import assert from 'node:assert/strict';
import {test} from 'node:test';
import {radialVignette, radialWash} from './gradients.ts';

const COLOUR = '#443199';

test('a wash paints an ellipse with two radii', () => {
  const gradient = radialWash(COLOUR, 0.5);
  assert.match(gradient, /radial-gradient\(ellipse \d+% \d+% at 50% 50%/);
});

test('a wash fades out towards the edge', () => {
  const gradient = radialWash(COLOUR, 0.5);
  const alphas = [...gradient.matchAll(/rgba\([^)]*?, ([\d.]+)\)/g)].map((match) =>
    Number(match[1]),
  );
  assert.equal(alphas.length, 3);
  assert.ok(alphas[0] > alphas[1]);
  assert.ok(alphas[1] > alphas[2]);
  assert.equal(alphas[2], 0);
});

test('a vignette paints an ellipse with two radii', () => {
  const gradient = radialVignette(COLOUR, 0.7, 60);
  assert.match(gradient, /radial-gradient\(ellipse \d+% \d+% at 50% 45%/);
});

test('a vignette is clear in the middle and coloured at the edge', () => {
  const gradient = radialVignette(COLOUR, 0.7, 60);
  const alphas = [...gradient.matchAll(/rgba\([^)]*?, ([\d.]+)\)/g)].map((match) =>
    Number(match[1]),
  );
  assert.equal(alphas[0], 0);
  assert.ok(alphas[1] > 0);
});

test('every gradient uses an ellipse with two radii, never one', () => {
  for (const gradient of [
    radialWash(COLOUR, 0.5, {radiusX: 80, radiusY: 50}),
    radialVignette(COLOUR, 0.6, 55),
  ]) {
    const size = gradient.match(/ellipse ([^)]*?) at/)?.[1] ?? '';
    assert.equal(size.split(' ').length, 2, `invalid ellipse size: ${size}`);
  }
});
