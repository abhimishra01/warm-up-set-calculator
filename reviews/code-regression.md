# Code review: regression lens (Leslie, 2026-10-20)
Verdict: the plate and rounding math is correct. The ramp rules are the weak spot for light and heavy lifters, and Custom percents cannot be typed on an iPhone. 2 must-fix.

## How I checked
1. `npm test`: 40 of 40 pass.
2. Wrote my own solver in `tmp-review/check.mjs` (brute-force plate combinations, nearest total, tie goes lighter, half-up rounding). Compared the ramp totals for 3 presets x 3 rounding steps x every weight in range, lb (45 and 35 bar) and kg (20 and 15 bar): 2,532 cases, 0 differences. Caveat: I coded the same rules (half up, tie lighter, drop rows at or under the previous set or above work), so this proves the implementation, not the rule choices.
3. Hand recomputation, matched on the live page:

| Case | Hand result | Page |
|---|---|---|
| 225 lb, strength, bar 45 | 40/60/80% = 90, 135, 180. Sides 22.5 (10+10+2.5), 45, 67.5 | 45, 90, 135, 180, 225. Same. |
| 315 lb strength | 126 to 125, 189 to 190, 252 to 250 | 45, 125, 190, 250, 315. Same. |
| 405 lb strength | 162 to 160, 243 to 245, 324 to 325 | 160, 245, 325. Same. |
| 135 lb powerlifting | 67.5 to 70, 87.75 to 90, 101.25 to 100, 114.75 to 115, 121.5 to 120 | 70, 90, 100, 115, 120. Same. |
| 55 lb, bar 45, powerlifting | 50 to 50; 85% 46.75 to 45 (=bar, dropped); 90% 49.5 to 50 | 45, 50, 55. Same as the test. |
| 100 kg, bar 20, strength, 2.5 step | 40, 60, 80 | 20, 40, 60, 80, 100. Same. |
| 102.5 kg (225 lb converted) | 40% = 41 to 40; 60% = 61.5 to 62.5; 80% = 82 to 82.5 | 40, 62.5, 82.5. Side 21.25 = 20 + 1.25. Same. |
| 457 lb typed, plates to 2.5 | Plates only make 5 lb steps: 455 | Says "cannot make 457, closest 455". Same. |
| Bar 35, only 45 lb plates, work 225 | Loads: 35, 125, 215, 305. 225 is 10 from 215 | 125 and 215, closest 215. Same. |
| 1 lb = 0.45359237 kg | Exact by the 1959 agreement | Matches the article. |

4. Formula and preset sources. Strength (bar x5 x2, 40% x5, 60% x3, 80% x2) matches the Starting Strength template (Rippetoe; forum post https://startingstrength.com/resources/forum/general-programming/21761-warm-sets.html). The "3 to 5 warm-up sets" line in the FAQ matches the book as quoted there. Powerlifting (50/65/75/85/90) and hypertrophy (50/75) have no source in the repo, and the page does not cite any. The copy does call them "common starting points", which is honest, but the Strength note claims a program use without naming it.

5. Template rules: canonical points to https://warmupsetcalculator.com/ on both builds; `_headers` has noindex for `*.pages.dev`; the Pages build (`PAGES_BASE=/warm-up-set-calculator/`, built to `dist-review-pages`, served under that path) has `noindex`, every link, icon, manifest and og:image under the base, and still canonical to the real domain; normal build has no noindex; footer links to About, Contact, Privacy, Terms; 404 is noindex and not in the sitemap; sitemap lists 5 pages; GA and AdSense render nothing when empty and `ads.txt` is a comment. All hold.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| must | src/components/Tool.astro:48 | `#custom-pcts` has `inputmode="decimal"`. The iOS decimal pad has digits and a period only (no comma, no space). The field needs separators ("40, 60, 80"). Cannot test on a real iPhone here; this is how the iOS keyboard behaves. | Custom is unusable on iPhone: one percent at most. 2 of 5 personas were on phones. | Use `inputmode="text"` (or remove it) for this field. Keep `decimal` for weights. |
| must | src/lib/warmup.js:9-14 (powerlifting) and :58-76 | Ramp has no minimum or maximum jump. Reproduced: 405 lb powerlifting goes bar to 205 (a 160 lb jump after the empty bar only). 135 lb powerlifting gives 70, 90, 100, 115, 120 (5 lb apart, 6 sets for a 135 lb lift). 95 lb gives 50, 60, 70, 80, 85. Spec says "sensible % jumps". | A real lifter will not do these. It is the main promise of the page. | Add a 30% step to powerlifting, and drop a step when it is within about 10 lb (5 kg) of the one before or of the work set. Add a test for 405 and 135. |
| should | src/lib/plates.js:8 | Default lb plates include 35 lb. Most US commercial gyms have 45, 25, 10, 5, 2.5. Result: 125 lb shows "35 + 5", 220 shows "45 + 35 + 5 + 2.5". The sister tool (barbell-plate-calculator) leaves 35 off by default and its comment says why; this comment dropped that sentence. | Wrong loads by default for most gym users. | Default to `[45, 25, 10, 5, 2.5]` for lb, same as the plate calculator. |
| should | src/lib/warmup.js:42 | Rounding to a step finer than the plates (5 lb step, no 2.5 plates) gives 10 lb gaps. The label then shows the real percent (Dave asked for 92 and got 90). | Honest but unexplained. | Show the asked percent in small text, or say "plates make 10 lb jumps" when that applies. |
| should | src/lib/warmup.js:17 | Strength note says "used for linear progression programs". No program named, no source. | Brief says cite every program rule. | "The 40, 60 and 80 percent ramp from Starting Strength" with a link in the article. Source the other two or state they are generic. |
| should | src/components/Tool.astro:182 | Crash on a hand-edited saved preset such as `toString` (see maintainer review). | Dead tool until site data is cleared. | `Object.hasOwn`. |
| nice | src/components/Tool.astro:251 | Message for 46 lb (bar 45) says "at or under the bar ... or plates cannot add weight". 46 is not under the bar. | Reads as wrong for the second case. | Two messages: at or under the bar; plates cannot add weight above the bar. |
| nice | src/lib/warmup.js:76 | Label can read 79% for 250 of 315 (79.4%). | Looks odd next to the "80%" in the style table. | Keep (it is honest). Add a header hint "actual %". |
