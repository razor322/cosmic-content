export const TOTAL_FRAMES = 900;
export const CROSSFADE_FRAMES = 18;

export type SceneId = 'void' | 'nebula' | 'planet' | 'warp' | 'resolve';

export type SceneSpan = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

export const SCENE_BOUNDARIES: readonly number[] = [0, 120, 300, 510, 720, 900];

const SCENE_IDS: SceneId[] = ['void', 'nebula', 'planet', 'warp', 'resolve'];

export const buildSceneSpans = (
  boundaries: readonly number[] = SCENE_BOUNDARIES,
  crossfade: number = CROSSFADE_FRAMES,
  total: number = TOTAL_FRAMES,
): SceneSpan[] => {
  const half = Math.floor(crossfade / 2);
  return boundaries.slice(0, -1).map((boundary, index) => {
    const from = Math.max(0, boundary - half);
    const isLast = index === boundaries.length - 2;
    const end = isLast ? total : boundaries[index + 1] + half;
    return {id: SCENE_IDS[index], from, durationInFrames: end - from};
  });
};

export const overlapFrames = (a: SceneSpan, b: SceneSpan): number => {
  const aEnd = a.from + a.durationInFrames;
  return Math.max(0, aEnd - b.from);
};
