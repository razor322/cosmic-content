import type {NarrationEntry} from '../data/narration.ts';

export const SUBTITLE_DELAY_FRAMES = 6;
export const SUBTITLE_FADE_IN_FRAMES = 10;
export const SUBTITLE_FADE_OUT_FRAMES = 10;
export const SUBTITLE_RISE_PX = 12;

export type SubtitleState = {
  id: string;
  text: string;
  opacity: number;
  offsetY: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const ramp = (frame: number, from: number, to: number): number =>
  clamp01((frame - from) / (to - from));

export const subtitleStateAt = (
  frame: number,
  entries: NarrationEntry[],
): SubtitleState | null => {
  for (const entry of entries) {
    const start = entry.startFrame + SUBTITLE_DELAY_FRAMES;
    const fadeInEnd = start + SUBTITLE_FADE_IN_FRAMES;
    const fadeOutStart = entry.endFrame - SUBTITLE_FADE_OUT_FRAMES;
    if (frame < start || frame > entry.endFrame) {
      continue;
    }
    const fadeIn = ramp(frame, start, fadeInEnd);
    const fadeOut = 1 - ramp(frame, fadeOutStart, entry.endFrame);
    return {
      id: entry.id,
      text: entry.text,
      opacity: clamp01(fadeIn * fadeOut),
      offsetY: SUBTITLE_RISE_PX * (1 - fadeIn),
    };
  }
  return null;
};
