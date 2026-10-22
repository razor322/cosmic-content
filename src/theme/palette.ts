/**
 * The only place in the project where a hex colour is allowed to exist.
 * Every other file consumes these tokens or a derived colour made with
 * `tint` and `shade`, which mix with star.white or space.base only.
 */

export type PaletteKey =
  | 'space.base'
  | 'cosmic.indigo'
  | 'nebula.purple'
  | 'stellar.magenta'
  | 'solar.coral'
  | 'star.white';

export type Palette = Record<PaletteKey, string>;

export const PALETTE_KEYS: PaletteKey[] = [
  'space.base',
  'cosmic.indigo',
  'nebula.purple',
  'stellar.magenta',
  'solar.coral',
  'star.white',
];

export const cosmicPalette: Palette = {
  'space.base': '#0A0618',
  'cosmic.indigo': '#443199',
  'nebula.purple': '#792CA2',
  'stellar.magenta': '#C13383',
  'solar.coral': '#E05454',
  'star.white': '#F6F1FF',
};

/** The warm ramp, coldest token first. Indigo may never jump straight to coral. */
export const WARM_ORDER: PaletteKey[] = [
  'cosmic.indigo',
  'nebula.purple',
  'stellar.magenta',
  'solar.coral',
];

export type Lead = 'indigo' | 'purple' | 'magenta';

const LEAD_KEYS: Record<Lead, PaletteKey> = {
  indigo: 'cosmic.indigo',
  purple: 'nebula.purple',
  magenta: 'stellar.magenta',
};

const toRgb = (hex: string): [number, number, number] => {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
};

const toHex = (rgb: [number, number, number]): string =>
  `#${rgb
    .map((channel) => Math.round(Math.min(255, Math.max(0, channel))).toString(16).padStart(2, '0'))
    .join('')}`;

export const withAlpha = (hex: string, alpha: number): string => {
  const [r, g, b] = toRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Mixes two colours. Derived colours are only ever made through this. */
export const mix = (a: string, b: string, amount: number): string => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  const t = Math.min(1, Math.max(0, amount));
  return toHex([
    r1 + (r2 - r1) * t,
    g1 + (g2 - g1) * t,
    b1 + (b2 - b1) * t,
  ]);
};

/** Lightens towards star.white. */
export const tint = (hex: string, amount: number, palette: Palette = cosmicPalette): string =>
  mix(hex, palette['star.white'], amount);

/** Darkens towards space.base. */
export const shade = (hex: string, amount: number, palette: Palette = cosmicPalette): string =>
  mix(hex, palette['space.base'], amount);

/** Evenly spaced input range for interpolateColors with the same stop count. */
export const rampInputRange = (stopCount: number): number[] =>
  stopCount <= 1
    ? [0]
    : Array.from({length: stopCount}, (_, index) => index / (stopCount - 1));

/** The four stop warm ramp, for interpolateColors. */
export const warmRamp = (palette: Palette = cosmicPalette): string[] =>
  WARM_ORDER.map((key) => palette[key]);

/**
 * The Core scene ramp for an episode lead colour. Every pair of stops is
 * adjacent in the warm order, and coral never appears here: coral stays a
 * single focal accent.
 */
export const coreRamp = (lead: Lead, palette: Palette = cosmicPalette): string[] => {
  const key = LEAD_KEYS[lead];
  const index = WARM_ORDER.indexOf(key);
  const warmer = WARM_ORDER[index + 1];
  const neighbour = warmer === 'solar.coral' ? WARM_ORDER[index - 1] : warmer;
  return [palette[key], palette[key], palette[neighbour]];
};
