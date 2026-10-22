import React from 'react';
import {AbsoluteFill} from 'remotion';
import {radialVignette} from '../lib/gradients.ts';

export type VignetteProps = {
  color: string;
  strength: number;
  openRatio: number;
};

export const Vignette: React.FC<VignetteProps> = ({color, strength, openRatio}) => (
  <AbsoluteFill
    style={{
      background: radialVignette(color, strength, openRatio),
      pointerEvents: 'none',
    }}
  />
);
