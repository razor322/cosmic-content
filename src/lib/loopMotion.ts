import {spring} from 'remotion';
import {TOTAL_FRAMES} from './timeline.ts';

/** How far the starfield travels while it slows down, as a share of the width. */
export const DRIFT_RATIO = 0.24;

const SPRING_CONFIG = {
  damping: 200,
  mass: 1,
  stiffness: 40,
  overshootClamping: true,
};

const SPRING_DURATION = 60;

/**
 * The frame the loop starfield uses. At the last frame of the episode it is
 * zero, which is the state of frame zero, so the reel can loop without a cut.
 */
export const loopFrame = (frame: number, total: number = TOTAL_FRAMES): number =>
  frame - total;

/** Starfield travel in the hook: it starts fast and slows down. */
export const hookDrift = (frame: number, fps: number, width: number): number => {
  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIG,
    durationInFrames: SPRING_DURATION,
  });
  return -progress * DRIFT_RATIO * width;
};

/**
 * Starfield travel in the last seconds of the closer. It returns to zero
 * exactly at the end of the episode, at the same speed the hook started with.
 */
export const tailDrift = (
  frame: number,
  fps: number,
  width: number,
  total: number = TOTAL_FRAMES,
): number => {
  const elapsed = Math.max(0, total - frame);
  const progress = spring({
    frame: elapsed,
    fps,
    config: SPRING_CONFIG,
    durationInFrames: SPRING_DURATION,
  });
  return progress * DRIFT_RATIO * width;
};
