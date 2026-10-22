import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  coreRamp,
  cosmicPalette,
  mix,
  PALETTE_KEYS,
  shade,
  tint,
  WARM_ORDER,
  warmRamp,
  withAlpha,
} from '../theme/palette.ts';

test('the palette holds exactly the six tokens of the brief', () => {
  assert.deepEqual(PALETTE_KEYS, [
    'space.base',
    'cosmic.indigo',
    'nebula.purple',
    'stellar.magenta',
    'solar.coral',
    'star.white',
  ]);
});

test('the token values match the brief', () => {
  assert.equal(cosmicPalette['space.base'], '#0A0618');
  assert.equal(cosmicPalette['cosmic.indigo'], '#443199');
  assert.equal(cosmicPalette['nebula.purple'], '#792CA2');
  assert.equal(cosmicPalette['stellar.magenta'], '#C13383');
  assert.equal(cosmicPalette['solar.coral'], '#E05454');
  assert.equal(cosmicPalette['star.white'], '#F6F1FF');
});

test('no token is pure black or pure white', () => {
  for (const key of PALETTE_KEYS) {
    const hex = cosmicPalette[key].toLowerCase();
    assert.notEqual(hex, '#000000');
    assert.notEqual(hex, '#ffffff');
    assert.notEqual(hex, '#000');
    assert.notEqual(hex, '#fff');
  }
});

test('the warm ramp has four stops in the temperature order', () => {
  const ramp = warmRamp();
  assert.equal(ramp.length, 4);
  assert.deepEqual(ramp, [
    cosmicPalette['cosmic.indigo'],
    cosmicPalette['nebula.purple'],
    cosmicPalette['stellar.magenta'],
    cosmicPalette['solar.coral'],
  ]);
});

test('indigo and coral are never neighbours in the ramp', () => {
  const ramp = warmRamp();
  const indigo = ramp.indexOf(cosmicPalette['cosmic.indigo']);
  const coral = ramp.indexOf(cosmicPalette['solar.coral']);
  assert.ok(Math.abs(indigo - coral) > 1);
});

test('the warm order is indigo, purple, magenta, coral', () => {
  assert.deepEqual(WARM_ORDER, [
    'cosmic.indigo',
    'nebula.purple',
    'stellar.magenta',
    'solar.coral',
  ]);
});

test('a core ramp only mixes neighbouring tokens and never uses coral', () => {
  for (const lead of ['indigo', 'purple', 'magenta'] as const) {
    const ramp = coreRamp(lead);
    assert.equal(ramp.length, 3);
    assert.ok(!ramp.includes(cosmicPalette['solar.coral']));
    const leadColour = ramp[0];
    const neighbour = ramp[2];
    const warm = warmRamp();
    assert.ok(
      Math.abs(warm.indexOf(leadColour) - warm.indexOf(neighbour)) === 1,
      `${lead} ramp mixes tokens that are not neighbours`,
    );
  }
});

test('derived colours only move towards star.white or space.base', () => {
  const lightened = tint(cosmicPalette['cosmic.indigo'], 0.5);
  const darkened = shade(cosmicPalette['cosmic.indigo'], 0.5);
  assert.equal(lightened, mix(cosmicPalette['cosmic.indigo'], cosmicPalette['star.white'], 0.5));
  assert.equal(darkened, mix(cosmicPalette['cosmic.indigo'], cosmicPalette['space.base'], 0.5));
  assert.notEqual(lightened, darkened);
});

test('withAlpha keeps the hue and only changes the alpha', () => {
  assert.equal(withAlpha('#443199', 0.4), 'rgba(68, 49, 153, 0.4)');
});
