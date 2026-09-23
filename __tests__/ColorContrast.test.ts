import { ensureContrastText } from '@/lib/color-contrast';

describe('ensureContrastText', () => {
  it('leaves a color unchanged when it already meets the contrast ratio', () => {
    expect(ensureContrastText('#000000', '#FAF3EA')).toBe('#000000');
  });

  it('darkens the Happiness yellow enough to pass WCAG AA on the light surface color', () => {
    const bg = '#FAF3EA';
    const result = ensureContrastText('#F5C842', bg);
    expect(result).not.toBe('#F5C842');
    expect(contrastRatio(result, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('darkens near-white text until it passes against a light background', () => {
    const bg = '#FFFFFF';
    const result = ensureContrastText('#FEFEFE', bg);
    expect(contrastRatio(result, bg)).toBeGreaterThanOrEqual(4.5);
  });
});

function contrastRatio(fg: string, bg: string): number {
  const lum = (hex: string) => {
    const n = parseInt(hex.slice(1), 16);
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}
