import React from 'react';
import {
  AbsoluteFill,
  Composition,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from 'remotion';
import {AudioTrack} from './components/AudioTrack.tsx';
import {DitherOverlay} from './components/DitherOverlay.tsx';
import {FilmGrain} from './components/FilmGrain.tsx';
import {FontLoader} from './components/FontLoader.tsx';
import {SafeZoneGuide} from './components/SafeZoneGuide.tsx';
import {Subtitle} from './components/Subtitle.tsx';
import {episodeById, episodes, type Episode, type SceneId} from './data/episodes.ts';
import {buildSceneSpans, sceneSlot, TOTAL_FRAMES} from './lib/timeline.ts';
import type {SubtitleSlot} from './lib/subtitle.ts';
import {CloserScene} from './scenes/Closer.tsx';
import {CoreScene} from './scenes/Core.tsx';
import {Extra1Scene} from './scenes/Extra1.tsx';
import {Extra2Scene} from './scenes/Extra2.tsx';
import {HookScene} from './scenes/Hook.tsx';
import {cosmicPalette} from './theme/palette.ts';
import type {EpisodeProps} from './types.ts';

const SceneHost: React.FC<{children: React.ReactNode; fadeIn: boolean}> = ({
  children,
  fadeIn,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, 12], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const SceneProgress: React.FC<{
  durationInFrames: number;
  render: (progress: number) => React.ReactNode;
}> = ({durationInFrames, render}) => {
  const frame = useCurrentFrame();
  const progress = Math.min(1, Math.max(0, frame / (durationInFrames - 1)));
  return <>{render(progress)}</>;
};

const subtitleSlotsFor = (episode: Episode): SubtitleSlot[] =>
  (['core', 'add1', 'add2', 'closer'] as SceneId[]).map((id) => {
    const slot = sceneSlot(id);
    const copy = episode.scenes[id];
    return {
      id,
      from: slot.from,
      durationInFrames: slot.durationInFrames,
      text: copy?.narration ?? '',
    };
  });

const CosmicEpisode: React.FC<EpisodeProps> = (props) => {
  const episode = episodeById(props.episodeId) ?? episodes[0];
  const {palette} = props;
  const spans = buildSceneSpans();

  return (
    <AbsoluteFill style={{backgroundColor: palette['space.base']}}>
      <FontLoader>
      {spans.map((span) => (
        <Sequence
          key={span.id}
          name={span.id}
          from={span.from}
          durationInFrames={span.durationInFrames}
        >
          <SceneHost fadeIn={span.id !== 'hook'}>
            <SceneProgress
              durationInFrames={span.durationInFrames}
              render={(progress) => {
                if (span.id === 'hook') {
                  return (
                    <HookScene
                      palette={palette}
                      seed={episode.seed}
                      progress={progress}
                      lines={episode.scenes.hook.onScreen ?? [episode.scenes.hook.narration]}
                      highlight={episode.scenes.hook.highlight}
                    />
                  );
                }
                if (span.id === 'core') {
                  return (
                    <CoreScene
                      palette={palette}
                      seed={episode.seed}
                      progress={progress}
                      lead={episode.lead}
                      context={episode.context}
                      keyPoint={episode.scenes.core.keyPoint}
                    />
                  );
                }
                if (span.id === 'add1') {
                  return (
                    <Extra1Scene
                      palette={palette}
                      seed={episode.seed}
                      progress={progress}
                      variant={episode.planetVariant}
                      keyPoint={episode.scenes.add1.keyPoint}
                    />
                  );
                }
                if (span.id === 'add2') {
                  return (
                    <Extra2Scene
                      palette={palette}
                      seed={episode.seed}
                      progress={progress}
                      keyPoint={episode.scenes.add2.keyPoint}
                    />
                  );
                }
                return (
                  <CloserScene
                    palette={palette}
                    seed={episode.seed}
                    progress={progress}
                    ctaText={props.ctaText}
                  />
                );
              }}
            />
          </SceneHost>
        </Sequence>
      ))}

      <DitherOverlay opacity={0.025} />
      <FilmGrain opacity={0.035} />

      {props.showSubtitle ? (
        <Subtitle
          slots={subtitleSlotsFor(episode)}
          palette={{'star.white': palette['star.white'], 'space.base': palette['space.base']}}
        />
      ) : null}

      {props.showSafeZoneGuide ? (
        <SafeZoneGuide accent={palette['solar.coral']} text="SAFE ZONE" />
      ) : null}

      <AudioTrack
        episodeId={episode.id}
        scenes={(['hook', 'core', 'add1', 'add2', 'closer'] as SceneId[]).map((id) => ({
          id,
          text: episode.scenes[id]?.narration ?? '',
        }))}
        volumeVoiceover={props.volumeVoiceover}
        volumeAmbient={props.volumeAmbient}
        volumeSfx={0.5}
      />
      </FontLoader>
    </AbsoluteFill>
  );
};

const calculateMetadata: CalculateMetadataFunction<EpisodeProps> = ({props}) => {
  const episode = episodeById(props.episodeId) ?? episodes[0];
  return {
    durationInFrames: TOTAL_FRAMES,
    props: {...props, episodeId: episode.id},
    defaultCodec: 'h264',
    defaultOutName: episode.id,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {episodes.map((episode) => (
        <Composition
          key={episode.id}
          id={episode.id}
          component={CosmicEpisode}
          durationInFrames={TOTAL_FRAMES}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            episodeId: episode.id,
            palette: cosmicPalette,
            showSubtitle: true,
            showSafeZoneGuide: false,
            volumeVoiceover: 1,
            volumeAmbient: 0.22,
            ctaText: 'FOLLOW FOR THE NEXT EPISODE',
          }}
          calculateMetadata={calculateMetadata}
        />
      ))}
    </>
  );
};
