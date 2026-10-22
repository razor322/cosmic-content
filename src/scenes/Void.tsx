import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {Stars} from '../components/Stars.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {withAlpha} from '../data/theme.ts';
import type {SceneProps} from '../types.ts';

export const VoidScene: React.FC<SceneProps> = ({palette, seed, progress}) => {
  const {height} = useVideoConfig();
  const openRatio = interpolate(progress, [0, 1], [44, 68], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 100% 68% at 50% 74%, ${withAlpha(palette.cosmicIndigo, 1)} 0%, ${withAlpha(palette.cosmicIndigo, 1)} 46%, ${withAlpha(palette.deepViolet, 1)} 96%)`,
      }}
    >
      <Stars seed={seed} count={70} layer={0} color={palette.starlight} opacity={0.5} parallax={0.6} />
      <Stars seed={seed + 1} count={46} layer={1} color={palette.starlight} opacity={0.7} parallax={1} />
      <Stars seed={seed + 2} count={22} layer={2} color={palette.lavender} opacity={0.85} parallax={1.5} />
      <Vignette color={palette.deepViolet} strength={0.6} openRatio={openRatio} />
    </AbsoluteFill>
  );
};
