import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {KeyPointChip} from '../components/KeyPointChip.tsx';
import {SpaceWash} from '../components/SpaceWash.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {Warp} from '../components/Warp.tsx';
import type {Palette} from '../theme/palette.ts';

export type Extra2SceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  keyPoint?: string;
};

export const Extra2Scene: React.FC<Extra2SceneProps> = ({
  palette,
  seed,
  progress,
  keyPoint,
}) => {
  const zoom = interpolate(progress, [0, 1], [1, 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const roll = interpolate(progress, [0, 0.5, 1], [-1.6, 0.5, -1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <SpaceWash colour={palette['cosmic.indigo']} strength={0.55} centerRatio={0.46} radiusX={34} radiusY={21} />
      <Warp
        seed={seed + 17}
        progress={progress}
        white={palette['star.white']}
        magenta={palette['stellar.magenta']}
        coral={palette['solar.coral']}
        indigo={palette['cosmic.indigo']}
        base={palette['space.base']}
        roll={roll}
        zoom={zoom}
      />

      {keyPoint ? (
        <KeyPointChip
          text={keyPoint}
          appearFrame={30}
          textColour={palette['star.white']}
          base={palette['space.base']}
        />
      ) : null}

      <Vignette color={palette['space.base']} strength={0.5} openRatio={62} />
    </AbsoluteFill>
  );
};
