import React from 'react';
import {AbsoluteFill} from 'remotion';
import {withAlpha} from '../data/theme.ts';

export type VignetteProps = {
  color: string;
  strength: number;
  openRatio: number;
};

export const Vignette: React.FC<VignetteProps> = ({color, strength, openRatio}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse ${openRatio}% at 50% 45%, ${withAlpha(color, 0)} 28%, ${withAlpha(color, strength)} 100%)`,
      pointerEvents: 'none',
    }}
  />
);
