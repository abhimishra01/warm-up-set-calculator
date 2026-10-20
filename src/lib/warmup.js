// Warm up ramp logic. Pure functions, no DOM. Plate math lives in plates.js (copied from the plate calculator).
import { solve, fromHundredths, toHundredths } from './plates.js';

// pct 0 means the empty bar. sets is the number of sets, reps is reps per set.
// minGap is the smallest jump allowed between two sets, and between the last warm up and the work set.
// Strength follows the Starting Strength template (Rippetoe). The other two are common starting points with no single source.
export const SOURCES = {
  strength: { name: 'Starting Strength', url: 'https://startingstrength.com/resources/forum/general-programming/21761-warm-sets.html' },
};
export const PRESETS = {
  powerlifting: {
    label: 'Powerlifting',
    note: 'A common starting point, not a standard. Heavy singles and triples. Low reps near the top keep you fresh for the work set.',
    minGap: { lb: 20, kg: 10 },
    steps: [
      { pct: 0, sets: 1, reps: 10 }, { pct: 30, sets: 1, reps: 5 }, { pct: 50, sets: 1, reps: 5 }, { pct: 65, sets: 1, reps: 3 },
      { pct: 75, sets: 1, reps: 2 }, { pct: 85, sets: 1, reps: 1 }, { pct: 90, sets: 1, reps: 1 },
    ],
  },
  strength: {
    label: 'Strength',
    note: 'The empty bar for 2 sets of 5, then 40, 60 and 80 percent, from the Starting Strength warm-up template.',
    minGap: { lb: 10, kg: 5 },
    steps: [
      { pct: 0, sets: 2, reps: 5 }, { pct: 40, sets: 1, reps: 5 }, { pct: 60, sets: 1, reps: 3 }, { pct: 80, sets: 1, reps: 2 },
    ],
  },
  hypertrophy: {
    label: 'Hypertrophy',
    note: 'A common starting point, not a standard. Fewer, lighter sets. The work set is for 8 to 12 reps, so the warm up should not tire you.',
    minGap: { lb: 10, kg: 5 },
    steps: [
      { pct: 0, sets: 1, reps: 10 }, { pct: 50, sets: 1, reps: 6 }, { pct: 75, sets: 1, reps: 3 },
    ],
  },
};

// Rounding steps offered per unit. The first one is the default.
export const ROUND_STEPS = { lb: [5, 2.5, 10], kg: [2.5, 1.25, 5] };
export const MAX_PERCENTS = 8;

// Read "40, 60 80" into [40, 60, 80]. Keeps values from 1 to 99 only, sorted, no repeats.
export function parsePercents(text) {
  const out = [];
  for (const part of String(text).split(/[\s,;]+/)) {
    const t = part.replace('%', '');
    if (!/^\d+(\.\d+)?$/.test(t)) continue;
    const n = Number(t);
    if (n >= 1 && n <= 99 && !out.includes(n)) out.push(n);
  }
  return out.sort((a, b) => a - b).slice(0, MAX_PERCENTS);
}

// Round to a step in whole hundredths so 2.5 and 1.25 steps stay exact. Halves round up.
export function roundToStep(value, step) {
  if (!(step > 0)) return Math.round(value * 100) / 100;
  const stepH = toHundredths(step);
  return fromHundredths(Math.floor((Math.round(value * 100) + stepH / 2) / stepH) * stepH);
}

// Build the table of sets.
// work: the work weight (total on the bar). bar: bar weight. plates: enabled plate weights.
// steps: [{pct, sets, reps}] (pct 0 = empty bar). step: rounding step before the plates are chosen.
// minGap: sets closer than this to the set before, or to the work set, are dropped (0 = keep all).
// Percents are taken from the load that will be lifted (the closest loadable weight), not the typed weight.
// Returns { status, rows, work } where rows are [{kind, pct, total, side, list, sets, reps}].
export function buildWarmups({ work, bar, plates, steps, step = 0, minGap = 0 }) {
  if (!(work > 0) || !(bar >= 0)) return { status: 'empty', rows: [] };
  if (toHundredths(work) <= toHundredths(bar)) return { status: 'light', rows: [], bar };
  if (!plates.length) return { status: 'noplates', rows: [], bar };
  const w = solve({ target: work, bar, plates });
  if (toHundredths(w.total) <= toHundredths(bar)) return { status: 'light', rows: [], bar }; // plates too coarse to add anything
  const rows = [];
  const barStep = steps.find((s) => s.pct === 0);
  if (barStep) rows.push({ kind: 'bar', pct: 0, total: bar, side: 0, list: [], sets: barStep.sets, reps: barStep.reps });
  let prev = toHundredths(bar);
  const workH = toHundredths(w.total);
  for (const s of steps) {
    if (s.pct <= 0) continue;
    const r = solve({ target: roundToStep((w.total * s.pct) / 100, step), bar, plates });
    if (r.status !== 'exact' && r.status !== 'closest') continue; // at or under the bar
    const tH = toHundredths(r.total);
    const gap = toHundredths(minGap);
    if (tH - prev < Math.max(gap, 1) || workH - tH < Math.max(gap, 1)) continue; // keep the ramp strictly rising and below the work set
    prev = tH;
    rows.push({ kind: 'ramp', asked: s.pct, pct: Math.round((r.total / w.total) * 100), total: r.total, side: r.side, list: r.list, sets: s.sets, reps: s.reps });
  }
  rows.push({ kind: 'work', pct: 100, total: w.total, side: w.side, list: w.list, sets: 1, reps: null });
  return { status: w.status === 'exact' ? 'exact' : 'closest', rows, work: w.total, asked: work, bar };
}
