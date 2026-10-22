import type {SceneId} from '../data/episodes.ts';

export const TOTAL_FRAMES = 1080;
export const CROSSFADE_FRAMES = 12;
export const VO_OFFSET_FRAMES = 4;

export const SCENE_IDS: SceneId[] = ['hook', 'core', 'add1', 'add2', 'closer'];

export const SCENE_BOUNDS: readonly number[] = [0, 90, 360, 600, 840, 1080];

export type SceneSpan = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

export type SceneSlot = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

export const SCENE_SLOTS: SceneSlot[] = SCENE_IDS.map((id, index) => ({
  id,
  from: SCENE_BOUNDS[index],
  durationInFrames: SCENE_BOUNDS[index + 1] - SCENE_BOUNDS[index],
}));

export const sceneSlot = (id: SceneId): SceneSlot => {
  const slot = SCENE_SLOTS.find((candidate) => candidate.id === id);
  if (!slot) {
    throw new Error(`Unknown scene "${id}"`);
  }
  return slot;
};

/** The window a voiceover file may fill: it starts four frames into the scene. */
export const audioSlot = (id: SceneId): {from: number; durationInFrames: number} => {
  const slot = sceneSlot(id);
  return {
    from: slot.from + VO_OFFSET_FRAMES,
    durationInFrames: slot.durationInFrames - VO_OFFSET_FRAMES,
  };
};

/**
 * The render span of a scene. Every scene reaches six frames into its
 * neighbour so the crossfade has both halves available.
 */
export const buildSceneSpans = (
  bounds: readonly number[] = SCENE_BOUNDS,
  crossfade: number = CROSSFADE_FRAMES,
  total: number = TOTAL_FRAMES,
): SceneSpan[] => {
  const half = Math.floor(crossfade / 2);
  return bounds.slice(0, -1).map((boundary, index) => {
    const from = Math.max(0, boundary - half);
    const isLast = index === bounds.length - 2;
    const end = isLast ? total : bounds[index + 1] + half;
    return {id: SCENE_IDS[index], from, durationInFrames: end - from};
  });
};

export const overlapFrames = (a: SceneSpan, b: SceneSpan): number => {
  const aEnd = a.from + a.durationInFrames;
  return Math.max(0, aEnd - b.from);
};
