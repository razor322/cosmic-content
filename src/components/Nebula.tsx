import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {nebulaBlobs} from '../lib/seeded.ts';
import type {Palette} from '../types.ts';

export type NebulaProps = {
  seed: number;
  progress: number;
  palette: Palette;
};

export const Nebula: React.FC<NebulaProps> = ({seed, progress, palette}) => {
  const {width, height} = useVideoConfig();
  const blobs = React.useMemo(() => nebulaBlobs(seed, 6), [seed]);
  const toneColor = (tone: 'purple' | 'magenta' | 'coral'): string => {
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    if (tone === 'coral') {
      return palette.solarCoral;
    }
    return palette.nebulaPurple;
  };

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {blobs.map((blob, index) => (
            <radialGradient key={index} id={`blob-${index}`}>
              <stop offset="0%" stopColor={toneColor(blob.tone)} stopOpacity={blob.opacity} />
              <stop offset="55%" stopColor={toneColor(blob.tone)} stopOpacity={blob.opacity * 0.35} />
              <stop offset="100%" stopColor={toneColor(blob.tone)} stopOpacity={0} />
            </radialGradient>
          ))}
          <radialGradient id="wash">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0.16} />
            <stop offset="100%" stopColor={palette.lavender} stopOpacity={0} />
          </radialGradient>
        </defs>
        {blobs.map((blob, index) => (
          <ellipse
            key={index}
            cx={blob.x * width}
            cy={blob.y * height + progress * height * 0.06}
            rx={blob.radius * width * 0.95}
            ry={blob.radius * height * 0.62}
            fill={`url(#blob-${index})`}
            transform={`translate(${width / 2} ${height / 2}) scale(${1 + progress * 0.08}) translate(${-width / 2} ${-height / 2})`}
          />
        ))}
        <ellipse
          cx={width * 0.34}
          cy={height * 0.38}
          rx={width * 0.5}
          ry={height * 0.34}
          fill="url(#wash)"
        />
      </svg>
    </AbsoluteFill>
  );
};
