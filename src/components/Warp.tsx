import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useVideoConfig} from 'remotion';
import {warpStreaks} from '../lib/seeded.ts';
import {rampInputRange} from '../theme/palette.ts';

export type WarpProps = {
  seed: number;
  progress: number;
  white: string;
  magenta: string;
  coral: string;
  indigo: string;
  base: string;
  roll: number;
  zoom: number;
  centerRatio?: number;
};

/**
 * The second extra scene: the star field stretches into radial streaks. Two
 * offset copies of the streak layer, masked to the frame edges, carry a light
 * colour split that stays inside the palette.
 */
export const Warp: React.FC<WarpProps> = ({
  seed,
  progress,
  white,
  magenta,
  coral,
  indigo,
  base,
  roll,
  zoom,
  centerRatio = 0.46,
}) => {
  const {width, height} = useVideoConfig();
  const streaks = React.useMemo(() => warpStreaks(seed, 90), [seed]);
  const cx = width / 2;
  const cy = height * centerRatio;
  const maxRadius = Math.hypot(width, height) * 0.62;
  const speed = interpolate(progress, [0, 0.3, 0.62, 1], [0.1, 1, 0.72, 0.14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // The centre warms up as the speed peaks, so the scene arc runs indigo to magenta to coral.
  const depthColour = interpolateColors(
    progress,
    rampInputRange(3),
    [indigo, magenta, coral],
  );

  const toneColour = (tone: 'starlight' | 'magenta' | 'coral'): string => {
    if (tone === 'magenta' || tone === 'coral') {
      return magenta;
    }
    return white;
  };

  const renderStreaks = (offsetX: number, colourOverride?: string, opacityScale = 1) =>
    streaks.map((streak, index) => {
      const inner = streak.inner * maxRadius;
      const outer =
        streak.inner * maxRadius + streak.outer * maxRadius * (0.28 + 0.72 * speed);
      const x1 = cx + Math.cos(streak.angle) * inner;
      const y1 = cy + Math.sin(streak.angle) * inner;
      const x2 = cx + Math.cos(streak.angle) * outer;
      const y2 = cy + Math.sin(streak.angle) * outer;
      return (
        <line
          key={index}
          x1={x1 + offsetX}
          y1={y1}
          x2={x2 + offsetX}
          y2={y2}
          stroke={colourOverride ?? toneColour(streak.tone)}
          strokeWidth={streak.width * (0.6 + 0.9 * speed)}
          strokeLinecap="round"
          opacity={streak.alpha * speed * opacityScale}
        />
      );
    });

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="warpDepth" cx="50%" cy="50%" r="30%">
            <stop offset="0%" stopColor={depthColour} stopOpacity={0.8} />
            <stop offset="55%" stopColor={depthColour} stopOpacity={0.35} />
            <stop offset="100%" stopColor={depthColour} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="warpEdge" cx="50%" cy="46%" r="52%">
            <stop offset="52%" stopColor={base} stopOpacity={0} />
            <stop offset="100%" stopColor={white} stopOpacity={1} />
          </radialGradient>
          <mask id="warpEdgeMask">
            <rect x="0" y="0" width={width} height={height} fill="url(#warpEdge)" />
          </mask>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="url(#warpDepth)" />

        <g
          transform={`rotate(${roll} ${cx} ${cy}) translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}
        >
          {renderStreaks(0)}
        </g>

        <g mask="url(#warpEdgeMask)">
          <g
            transform={`rotate(${roll} ${cx} ${cy}) translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}
          >
            {renderStreaks(3, magenta, 0.55)}
          </g>
          <g
            transform={`rotate(${roll} ${cx} ${cy}) translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}
          >
            {renderStreaks(-3, indigo, 0.7)}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
