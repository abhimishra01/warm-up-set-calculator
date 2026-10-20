// HTML builders shared by the server render (first paint, no-JS) and the browser script. Plain strings, no DOM.
import { PLATES, BARS, fmt } from './plates.js';
import { ROUND_STEPS } from './warmup.js';

// Plate dot colors follow competition plates: [fill, text].
export const COLORS = {
  lb: { '45': '#1d4ed8', '35': '#facc15', '25': '#16a34a', '10': '#f1f1ee', '5': '#dc2626', '2.5': '#475569', '1.25': '#a8a29e' },
  kg: { '25': '#dc2626', '20': '#1d4ed8', '15': '#facc15', '10': '#16a34a', '5': '#f1f1ee', '2.5': '#475569', '1.25': '#a8a29e' },
};
export const QUICK = { lb: [95, 135, 185, 225, 275, 315, 405], kg: [60, 80, 100, 120, 140, 180] };

const dot = (unit, w) => `<span class="dot" aria-hidden="true" style="background:${COLORS[unit][fmt(w)] || '#a8a29e'}"></span>`;

export function sideHtml(list, unit) {
  if (!list.length) return '<span class="text-muted">Bar only</span>';
  return list.map((p) => `<span class="side-item">${dot(unit, p.w)}${fmt(p.w)}${p.n > 1 ? `<small>&times;${p.n}</small>` : ''}</span>`).join('');
}

export function repsText(row) {
  if (row.kind === 'work') return 'Your sets';
  if (!row.reps) return '&ndash;';
  return row.sets > 1 ? `${row.sets} &times; ${row.reps}` : String(row.reps);
}

const rowLabel = (row) => (row.kind === 'bar' ? 'Empty bar' : row.kind === 'work' ? 'Work set' : `${row.pct}%`);

export function rowHtml(row, unit) {
  const work = row.kind === 'work' ? ' class="work-row"' : '';
  return `<tr${work}><th scope="row" class="px-2.5 py-2.5 font-semibold sm:px-3">${rowLabel(row)}</th>` +
    `<td class="px-2.5 py-2.5 font-mono font-semibold tabular-nums sm:px-3">${fmt(row.total)}<span class="font-sans text-xs font-normal text-muted"> ${unit}</span></td>` +
    `<td class="px-2.5 py-2.5 sm:px-3"><div class="flex flex-wrap items-center gap-x-2.5 gap-y-1 tabular-nums">${sideHtml(row.list, unit)}</div></td>` +
    `<td class="px-2.5 py-2.5 tabular-nums sm:px-3">${repsText(row)}</td></tr>`;
}

export const rowsHtml = (res, unit) => res.rows.map((r) => rowHtml(r, unit)).join('');

// "45 > 90 > 135 > 180 > 225 lb" for the summary line.
export const rampLine = (res, unit) => res.rows.map((r) => fmt(r.total)).join(' → ') + ` ${unit}`;

export const chipsHtml = (unit) => QUICK[unit].map((w) => `<button type="button" class="chip" data-w="${w}">${w}</button>`).join('');

export function barGroupHtml(unit, selected) {
  const bars = [...BARS[unit].map((w) => ({ id: String(w), label: `${w} ${unit}` })), { id: 'custom', label: 'Custom' }];
  return bars.map((b) => `<label class="seg"><input type="radio" name="bar" value="${b.id}" class="peer sr-only"${b.id === selected ? ' checked' : ''} /><span class="seg-face">${b.label}</span></label>`).join('');
}

export function plateGroupHtml(unit, enabled) {
  return PLATES[unit].map((w) => `<label><input type="checkbox" name="plate" value="${w}" class="peer sr-only"${enabled.includes(w) ? ' checked' : ''} /><span class="plate-pill">${dot(unit, w).replace('class="dot"', 'class="dot"')}${fmt(w)} ${unit}</span></label>`).join('');
}

export function roundGroupHtml(unit, selected) {
  return ROUND_STEPS[unit].slice().sort((a, b) => a - b).map((s) => `<label class="seg"><input type="radio" name="round" value="${s}" class="peer sr-only"${s === selected ? ' checked' : ''} /><span class="seg-face">${fmt(s)} ${unit}</span></label>`).join('');
}
