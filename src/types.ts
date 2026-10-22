import type {Palette} from './theme/palette.ts';

export type EpisodeProps = {
  episodeId: string;
  palette: Palette;
  showSubtitle: boolean;
  showSafeZoneGuide: boolean;
  volumeVoiceover: number;
  volumeAmbient: number;
  ctaText: string;
};
