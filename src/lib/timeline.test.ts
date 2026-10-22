import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  buildSceneSpans,
  CROSSFADE_FRAMES,
  overlapFrames,
  SCENE_BOUNDARIES,
  TOTAL_FRAMES,
} from './timeline.ts';

test('the composition is 900 frames long', () => {
  assert.equal(TOTAL_FRAMES, 900);
});

test('narration boundaries match the brief', () => {
  assert.deepEqual([...SCENE_BOUNDARIES], [0, 120, 300, 510, 720, 900]);
});

test('scenes cover the whole composition without a gap', () => {
  const spans = buildSceneSpans();
  assert.equal(spans[0].from, 0);
  const last = spans[spans.length - 1];
  assert.equal(last.from + last.durationInFrames, TOTAL_FRAMES);
  for (let i = 1; i < spans.length; i++) {
    const previousEnd = spans[i - 1].from + spans[i - 1].durationInFrames;
    assert.ok(previousEnd >= spans[i].from, `gap before scene ${spans[i].id}`);
  }
});

test('consecutive scenes crossfade by 18 frames', () => {
  const spans = buildSceneSpans();
  for (let i = 1; i < spans.length; i++) {
    assert.equal(overlapFrames(spans[i - 1], spans[i]), CROSSFADE_FRAMES);
  }
});

test('the crossfade stays inside the 15 to 20 frame window', () => {
  assert.ok(CROSSFADE_FRAMES >= 15 && CROSSFADE_FRAMES <= 20);
});

test('every scene keeps more than 100 frames of screen time', () => {
  const spans = buildSceneSpans();
  assert.ok(spans.every((span) => span.durationInFrames > 100));
});

test('the scene ids follow the order of the brief', () => {
  const spans = buildSceneSpans();
  assert.deepEqual(
    spans.map((span) => span.id),
    ['void', 'nebula', 'planet', 'warp', 'resolve'],
  );
});
