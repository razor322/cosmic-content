import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {withAlpha} from '../theme/palette.ts';
import {BODY_FONT} from '../theme/fonts.ts';

export type ContextTagProps = {
  text: string;
  holdFrames: number;
  textColour: string;
  base: string;
};

/**
 * The field the episode lives in. It sits at the top of the safe area and
 * leaves after two seconds.
 */
export const ContextTag: React.FC<ContextTagProps> = ({
  text,
  holdFrames,
  textColour,
  base,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, 10, holdFrames - 12, holdFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '13%',
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: BODY_FONT,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '0.22em',
          color: withAlpha(textColour, 0.82),
          textTransform: 'uppercase',
          textShadow: `0 2px 20px ${withAlpha(base, 0.95)}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
