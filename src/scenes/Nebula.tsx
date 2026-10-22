import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Nebula} from '../components/Nebula.tsx';
import {Particles} from '../components/Particles.tsx';
import {ShootingStar} from '../components/ShootingStar.tsx';
import {Stars} from '../components/Stars.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {withAlpha} from '../data/theme.ts';
import type {SceneProps} from '../types.ts';

export const NebulaScene: React.FC<SceneProps> = ({palette, seed, progress}) => (
  <AbsoluteFill style={{backgroundColor: palette.deepViolet}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 92% 62% at 50% 40%, ${withAlpha(palette.nebulaPurple, 0.85)}, ${withAlpha(palette.cosmicIndigo, 0.9)} 58%, ${withAlpha(palette.deepViolet, 1)} 96%)`,
      }}
    />
    <Nebula seed={seed + 11} progress={progress} palette={palette} />
    <Stars seed={seed + 12} count={52} layer={0} color={palette.starlight} opacity={0.45} parallax={0.5} />
    <Stars seed={seed + 13} count={34} layer={1} color={palette.starlight} opacity={0.65} parallax={0.9} />
    <Stars seed={seed + 14} count={16} layer={2} color={palette.lavender} opacity={0.8} parallax={1.4} />
    <Particles seed={seed + 31} count={26} color={palette.lavender} drift={0.35} />
    <ShootingStar startFrame={129} color={palette.starlight} length={260} />
    <Vignette color={palette.deepViolet} strength={0.55} openRatio={58} />
  </AbsoluteFill>
);
