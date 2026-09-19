import type { Translations } from '@/i18n/translations';
import type { JournalEntry } from '@/types';

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

// ── Diary-card pattern detection (issue #73/#74) ──
//
// Anchored to entries already flagged by detectConcern (crisis/trauma
// keyword hits), never to raw mood values — journaling.pdf's own "Noise"
// section warns against auto-generated insights that pathologize normal
// mood variation (e.g. "labeling three low-mood days as a concerning
// trend"). Frequency of an already-validated concern signal is the only
// input used here.

export type PatternType = 'recurringUrges' | 'consistentTrigger' | 'worseningTrend';

export interface PatternConcern {
  type: PatternType;
  /** The recurring context tag — set only when type is 'consistentTrigger'. */
  tag?: string;
}

/** A previously shown pattern notice, persisted so the same signal doesn't
 * re-fire on every save. */
export interface PatternNoticeRecord {
  type: PatternType;
  tag?: string;
  shownAt: string; // ISO
}

const MS_PER_DAY = 86400000;
const PATTERN_WINDOW_DAYS = 14; // "persistent... more than two weeks" (journaling.pdf)
const TREND_WINDOW_DAYS = 28;
const PATTERN_MIN_COUNT = 3; // mirrors journaling.pdf's own rumination rule of thumb

function daysAgo(iso: string, now: Date): number {
  return (now.getTime() - new Date(iso).getTime()) / MS_PER_DAY;
}

interface FlaggedEntry {
  entry: JournalEntry;
  concern: ConcernType;
}

function flagEntries(
  entries: JournalEntry[],
  crisisKeywords: CrisisKeywords,
  traumaKeywords: TraumaKeywords,
): FlaggedEntry[] {
  const flagged: FlaggedEntry[] = [];
  for (const entry of entries) {
    const concern = entry.note ? detectConcern(entry.note, crisisKeywords, traumaKeywords) : null;
    if (concern) flagged.push({ entry, concern });
  }
  return flagged;
}

/**
 * Detects a diary-card-style pattern across journal-entry history, per
 * journaling.pdf's "Limits and Cautions" fourth professional-help trigger.
 * Checked in priority order (most acute first): recurring urges, then a
 * consistent trigger tag, then a worsening frequency trend.
 */
export function detectPattern(
  entries: JournalEntry[],
  now: Date,
  crisisKeywords: CrisisKeywords,
  traumaKeywords: TraumaKeywords,
): PatternConcern | null {
  const flagged = flagEntries(entries, crisisKeywords, traumaKeywords);
  const withinWindow = flagged.filter(f => daysAgo(f.entry.date, now) <= PATTERN_WINDOW_DAYS);

  const urgeCount = withinWindow.filter(f => f.concern === 'crisis').length;
  if (urgeCount >= PATTERN_MIN_COUNT) return { type: 'recurringUrges' };

  const tagCounts = new Map<string, number>();
  for (const f of withinWindow) {
    for (const tag of f.entry.contextTags ?? []) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }
  for (const [tag, count] of tagCounts) {
    if (count >= PATTERN_MIN_COUNT) return { type: 'consistentTrigger', tag };
  }

  // "Worsening" implies a rise from an established baseline, not just the
  // first occurrence of a signal — requires at least one flagged entry in
  // the older half too, or this would fire on any brand-new cluster of
  // activity with zero prior history.
  const withinTrend = flagged.filter(f => daysAgo(f.entry.date, now) <= TREND_WINDOW_DAYS);
  const newerCount = withinTrend.filter(f => daysAgo(f.entry.date, now) <= PATTERN_WINDOW_DAYS).length;
  const olderCount = withinTrend.length - newerCount;
  if (olderCount >= 1 && newerCount >= 2 && newerCount > olderCount) return { type: 'worseningTrend' };

  return null;
}

/**
 * Whether a freshly detected pattern should surface a notice, given the
 * last one shown. Suppresses a repeat of the *same* signal until its
 * window has fully rolled over, but never suppresses a genuinely new or
 * distinct pattern — otherwise an old acknowledgment would hide a new one.
 */
export function shouldShowPatternNotice(
  concern: PatternConcern,
  last: PatternNoticeRecord | null,
  now: Date,
): boolean {
  if (!last) return true;
  const isSameSignal = last.type === concern.type && last.tag === concern.tag;
  if (!isSameSignal) return true;
  return daysAgo(last.shownAt, now) > PATTERN_WINDOW_DAYS;
}
