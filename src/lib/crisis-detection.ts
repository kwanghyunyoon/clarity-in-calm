import type { Translations } from '@/i18n/translations';

export type CrisisKeywords = Translations['journal']['crisisKeywords'];
export type TraumaKeywords = Translations['journal']['traumaKeywords'];
export type ConcernType = 'crisis' | 'trauma';

function matchesAny(text: string, keywords: Record<string, readonly string[]>): boolean {
  const lower = text.toLowerCase();
  return Object.values(keywords)
    .flat()
    .some(kw => lower.includes(kw.toLowerCase()));
}

export function checkCrisis(text: string, crisisKeywords: CrisisKeywords): boolean {
  return matchesAny(text, crisisKeywords);
}

export function checkTrauma(text: string, traumaKeywords: TraumaKeywords): boolean {
  return matchesAny(text, traumaKeywords);
}

/**
 * Crisis (suicide/self-harm) keywords take priority over trauma-symptom
 * keywords when both match the same text.
 */
export function detectConcern(
  text: string,
  crisisKeywords: CrisisKeywords,
  traumaKeywords: TraumaKeywords,
): ConcernType | null {
  if (checkCrisis(text, crisisKeywords)) return 'crisis';
  if (checkTrauma(text, traumaKeywords)) return 'trauma';
  return null;
}
