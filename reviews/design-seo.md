# Design and SEO review (Leslie, 2026-10-20)
Scores (Lighthouse, Google Chrome headless, `dist-review` on localhost:4816):

| Run | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Mobile | 100 | 100 | 100 | 100 | 1.2 s | 0 | 0 ms |
| Desktop | 100 | 100 | 100 | 100 | 0.3 s | 0.007 | 0 ms |

Also measured CLS 0 at 390 and 1280 px when a saved state (kg, powerlifting, 140) replaces the first paint. Page weight: HTML plus 13 KB JS and 29 KB CSS, no web fonts, 340 KB for the whole build.

Verdict: a clear, finished, distinctive page; the Retro skin works in light and dark, print is clean, SEO basics are complete. 2 must-fix (the 404 page is visibly broken; no sticky result bar on phones, which the design study asks for).

## Against competitors
- Fetched this session: Lift Vault warm-up calculator (https://liftvault.com/resources/warmup-set-calculator/). Inputs: work weight and bar. Output: ramp with reps and plates per side, ending at the work set. Percents about 40, 55, 70, 85. The page showed no lb and kg switch, no presets, no print or copy, no plate selection, and carries an affiliate notice, an app promo sidebar, a pop-up and a long article. This page has all of those features and no pop-up. Advantage: clear.
- Second competitor: a search for FitnessVolt returned only scraped mirror pages, so I could not verify it. SensAI, Calculator.academy and Hevy were not fetched. Judgment on them rests on the research file only.
- Where this page is weaker: Lift Vault's ramp is a 4-step even ramp (40, 55, 70, 85), while the Powerlifting preset here has the large first jump (see regression.md).

## Design checklists
- web-design-guidelines (Vercel rules, fetched today) applied by hand to Tool.astro and skin-retro.css. Findings: Tool.astro:48 `inputmode="decimal"` on a field that needs separators; no `spellcheck="false"` or `autocapitalize` on the numeric text inputs (Tool.astro:31, 48, 61); no `touch-action: manipulation` on the +/- and chip buttons, so quick taps can trigger double-tap zoom on iOS; plain spaces between number and unit ("225 lb", "45 lb") can wrap, use a non-breaking space; the weight is not in the URL, so a result cannot be shared by link. Passed: focus-visible and 3 px outline, no `transition: all`, reduced motion respected, `aria-live=polite` on the status, labelled controls and table caption, tabular numerals, color-scheme per theme.
- taste-skill and awesome-design-md were not run as separate passes. The skin follows design-study/RECOMMENDATION.md (Retro print), and I judged against it.

Seen at 1280 and 390, light and dark (screenshots in my temp folder, deleted at the end): hierarchy is clear, the green result box is the focal point, 2 px ink edges and hard shadows pass the 3:1 edge rule (edge is the ink color), numbers are mono and tabular, no horizontal scroll at 390, print emulation shows only a bold table with plate dots, and the 404 and About pages load under the same skin.

| Sev | Area | Finding | Fix |
|---|---|---|---|
| must | 404 page | The "404" text renders as a full-width thin bordered bar with tiny uppercase letters, above the heading. Cause: skin-retro.css:40 (`main > section:first-child > p:first-child`) targets the first paragraph and styles it as a badge. | Remove that rule, or scope it to the home hero. Recheck 404 at 390 px. |
| should | Phone, tap targets | Header links About and Contact measure 39 x 36 and 51 x 36 px; footer links 36 px high; the logo link 32 px. Design study asked for 44 px. | Add vertical padding (or `min-h-11`) to header and footer links. |
| must | Phone, flow | After typing a weight the result box starts at y=674 of an 844 px screen, and the table at y=917. The person must scroll after every change. RECOMMENDATION.md line 74 says "Keep the sticky result bar on phones" and the tool file says to apply it. The sister barbell tool also has only a desktop-sticky result (`md:sticky`), so this is a family gap. | A compact sticky bar with the ramp line (`45 → 90 → ...`) at the bottom of the screen while the tool is in view, or move Warm-up style below the result. |
| should | Desktop, fold | At 1280x900 the plates and rounding settings sit below the fold; the table has a lot of empty space under it (right column stops at ~y=570 while the left runs to ~y=935). | Move Bar, Plates and Round into the right column under the table, or collapse them into one "Settings" row. |
| nice | Dark mode, plate dots | The 2.5 lb dot (#475569) is about 2:1 against the dark card. | Lighten the 2.5 dot in dark mode; the label is there, so it is decoration, but it looks dim. |
| nice | Favicon and og.png | Favicon (green disc, barbell with plates) is clear at 32 px and matches the skin. OG image is good and readable. | No change. |
| nice | Touch and typing | Add `touch-action: manipulation` to buttons and chips, `spellcheck="false"` to the numeric text inputs, and non-breaking spaces in "225 lb". | From the web-design-guidelines pass. |
| nice | Chips | The quick-weight chips wrap with 405 alone on a second line on desktop and phone. | Drop one chip (95 or 405) or reduce chip width. |
| nice | Header | Logo text is "Warm-up Set Calculator" and the H1 and title say "Warm up set calculator". | Match the brand spelling (see readability). |
| nice | Tab order on phones | DOM order is weight, style, bar, plates, round, then the result. Visual order puts the result before bar and plates. Tab and screen reader order differ from what is seen. | Fine to keep; or put the result earlier in the DOM and use `order-` for desktop. |
| nice | Empty and error states | Good: red border plus a plain sentence for bad weight, bad percents, bad bar, no plates, weight under the bar. The "light" message mixes two cases (see regression). | Split the message. |

## SEO
- Title: "Warm Up Set Calculator: Sets and Plates (lb & kg)" (53 chars). Description 137 chars, ends at the print feature. Exact keyword leads both.
- H1 once. Outline: 10 H2 sections, no skipped levels. Article about 785 words, FAQ about 385 words (8 questions).
- JSON-LD parsed: `WebApplication` (774 bytes) and `FAQPage` (8 questions, text matches the visible FAQ). `applicationCategory` is `HealthApplication` (a valid value). `offers` price is 0. No parse errors.
- Canonical is the real domain on both builds. `og:image` is 1200 x 630, absolute URL. Twitter card is `summary_large_image`.
- Sitemap has 5 URLs, robots.txt allows all and lists the sitemap, 404 is `noindex`, GitHub Pages build is `noindex`.
- Internal links: nav, footer legal pages, "Back to the calculator" link. No links between articles (single page tool), fine.
- Gaps (should): (1) the article has no diagram of a loaded bar and no image with alt text, so it gives no image result; (2) no link to a source for the presets (add one outbound link to the Starting Strength template, it also helps trust); (3) the FAQ "How many warm up sets" answer is the best snippet bait but is long (62 words); lead with a one-sentence answer.
- Health wording: "not medical advice" appears in the article, About and Terms, where health is touched. Fine.
