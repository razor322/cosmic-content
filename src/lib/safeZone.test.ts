import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  focusBand,
  safeZone,
  subtitleBottomClearance,
  subtitleFontSize,
  subtitleMaxWidth,
  titleFontSize,
} from './safeZone.ts';

test('safe zone matches the reference canvas', () => {
  const zone = safeZone(1080, 1920);
  assert.equal(zone.top, 220);
  assert.equal(zone.bottom, 380);
  assert.equal(zone.left, 60);
  assert.equal(zone.right, 120);
});

test('safe zone scales with the output size', () => {
  const zone = safeZone(540, 960);
  assert.equal(zone.top, 110);
  assert.equal(zone.left, 30);
});

test('subtitle keeps 400 px of clearance at the reference size', () => {
  assert.equal(subtitleBottomClearance(1920), 400);
  assert.ok(subtitleBottomClearance(960) >= 200);
});

test('subtitle width and font size follow the reference ratio', () => {
  assert.equal(subtitleMaxWidth(1080), 840);
  assert.equal(subtitleFontSize(1080), 50);
  assert.equal(titleFontSize(1080), 108);
});

test('focus band sits between 35 and 55 percent of the height', () => {
  const band = focusBand(1920);
  assert.equal(band.top, 1920 * 0.35);
  assert.equal(band.bottom, 1920 * 0.55);
});
