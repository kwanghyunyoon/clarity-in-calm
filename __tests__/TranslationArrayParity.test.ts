/**
 * SOURCE's locale-leaf types require every leaf to declare en/ko/es/hi, but
 * TypeScript only checks that the four are the SAME array type, not the same
 * length — a locale can silently ship one fewer slide, mood, or day label
 * than the others. This test walks SOURCE and asserts array-shaped leaves
 * have equal length across all four locales.
 *
 * journal.crisisKeywords is exempt: its category leaves are deliberately
 * locale-tuned phrase lists, not parallel translations of the same phrases
 * (see __tests__/CrisisKeywordsParity.test.ts, which checks that one separately).
 *
 * journal.crisis.lines is exempt for the same reason: it's a list of
 * region-specific crisis hotlines, not a translated list — es has 6 entries
 * (covering Mexico, Colombia, Argentina, Peru) where en/ko/hi have 3.
 *
 * journal.traumaKeywords is exempt for the same reason as crisisKeywords:
 * locale-tuned phrase lists (see __tests__/CrisisKeywordsParity.test.ts,
 * "traumaKeywords locale parity", which checks that one separately).
 */
import { SOURCE, type Locale } from '@/i18n/translations';

const LOCALES: Locale[] = ['en', 'ko', 'es', 'hi'];
const EXEMPT_PATHS = new Set(['journal.crisisKeywords', 'journal.crisis.lines', 'journal.traumaKeywords']);

function isLocaleLeaf(v: unknown): v is Record<Locale, unknown> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    LOCALES.every(l => l in (v as Record<string, unknown>)) &&
    Object.keys(v as object).length === LOCALES.length
  );
}

function collectArrayLeaves(node: unknown, path: string[], out: string[][]) {
  if (EXEMPT_PATHS.has(path.join('.'))) return;
  if (isLocaleLeaf(node)) {
    if (Array.isArray(node.en)) out.push(path);
    return;
  }
  if (typeof node === 'object' && node !== null) {
    for (const [key, value] of Object.entries(node)) {
      collectArrayLeaves(value, [...path, key], out);
    }
  }
}

const arrayLeafPaths: string[][] = [];
collectArrayLeaves(SOURCE, [], arrayLeafPaths);

function getAt(obj: unknown, path: string[]): unknown {
  return path.reduce((cur, key) => (cur as Record<string, unknown>)[key], obj);
}

describe('translation array-leaf parity', () => {
  test('found at least one array-shaped leaf to check', () => {
    expect(arrayLeafPaths.length).toBeGreaterThan(0);
  });

  test.each(arrayLeafPaths.map(p => p.join('.')))('%s has the same length in every locale', pathStr => {
    const leaf = getAt(SOURCE, pathStr.split('.')) as Record<Locale, unknown[]>;
    const lengths = LOCALES.map(l => leaf[l].length);
    expect(new Set(lengths).size).toBe(1);
  });
});
