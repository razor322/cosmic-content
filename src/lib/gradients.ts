import {withAlpha} from '../theme/palette.ts';

/**
 * A radial wash. The ellipse needs two radii: with a single value the whole
 * gradient is invalid and nothing is painted.
 */
export const radialWash = (
  colour: string,
  strength: number,
  options: {
    centerX?: number;
    centerY?: number;
    radiusX?: number;
    radiusY?: number;
  } = {},
): string => {
  const {
    centerX = 50,
    centerY = 50,
    radiusX = 92,
    radiusY = 66,
  } = options;
  return [
    `radial-gradient(ellipse ${radiusX}% ${radiusY}% at ${centerX}% ${centerY}%`,
    `${withAlpha(colour, strength)} 0%`,
    `${withAlpha(colour, strength * 0.45)} 46%`,
    `${withAlpha(colour, 0)} 100%)`,
  ].join(', ');
};

/**
 * A vignette: transparent in the middle, the colour at the edge. The open
 * ratio is the radius that stays clear.
 */
export const radialVignette = (
  colour: string,
  strength: number,
  openRatio: number,
  centerY = 45,
): string =>
  [
    `radial-gradient(ellipse ${openRatio}% ${Math.round(openRatio * 0.72)}% at 50% ${centerY}%`,
    `${withAlpha(colour, 0)} 30%`,
    `${withAlpha(colour, strength)} 100%)`,
  ].join(', ');
