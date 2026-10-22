import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors, useVideoConfig} from 'remotion';
import {nebulaBlobs} from '../lib/seeded.ts';
import {coreRamp, rampInputRange, type Lead, type Palette} from '../theme/palette.ts';

export type NebulaProps = {
  seed: number;
  progress: number;
  palette: Palette;
  lead: Lead;
  centerRatio?: number;
};

/**
 * The core scene cloud. It opens out of a single point and settles into a
 * drifting field, coloured with the ramp of the episode lead colour.
 */
export const Nebula: React.FC<NebulaProps> = ({
  seed,
  progress,
  palette,
  lead,
  centerRatio = 0.46,
}) => {
  const {width, height} = useVideoConfig();
  const blobs = React.useMemo(() => nebulaBlobs(seed, 6), [seed]);
  const ramp = React.useMemo(() => coreRamp(lead, palette), [lead, palette]);
  const bloom = interpolate(progress, [0, 0.42], [0.05, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cx = width / 2;
  const cy = height * centerRatio;
  const coreColour = interpolateColors(progress, rampInputRange(ramp.length), ramp);

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          {blobs.map((blob, index) => (
            <radialGradient key={index} id={`cloud-${index}`}>
              <stop offset="0%" stopColor={coreColour} stopOpacity={blob.opacity * 0.9} />
              <stop offset="52%" stopColor={coreColour} stopOpacity={blob.opacity * 0.3} />
              <stop offset="100%" stopColor={coreColour} stopOpacity={0} />
            </radialGradient>
          ))}
          <radialGradient id="seedCore">
            <stop offset="0%" stopColor={palette['star.white']} stopOpacity={0.9} />
            <stop offset="45%" stopColor={coreColour} stopOpacity={0.45} />
            <stop offset="100%" stopColor={coreColour} stopOpacity={0} />
          </radialGradient>
        </defs>

        {blobs.map((blob, index) => {
          const distance = Math.hypot(blob.x * width - cx, blob.y * height - cy);
          const spread = 0.25 + 0.75 * bloom;
          const radius = blob.radius * width * 0.42 * spread;
          return (
            <ellipse
              key={index}
              cx={cx + (blob.x * width - cx) * spread}
              cy={cy + (blob.y * height - cy) * spread}
              rx={radius}
              ry={radius * 0.72}
              fill={`url(#cloud-${index})`}
              opacity={Math.min(1, distance / (width * 0.5))}
            />
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r={width * 0.34 * bloom}
          fill="url(#seedCore)"
          opacity={0.55 * (1 - bloom) + 0.12}
        />
      </svg>
    </AbsoluteFill>
  );
};
