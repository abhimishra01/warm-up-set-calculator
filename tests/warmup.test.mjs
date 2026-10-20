// Known-answer tests for the warm-up ramp. Expected values are worked out by hand in the comments.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildWarmups, parsePercents, allPercents, MAX_PERCENTS, roundToStep, PRESETS, ROUND_STEPS } from '../src/lib/warmup.js';
import { solve, DEFAULT_PLATES } from '../src/lib/plates.js';

const LB = DEFAULT_PLATES.lb; // 45 25 10 5 2.5
const KG = DEFAULT_PLATES.kg; // 25 20 15 10 5 2.5 1.25
const totals = (r) => r.rows.map((x) => x.total);
const sideOf = (list) => list.reduce((a, p) => a + p.w * p.n, 0);

test('strength ramp, 225 lb on a 45 lb bar: 40/60/80 percent = 90, 135, 180', () => {
  const r = buildWarmups({ work: 225, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 });
  assert.equal(r.status, 'exact');
  assert.deepEqual(totals(r), [45, 90, 135, 180, 225]);
  assert.deepEqual(r.rows.map((x) => x.kind), ['bar', 'ramp', 'ramp', 'ramp', 'work']);
  assert.deepEqual(r.rows.map((x) => x.pct), [0, 40, 60, 80, 100]);
  assert.deepEqual(r.rows.map((x) => x.side), [0, 22.5, 45, 67.5, 90]); // (total - 45) / 2
  assert.equal(r.rows[0].sets, 2);
  assert.equal(r.rows[0].reps, 5);
  assert.deepEqual(r.rows[2].list, [{ w: 45, n: 1 }]); // 135 lb: one 45 per side
  assert.deepEqual(r.rows[4].list, [{ w: 45, n: 2 }]); // 225 lb: two 45s per side
});

test('strength ramp in kg, 100 kg on a 20 kg bar: 40, 60, 80', () => {
  const r = buildWarmups({ work: 100, bar: 20, plates: KG, steps: PRESETS.strength.steps, step: 2.5 });
  assert.deepEqual(totals(r), [20, 40, 60, 80, 100]);
  assert.deepEqual(r.rows.map((x) => x.side), [0, 10, 20, 30, 40]);
  assert.deepEqual(r.rows[1].list, [{ w: 10, n: 1 }]); // 10 kg per side
  assert.deepEqual(r.rows[2].list, [{ w: 20, n: 1 }]);
});

test('powerlifting ramp, 95 lb: every step rounds to 5 lb, then to plates', () => {
  // 50% 47.5 -> 50; 65% 61.75 -> 60; 75% 71.25 -> 70; 85% 80.75 -> 80; 90% 85.5 -> 85
  const r = buildWarmups({ work: 95, bar: 45, plates: LB, steps: PRESETS.powerlifting.steps, step: 5 });
  assert.deepEqual(totals(r), [45, 50, 60, 70, 80, 85, 95]);
});

test('steps that land on the bar or under it are dropped, and the ramp never repeats a weight', () => {
  // work 55 lb, bar 45: 50/65/75 percent are under the bar, 85% is 46.75 -> 45 = the bar, 90% is 49.5 -> 50
  const r = buildWarmups({ work: 55, bar: 45, plates: LB, steps: PRESETS.powerlifting.steps, step: 5 });
  assert.deepEqual(totals(r), [45, 50, 55]);
});

test('work weight at or under the bar gives no ramp', () => {
  assert.equal(buildWarmups({ work: 45, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 }).status, 'light');
  assert.equal(buildWarmups({ work: 35, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 }).status, 'light');
  assert.equal(buildWarmups({ work: 0, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 }).status, 'empty');
  assert.equal(buildWarmups({ work: NaN, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 }).status, 'empty');
});

test('no plates switched on', () => {
  assert.equal(buildWarmups({ work: 225, bar: 45, plates: [], steps: PRESETS.strength.steps, step: 5 }).status, 'noplates');
});

test('plates too coarse to add weight above the bar', () => {
  // only 45 lb plates, bar 45, work 50: side 2.5 -> closest side is 0 (total 45) so there is nothing to ramp
  assert.equal(buildWarmups({ work: 50, bar: 45, plates: [45], steps: PRESETS.strength.steps, step: 5 }).status, 'light');
});

test('work weight the plates cannot make: closest load is used and reported', () => {
  // only 45 lb plates: 135 or 225 are reachable. 200 is 65 from 135 and 25 from 225.
  const r = buildWarmups({ work: 200, bar: 45, plates: [45], steps: PRESETS.strength.steps, step: 5 });
  assert.equal(r.status, 'closest');
  assert.equal(r.work, 225);
  assert.equal(r.asked, 200);
  // 40% of 200 = 80 -> 80, plates reach only 45 and 135, so 45 is the closest (dropped: equals the bar);
  // 60% = 120 -> 135; 80% = 160 -> 135 (repeat, dropped)
  assert.deepEqual(totals(r), [45, 135, 225]);
});

test('rounding step: halves round up and the step is exact for 2.5 and 1.25', () => {
  assert.equal(roundToStep(112.5, 5), 115);
  assert.equal(roundToStep(47.5, 5), 50);
  assert.equal(roundToStep(146.25, 5), 145);
  assert.equal(roundToStep(91.25, 2.5), 92.5); // halfway between 90 and 92.5
  assert.equal(roundToStep(40.3, 1.25), 40);
  assert.equal(roundToStep(62.5, 1.25), 62.5);
  assert.equal(roundToStep(84, 10), 80);
  assert.equal(roundToStep(85, 10), 90);
  assert.equal(roundToStep(12.345, 0), 12.35);
});

test('tie in the plate solver goes to the lighter load', () => {
  // plates 25 only, bar 45, target 120: side 37.5 is 12.5 from 25 and 12.5 from 50 -> 95 (not 145)
  assert.equal(solve({ target: 120, bar: 45, plates: [25] }).total, 95);
});

test('custom percent text', () => {
  assert.deepEqual(parsePercents('40, 60 80%, 100, 0, 60, abc'), [40, 60, 80]);
  assert.deepEqual(parsePercents('90;50;70'), [50, 70, 90]);
  assert.deepEqual(parsePercents(''), []);
  assert.deepEqual(allPercents('10 20 30 40 50 60 70 80 90'), [10, 20, 30, 40, 50, 60, 70, 80, 90]);
  assert.equal(parsePercents('10 20 30 40 50 60 70 80 90').length, MAX_PERCENTS);
  assert.equal(parsePercents('1 2 3 4 5 6 7 8 9 10').length, 8);
});

test('presets are well formed', () => {
  assert.deepEqual(PRESETS.strength.steps.map((s) => s.pct), [0, 40, 60, 80]);
  assert.deepEqual(PRESETS.hypertrophy.steps.map((s) => s.pct), [0, 50, 75]);
  assert.deepEqual(PRESETS.powerlifting.steps.map((s) => s.pct), [0, 30, 50, 65, 75, 85, 90]);
  for (const p of Object.values(PRESETS)) {
    const pcts = p.steps.map((s) => s.pct);
    assert.deepEqual(pcts, [...pcts].sort((a, b) => a - b));
  }
  assert.deepEqual(ROUND_STEPS.lb[0], 5);
  assert.deepEqual(ROUND_STEPS.kg[0], 2.5);
});

test('every row is a real load: bar + 2 x plates per side, strictly rising, ends at the work set', () => {
  const cases = [['lb', 45, LB, [5, 2.5, 10], [65, 95, 135, 185, 225, 275, 315, 365, 405, 455, 500]],
                 ['kg', 20, KG, [2.5, 1.25, 5], [40, 60, 80, 100, 140, 180, 227.5, 250]]];
  for (const [, bar, plates, steps, works] of cases) {
    for (const preset of Object.values(PRESETS)) {
      for (const step of steps) {
        for (const work of works) {
          const r = buildWarmups({ work, bar, plates, steps: preset.steps, step });
          assert.ok(r.rows.length >= 2, `rows for ${work}`);
          assert.equal(r.rows.at(-1).kind, 'work');
          assert.equal(r.rows.at(-1).total, r.work);
          for (let i = 0; i < r.rows.length; i++) {
            const x = r.rows[i];
            assert.equal(Math.round((bar + 2 * sideOf(x.list)) * 100), Math.round(x.total * 100), `${work} row ${i}`);
            if (i > 0) assert.ok(x.total > r.rows[i - 1].total, `rising at ${work} row ${i}`);
          }
        }
      }
    }
  }
});

const ramp = (work, key, unit = 'lb') => buildWarmups({ work, bar: unit === 'lb' ? 45 : 20, plates: unit === 'lb' ? LB : KG, steps: PRESETS[key].steps, step: unit === 'lb' ? 5 : 2.5, minGap: PRESETS[key].minGap[unit] });

test('powerlifting 405 lb has no big jump after the bar (30 percent set added)', () => {
  // 30% 121.5 -> 120; 50% 202.5 -> 205; 65% 263.25 -> 265; 75% 303.75 -> 305; 85% 344.25 -> 345; 90% 364.5 -> 365
  assert.deepEqual(totals(ramp(405, 'powerlifting')), [45, 120, 205, 265, 305, 345, 365, 405]);
});

test('powerlifting 135 lb drops sets closer than 20 lb: no 5 lb steps', () => {
  // raw 70, 90, 100, 115, 120 -> 100 is 10 above 90, 120 is 15 under the work set: both dropped
  assert.deepEqual(totals(ramp(135, 'powerlifting')), [45, 70, 90, 115, 135]);
});

test('powerlifting 95 lb is short', () => {
  assert.deepEqual(totals(ramp(95, 'powerlifting')), [45, 70, 95]);
});

test('strength keeps the Starting Strength sets at 135 lb (55, 80, 110)', () => {
  assert.deepEqual(totals(ramp(135, 'strength')), [45, 55, 80, 110, 135]);
});

test('minGap in kg: powerlifting jumps are at least 10 kg after the first set', () => {
  const t = totals(ramp(100, 'powerlifting', 'kg'));
  for (let i = 1; i < t.length; i++) assert.ok(t[i] - t[i - 1] >= 10, `${t[i - 1]} to ${t[i]}`);
  assert.deepEqual(totals(ramp(100, 'strength', 'kg')), [20, 40, 60, 80, 100]);
});

test('when the work weight is not loadable, percents come from the loaded weight', () => {
  // plates make 5 lb steps. 457 lb -> 455 lb loaded. 40% of 455 = 182 -> 180, not 40% of 457 = 182.8 -> 185
  const r = buildWarmups({ work: 457, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 });
  assert.equal(r.work, 455);
  assert.equal(r.rows[1].total, 180);
  assert.equal(r.rows[1].pct, 40);
});

test('rows keep the asked percent and the real percent', () => {
  const r = buildWarmups({ work: 135, bar: 45, plates: LB, steps: PRESETS.strength.steps, step: 5 });
  const row = r.rows[1]; // 40% of 135 = 54 -> 55, real 41%
  assert.equal(row.asked, 40);
  assert.equal(row.pct, 41);
});

test('a bar and plates that add nothing gives the light status', () => {
  assert.equal(buildWarmups({ work: 46, bar: 45, plates: [45], steps: PRESETS.strength.steps, step: 5 }).status, 'light');
});
