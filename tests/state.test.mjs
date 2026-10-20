// Saved-settings loading with hostile or hand-edited data.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadState, defaultState } from '../src/lib/state.js';

test('nothing saved gives the defaults', () => {
  assert.deepEqual(loadState(null), defaultState());
  assert.deepEqual(loadState('text'), defaultState());
  assert.deepEqual(loadState([]), defaultState());
});

test('inherited object names are not presets', () => {
  for (const name of ['toString', '__proto__', 'constructor', 'hasOwnProperty']) {
    assert.equal(loadState({ preset: name }).preset, 'strength', name);
  }
  assert.equal(loadState({ preset: 'custom' }).preset, 'custom');
  assert.equal(loadState({ preset: 'hypertrophy' }).preset, 'hypertrophy');
});

test('all plates off falls back to the default plates for that unit only', () => {
  const s = loadState({ plates: { lb: [], kg: [25, 20] } });
  assert.deepEqual(s.plates.lb, defaultState().plates.lb);
  assert.deepEqual(s.plates.kg, [25, 20]);
  assert.deepEqual(loadState({ plates: { lb: [99, 'x'] } }).plates.lb, defaultState().plates.lb);
});

test('weights are bounded per unit', () => {
  assert.equal(loadState({ unit: 'lb', work: 1500 }).work, 1500);
  assert.equal(loadState({ unit: 'lb', work: 1501 }).work, 225);
  assert.equal(loadState({ unit: 'kg', work: 701 }).work, 225);
  assert.equal(loadState({ work: -5 }).work, 225);
  assert.equal(loadState({ work: 'abc' }).work, 225);
  assert.equal(loadState({ customBar: { lb: 0 } }).customBar.lb, 25);
  assert.equal(loadState({ customBar: { lb: 35 } }).customBar.lb, 35);
});

test('bar ids and rounding steps must be known', () => {
  const s = loadState({ bar: { lb: '99', kg: 'custom' }, round: { lb: 7, kg: 1.25 } });
  assert.equal(s.bar.lb, '45');
  assert.equal(s.bar.kg, 'custom');
  assert.equal(s.round.lb, 5);
  assert.equal(s.round.kg, 1.25);
});

test('custom percent text is capped at 60 characters', () => {
  assert.equal(loadState({ custom: '1 '.repeat(100) }).custom.length, 60);
});
