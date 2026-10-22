const REFERENCE_WIDTH = 1080;
const REFERENCE_HEIGHT = 1920;

export type SafeZone = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export const safeZone = (width: number, height: number): SafeZone => ({
  top: (220 / REFERENCE_HEIGHT) * height,
  bottom: (380 / REFERENCE_HEIGHT) * height,
  left: (60 / REFERENCE_WIDTH) * width,
  right: (120 / REFERENCE_WIDTH) * width,
});

export const subtitleBottomClearance = (height: number): number =>
  (400 / REFERENCE_HEIGHT) * height;

export const subtitleMaxWidth = (width: number): number =>
  (840 / REFERENCE_WIDTH) * width;

export const subtitleFontSize = (width: number): number => (50 / REFERENCE_WIDTH) * width;

export const titleFontSize = (width: number): number => (108 / REFERENCE_WIDTH) * width;

export const focusBand = (height: number): {top: number; bottom: number} => ({
  top: height * 0.35,
  bottom: height * 0.55,
});
