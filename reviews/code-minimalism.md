# Code review: minimalism lens (Leslie, 2026-10-20)
Verdict: lean already (13 KB script, 29 KB CSS, 6 pages). Dead code came across with the copy from the plate calculator. 0 must-fix.

Template leftovers (README, new-tool script, screenshots, duplicate legal links, build date, British spelling) are not repeated.

| Sev | File:line | Finding | Why | Fix |
|---|---|---|---|---|
| should | src/lib/plates.js:93-101 | `warmups()` is never used by the page. Only `tests/plates.test.mjs` lines 76, 136, 141 call it. It uses `Math.round` while the real ramp (`buildWarmups`) uses `roundToStep`. | Two ramp functions with different rounding. A reader may fix the wrong one, and the old tests give false comfort. | Delete `warmups()` and its three tests. `warmup.test.mjs` already covers the real ramp. |
| should | src/lib/plates.js:62-75 and :64 | Collar support (`collar`, `collarPair`, `loadedTotal` argument) is never used. The UI always passes 0. Tests at plates.test.mjs:50 and :110 exist only for it. | About 6 lines and 2 tests for a feature this tool does not have. | Remove the `collar` parameter and the two tests. |
| should | src/lib/plates.js:123 | `describe()` is unused in `src/` (only a test). | Dead export from the copied code. | Delete it and its test. |
| nice | src/lib/plates.js:14 and src/lib/warmup.js:32 | `STEP = {lb:5, kg:2.5}` and `ROUND_STEPS` first entries repeat the same fact. | Two sources of truth for the default step. | Derive `STEP` from `ROUND_STEPS[unit][0]`, or the reverse. |
| nice | src/lib/render.js:48 | `.replace('class="dot"', 'class="dot"')` changes nothing. | Leftover. | Delete the `.replace(...)`. |
| nice | src/styles/skin-retro.css:40 | Selector `main > section:first-child > p:first-child` matches nothing on the home page. It does match the "404" paragraph on the 404 page and breaks it (see design-seo.md). | Dead on the home page, harmful on 404. | Delete the rule. |
| nice | src/styles/skin-retro.css:44 | `.tbl thead th` and Tool.astro:139 `.no-print` match no element. Also `#tool h2` and `#tool label.block` selectors at skin-retro.css:50 (no h2 in the tool; `label.block` hits only the work label). | Dead selectors. | Delete the unused parts. |
| nice | src/components/Tool.astro:123,130 | `.dot` is defined twice (`.plate-pill .dot` and `.dot`), both 2px border. | Small duplicate. | Keep one. |
| nice | src/components/Tool.astro:49 | The `custom-help` and `custom-bar-wrap` blocks sit hidden in the DOM for everyone. | About 600 bytes of HTML for a path many people never use. | Fine. Leave. |

Size check: JS 12.9 KB, CSS 29.4 KB, whole `dist-review` 340 KB (mostly icons and og.png). Nothing to cut there.
