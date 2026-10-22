import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  estimateTextWidth,
  fitHookFontSize,
  HOOK_MAX_FONT,
  HOOK_MIN_FONT,
} from './textFit.ts';

const MAX_WIDTH = 900;

test('a short hook keeps the largest size', () => {
  const size = fitHookFontSize(['YOU ARE', 'MADE OF', 'STARS.'], MAX_WIDTH);
  assert.equal(size, HOOK_MAX_FONT);
});

test('a long hook shrinks but never below the minimum', () => {
  const size = fitHookFontSize(
    ['FOOTPRINTS', 'THAT LAST', 'MILLIONS', 'OF YEARS.'],
    MAX_WIDTH,
  );
  assert.ok(size < HOOK_MAX_FONT);
  assert.ok(size >= HOOK_MIN_FONT);
});

test('every line fits the safe width at the chosen size', () => {
  const lines = ['FOOTPRINTS', 'THAT LAST', 'MILLIONS', 'OF YEARS.'];
  const size = fitHookFontSize(lines, MAX_WIDTH);
  for (const line of lines) {
    assert.ok(estimateTextWidth(line, size) <= MAX_WIDTH, `${line} is too wide`);
  }
});

test('longer text never gets a bigger size', () => {
  const short = fitHookFontSize(['OF SAND.'], MAX_WIDTH);
  const long = fitHookFontSize(['FOOTPRINTS'], MAX_WIDTH);
  assert.ok(long <= short);
});

test('an empty line has no width', () => {
  assert.equal(estimateTextWidth('', 140), 0);
});
