import { canAdvance, EMOTION_LOG_STEPS, nextStepIndex, prevStepIndex } from '@/lib/emotion-log-steps';

describe('EMOTION_LOG_STEPS', () => {
  it('starts with the emotion picker and ends with review', () => {
    expect(EMOTION_LOG_STEPS[0]).toBe('emotion');
    expect(EMOTION_LOG_STEPS[EMOTION_LOG_STEPS.length - 1]).toBe('review');
  });
});

describe('canAdvance', () => {
  it('blocks leaving the emotion step until one is picked', () => {
    expect(canAdvance('emotion', false)).toBe(false);
    expect(canAdvance('emotion', true)).toBe(true);
  });

  it('never blocks the other, optional steps', () => {
    expect(canAdvance('intensity', false)).toBe(true);
    expect(canAdvance('context', false)).toBe(true);
    expect(canAdvance('coping', false)).toBe(true);
    expect(canAdvance('note', false)).toBe(true);
  });
});

describe('nextStepIndex / prevStepIndex', () => {
  const lastIndex = EMOTION_LOG_STEPS.length - 1;

  it('advances by one and clamps at the last step', () => {
    expect(nextStepIndex(0)).toBe(1);
    expect(nextStepIndex(lastIndex)).toBe(lastIndex);
  });

  it('retreats by one and clamps at the first step', () => {
    expect(prevStepIndex(1)).toBe(0);
    expect(prevStepIndex(0)).toBe(0);
  });
});
