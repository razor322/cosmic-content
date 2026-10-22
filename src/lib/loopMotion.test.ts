import assert from 'node:assert/strict';
import {test} from 'node:test';
import {DRIFT_RATIO, hookDrift, loopFrame, tailDrift} from './loopMotion.ts';
import {TOTAL_FRAMES} from './timeline.ts';

const FPS = 30;
const WIDTH = 1080;

test('the loop frame is zero at the end of the episode', () => {
  assert.equal(loopFrame(TOTAL_FRAMES), 0);
  assert.equal(loopFrame(0), -TOTAL_FRAMES);
});

test('the hook starfield starts at rest on frame zero', () => {
  assert.ok(Math.abs(hookDrift(0, FPS, WIDTH)) < 1e-9);
});

test('the hook starfield has settled by the end of the hook', () => {
  const settled = hookDrift(89, FPS, WIDTH);
  assert.ok(Math.abs(settled + DRIFT_RATIO * WIDTH) < 1);
});

test('the loop starfield is back at the start position on the last frame', () => {
  assert.equal(tailDrift(TOTAL_FRAMES, FPS, WIDTH), 0);
});

test('the starfield enters the loop at the same speed it started with', () => {
  const hookStep = Math.abs(hookDrift(1, FPS, WIDTH) - hookDrift(0, FPS, WIDTH));
  const tailStep = Math.abs(
    tailDrift(TOTAL_FRAMES - 1, FPS, WIDTH) - tailDrift(TOTAL_FRAMES, FPS, WIDTH),
  );
  assert.ok(Math.abs(hookStep - tailStep) < 1e-6);
});

test('the starfield travels in the same direction in both halves', () => {
  assert.ok(hookDrift(1, FPS, WIDTH) < hookDrift(0, FPS, WIDTH));
  assert.ok(tailDrift(TOTAL_FRAMES - 1, FPS, WIDTH) > tailDrift(TOTAL_FRAMES, FPS, WIDTH));
});
