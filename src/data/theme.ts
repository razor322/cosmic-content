import type {Palette} from '../types.ts';

export const PALETTE_KEYS: (keyof Palette)[] = [
  'cosmicIndigo',
  'nebulaPurple',
  'stellarMagenta',
  'solarCoral',
  'deepViolet',
  'lavender',
  'starlight',
];

export const cosmicTheme: Palette = {
  cosmicIndigo: '#443199',
  nebulaPurple: '#792CA2',
  stellarMagenta: '#C13383',
  solarCoral: '#E05454',
  deepViolet: '#29204F',
  lavender: '#B8B2FF',
  starlight: '#FFF2EC',
};

export const withAlpha = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
