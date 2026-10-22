import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {starLayerPoints} from '../lib/seeded.ts';

export type StarsProps = {
  seed: number;
  count: number;
  layer: 0 | 1 | 2;
  color: string;
  opacity: number;
  parallax: number;
};

const LAYER_SPEED = [0.35, 0.7, 1.1];

export const Stars: React.FC<StarsProps> = ({seed, count, layer, color, opacity, parallax}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const points = React.useMemo(() => starLayerPoints(seed, layer, count), [seed, layer, count]);
  const speed = (LAYER_SPEED[layer] ?? 0.7) * parallax;
  const drift = frame * speed;
  const scale = width / 1080;

  return (
    <AbsoluteFill style={{opacity}}>
      {points.map((star, index) => {
        const twinkle = 0.78 + 0.22 * Math.sin(frame * 0.035 + star.phase);
        const x = ((star.x * width + drift) % (width + 40)) - 20;
        const y = (star.y * height + drift * 0.25) % height;
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
