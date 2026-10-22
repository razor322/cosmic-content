import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme.ts';
import {
  subtitleBottomClearance,
  subtitleFontSize,
  subtitleMaxWidth,
} from '../lib/safeZone.ts';
import {subtitleStateAt} from '../lib/subtitle.ts';
import type {NarrationEntry, Palette} from '../types.ts';

export type SubtitleProps = {
  entries: NarrationEntry[];
  palette: Palette;
};

const BODY_FONT = '"Segoe UI", "Helvetica Neue", Arial, sans-serif';

export const Subtitle: React.FC<SubtitleProps> = ({entries, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const state = subtitleStateAt(frame, entries);
  if (!state || state.opacity <= 0) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: subtitleBottomClearance(height),
        display: 'flex',
        justifyContent: 'center',
        padding: '0 40px',
      }}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: subtitleMaxWidth(width),
          opacity: state.opacity,
          transform: `translateY(${state.offsetY}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-70px -90px',
            background: `linear-gradient(to top, ${withAlpha(palette.deepViolet, 0.55)}, transparent)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            fontSize: subtitleFontSize(width),
            lineHeight: 1.25,
            fontWeight: 300,
            textAlign: 'center',
            color: palette.starlight,
            fontFamily: BODY_FONT,
            textShadow: `0 2px 24px ${withAlpha(palette.deepViolet, 0.9)}`,
          }}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
};
