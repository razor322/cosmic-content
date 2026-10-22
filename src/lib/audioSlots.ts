import type {NarrationEntry} from '../data/narration.ts';

export type SlotCheck = {
  id: string;
  allowedSeconds: number;
  measuredSeconds: number;
  overlong: boolean;
  message: string;
};

export const checkAudioSlot = (
  entry: NarrationEntry,
  measuredSeconds: number,
  fps: number,
): SlotCheck => {
  const allowedSeconds = (entry.endFrame - entry.startFrame) / fps;
  const overlong = measuredSeconds > allowedSeconds;
  const message = overlong
    ? `Voiceover "${entry.id}" runs ${measuredSeconds.toFixed(2)}s but its slot allows ${allowedSeconds.toFixed(2)}s. Shorten the line or move the slot in src/data/narration.ts.`
    : `Voiceover "${entry.id}" fits its slot: ${measuredSeconds.toFixed(2)}s of ${allowedSeconds.toFixed(2)}s.`;
  return {id: entry.id, allowedSeconds, measuredSeconds, overlong, message};
};
