export const HOOK_MAX_FONT = 140;
export const HOOK_MIN_FONT = 108;
export const HOOK_TRACKING = 0.05;

const CHAR_WIDTHS: Record<string, number> = {
  ' ': 0.3,
  '.': 0.26,
  ',': 0.26,
  "'": 0.22,
  'I': 0.28,
  'J': 0.44,
  'M': 0.92,
  'W': 0.96,
  'L': 0.58,
};

const DEFAULT_CHAR_WIDTH = 0.68;

/** Estimated rendered width of one line of uppercase display text. */
export const estimateTextWidth = (
  text: string,
  fontSize: number,
  tracking: number = HOOK_TRACKING,
): number => {
  let em = 0;
  for (const character of text) {
    em += CHAR_WIDTHS[character] ?? DEFAULT_CHAR_WIDTH;
  }
  return em * fontSize + tracking * fontSize * Math.max(0, text.length - 1);
};

/**
 * The largest font size at which every line of the hook still fits the safe
 * width. The hook is three lines in most episodes and four in a few, so the
 * size has to shrink instead of overflowing.
 */
export const fitHookFontSize = (
  lines: string[],
  maxWidth: number,
  tracking: number = HOOK_TRACKING,
): number => {
  let size = HOOK_MAX_FONT;
  while (size > HOOK_MIN_FONT) {
    const fits = lines.every(
      (line) => estimateTextWidth(line, size, tracking) <= maxWidth,
    );
    if (fits) {
      return size;
    }
    size -= 1;
  }
  return HOOK_MIN_FONT;
};
