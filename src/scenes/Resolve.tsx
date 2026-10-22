import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Stars} from '../components/Stars.tsx';
import {Title} from '../components/Title.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {withAlpha} from '../data/theme.ts';
import type {SceneProps} from '../types.ts';

export const ResolveScene: React.FC<SceneProps> = ({
  palette,
  seed,
  progress,
  durationInFrames,
  title,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const ringRadius = interpolate(progress, [0.06, 0.9], [width * 0.12, width * 1.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ringOpacity = interpolate(progress, [0.06, 0.2, 0.9], [0, 0.5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleFade = interpolate(
    frame,
    [durationInFrames - 42, durationInFrames - 12],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 88% 60% at 50% 44%, ${withAlpha(palette.nebulaPurple, 1)} 0%, ${withAlpha(palette.cosmicIndigo, 1)} 52%, ${withAlpha(palette.deepViolet, 1)} 100%)`,
      }}
    >
      <Stars seed={seed + 23} count={40} layer={1} color={palette.starlight} opacity={0.45} parallax={0.7} />
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{position: 'absolute'}}
      >
        <circle
          cx={width / 2}
          cy={height * 0.46}
          r={ringRadius}
          fill="none"
          stroke={palette.lavender}
          strokeWidth={2}
          opacity={ringOpacity}
        />
      </svg>
      <Title title={title} fadeOut={titleFade} palette={palette} />
      <Vignette color={palette.deepViolet} strength={0.6} openRatio={58} />
    </AbsoluteFill>
  );
};
