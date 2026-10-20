# Warm up set calculator

Static Astro site (Tailwind 4, Retro print skin). Domain: warmupsetcalculator.com.

- `npm run dev`, `npm test`, `npm run build`
- Logic: `src/lib/warmup.js` (ramp), `src/lib/plates.js` (plate maths, copied from the barbell plate calculator), tests in `tests/`.
- GitHub Pages: `.github/workflows/pages.yml` builds with `PAGES_BASE=/warm-up-set-calculator/`. Canonical stays on the real domain and Pages builds are noindex.
