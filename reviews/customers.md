# Mock-customer test (Leslie, 2026-10-20)
Method: five personas, each used the live page (`dist-review` on localhost:4817) with playwright-cli at their viewport, typing real values and clicking. These are simulated reactions based on what each person did on the page; they are not real people's opinions.

## Jake, 19, college freshman, first time on a squat rack. iPhone, 390 x 844
Googled "how much should I warm up before squats". He sees the page title and clicks. He taps the 135 chip. The result box starts at the bottom of the screen and the table is below it, so he scrolls. Result: bar 2 x 5, 55, 80, 110, then 135. He asks why 55 lb and not 54 (40% of 135) and why the table says 41% and 59%.
- Click on Google over the others? Yes: "plates per side" in the title is what he needs.
- Under 30 seconds? About 20 seconds, but the scroll after typing felt like extra work.
- Confused by: "Warm-up style", "Strength" and the note "linear progression programs". "What is a hypertrophy?" The plate colors helped.
- Missing to bookmark: a one-line "what should I pick" for beginners.
- Trust: yes, it shows the math and says reps are a guide. Come back: yes.

## Marcus, 28, powerlifter, Austin. iPhone, 390 x 844
Types 405 and picks Powerlifting. Gets bar x10, then 205 (45 + 35 + 5 per side), 265, 305, 345, 365, 405. He says the first jump is 160 lb after an empty bar and he would never do that; he wants 135 and 225 in there. He turns off 35 lb plates (his gym has none) and the loads change to 45 + 25 + 10 + 5. He wants Custom percents. I could not test the iPhone keyboard here (playwright has no iOS keypad). By known iOS behavior, a field with `inputmode="decimal"` shows digits and a period only, so he would not be able to type "50 70 85". Treat this as inferred, not observed.
- Click on Google? Yes. "Plates you own" is what other sites lack.
- Under 30 seconds? Yes for a default ramp. The custom ramp may be blocked on iPhone (inferred, see above).
- Confused by: the 35 lb plate turned on by default; the 51% label (he asked for 50).
- Missing to bookmark: a lower first step.
- Trust: medium until he sees the first jump. Come back: yes if the ramp is fixed.

## Coach Mike, 45, high school strength coach, Texas. Laptop, 1280 x 800
Wants a printout for the room. Sets bar 35 lb, types 95 (a freshman girl), then 185. The ramps are right and the layout is clear. Tap Print: a clean black table appears, one page. He wants a sheet for the whole team with many athletes, a name line and blank boxes to write the reps done.
- Click on Google? Yes ("warm up calculator" is his query).
- Under 30 seconds? Yes, per athlete. Not for 25 athletes.
- Missing: a multi-athlete print (a list of work weights), blank write-in columns, a percent-of-1RM link.
- Trust: yes. Come back: only if he can print a team sheet.

## Anna, 34, CrossFit and weightlifting, Chicago. Android, 412 x 915, uses kg
Sets kg, bar 15 kg, types 60 and gets 15, 25, 35, 47.5, 60 with plates. Types "52,5" with a comma: it works. Taps + twice on 100 kg: 105 (steps of 2.5). Switches to lb: 105 kg becomes 230 lb (231.5 rounded to 5), the bar resets to 45 lb, which she did not expect.
- Click on Google? Yes, because kg is on the first screen.
- Under 30 seconds? Yes.
- Confused by: the bar selection resets by unit; the preset names mean nothing to her ("Hypertrophy" is fine).
- Missing: kg bar names (15 kg women's bar is there, good), a "snatch/clean" preset, a lighter jump set for light weights.
- Trust: yes. Come back: yes.

## Dave, 52, 25-year powerlifter, home gym. Laptop, 1366 x 768
Turns off 35 and 2.5 lb plates (his plate set stops at 5), sets a custom 55 lb bar, types 502. The page says plates cannot make 502, the closest is 505. He types Custom percents "50 70 85 92" and gets 49%, 68%, 84%, 90%: he asked for 92 and sees 90. He reads the note and understands the 10 lb jumps from 5 lb plates, but he wants the asked percent shown.
- Click on Google? Yes. Done under 30 seconds: yes.
- Confused by: percent labels that differ from what he typed; a 502 turning into 505 with no way to see both options (the plate calculator offers "lower/upper").
- Missing: lower/upper option for the work set; RPE or 1RM tie in; export.
- Trust: high, because the page tells him when it cannot make a weight. Come back: yes.

## Ranked change list
Counts come from what each persona said or did in the stories above. Rows 1 and 3 do not come from a persona count: row 1 is inferred from iOS behavior, row 3 from the design study.

| Rank | Sev | Change | Asked by |
|---|---|---|---|
| 1 | must | Custom percents field: drop `inputmode="decimal"` so an iPhone can type separators | 0 observed (inferred from iOS behavior; Marcus would hit it) |
| 2 | must | Sensible jumps: no 160 lb jump after the bar at 405 lb; no 5 lb steps at light weights (30% step for powerlifting, drop steps within about 10 lb) | 1 of 5 (Marcus), plus my own tests at 95 and 135 lb |
| 3 | must | Phone: show the ramp without scrolling (sticky result bar; RECOMMENDATION.md line 74) | 1 of 5 (Jake) plus the spec line |
| 4 | should | Show the asked percent next to the real one, and explain rounding ("why 41%?") | 3 of 5 (Jake 41% and 59%, Marcus 51%, Dave 90% for 92%) |
| 5 | should | Leave 35 lb plates off by default, as the plate calculator does | 1 of 5 (Marcus), plus the sister tool |
| 6 | should | One-line beginner hint beside the style buttons ("new lifter: Strength") | 1 of 5 (Jake) |
| 7 | should | Accept "225 lb" (strip the unit) | 0 of 5; found by testing |
| 8 | nice | Team print sheet: several work weights, name line, blank rep boxes | 1 of 5 (Mike) |
| 9 | nice | Lower and upper option when the work weight is not loadable | 1 of 5 (Dave) |
| 10 | nice | Keep the bar choice when switching units, or say it reset | 1 of 5 (Anna) |

Top 5 changes: (1) iPhone Custom input; (2) ramp jumps; (3) phone result visible without scrolling; (4) show asked vs real percent and explain rounding; (5) 35 lb plates off by default.
