import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme.ts';
import {titleFontSize} from '../lib/safeZone.ts';
import type {Palette} from '../types.ts';

export type TitleProps = {
  title: string;
  fadeOut: number;
  palette: Palette;
};

const DISPLAY_FONT = '"Segoe UI Light", "Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const Title: React.FC<TitleProps> = ({title, fadeOut, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const lines = title.split('\n');
  const size = titleFontSize(width);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: height * 0.34,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: size * 0.14,
        opacity: 1 - fadeOut,
      }}
    >
      {lines.map((line, index) => {
        const start = 20 + index * 10;
        const t = Math.min(1, Math.max(0, (frame - start) / 44));
        const inset = (1 - t) * 50;
        const spacing = (0.42 - 0.24 * t).toFixed(3);
        return (
          <div key={index} style={{width: '100%', overflow: 'hidden', textAlign: 'center'}}>
            <div
              style={{
                clipPath: `inset(0 ${inset}% 0 ${inset}%)`,
                opacity: Math.min(1, t * 1.6),
                fontSize: size,
                fontWeight: 200,
                letterSpacing: `${spacing}em`,
                color: palette.starlight,
                fontFamily: DISPLAY_FONT,
                textShadow: `0 0 40px ${withAlpha(palette.lavender, 0.35)}`,
                lineHeight: 1.15,
                textTransform: 'uppercase',
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
