import type {NarrationEntry} from '../data/narration.ts';

export type MissingAudio = {
  id: string;
  file: string;
  path: string;
};

export const findMissingAudio = (
  entries: NarrationEntry[],
  exists: (path: string) => boolean,
  resolve: (file: string) => string,
): MissingAudio[] =>
  entries
    .filter((entry) => !exists(resolve(entry.audioFile)))
    .map((entry) => ({id: entry.id, file: entry.audioFile, path: resolve(entry.audioFile)}));
