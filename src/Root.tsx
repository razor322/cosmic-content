import React from 'react';
import {AbsoluteFill, Composition} from 'remotion';
import {cosmicTheme} from './data/theme.ts';
import type {CosmicIntroProps} from './types.ts';

const CosmicIntro: React.FC<CosmicIntroProps> = () => {
  return <AbsoluteFill style={{backgroundColor: cosmicTheme.cosmicIndigo}} />;
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CosmicIntro"
      component={CosmicIntro}
      durationInFrames={900}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{
        title: 'BEYOND\nTHE\nSKY',
        narration: undefined,
        palette: cosmicTheme,
        seed: 20261022,
        showSubtitle: true,
        showSafeZoneGuide: false,
        voice: 'en-US-AndrewNeural',
        voiceVolume: 1,
        ambientVolume: 0.18,
        showRing: true,
      }}
    />
  );
};
