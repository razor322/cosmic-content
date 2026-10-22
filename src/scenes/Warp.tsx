import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Vignette} from '../components/Vignette.tsx';
import {Warp} from '../components/Warp.tsx';
import type {SceneProps} from '../types.ts';

export const WarpScene: React.FC<SceneProps> = ({palette, seed, progress}) => {
  const zoom = interpolate(progress, [0, 1], [1, 1.22], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const roll = interpolate(progress, [0, 0.5, 1], [-1.6, 0.4, -1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: palette.deepViolet}}>
      <Warp seed={seed + 17} progress={progress} palette={palette} roll={roll} zoom={zoom} />
      <Vignette color={palette.deepViolet} strength={0.55} openRatio={60} />
    </AbsoluteFill>
  );
};
