import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AudioTrack} from './components/AudioTrack.tsx';
import {FilmGrain} from './components/FilmGrain.tsx';
import {SafeZoneGuide} from './components/SafeZoneGuide.tsx';
import {Subtitle} from './components/Subtitle.tsx';
import {narration} from './data/narration.ts';
import {cosmicTheme} from './data/theme.ts';
import {buildSceneSpans, CROSSFADE_FRAMES, TOTAL_FRAMES} from './lib/timeline.ts';
import {NebulaScene} from './scenes/Nebula.tsx';
import {PlanetScene} from './scenes/Planet.tsx';
import {ResolveScene} from './scenes/Resolve.tsx';
import {VoidScene} from './scenes/Void.tsx';
import {WarpScene} from './scenes/Warp.tsx';
import type {CosmicIntroProps} from './types.ts';

const SCENES = {
  void: VoidScene,
  nebula: NebulaScene,
  planet: PlanetScene,
  warp: WarpScene,
  resolve: ResolveScene,
} as const;

const LAST_SCENE_FADE_FRAMES = 14;

const SceneHost: React.FC<{
  children: React.ReactNode;
  durationInFrames: number;
  fadeIn: boolean;
}> = ({children, durationInFrames, fadeIn}) => {
  const frame = useCurrentFrame();
  const fadeInOpacity = fadeIn
    ? interpolate(frame, [0, CROSSFADE_FRAMES], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  const fadeOutOpacity = interpolate(
    frame,
    [durationInFrames - LAST_SCENE_FADE_FRAMES, durationInFrames - 1],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{opacity: Math.min(fadeInOpacity, fadeOutOpacity)}}>
      {children}
    </AbsoluteFill>
  );
};

const SceneProgress: React.FC<{
  durationInFrames: number;
  render: (progress: number) => React.ReactNode;
}> = ({durationInFrames, render}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / (durationInFrames - 1)));
  return <>{render(progress)}</>;
};

const CosmicIntro: React.FC<CosmicIntroProps> = (props) => {
  const frame = useCurrentFrame();
  const entries = props.narration ?? narration;
  const spans = buildSceneSpans();
  const driftX = interpolate(frame, [0, TOTAL_FRAMES], [-8, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const driftY = interpolate(frame, [0, TOTAL_FRAMES], [6, -6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const roll = interpolate(frame, [0, 450, TOTAL_FRAMES], [-1.2, 0.6, -0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: props.palette.deepViolet}}>
      <AbsoluteFill
        style={{
          transform: `translate(${driftX}px, ${driftY}px) rotate(${roll}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        {spans.map((span) => {
          const Scene = SCENES[span.id];
          const isLast = span.id === 'resolve';
          return (
            <Sequence
              key={span.id}
              name={span.id}
              from={span.from}
              durationInFrames={span.durationInFrames}
            >
              <SceneHost
                durationInFrames={span.durationInFrames}
                fadeIn={span.id !== 'void'}
              >
                <SceneProgress
                  durationInFrames={span.durationInFrames}
                  render={(progress) => (
                    <Scene
                      palette={props.palette}
                      seed={props.seed}
                      progress={progress}
                      durationInFrames={span.durationInFrames}
                      showRing={props.showRing}
                      title={props.title}
                    />
                  )}
                />
              </SceneHost>
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <FilmGrain opacity={0.05} seed={props.seed} />
      {props.showSubtitle ? <Subtitle entries={entries} palette={props.palette} /> : null}
      {props.showSafeZoneGuide ? <SafeZoneGuide palette={props.palette} /> : null}
      <AudioTrack
        entries={entries}
        voiceVolume={props.voiceVolume}
        ambientVolume={props.ambientVolume}
      />
    </AbsoluteFill>
  );
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
