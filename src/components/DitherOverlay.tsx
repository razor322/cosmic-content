import React from 'react';
import {AbsoluteFill} from 'remotion';

export type DitherOverlayProps = {
  opacity?: number;
};

const BAYER_4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const buildDitherSvg = (): string => {
  const cells = BAYER_4.map((row, y) =>
    row
      .map((value, x) => {
        const alpha = (value / 16) * 0.9;
        return `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(255,255,255)" fill-opacity="${alpha.toFixed(3)}"/>`;
      })
      .join(''),
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4" shape-rendering="crispEdges">${cells}</svg>`;
};

const DITHER_URI = `data:image/svg+xml;utf8,${encodeURIComponent(buildDitherSvg())}`;

/**
 * A static ordered dither. It breaks up the banding that wide gradients show
 * on phone screens without adding visible texture.
 */
export const DitherOverlay: React.FC<DitherOverlayProps> = ({opacity = 0.025}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `url("${DITHER_URI}")`,
      backgroundRepeat: 'repeat',
      backgroundSize: '4px 4px',
      opacity,
      mixBlendMode: 'soft-light',
      pointerEvents: 'none',
    }}
  />
);
