import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {warpStreaks} from '../lib/seeded.ts';
import type {Palette} from '../types.ts';

export type WarpProps = {
  seed: number;
  progress: number;
  palette: Palette;
  roll: number;
  zoom: number;
};

export const Warp: React.FC<WarpProps> = ({seed, progress, palette, roll, zoom}) => {
  const {width, height} = useVideoConfig();
  const streaks = React.useMemo(() => warpStreaks(seed, 90), [seed]);
  const cx = width / 2;
  const cy = height * 0.46;
  const maxRadius = Math.hypot(width, height) * 0.62;
  const speed = interpolate(progress, [0, 0.33, 0.66, 1], [0.08, 1, 0.78, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const toneColor = (tone: 'starlight' | 'magenta' | 'coral'): string => {
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    if (tone === 'coral') {
      return palette.solarCoral;
    }
    return palette.starlight;
  };

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="warpDepth" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={palette.cosmicIndigo} stopOpacity={0.95} />
            <stop offset="70%" stopColor={palette.cosmicIndigo} stopOpacity={0.55} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={0.2} />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#warpDepth)" />
        <g
          transform={`rotate(${roll} ${cx} ${cy}) translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}
        >
          {streaks.map((streak, index) => {
            const inner = streak.inner * maxRadius;
            const outer =
              streak.inner * maxRadius + streak.outer * maxRadius * (0.3 + 0.7 * speed);
            const x1 = cx + Math.cos(streak.angle) * inner;
            const y1 = cy + Math.sin(streak.angle) * inner;
            const x2 = cx + Math.cos(streak.angle) * outer;
            const y2 = cy + Math.sin(streak.angle) * outer;
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={toneColor(streak.tone)}
                strokeWidth={streak.width * (0.6 + 0.9 * speed)}
                strokeLinecap="round"
                opacity={streak.alpha * speed}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
