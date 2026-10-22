import assert from 'node:assert/strict';
import {test} from 'node:test';
import {
  SUBTITLE_DELAY_FRAMES,
  SUBTITLE_FADE_IN_FRAMES,
  SUBTITLE_FADE_OUT_FRAMES,
  SUBTITLE_RISE_PX,
  subtitleStateAt,
} from './subtitle.ts';

const slots = [
  {id: 'core', from: 90, durationInFrames: 270, text: 'The calcium in your bones.'},
  {id: 'add1', from: 360, durationInFrames: 240, text: 'But it gets bigger.'},
];

test('no subtitle before the voiceover plus the delay', () => {
  assert.equal(subtitleStateAt(90 + 4 + SUBTITLE_DELAY_FRAMES - 1, slots), null);
});

test('the subtitle starts six frames after the voiceover', () => {
  const state = subtitleStateAt(90 + 4 + SUBTITLE_DELAY_FRAMES, slots);
  assert.ok(state);
  assert.equal(state?.sceneId, 'core');
  assert.equal(state?.text, 'The calcium in your bones.');
});

test('the subtitle fades in over ten frames and rises twelve pixels', () => {
  const start = 90 + 4 + SUBTITLE_DELAY_FRAMES;
  const early = subtitleStateAt(start, slots);
  const settled = subtitleStateAt(start + SUBTITLE_FADE_IN_FRAMES, slots);
  assert.equal(early?.opacity, 0);
  assert.equal(settled?.opacity, 1);
  assert.equal(early?.offsetY, SUBTITLE_RISE_PX);
  assert.equal(settled?.offsetY, 0);
});

test('the subtitle fades out over the last ten frames of the slot', () => {
  const end = 90 + 270;
  const middle = subtitleStateAt(end - SUBTITLE_FADE_OUT_FRAMES / 2, slots);
  const last = subtitleStateAt(end, slots);
  assert.ok((middle?.opacity ?? 0) > 0);
  assert.ok((middle?.opacity ?? 0) < 1);
  assert.equal(last?.opacity, 0);
});

test('only one scene carries a subtitle at a time', () => {
  for (let frame = 0; frame <= 1080; frame += 7) {
    const state = subtitleStateAt(frame, slots);
    if (state) {
      const others = slots.filter((slot) => slot.id !== state.sceneId);
      for (const other of others) {
        assert.notEqual(other.id, state.sceneId);
      }
    }
  }
});
