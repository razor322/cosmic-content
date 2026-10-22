import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {HookText} from '../components/HookText.tsx';
import {Stars} from '../components/Stars.tsx';
import {SpaceWash} from '../components/SpaceWash.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {hookDrift} from '../lib/loopMotion.ts';
import {STAR_LAYERS} from '../lib/starLayers.ts';
import {mix, type Palette} from '../theme/palette.ts';

export type SceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  lines: string[];
  highlight?: string;
};

export const HookScene: React.FC<SceneProps> = ({palette, seed, lines, highlight}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const drift = hookDrift(frame, fps, width);
  const starColour = mix(palette['star.white'], palette['stellar.magenta'], 0.15);

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <SpaceWash colour={palette['cosmic.indigo']} strength={0.62} centerRatio={0.6} radiusX={49} radiusY={29} />
      {STAR_LAYERS.map((layer) => (
        <Stars
          key={layer.layer}
          seed={seed + layer.seedOffset}
          count={layer.count}
          layer={layer.layer}
          color={starColour}
          opacity={layer.opacity}
          driftX={drift}
          sizeScale={layer.sizeScale}
        />
      ))}
      <HookText lines={lines} highlight={highlight} palette={palette} />
      <Vignette color={palette['space.base']} strength={0.7} openRatio={62} />
    </AbsoluteFill>
  );
};
