import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  audioSlot,
  buildSceneSpans,
  CROSSFADE_FRAMES,
  overlapFrames,
  SCENE_BOUNDS,
  SCENE_SLOTS,
  sceneSlot,
  TOTAL_FRAMES,
  VO_OFFSET_FRAMES,
} from './timeline.ts';

test('an episode is 1080 frames long', () => {
  assert.equal(TOTAL_FRAMES, 1080);
});

test('the scene boundaries follow the brief', () => {
  assert.deepEqual([...SCENE_BOUNDS], [0, 90, 360, 600, 840, 1080]);
});

test('the five scene slots cover the episode exactly', () => {
  assert.equal(SCENE_SLOTS.length, 5);
  const total = SCENE_SLOTS.reduce((sum, slot) => sum + slot.durationInFrames, 0);
  assert.equal(total, TOTAL_FRAMES);
  assert.deepEqual(
    SCENE_SLOTS.map((slot) => [slot.id, slot.from, slot.durationInFrames]),
    [
      ['hook', 0, 90],
      ['core', 90, 270],
      ['add1', 360, 240],
      ['add2', 600, 240],
      ['closer', 840, 240],
    ],
  );
});

test('the core message ends at second twelve', () => {
  assert.equal(SCENE_BOUNDS[2] / 30, 12);
});

test('scene spans cover the episode without a gap', () => {
  const spans = buildSceneSpans();
  assert.equal(spans[0].from, 0);
  const last = spans[spans.length - 1];
  assert.equal(last.from + last.durationInFrames, TOTAL_FRAMES);
  for (let i = 1; i < spans.length; i++) {
    const previousEnd = spans[i - 1].from + spans[i - 1].durationInFrames;
    assert.ok(previousEnd >= spans[i].from, `gap before ${spans[i].id}`);
  }
});

test('neighbouring scenes crossfade by twelve frames', () => {
  const spans = buildSceneSpans();
  for (let i = 1; i < spans.length; i++) {
    assert.equal(overlapFrames(spans[i - 1], spans[i]), CROSSFADE_FRAMES);
  }
  assert.ok(CROSSFADE_FRAMES >= 10 && CROSSFADE_FRAMES <= 16);
});

test('a voiceover starts four frames into its scene', () => {
  assert.equal(VO_OFFSET_FRAMES, 4);
  const slot = audioSlot('core');
  assert.equal(slot.from, sceneSlot('core').from + 4);
  assert.equal(slot.durationInFrames, sceneSlot('core').durationInFrames - 4);
});

test('an unknown scene name fails loudly', () => {
  assert.throws(() => sceneSlot('nope' as never), /Unknown scene/);
});
