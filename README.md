# Warm up set calculator

Free browser tool. Enter a work weight and get warm up sets from the empty bar, rounded to loadable weights, with plates per side. lb and kg, bar weight, plates you own, three presets (Powerlifting, Strength, Hypertrophy), custom percents, copy as text, print view. Domain: warmupsetcalculator.com.

Static Astro site, Tailwind 4, Retro print skin.

- `npm run dev`, `npm test`, `npm run build`
- `src/lib/warmup.js`: ramp rules and presets. The Strength preset follows the Starting Strength template. The other two are labeled as common starting points.
- `src/lib/plates.js`: plate math (copied from the barbell plate calculator).
- `src/lib/state.js`: loads saved settings and rejects bad data.
- `src/lib/render.js`: HTML for the table, shared by the build and the browser.
- `src/components/Tool.astro`: the UI, including the phone-only sticky result bar.
- Tests: `tests/*.test.mjs` (`npm test`).
- GitHub Pages: `.github/workflows/pages.yml` builds with `PAGES_BASE=/warm-up-set-calculator/`. Local check: `PAGES_BASE=/warm-up-set-calculator/ npx astro build --outDir dist-pages`, then serve it under that path. Canonical stays on the real domain and Pages builds are noindex.
