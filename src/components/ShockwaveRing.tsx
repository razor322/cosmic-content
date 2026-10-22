import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {withAlpha} from '../theme/palette.ts';

export type ShockwaveRingProps = {
  radius: number;
  opacity: number;
  color: string;
  strokeWidth?: number;
  centerRatio?: number;
};

/** A thin ring that expands out of the focal point. */
export const ShockwaveRing: React.FC<ShockwaveRingProps> = ({
  radius,
  opacity,
  color,
  strokeWidth,
  centerRatio = 0.46,
}) => {
  const {width, height} = useVideoConfig();
  const line = strokeWidth ?? Math.max(1.5, width * 0.0022);
  const cx = width / 2;
  const cy = height * centerRatio;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={withAlpha(color, 0.25)}
          strokeWidth={line * 4}
          opacity={opacity * 0.5}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={line}
          opacity={opacity}
        />
      </svg>
    </AbsoluteFill>
  );
};
