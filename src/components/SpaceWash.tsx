import React from 'react';
import {AbsoluteFill} from 'remotion';
import {radialWash} from '../lib/gradients.ts';

export type SpaceWashProps = {
  colour: string;
  strength: number;
  centerRatio?: number;
  radiusX?: number;
  radiusY?: number;
};

/**
 * The colour of the space itself. It is a contained glow, not a tint over the
 * whole frame, so the deep base keeps most of the picture.
 */
export const SpaceWash: React.FC<SpaceWashProps> = ({
  colour,
  strength,
  centerRatio = 0.46,
  radiusX = 40,
  radiusY = 24,
}) => (
  <AbsoluteFill
    style={{
      background: radialWash(colour, strength, {
        centerY: Math.round(centerRatio * 100),
        radiusX,
        radiusY,
      }),
      pointerEvents: 'none',
    }}
  />
);
