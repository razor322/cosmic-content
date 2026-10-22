import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {starLayerPoints} from '../lib/seeded.ts';

export type StarsProps = {
  seed: number;
  count: number;
  layer: 0 | 1 | 2;
  color: string;
  opacity: number;
  driftX: number;
  driftY?: number;
  twinkleSpeed?: number;
  sizeScale?: number;
};

export const Stars: React.FC<StarsProps> = ({
  seed,
  count,
  layer,
  color,
  opacity,
  driftX,
  driftY = 0,
  twinkleSpeed = 0.035,
  sizeScale = 1,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const points = React.useMemo(() => starLayerPoints(seed, layer, count), [seed, layer, count]);
  const scale = (width / 1080) * sizeScale;

  return (
    <AbsoluteFill style={{opacity}}>
      {points.map((star, index) => {
        const twinkle = 0.8 + 0.2 * Math.sin(frame * twinkleSpeed + star.phase);
        const x = ((star.x * width + driftX) % (width + 60)) - 30;
        const y = ((star.y * height + driftY) % (height + 60)) - 30;
        const diameter = star.size * scale;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: diameter,
              height: diameter,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: star.alpha * twinkle,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
