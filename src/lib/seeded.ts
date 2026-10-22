export const createRandom = (seed: number): (() => number) => {
  let state = Math.imul(seed ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type StarPoint = {
  x: number;
  y: number;
  size: number;
  alpha: number;
  phase: number;
};

export type Blob = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  tone: 'purple' | 'magenta' | 'coral';
};

export type Streak = {
  angle: number;
  inner: number;
  outer: number;
  width: number;
  alpha: number;
  tone: 'starlight' | 'magenta' | 'coral';
};

export type Band = {
  y: number;
  thickness: number;
  opacity: number;
  tone: 'purple' | 'lavender' | 'magenta';
};

const LAYER_SIZE: Record<number, [number, number]> = {
  0: [0.4, 1.1],
  1: [0.8, 2.0],
  2: [1.6, 3.4],
};

const LAYER_ALPHA: Record<number, [number, number]> = {
  0: [0.25, 0.55],
  1: [0.4, 0.75],
  2: [0.55, 0.95],
};

export const starLayerPoints = (seed: number, layer: number, count: number): StarPoint[] => {
  const next = createRandom(seed + layer * 7919);
  const [minSize, maxSize] = LAYER_SIZE[layer] ?? LAYER_SIZE[1];
  const [minAlpha, maxAlpha] = LAYER_ALPHA[layer] ?? LAYER_ALPHA[1];
  return Array.from({length: count}, () => ({
    x: next(),
    y: next(),
    size: minSize + next() * (maxSize - minSize),
    alpha: minAlpha + next() * (maxAlpha - minAlpha),
    phase: next() * Math.PI * 2,
  }));
};

export const nebulaBlobs = (seed: number, count: number): Blob[] => {
  const next = createRandom(seed + 104729);
  const tones: Blob['tone'][] = ['purple', 'purple', 'magenta'];
  const blobs = Array.from({length: count}, () => ({
    x: 0.1 + next() * 0.8,
    y: 0.05 + next() * 0.9,
    radius: 0.18 + next() * 0.34,
    opacity: 0.35 + next() * 0.4,
    tone: tones[Math.floor(next() * tones.length)] as Blob['tone'],
  }));
  if (blobs.length > 0) {
    blobs[blobs.length - 1].tone = 'coral';
  }
  return blobs;
};

export const warpStreaks = (seed: number, count: number): Streak[] => {
  const next = createRandom(seed + 15485863);
  const tones: Streak['tone'][] = ['starlight', 'starlight', 'starlight', 'magenta', 'coral'];
  return Array.from({length: count}, () => ({
    angle: next() * Math.PI * 2,
    inner: 0.08 + next() * 0.18,
    outer: 0.34 + next() * 0.66,
    width: 0.6 + next() * 2.2,
    alpha: 0.2 + next() * 0.7,
    tone: tones[Math.floor(next() * tones.length)] as Streak['tone'],
  }));
};

export const planetBands = (seed: number, count: number): Band[] => {
  const next = createRandom(seed + 32452843);
  const tones: Band['tone'][] = ['purple', 'lavender', 'magenta'];
  return Array.from({length: count}, () => ({
    y: 0.18 + next() * 0.64,
    thickness: 0.02 + next() * 0.07,
    opacity: 0.12 + next() * 0.3,
    tone: tones[Math.floor(next() * tones.length)] as Band['tone'],
  }));
};
