import assert from 'node:assert/strict';
import {test} from 'node:test';
import {cosmicTheme, PALETTE_KEYS, withAlpha} from '../data/theme.ts';

test('palette holds exactly the seven brand tokens', () => {
  assert.deepEqual(PALETTE_KEYS, [
    'cosmicIndigo',
    'nebulaPurple',
    'stellarMagenta',
    'solarCoral',
    'deepViolet',
    'lavender',
    'starlight',
  ]);
});

test('palette values match the brand hexes', () => {
  assert.equal(cosmicTheme.cosmicIndigo, '#443199');
  assert.equal(cosmicTheme.nebulaPurple, '#792CA2');
  assert.equal(cosmicTheme.stellarMagenta, '#C13383');
  assert.equal(cosmicTheme.solarCoral, '#E05454');
  assert.equal(cosmicTheme.deepViolet, '#29204F');
  assert.equal(cosmicTheme.lavender, '#B8B2FF');
  assert.equal(cosmicTheme.starlight, '#FFF2EC');
});

test('withAlpha converts a hex to rgba', () => {
  assert.equal(withAlpha('#443199', 0.5), 'rgba(68, 49, 153, 0.5)');
});
