import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createRandom, nebulaBlobs, planetBands, starLayerPoints, warpStreaks} from './seeded.ts';

test('the same seed produces the same sequence', () => {
  const a = createRandom(42);
  const b = createRandom(42);
  for (let i = 0; i < 50; i++) {
    assert.equal(a(), b());
  }
});

test('different seeds produce different sequences', () => {
  const a = createRandom(1);
  const b = createRandom(2);
  assert.notEqual(a(), b());
});

test('generated values stay inside 0 to 1', () => {
  const next = createRandom(7);
  for (let i = 0; i < 500; i++) {
    const value = next();
    assert.ok(value >= 0 && value < 1, `value out of range: ${value}`);
  }
});

test('star layers are deterministic and normalised', () => {
  const first = starLayerPoints(99, 1, 30);
  const second = starLayerPoints(99, 1, 30);
  assert.deepEqual(first, second);
  assert.equal(first.length, 30);
  for (const star of first) {
    assert.ok(star.x >= 0 && star.x <= 1);
    assert.ok(star.y >= 0 && star.y <= 1);
    assert.ok(star.size > 0);
    assert.ok(star.alpha > 0 && star.alpha <= 1);
  }
});

test('each parallax layer has its own size range', () => {
  const far = starLayerPoints(5, 0, 40);
  const near = starLayerPoints(5, 2, 40);
  const farMax = Math.max(...far.map((s) => s.size));
  const nearMax = Math.max(...near.map((s) => s.size));
  assert.ok(nearMax > farMax);
});

test('nebula blobs, warp streaks and planet bands are deterministic', () => {
  assert.deepEqual(nebulaBlobs(3, 5), nebulaBlobs(3, 5));
  assert.deepEqual(warpStreaks(3, 5), warpStreaks(3, 5));
  assert.deepEqual(planetBands(3, 5), planetBands(3, 5));
});

test('warp streaks point away from the centre', () => {
  for (const streak of warpStreaks(11, 40)) {
    assert.ok(streak.angle >= 0 && streak.angle < Math.PI * 2);
    assert.ok(streak.outer > streak.inner);
  }
});

test('the last nebula blob carries the single warm accent', () => {
  const blobs = nebulaBlobs(11, 6);
  const warm = blobs.filter((blob) => blob.tone === 'coral');
  assert.equal(warm.length, 1);
  assert.equal(warm[0], blobs[blobs.length - 1]);
});
