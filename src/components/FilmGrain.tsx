import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type FilmGrainProps = {
  opacity: number;
  seed: number;
};

const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="1" stitchTiles="stitch"/></filter><rect width="260" height="260" filter="url(#grain)"/></svg>`;

const GRAIN_URI = `data:image/svg+xml;utf8,${encodeURIComponent(GRAIN_SVG)}`;

export const FilmGrain: React.FC<FilmGrainProps> = ({opacity, seed}) => {
  const frame = useCurrentFrame();
  const shiftX = ((frame * 7 + seed) % 11) - 5;
  const shiftY = ((frame * 5 + seed) % 9) - 4;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${GRAIN_URI}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '260px 260px',
        opacity,
        mixBlendMode: 'soft-light',
        transform: `translate(${shiftX}px, ${shiftY}px) scale(1.04)`,
        pointerEvents: 'none',
      }}
    />
  );
};
