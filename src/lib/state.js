// Saved settings. Pure functions, no DOM. Hostile or hand-edited data falls back to defaults field by field.
import { PLATES, DEFAULT_PLATES, BARS, MAX_WORK } from './plates.js';
import { PRESETS, ROUND_STEPS } from './warmup.js';

export const DEFAULT_CUSTOM_BAR = { lb: 25, kg: 10 };

export function defaultState() {
  return {
    unit: 'lb',
    work: 225,
    preset: 'strength',
    custom: '40, 60, 80',
    bar: { lb: '45', kg: '20' },
    customBar: { ...DEFAULT_CUSTOM_BAR },
    plates: { lb: [...DEFAULT_PLATES.lb], kg: [...DEFAULT_PLATES.kg] },
    round: { lb: ROUND_STEPS.lb[0], kg: ROUND_STEPS.kg[0] },
  };
}

const isWeight = (x, unit) => typeof x === 'number' && Number.isFinite(x) && x > 0 && x <= MAX_WORK[unit];

// Merge saved data into a fresh default state.
export function loadState(saved) {
  const state = defaultState();
  if (!saved || typeof saved !== 'object') return state;
  if (saved.unit === 'lb' || saved.unit === 'kg') state.unit = saved.unit;
  if (isWeight(saved.work, state.unit)) state.work = saved.work;
  if (saved.preset === 'custom' || (typeof saved.preset === 'string' && Object.hasOwn(PRESETS, saved.preset))) state.preset = saved.preset;
  if (typeof saved.custom === 'string') state.custom = saved.custom.slice(0, 60);
  for (const u of ['lb', 'kg']) {
    const bar = saved.bar && saved.bar[u];
    if (typeof bar === 'string' && (bar === 'custom' || BARS[u].map(String).includes(bar))) state.bar[u] = bar;
    if (saved.customBar && isWeight(saved.customBar[u], u)) state.customBar[u] = saved.customBar[u];
    if (saved.plates && Array.isArray(saved.plates[u])) {
      const kept = saved.plates[u].filter((w) => PLATES[u].includes(w));
      if (kept.length) state.plates[u] = kept; // all plates off would open on an empty tool
    }
    if (saved.round && ROUND_STEPS[u].includes(saved.round[u])) state.round[u] = saved.round[u];
  }
  return state;
}
