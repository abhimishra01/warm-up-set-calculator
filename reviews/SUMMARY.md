# Fix summary (Okoye, 2026-10-20)

## Fixed
- Custom percents field: `inputmode="text"` so iPhone can type separators (must).
- Ramp jumps (must): Powerlifting gets a 30% set and a 20 lb / 10 kg minimum jump. Strength and Hypertrophy use 10 lb / 5 kg. Sets too close to the previous set or the work set are dropped. 405 lb now goes 45, 120, 205, 265, 305, 345, 365, 405. 135 lb goes 45, 70, 90, 115, 135. Tests added.
- Sticky result bar on phones (must): shows the ramp while the tool is on screen and the result box has scrolled away. Tap scrolls to the table. Hidden in print and on md+.
- 404 badge bug: removed the dead skin rule (must). Other dead skin selectors removed.
- Saved-state crash on `toString` etc: `Object.hasOwn`, logic moved to `src/lib/state.js` with hostile-input tests. Bar 0 is invalid. All plates off falls back to default plates.
- Percents now come from the loaded weight (not the typed one). The table shows the asked percent and the real one in small text when they differ.
- Default lb plates no longer include 35 lb. Work weight capped at 1500 lb / 700 kg. "225 lb", "100kg", "315#" are accepted.
- Strength preset is sourced to Starting Strength (Rippetoe) in the note, article and FAQ. Powerlifting and Hypertrophy are labeled "a common starting point, not a standard", with no source claimed.
- Split "light" message in two. Copy text says "empty bar". "Step" wording changed to "set" in the UI. "Warm up" (noun) used everywhere, including header and manifest.
- Tap targets 44 px (header and footer links), `touch-action: manipulation`, `spellcheck=false`, non-breaking spaces in result text, brighter 2.5 plate dot, chip row no longer wraps on a phone.
- Removed dead code: `warmups()`, `describe()`, collar support, no-op replace. "Last updated" date lives in `site.config.ts`. Article uses the same x sign as the tool. README rewritten.
- Template list: already in place (US spelling, fixed date, deploy runs tests, no new-tool.sh, screenshots and .playwright-cli ignored, Tailwind `source(none)` plus `@source "../"`). CSS was 29.4 KB before, 29.2 KB plus 4.7 KB of component CSS after (Astro now splits it); JS 12.9 to 14.1 KB.
- GitHub Pages: kept. Verified a `/warm-up-set-calculator/` build: home, about, privacy, icon, manifest all 200, noindex, canonical on the real domain, no unbased absolute paths.

## Rejected
- Move Bar/Plates/Round to the right column (desktop fold): layout change with a trade-off on phone order. Later.
- Team print sheet, lower/upper option, keep bar across units, beginner hint, article diagram, 80 ms debounce, Any-casts typing: new features or low value for a single-purpose tool. Phase 2 if wanted.
- Minimum gap in Custom mode: Custom honors the typed percents.

## Status
- `npm test`: 49 of 49 pass. `npm run build`: OK. Screenshots at 1280 and 390, light and dark, checked.
- Lighthouse not re-run after the changes (earlier review: 100 on all four).

## For the owner
- The Starting Strength link is the forum post the reviewer used. startingstrength.com blocks bots (403), so I could not re-read it. Open it once and confirm it shows the 40/60/80 scheme, or change `SOURCES` in `src/lib/warmup.js`.
- Set up hello@warmupsetcalculator.com mail routing when the domain is bought.

## Phase 2 SEO pages (top 20 candidates)
1. 225 lb squat warm up sets
2. 315 lb squat warm up sets
3. 405 lb deadlift warm up sets
4. 135 lb bench press warm up sets
5. 185 lb bench press warm up sets
6. 225 lb bench press warm up sets
7. 275 lb squat warm up sets
8. 315 lb deadlift warm up sets
9. 495 lb deadlift warm up sets
10. 100 kg squat warm up sets
11. 140 kg deadlift warm up sets
12. 60 kg bench press warm up sets
13. 135 lb overhead press warm up sets
14. 365 lb squat warm up sets
15. 405 lb squat warm up sets
16. 225 lb deadlift warm up sets
17. Powerlifting warm up sets calculator
18. Starting Strength warm up sets
19. Warm up sets for a 35 lb bar
20. Warm up sets with no 35 lb or 2.5 lb plates
