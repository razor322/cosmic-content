import React from 'react';
import {useVideoConfig} from 'remotion';
import {HEADING_FONT} from '../theme/fonts.ts';
import type {Palette} from '../theme/palette.ts';

export type TitleProps = {
  progress: number;
  fadeOut: number;
  palette: Palette;
  lines?: string[];
};

const DEFAULT_LINES = ['BEYOND', 'THE', 'SKY'];

/**
 * The closing title. Each line opens from the middle outwards, and the letter
 * spacing widens while it does.
 */
export const Title: React.FC<TitleProps> = ({progress, fadeOut, palette, lines}) => {
  const {width, height} = useVideoConfig();
  const text = lines ?? DEFAULT_LINES;
  const size = width * 0.115;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: height * 0.33,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.12,
        opacity: 1 - fadeOut,
      }}
    >
      {text.map((line, index) => {
        const start = index * 0.12;
        const t = Math.min(1, Math.max(0, (progress - start) / 0.52));
        const inset = (1 - t) * 50;
        const spacing = 0.08 + 0.22 * t;
        return (
          <div key={index} style={{width: '100%', overflow: 'hidden', textAlign: 'center'}}>
            <div
              style={{
                clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
                opacity: Math.min(1, t * 1.8),
                fontFamily: HEADING_FONT,
                fontSize: size,
                fontWeight: 400,
                letterSpacing: `${spacing.toFixed(3)}em`,
                color: palette['star.white'],
                lineHeight: 1.12,
                textTransform: 'uppercase',
                textShadow: `0 0 ${size * 0.3}px ${palette['space.base']}`,
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
    </div>
  );
};
