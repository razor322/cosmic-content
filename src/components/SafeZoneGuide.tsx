import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {withAlpha} from '../data/theme.ts';
import {safeZone, subtitleBottomClearance} from '../lib/safeZone.ts';
import type {Palette} from '../types.ts';

export type SafeZoneGuideProps = {
  palette: Palette;
};

export const SafeZoneGuide: React.FC<SafeZoneGuideProps> = ({palette}) => {
  const {width, height} = useVideoConfig();
  const zone = safeZone(width, height);
  const clearance = subtitleBottomClearance(height);
  const stroke = `1px dashed ${withAlpha(palette.solarCoral, 0.6)}`;
  const label = {
    fontSize: 22,
    color: withAlpha(palette.solarCoral, 0.85),
    fontFamily: '"Segoe UI", Arial, sans-serif',
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
        <span style={{position: 'absolute', top: -30, left: 0, ...label}}>SAFE ZONE</span>
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
        <span style={{position: 'absolute', bottom: 8, left: 0, ...label}}>
          SUBTITLE CLEARANCE
        </span>
      </div>
    </AbsoluteFill>
  );
};
