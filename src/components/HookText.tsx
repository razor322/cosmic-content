import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fitHookFontSize, HOOK_TRACKING} from '../lib/textFit.ts';
import {safeZone} from '../lib/safeZone.ts';
import {HEADING_FONT} from '../theme/fonts.ts';
import type {Palette} from '../theme/palette.ts';

export type HookTextProps = {
  lines: string[];
  highlight?: string;
  palette: Palette;
};

/**
 * The hook of an episode. It is readable on the very first frame, it only
 * settles from a small scale over eight frames, and the highlighted word is
 * the single coral element of the frame.
 */
export const HookText: React.FC<HookTextProps> = ({lines, highlight, palette}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const zone = safeZone(width, height);
  const maxWidth = width - zone.left - zone.right;
  const size = fitHookFontSize(lines, maxWidth);
  const scale = interpolate(frame, [0, 8], [1.04, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: zone.left,
        right: zone.right,
        top: height * 0.3,
        transform: `scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {lines.map((line, index) => {
        const at = highlight ? line.indexOf(highlight) : -1;
        return (
          <div
            key={index}
            style={{
              fontFamily: HEADING_FONT,
              fontSize: size,
              lineHeight: 1.06,
              letterSpacing: `${HOOK_TRACKING}em`,
              textAlign: 'center',
              color: palette['star.white'],
              textTransform: 'uppercase',
              textShadow: `0 0 ${size * 0.32}px ${palette['space.base']}`,
            }}
          >
            {at === -1 ? (
              line
            ) : (
              <>
                {line.slice(0, at)}
                <span style={{color: palette['solar.coral']}}>{highlight}</span>
                {line.slice(at + (highlight?.length ?? 0))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};
