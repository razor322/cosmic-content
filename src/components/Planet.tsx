import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {createRandom, planetBands} from '../lib/seeded.ts';
import type {PlanetVariant} from '../data/episodes.ts';

export type PlanetProps = {
  seed: number;
  progress: number;
  variant: PlanetVariant;
  colors: string[];
  rimColor: string;
  white: string;
  showRing?: boolean;
  lightSweep?: number;
  centerRatio?: number;
};

/**
 * The object of the first extra scene. The variant decides the surface: bands,
 * a ring, clouds, craters, or the bright core of a star.
 */
export const Planet: React.FC<PlanetProps> = ({
  seed,
  progress,
  variant,
  colors,
  rimColor,
  white,
  showRing = false,
  lightSweep = 0,
  centerRatio = 0.46,
}) => {
  const {width, height} = useVideoConfig();
  const radius = width * 0.45;
  const cx = width / 2;
  const cy = height * centerRatio;
  const bands = React.useMemo(() => planetBands(seed, 9), [seed]);
  const craters = React.useMemo(() => {
    const next = createRandom(seed + 7717);
    return Array.from({length: 11}, () => ({
      x: (next() - 0.5) * radius * 1.7,
      y: (next() - 0.5) * radius * 1.7,
      r: radius * (0.05 + next() * 0.12),
    }));
  }, [seed, radius]);
  const clouds = React.useMemo(() => {
    const next = createRandom(seed + 3313);
    return Array.from({length: 7}, () => ({
      x: (next() - 0.5) * radius * 1.5,
      y: (next() - 0.5) * radius * 1.1,
      r: radius * (0.18 + next() * 0.3),
      opacity: 0.1 + next() * 0.22,
    }));
  }, [seed, radius]);
  const arcs = React.useMemo(() => {
    const next = createRandom(seed + 5107);
    return Array.from({length: 5}, () => ({
      rx: radius * (0.45 + next() * 0.5),
      ry: radius * (0.1 + next() * 0.16),
      angle: next() * 180,
      opacity: 0.2 + next() * 0.35,
    }));
  }, [seed, radius]);
  const ringRx = radius * 1.7;
  const ringRy = radius * 0.32;
  const moonAngle = progress * Math.PI * 2 * 0.5;
  const spin = progress * 8;

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="objectSurface" cx="36%" cy="32%" r="80%">
            <stop offset="0%" stopColor={colors[0]} stopOpacity={1} />
            <stop offset="58%" stopColor={colors[1] ?? colors[0]} stopOpacity={1} />
            <stop offset="80%" stopColor={colors[2] ?? colors[1] ?? colors[0]} stopOpacity={1} />
            <stop offset="100%" stopColor={colors[3] ?? colors[2] ?? colors[0]} stopOpacity={1} />
          </radialGradient>
          <linearGradient id="objectLimb" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[2] ?? colors[0]} stopOpacity={0} />
            <stop offset="58%" stopColor={colors[2] ?? colors[0]} stopOpacity={0.12} />
            <stop offset="100%" stopColor={colors[2] ?? colors[0]} stopOpacity={0.82} />
          </linearGradient>
          <linearGradient id="objectRim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={rimColor} stopOpacity={0} />
            <stop offset="16%" stopColor={rimColor} stopOpacity={0.3} />
            <stop offset="28%" stopColor={rimColor} stopOpacity={1} />
            <stop offset="40%" stopColor={rimColor} stopOpacity={0.12} />
            <stop offset="58%" stopColor={rimColor} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="objectSweep" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={rimColor} stopOpacity={0} />
            <stop offset="50%" stopColor={rimColor} stopOpacity={0.16} />
            <stop offset="100%" stopColor={rimColor} stopOpacity={0} />
          </linearGradient>
          <radialGradient id="starCore">
            <stop offset="0%" stopColor={white} stopOpacity={1} />
            <stop offset="34%" stopColor={rimColor} stopOpacity={0.95} />
            <stop offset="100%" stopColor={rimColor} stopOpacity={0} />
          </radialGradient>
          <clipPath id="objectClip">
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
              stroke={rimColor}
              strokeOpacity={0.34}
              strokeWidth={width * 0.006}
            />
          </g>
        ) : null}

        {variant === 'star' ? (
          <circle cx={cx} cy={cy} r={radius * 0.92} fill="url(#starCore)" opacity={0.32} />
        ) : (
          <circle cx={cx} cy={cy} r={radius} fill="url(#objectSurface)" />
        )}

        <g clipPath="url(#objectClip)">
          {variant === 'banded' || variant === 'ringed'
            ? bands.map((band, index) => (
                <ellipse
                  key={index}
                  cx={cx}
                  cy={cy - radius + band.y * radius * 2}
                  rx={radius * 1.05}
                  ry={band.thickness * radius}
                  fill={colors[index % colors.length]}
                  opacity={band.opacity}
                  transform={`rotate(${spin} ${cx} ${cy})`}
                />
              ))
            : null}

          {variant === 'cloudy'
            ? clouds.map((cloud, index) => (
                <ellipse
                  key={index}
                  cx={cx + cloud.x}
                  cy={cy + cloud.y}
                  rx={cloud.r}
                  ry={cloud.r * 0.6}
                  fill={colors[index % colors.length]}
                  opacity={cloud.opacity}
                  transform={`rotate(${spin} ${cx} ${cy})`}
                />
              ))
            : null}

          {variant === 'cratered'
            ? craters.map((crater, index) => (
                <g key={index} transform={`rotate(${spin} ${cx} ${cy})`}>
                  <circle
                    cx={cx + crater.x}
                    cy={cy + crater.y}
                    r={crater.r}
                    fill={colors[2] ?? colors[0]}
                    opacity={0.45}
                  />
                  <circle
                    cx={cx + crater.x}
                    cy={cy + crater.y}
                    r={crater.r}
                    fill="none"
                    stroke={rimColor}
                    strokeOpacity={0.22}
                    strokeWidth={width * 0.002}
                  />
                </g>
              ))
            : null}

          {variant === 'star'
            ? arcs.map((arc, index) => (
                <ellipse
                  key={index}
                  cx={cx}
                  cy={cy}
                  rx={arc.rx}
                  ry={arc.ry}
                  fill="none"
                  stroke={rimColor}
                  strokeOpacity={arc.opacity}
                  strokeWidth={width * 0.0035}
                  transform={`rotate(${arc.angle + spin * 4} ${cx} ${cy})`}
                />
              ))
            : null}

          <rect
            x={cx - radius * 1.2}
            y={cy - radius * 1.2}
            width={radius * 2.4}
            height={radius * 2.4}
            fill="url(#objectSweep)"
            transform={`translate(${lightSweep * radius * 1.6} 0) rotate(-24 ${cx} ${cy})`}
          />
        </g>

        {variant === 'star' ? (
          <circle cx={cx} cy={cy} r={radius * 0.24} fill={white} opacity={0.9} />
        ) : (
          <>
            <circle cx={cx} cy={cy} r={radius} fill="url(#objectLimb)" />
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#objectRim)"
              strokeWidth={width * 0.013}
            />
          </>
        )}

        {showRing ? (
          <g transform={`rotate(-18 ${cx} ${cy})`}>
            <path
              d={`M ${cx + ringRx} ${cy} A ${ringRx} ${ringRy} 0 0 0 ${cx - ringRx} ${cy}`}
              fill="none"
              stroke={rimColor}
              strokeOpacity={0.5}
              strokeWidth={width * 0.006}
            />
          </g>
        ) : null}

        <g transform={`rotate(-18 ${cx} ${cy})`}>
          <circle
            cx={cx + Math.cos(moonAngle) * radius * 1.22}
            cy={cy + Math.sin(moonAngle) * radius * 0.42}
            r={width * 0.013}
            fill={rimColor}
            opacity={0.85}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
