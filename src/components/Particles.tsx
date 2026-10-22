import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {createRandom} from '../lib/seeded.ts';

export type ParticlesProps = {
  seed: number;
  count: number;
  color: string;
  drift: number;
};

export const Particles: React.FC<ParticlesProps> = ({seed, count, color, drift}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const scale = width / 1080;
  const motes = React.useMemo(() => {
    const next = createRandom(seed + 999);
    return Array.from({length: count}, () => ({
      x: next(),
      y: next(),
      size: 1.2 + next() * 2.8,
      speed: drift * (0.4 + next() * 0.6),
      alpha: 0.12 + next() * 0.34,
    }));
  }, [seed, count, drift]);

  return (
    <AbsoluteFill>
      {motes.map((mote, index) => {
        const travelled = mote.y * height - frame * mote.speed;
        const y = ((travelled % height) + height) % height;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: mote.x * width,
              top: y,
              width: mote.size * scale,
              height: mote.size * scale,
              borderRadius: '50%',
              backgroundColor: color,
              opacity: mote.alpha,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
