import type {NarrationEntry} from '../types.ts';

export type {NarrationEntry};

export const narration: NarrationEntry[] = [
  {
    id: 'void',
    text: 'In the beginning, there was only silence.',
    startFrame: 0,
    endFrame: 120,
    audioFile: 'scene-1.mp3',
  },
  {
    id: 'nebula',
    text: 'From drifting clouds of dust and light, stars begin to form.',
    startFrame: 120,
    endFrame: 300,
    audioFile: 'scene-2.mp3',
  },
  {
    id: 'planet',
    text: 'Around them, worlds take shape, each one quietly turning in the dark.',
    startFrame: 300,
    endFrame: 510,
    audioFile: 'scene-3.mp3',
  },
  {
    id: 'warp',
    text: 'And we reach further, crossing distances too vast to measure.',
    startFrame: 510,
    endFrame: 720,
    audioFile: 'scene-4.mp3',
  },
  {
    id: 'resolve',
    text: 'Beyond the sky, the story is only beginning.',
    startFrame: 720,
    endFrame: 900,
    audioFile: 'scene-5.mp3',
  },
];
