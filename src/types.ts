export type Palette = {
  cosmicIndigo: string;
  nebulaPurple: string;
  stellarMagenta: string;
  solarCoral: string;
  deepViolet: string;
  lavender: string;
  starlight: string;
};

export type NarrationEntry = {
  id: string;
  text: string;
  startFrame: number;
  endFrame: number;
  audioFile: string;
};

export type CosmicIntroProps = {
  title: string;
  narration?: NarrationEntry[];
  palette: Palette;
  seed: number;
  showSubtitle: boolean;
  showSafeZoneGuide: boolean;
  voice: string;
  voiceVolume: number;
  ambientVolume: number;
  showRing: boolean;
};

export type SceneProps = {
  palette: Palette;
  seed: number;
  progress: number;
  durationInFrames: number;
  showRing: boolean;
  title: string;
};

