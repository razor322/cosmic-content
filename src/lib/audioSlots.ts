export type SlotCheck = {
  sceneId: string;
  allowedSeconds: number;
  measuredSeconds: number;
  overlong: boolean;
  message: string;
};

export const checkAudioSlot = (
  sceneId: string,
  measuredSeconds: number,
  allowedFrames: number,
  fps: number,
): SlotCheck => {
  const allowedSeconds = allowedFrames / fps;
  const overlong = measuredSeconds > allowedSeconds;
  const message = overlong
    ? `Voiceover "${sceneId}" runs ${measuredSeconds.toFixed(2)}s but its slot allows ${allowedSeconds.toFixed(2)}s. Shorten the line in src/data/episodes.ts or give the scene more frames.`
    : `Voiceover "${sceneId}" fits its slot: ${measuredSeconds.toFixed(2)}s of ${allowedSeconds.toFixed(2)}s.`;
  return {sceneId, allowedSeconds, measuredSeconds, overlong, message};
};
