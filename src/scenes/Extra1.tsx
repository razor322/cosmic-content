import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {KeyPointChip} from '../components/KeyPointChip.tsx';
import {Planet} from '../components/Planet.tsx';
import {Stars} from '../components/Stars.tsx';
import {SpaceWash} from '../components/SpaceWash.tsx';
import {Vignette} from '../components/Vignette.tsx';
import type {PlanetVariant} from '../data/episodes.ts';
import {mix, shade, type Palette} from '../theme/palette.ts';

export type Extra1SceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  variant: PlanetVariant;
  keyPoint?: string;
};

export const Extra1Scene: React.FC<Extra1SceneProps> = ({
  palette,
  seed,
  progress,
  variant,
  keyPoint,
}) => {
  const {width, height} = useVideoConfig();
  const starColour = mix(palette['star.white'], palette['nebula.purple'], 0.15);

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <SpaceWash colour={palette['cosmic.indigo']} strength={0.45} centerRatio={0.46} radiusX={32} radiusY={19} />
      <Stars
        seed={seed + 21}
        count={44}
        layer={0}
        color={starColour}
        opacity={0.4}
        driftX={progress * 18}
        sizeScale={1}
      />
      <Stars
        seed={seed + 22}
        count={26}
        layer={1}
        color={starColour}
        opacity={0.6}
        driftX={progress * 34}
        sizeScale={1.15}
      />

      <Planet
        seed={seed + 7}
        progress={progress}
        variant={variant}
        colors={[
          palette['nebula.purple'],
          palette['nebula.purple'],
          palette['stellar.magenta'],
          shade(palette['nebula.purple'], 0.62, palette),
        ]}
        rimColor={palette['star.white']}
        white={palette['star.white']}
        showRing={variant === 'ringed'}
        lightSweep={progress * 1.2}
      />

      {keyPoint ? (
        <KeyPointChip
          text={keyPoint}
          appearFrame={30}
          textColour={palette['star.white']}
          base={palette['space.base']}
        />
      ) : null}

      <Vignette color={palette['space.base']} strength={0.58} openRatio={58} />
    </AbsoluteFill>
  );
};
