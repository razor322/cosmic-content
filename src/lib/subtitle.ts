import {VO_OFFSET_FRAMES} from './timeline.ts';

export const SUBTITLE_DELAY_FRAMES = 6;
export const SUBTITLE_FADE_IN_FRAMES = 10;
export const SUBTITLE_FADE_OUT_FRAMES = 10;
export const SUBTITLE_RISE_PX = 12;

export type SubtitleSlot = {
  id: string;
  from: number;
  durationInFrames: number;
  text: string;
};

export type SubtitleState = {
  sceneId: string;
  text: string;
  opacity: number;
  offsetY: number;
};

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const ramp = (frame: number, from: number, to: number): number =>
  clamp01((frame - from) / (to - from));

/**
 * The subtitle of a scene starts six frames after its voiceover and leaves ten
 * frames before the slot ends.
 */
export const subtitleStateAt = (
  frame: number,
  slots: SubtitleSlot[],
): SubtitleState | null => {
  for (const slot of slots) {
    const audioStart = slot.from + VO_OFFSET_FRAMES;
    const start = audioStart + SUBTITLE_DELAY_FRAMES;
    const fadeInEnd = start + SUBTITLE_FADE_IN_FRAMES;
    const end = slot.from + slot.durationInFrames;
    const fadeOutStart = end - SUBTITLE_FADE_OUT_FRAMES;
    if (frame < start || frame > end) {
      continue;
    }
    const fadeIn = ramp(frame, start, fadeInEnd);
    const fadeOut = 1 - ramp(frame, fadeOutStart, end);
    return {
      sceneId: slot.id,
      text: slot.text,
      opacity: clamp01(fadeIn * fadeOut),
      offsetY: SUBTITLE_RISE_PX * (1 - fadeIn),
    };
  }
  return null;
};
