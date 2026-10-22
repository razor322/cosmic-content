import React, {useEffect, useState} from 'react';
import {Audio} from '@remotion/media';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {checkAudioSlot} from '../lib/audioSlots.ts';
import {TOTAL_FRAMES} from '../lib/timeline.ts';
import type {NarrationEntry} from '../types.ts';

export type AudioTrackProps = {
  entries: NarrationEntry[];
  voiceVolume: number;
  ambientVolume: number;
};

const clampVolume = (value: number): number => Math.min(1, Math.max(0, value));

export const AudioTrack: React.FC<AudioTrackProps> = ({entries, voiceVolume, ambientVolume}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [ambientReady, setAmbientReady] = useState(false);

  useEffect(() => {
    entries.forEach((entry) => {
      getAudioDurationInSeconds(staticFile(`voiceover/${entry.audioFile}`))
        .then((seconds) => {
          const check = checkAudioSlot(entry, seconds, fps);
          if (check.overlong) {
            console.warn(check.message);
          } else {
            console.log(check.message);
          }
        })
        .catch((error: unknown) => {
          console.error(
            `[audio] Missing or unreadable voiceover for scene "${entry.id}" (${entry.audioFile}). Run "npm run voiceover" before rendering.`,
            error,
          );
        });
    });
  }, [entries, fps]);

  useEffect(() => {
    let cancelled = false;
    fetch(staticFile('audio/ambient.mp3'), {method: 'HEAD'})
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

  const speaking = entries.some(
    (entry) => frame >= entry.startFrame && frame <= entry.endFrame,
  );
  const fade = interpolate(
    frame,
    [0, 45, TOTAL_FRAMES - 45, TOTAL_FRAMES],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const ambient = ambientReady
    ? clampVolume(ambientVolume) * fade * (speaking ? 0.35 : 1)
    : 0;

  return (
    <>
      {entries.map((entry) => (
        <Sequence key={entry.id} name={`voice-${entry.id}`} from={entry.startFrame}>
          <Audio src={staticFile(`voiceover/${entry.audioFile}`)} volume={clampVolume(voiceVolume)} />
        </Sequence>
      ))}
      {ambientReady ? (
        <Audio src={staticFile('audio/ambient.mp3')} volume={ambient} />
      ) : null}
    </>
  );
};
