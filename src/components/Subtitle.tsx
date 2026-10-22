import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {withAlpha} from '../theme/palette.ts';
import {
  subtitleBottomClearance,
  subtitleFontSize,
  subtitleMaxWidth,
} from '../lib/safeZone.ts';
import {subtitleStateAt, type SubtitleSlot} from '../lib/subtitle.ts';
import {BODY_FONT} from '../theme/fonts.ts';

export type SubtitleProps = {
  slots: SubtitleSlot[];
  palette: {
    'star.white': string;
    'space.base': string;
  };
};

/**
 * The spoken line of a scene. It stays inside the safe zone and keeps a
 * readable contrast over a bright cloud.
 */
export const Subtitle: React.FC<SubtitleProps> = ({slots, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const state = subtitleStateAt(frame, slots);
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
            inset: '-80px -100px',
            background: `linear-gradient(to top, ${withAlpha(palette['space.base'], 0.6)}, transparent)`,
          }}
        />
        <div
          style={{
            position: 'relative',
            fontFamily: BODY_FONT,
            fontSize: subtitleFontSize(width),
            fontWeight: 300,
            lineHeight: 1.25,
            textAlign: 'center',
            color: palette['star.white'],
            textShadow: `0 2px 26px ${withAlpha(palette['space.base'], 0.95)}`,
          }}
        >
          {state.text}
        </div>
      </div>
    </div>
  );
};
