import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {withAlpha} from '../theme/palette.ts';
import {safeZone, subtitleBottomClearance} from '../lib/safeZone.ts';

export type SafeZoneGuideProps = {
  accent: string;
  text: string;
};

export const SafeZoneGuide: React.FC<SafeZoneGuideProps> = ({accent, text}) => {
  const {width, height} = useVideoConfig();
  const zone = safeZone(width, height);
  const clearance = subtitleBottomClearance(height);
  const stroke = `1px dashed ${withAlpha(accent, 0.55)}`;
  const label = {
    fontSize: Math.max(16, width * 0.022),
    color: withAlpha(accent, 0.8),
    fontFamily: 'sans-serif',
  };

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: zone.left,
          top: zone.top,
          width: width - zone.left - zone.right,
          height: height - zone.top - zone.bottom,
          border: stroke,
        }}
      >
        <span style={{position: 'absolute', top: -label.fontSize * 1.6, left: 0, ...label}}>
          SAFE ZONE
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: clearance,
          borderTop: stroke,
        }}
      >
        <span style={{position: 'absolute', bottom: label.fontSize, left: 0, ...label}}>
          SUBTITLE CLEARANCE
        </span>
      </div>
    </AbsoluteFill>
  );
};
