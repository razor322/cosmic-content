import assert from 'node:assert/strict';
import {test} from 'node:test';
import {narration} from '../data/narration.ts';
import {
  SUBTITLE_DELAY_FRAMES,
  SUBTITLE_FADE_IN_FRAMES,
  SUBTITLE_FADE_OUT_FRAMES,
  SUBTITLE_RISE_PX,
  subtitleStateAt,
} from './subtitle.ts';

test('narration covers the five slots of the brief', () => {
  assert.equal(narration.length, 5);
  assert.deepEqual(
    narration.map((entry) => [entry.id, entry.startFrame, entry.endFrame]),
    [
      ['void', 0, 120],
      ['nebula', 120, 300],
      ['planet', 300, 510],
      ['warp', 510, 720],
      ['resolve', 720, 900],
    ],
  );
});

test('no subtitle is visible before the first slot opens', () => {
  assert.equal(subtitleStateAt(0, narration), null);
});

test('the subtitle appears six frames after the voiceover starts', () => {
  assert.equal(subtitleStateAt(SUBTITLE_DELAY_FRAMES - 1, narration), null);
  const state = subtitleStateAt(SUBTITLE_DELAY_FRAMES, narration);
  assert.ok(state);
  assert.equal(state?.id, 'void');
});

test('the subtitle fades in over ten frames and rises 12 px', () => {
  const start = SUBTITLE_DELAY_FRAMES;
  const mid = start + SUBTITLE_FADE_IN_FRAMES;
  const early = subtitleStateAt(start, narration);
  const settled = subtitleStateAt(mid, narration);
  assert.equal(early?.opacity, 0);
  assert.equal(settled?.opacity, 1);
  assert.equal(early?.offsetY, SUBTITLE_RISE_PX);
  assert.equal(settled?.offsetY, 0);
});

test('the subtitle fades out over the last ten frames of its slot', () => {
  const entry = narration[0];
  const fadeStart = entry.endFrame - SUBTITLE_FADE_OUT_FRAMES;
  const atFadeStart = subtitleStateAt(fadeStart, narration);
  const atFadeMiddle = subtitleStateAt(fadeStart + Math.floor(SUBTITLE_FADE_OUT_FRAMES / 2), narration);
  const gone = subtitleStateAt(entry.endFrame, narration);
  assert.equal(atFadeStart?.opacity, 1);
  assert.ok((atFadeMiddle?.opacity ?? 0) > 0);
  assert.ok((atFadeMiddle?.opacity ?? 0) < 1);
  assert.equal(gone?.opacity, 0);
});

test('the subtitle text comes from the narration data', () => {
  const state = subtitleStateAt(20, narration);
  assert.equal(state?.text, narration[0].text);
});

test('only one subtitle is ever active at a time', () => {
  for (let frame = 0; frame <= 900; frame++) {
    const active = narration.filter((entry) => {
      const state = subtitleStateAt(frame, narration);
      return state !== null && state.id === entry.id;
    });
    assert.ok(active.length <= 1, `more than one subtitle at frame ${frame}`);
  }
});

test('every narration slot produces a visible subtitle in its middle', () => {
  for (const entry of narration) {
    const middle = Math.floor((entry.startFrame + entry.endFrame) / 2);
    const state = subtitleStateAt(middle, narration);
    assert.ok(state, `no subtitle for ${entry.id} at frame ${middle}`);
    assert.equal(state?.opacity, 1);
  }
});
