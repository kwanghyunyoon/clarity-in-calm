import type { Translations } from '@/i18n/translations';

export type CrisisKeywords = Translations['journal']['crisisKeywords'];

export function checkCrisis(text: string, crisisKeywords: CrisisKeywords): boolean {
  const lower = text.toLowerCase();
  return Object.values(crisisKeywords)
    .flat()
    .some(kw => lower.includes(kw));
}
