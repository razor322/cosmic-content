export type MissingAudio = {
  sceneId: string;
  file: string;
  path: string;
};

export const findMissingAudio = (
  entries: {sceneId: string; file: string}[],
  exists: (path: string) => boolean,
  resolve: (file: string) => string,
): MissingAudio[] =>
  entries
    .filter((entry) => !exists(resolve(entry.file)))
    .map((entry) => ({
      sceneId: entry.sceneId,
      file: entry.file,
      path: resolve(entry.file),
    }));
