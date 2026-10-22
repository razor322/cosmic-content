import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {Planet} from '../components/Planet.tsx';
import {Stars} from '../components/Stars.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {withAlpha} from '../data/theme.ts';
import type {SceneProps} from '../types.ts';

export const PlanetScene: React.FC<SceneProps> = ({palette, seed, progress, showRing}) => {
  const {height} = useVideoConfig();
  const rise = interpolate(progress, [0, 0.65], [height * 0.18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 120% 82% at 50% 46%, ${withAlpha(palette.cosmicIndigo, 1)} 0%, ${withAlpha(palette.cosmicIndigo, 1)} 58%, ${withAlpha(palette.deepViolet, 1)} 100%)`,
      }}
    >
      <Stars seed={seed + 21} count={44} layer={0} color={palette.starlight} opacity={0.42} parallax={0.4} />
      <Stars seed={seed + 22} count={26} layer={1} color={palette.starlight} opacity={0.6} parallax={0.8} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${rise}px)`}}>
        <Planet
          seed={seed + 7}
          progress={progress}
          palette={palette}
          showRing={showRing}
          lightSweep={progress * 1.4}
        />
      </div>
      <Vignette color={palette.deepViolet} strength={0.55} openRatio={56} />
    </AbsoluteFill>
  );
};
