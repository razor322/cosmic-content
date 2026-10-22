import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export type FilmGrainProps = {
  opacity?: number;
};

const TILE = 256;

const buildGrainUri = (seed: number): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE}" height="${TILE}"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}" stitchTiles="stitch"/></filter><rect width="${TILE}" height="${TILE}" filter="url(#grain)"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const FilmGrain: React.FC<FilmGrainProps> = ({opacity = 0.035}) => {
  const frame = useCurrentFrame();
  const uri = buildGrainUri(frame);
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url("${uri}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${TILE}px ${TILE}px`,
        opacity,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
  );
};
