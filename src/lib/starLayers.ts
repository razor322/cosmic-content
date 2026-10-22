import type {StarPoint} from './seeded.ts';

export type StarLayer = {
  seedOffset: number;
  count: number;
  layer: 0 | 1 | 2;
  opacity: number;
  sizeScale: number;
};

/**
 * The star layers of the opening and of the closing tail. Both use the same
 * list, so the reel can loop without a cut.
 */
export const STAR_LAYERS: StarLayer[] = [
  {seedOffset: 0, count: 70, layer: 0, opacity: 0.5, sizeScale: 1},
  {seedOffset: 1, count: 46, layer: 1, opacity: 0.7, sizeScale: 1.15},
  {seedOffset: 2, count: 22, layer: 2, opacity: 0.85, sizeScale: 1.35},
];

export type StarPointList = StarPoint[];
