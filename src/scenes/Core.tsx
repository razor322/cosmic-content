import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ContextTag} from '../components/ContextTag.tsx';
import {KeyPointChip} from '../components/KeyPointChip.tsx';
import {Nebula} from '../components/Nebula.tsx';
import {SpaceWash} from '../components/SpaceWash.tsx';
import {Vignette} from '../components/Vignette.tsx';
import {createRandom} from '../lib/seeded.ts';
import {mix, type Palette} from '../theme/palette.ts';

export type CoreSceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  lead: 'indigo' | 'purple' | 'magenta';
  context: string;
  keyPoint?: string;
};

export const CoreScene: React.FC<CoreSceneProps> = ({
  palette,
  seed,
  progress,
  lead,
  context,
  keyPoint,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.46;

  const flow = React.useMemo(() => {
    const next = createRandom(seed + 4441);
    return Array.from({length: 44}, () => ({
      angle: next() * Math.PI * 2,
      radius: 0.45 + next() * 0.85,
      swirl: 0.2 + next() * 0.5,
      size: 1.6 + next() * 3.4,
      alpha: 0.18 + next() * 0.45,
    }));
  }, [seed]);

  const leadColour = {
    indigo: palette['cosmic.indigo'],
    purple: palette['nebula.purple'],
    magenta: palette['stellar.magenta'],
  }[lead];
  const particleColour = mix(palette['star.white'], leadColour, 0.15);

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <SpaceWash colour={palette['cosmic.indigo']} strength={0.5} centerRatio={0.46} radiusX={36} radiusY={21} />
      <Nebula
        seed={seed + 11}
        progress={progress}
        palette={palette}
        lead={lead}
      />

      {flow.map((particle, index) => {
        const radius = particle.radius * width * (1 - 0.88 * progress);
        const angle = particle.angle + progress * particle.swirl * Math.PI * 2;
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: cx + Math.cos(angle) * radius - particle.size / 2,
              top: cy + Math.sin(angle) * radius * 0.78 - particle.size / 2,
              width: particle.size,
              height: particle.size,
              borderRadius: '50%',
              backgroundColor: particleColour,
              opacity: particle.alpha,
            }}
          />
        );
      })}

      <ContextTag
        text={context}
        holdFrames={60}
        textColour={palette['star.white']}
        base={palette['space.base']}
      />

      {keyPoint ? (
        <KeyPointChip
          text={keyPoint}
          appearFrame={30}
          textColour={palette['star.white']}
          base={palette['space.base']}
        />
      ) : null}

      <Vignette color={palette['space.base']} strength={0.6} openRatio={60} />
    </AbsoluteFill>
  );
};
