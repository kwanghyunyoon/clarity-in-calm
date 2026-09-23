/**
 * Emotion swatch colors (see BASIC_EMOTIONS) double as text color on a
 * near-white surface — several, like Happiness's yellow, fail WCAG AA there.
 * Darkens a foreground color just enough to clear the ratio against a given
 * background, leaving already-compliant colors untouched.
 */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const toHex = (c: number) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [lr, lg, lb] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
  const [l1, l2] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

const MAX_STEPS = 30;
const DARKEN_FACTOR = 0.92;

export function ensureContrastText(fg: string, bg: string, minRatio = 4.5): string {
  const bgRgb = hexToRgb(bg);
  let rgb = hexToRgb(fg);

  for (let i = 0; i < MAX_STEPS && contrastRatio(rgb, bgRgb) < minRatio; i++) {
    rgb = rgb.map(c => c * DARKEN_FACTOR) as [number, number, number];
  }

  return rgbToHex(rgb);
}
