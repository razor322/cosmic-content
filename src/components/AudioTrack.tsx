import React, {useEffect, useState} from 'react';
import {Audio} from '@remotion/media';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {cancelRender, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {checkAudioSlot, type SlotCheck} from '../lib/audioSlots.ts';
import {audioSlot, TOTAL_FRAMES} from '../lib/timeline.ts';
import type {SceneId} from '../data/episodes.ts';

export type AudioTrackProps = {
  episodeId: string;
  scenes: {id: SceneId; text: string}[];
  volumeVoiceover: number;
  volumeAmbient: number;
  volumeSfx: number;
};

const clampVolume = (value: number): number => Math.min(1, Math.max(0, value));

export const AudioTrack: React.FC<AudioTrackProps> = ({
  episodeId,
  scenes,
  volumeVoiceover,
  volumeAmbient,
  volumeSfx,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [ambientReady, setAmbientReady] = useState(false);

  useEffect(() => {
    const checkDurations = async () => {
      for (const scene of scenes) {
        const slot = audioSlot(scene.id);
        let result: SlotCheck | null = null;
        try {
          const seconds = await getAudioDurationInSeconds(
            staticFile(`voiceover/${episodeId}/${scene.id}.mp3`),
          );
          result = checkAudioSlot(scene.id, seconds, slot.durationInFrames, fps);
        } catch (error: unknown) {
          console.error(
            `[audio] Missing or unreadable voiceover for scene "${scene.id}" of ${episodeId}. Run "npm run voiceover" before rendering.`,
            error,
          );
          continue;
        }
        if (result.overlong) {
          console.warn(result.message);
          cancelRender(new Error(result.message));
          return;
        }
        console.log(result.message);
      }
    };
    void checkDurations();
  }, [scenes, episodeId, fps]);

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile('audio/ambient.wav'), {method: 'HEAD'})
      .then((response) => {
        if (!cancelled && response.ok) {
          setAmbientReady(true);
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const speaking = scenes.some((scene) => {
    const slot = audioSlot(scene.id);
    return frame >= slot.from && frame <= slot.from + slot.durationInFrames;
  });
  const ambientFade = interpolate(
    frame,
    [0, 45, TOTAL_FRAMES - 60, TOTAL_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const ambient = ambientReady
    ? clampVolume(volumeAmbient) * ambientFade * (speaking ? 0.3 : 1)
    : 0;

  return (
    <>
      {scenes.map((scene) => {
        const slot = audioSlot(scene.id);
        return (
          <Sequence key={scene.id} name={`voice-${scene.id}`} from={slot.from}>
            <Audio
              src={staticFile(`voiceover/${episodeId}/${scene.id}.mp3`)}
              volume={clampVolume(volumeVoiceover)}
            />
          </Sequence>
        );
      })}

      <Sequence name="sfx-hit" from={0}>
        <Audio src={staticFile('audio/hit.wav')} volume={clampVolume(volumeSfx) * 0.9} />
      </Sequence>
      <Sequence name="sfx-whoosh" from={0}>
        <Audio src={staticFile('audio/whoosh.wav')} volume={clampVolume(volumeSfx) * 0.55} />
      </Sequence>

      {ambientReady ? (
        <Audio src={staticFile('audio/ambient.wav')} volume={ambient} loop />
      ) : null}
    </>
  );
};
