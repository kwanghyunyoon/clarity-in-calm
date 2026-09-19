/**
 * Storage keys + tourIds for the per-screen coach-mark tours (Journal,
 * Emotions, Insights). Shared between each screen's useScreenTour call, the
 * Settings replay rows (via TourReplayContext), and data-registry.ts so the
 * "seen" flags are covered by backup/delete-all.
 */

export const JOURNAL_TOUR = {
  tourId: 'journal',
  storageKey: '@cic:hasSeenJournalTour',
} as const;

export const EMOTIONS_TOUR = {
  tourId: 'emotions',
  storageKey: '@cic:hasSeenEmotionsTour',
} as const;

export const INSIGHTS_TOUR = {
  tourId: 'insights',
  storageKey: '@cic:hasSeenInsightsTour',
} as const;
