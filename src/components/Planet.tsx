import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {planetBands} from '../lib/seeded.ts';
import type {Palette} from '../types.ts';

export type PlanetProps = {
  seed: number;
  progress: number;
  palette: Palette;
  showRing: boolean;
  lightSweep: number;
};

export const Planet: React.FC<PlanetProps> = ({
  seed,
  progress,
  palette,
  showRing,
  lightSweep,
}) => {
  const {width, height} = useVideoConfig();
  const radius = width * 0.4;
  const cx = width * 0.5;
  const cy = height * 0.46;
  const bands = React.useMemo(() => planetBands(seed, 9), [seed]);
  const bandColor = (tone: 'purple' | 'lavender' | 'magenta'): string => {
    if (tone === 'lavender') {
      return palette.lavender;
    }
    if (tone === 'magenta') {
      return palette.stellarMagenta;
    }
    return palette.nebulaPurple;
  };
  const ringRx = radius * 1.75;
  const ringRy = radius * 0.34;
  const moonAngle = progress * Math.PI * 2 * 0.6;

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="surface" cx="38%" cy="34%" r="78%">
            <stop offset="0%" stopColor={palette.nebulaPurple} stopOpacity={1} />
            <stop offset="40%" stopColor={palette.cosmicIndigo} stopOpacity={1} />
            <stop offset="88%" stopColor={palette.deepViolet} stopOpacity={1} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={1} />
          </radialGradient>
          <linearGradient id="limb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.deepViolet} stopOpacity={0} />
            <stop offset="62%" stopColor={palette.deepViolet} stopOpacity={0.06} />
            <stop offset="100%" stopColor={palette.deepViolet} stopOpacity={0.45} />
          </linearGradient>
          <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0} />
            <stop offset="14%" stopColor={palette.lavender} stopOpacity={0.28} />
            <stop offset="26%" stopColor={palette.lavender} stopOpacity={1} />
            <stop offset="36%" stopColor={palette.lavender} stopOpacity={0.16} />
            <stop offset="55%" stopColor={palette.lavender} stopOpacity={0} />
            <stop offset="100%" stopColor={palette.stellarMagenta} stopOpacity={0.5} />
          </linearGradient>
          <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={palette.lavender} stopOpacity={0} />
            <stop offset="50%" stopColor={palette.lavender} stopOpacity={0.14} />
            <stop offset="100%" stopColor={palette.lavender} stopOpacity={0} />
          </linearGradient>
          <clipPath id="planetClip">
            <circle cx={cx} cy={cy} r={radius} />
          </clipPath>
        </defs>

        {showRing ? (
          <g transform={`rotate(-18 ${cx} ${cy})`}>
            <ellipse
              cx={cx}
              cy={cy}
              rx={ringRx}
              ry={ringRy}
              fill="none"
              stroke={palette.lavender}
              strokeOpacity={0.4}
              strokeWidth={width * 0.007}
            />
          </g>
        ) : null}

        <circle cx={cx} cy={cy} r={radius} fill="url(#surface)" />

        <g clipPath="url(#planetClip)" transform={`rotate(${progress * 6} ${cx} ${cy})`}>
          {bands.map((band, index) => (
            <ellipse
              key={index}
              cx={cx}
              cy={cy - radius + band.y * radius * 2}
              rx={radius * 1.05}
              ry={band.thickness * radius}
              fill={bandColor(band.tone)}
              opacity={band.opacity}
            />
          ))}
          <rect
            x={cx - radius * 1.2}
            y={cy - radius * 1.2}
            width={radius * 2.4}
            height={radius * 2.4}
            fill="url(#sweep)"
            transform={`translate(${lightSweep * radius * 1.6} 0) rotate(-24 ${cx} ${cy})`}
          />
        </g>

        <circle cx={cx} cy={cy} r={radius} fill="url(#limb)" />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#rim)"
          strokeWidth={width * 0.014}
        />

        {showRing ? (
          <g transform={`rotate(-18 ${cx} ${cy})`}>
            <path
              d={`M ${cx + ringRx} ${cy} A ${ringRx} ${ringRy} 0 0 0 ${cx - ringRx} ${cy}`}
              fill="none"
              stroke={palette.lavender}
              strokeOpacity={0.62}
              strokeWidth={width * 0.007}
            />
          </g>
        ) : null}

        <g transform={`rotate(-18 ${cx} ${cy})`}>
          <circle
            cx={cx + Math.cos(moonAngle) * radius * 1.2}
            cy={cy + Math.sin(moonAngle) * radius * 0.4}
            r={width * 0.014}
            fill={palette.starlight}
            opacity={0.9}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
