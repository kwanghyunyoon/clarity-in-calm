/**
 * Pure step-order/validation logic for the emotions screen's progressive
 * multi-step flow (#78) — kept free of React/RN so it can be unit tested
 * directly, same seam as use-onboarding-flow.ts's page index.
 */
export const EMOTION_LOG_STEPS = ['emotion', 'intensity', 'context', 'coping', 'note', 'review'] as const;

export type EmotionLogStep = typeof EMOTION_LOG_STEPS[number];

/** Only the emotion step is gated — every later step is optional. */
export function canAdvance(step: EmotionLogStep, hasEmotion: boolean): boolean {
  if (step === 'emotion') return hasEmotion;
  return true;
}

export function nextStepIndex(index: number): number {
  return Math.min(index + 1, EMOTION_LOG_STEPS.length - 1);
}

export function prevStepIndex(index: number): number {
  return Math.max(index - 1, 0);
}
