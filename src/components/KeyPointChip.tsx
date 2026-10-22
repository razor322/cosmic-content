import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {withAlpha} from '../theme/palette.ts';
import {BODY_FONT} from '../theme/fonts.ts';

export type KeyPointChipProps = {
  text: string;
  appearFrame: number;
  textColour: string;
  base: string;
};

/** The one number a viewer should remember from a scene. */
export const KeyPointChip: React.FC<KeyPointChipProps> = ({
  text,
  appearFrame,
  textColour,
  base,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [appearFrame, appearFrame + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const offset = interpolate(frame, [appearFrame, appearFrame + 12], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: '22%',
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${offset}px)`,
      }}
    >
      <div
        style={{
          fontFamily: BODY_FONT,
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: '0.16em',
          color: textColour,
          textTransform: 'uppercase',
          padding: '12px 22px',
          border: `1px solid ${withAlpha(textColour, 0.28)}`,
          borderRadius: 6,
          background: `linear-gradient(to bottom, ${withAlpha(base, 0.62)}, ${withAlpha(base, 0.38)})`,
          textShadow: `0 2px 18px ${withAlpha(base, 0.9)}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
