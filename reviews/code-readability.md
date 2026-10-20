# Code review: readability lens (Leslie, 2026-10-20)
Verdict: easy to read. Comments explain the why and the tests show worked numbers. A few misleading names and terms. 0 must-fix.

Template leftovers (README, screenshots, duplicate legal links, build-date "Last updated", British spelling) not repeated. No placeholder text found on the site (About, Privacy, Terms, Contact, FAQ, article all name this tool). No em dashes. No British spellings found in the built pages.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/plates.js:93 vs src/lib/warmup.js:58 | Two functions build a "warm-up ramp": `warmups()` (old, unused) and `buildWarmups()`. | A new engineer cannot tell which is live. | Delete `warmups()`. |
| should | UI strings, src/components/Tool.astro:254-258 and :251-261; src/lib/warmup.js | "Step" means three things: a warm-up set ("3 steps, then your work set"), the rounding step ("Round to 5 lb"), and the nudge size (`STEP`, +/- buttons). The page title says "sets". | Reader and user confusion; the code has `step`, `steps`, `STEP`, `ROUND_STEPS`. | Say "sets" for warm-up sets in the UI. Name the rounding value `roundTo` in code. |
| should | src/lib/render.js:37 | Comment shows `"45 > 90 > ..."` but the code joins with an arrow character. | Stale comment. | Update. |
| should | whole site | "Warm up" (title, h1, site name, keywords) vs "Warm-up" (header logo, "Warm-up style", short_name, preset notes). | Mixed terms. The keyword is "warm up set calculator", so the unhyphenated form is the brand. | Use "warm up" for the noun and "warm-up" only as an adjective, consistently. Header text and `short_name` first. |
| nice | src/lib/plates.js:8-9 | Comment lost the sentence from the plate calculator ("Few US gyms own 1.25 lb plates or 35 lb plates") and only the first half remains. | The 35 lb default looks deliberate. | Restate why, or change the default. |
| nice | src/lib/plates.js:105-110 | `convertTarget` is documented as "convert a target", but the tool calls its input "work weight". Same for `target` in `solve` and `buildWarmups({work})`. | Two words for one thing across files. | Rename to `work` in the copied code, or note it in the file header. |
| nice | src/lib/render.js:48 | No-op `.replace`. | Looks meaningful, is not. | Delete. |
| nice | src/pages/privacy.astro:3 and terms.astro:4 | `updated = 'October 20, 2026'` is typed twice. | Two edits for one fact. | Put it in `site.config.ts`. |
| nice | src/components/Article.astro:4-9 | Good: the example and the table are computed with the same code as the tool. Note the example uses "x" (ASCII) while the tool shows the multiplication sign. | Small mismatch. | Use the same sign. |
| nice | README.md | Accurate, short. Lacks how to run the Pages build locally and says nothing about the default plates. | A new engineer has to read `brief fix.md`. | Add two lines. |
| nice | src/pages/contact.astro, about.astro | Both promise a reply from hello@warmupsetcalculator.com. The domain is not bought, so the address does not exist yet. | Dead contact on the GitHub Pages preview. | Add to the launch checklist: set up mail routing with the domain. |
| nice | src/components/Tool.astro (copy text, `lastText`) | Copy text for the empty bar reads "45 lb (bar only per side)". | Odd wording in the text people paste into notes. | "45 lb (empty bar)". |
