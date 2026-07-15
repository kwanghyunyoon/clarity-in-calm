/**
 * Tests for the breathing phase logic shipped in src/lib/breathing.ts
 * and used by breathe.tsx. No React Native rendering required — pure logic only.
 */
import { CYCLE_MS, getPhaseAtTime, getPhaseCountdownAtTime, PHASE_DURATIONS } from '@/lib/breathing';

describe('BreathingExercise', () => {
  test('phase transitions: inhale → hold → exhale → rest', () => {
    expect(getPhaseAtTime(0)).toBe('inhale');
    expect(getPhaseAtTime(4000)).toBe('hold1');
    expect(getPhaseAtTime(8000)).toBe('exhale');
    expect(getPhaseAtTime(12000)).toBe('rest');
  });

  test('phase wraps back to inhale after full cycle', () => {
    expect(getPhaseAtTime(CYCLE_MS)).toBe('inhale');
  });

  test('duration of each phase matches configured values', () => {
    expect(PHASE_DURATIONS).toEqual([4000, 4000, 4000, 4000]);
  });

  test('mid-phase timing lands in correct phase', () => {
    expect(getPhaseAtTime(2000)).toBe('inhale');  // 2s into inhale
    expect(getPhaseAtTime(5000)).toBe('hold1');   // 1s into hold
    expect(getPhaseAtTime(9000)).toBe('exhale');  // 1s into exhale
    expect(getPhaseAtTime(13000)).toBe('rest');   // 1s into rest
  });

  test('countdown reflects seconds remaining in the current phase', () => {
    expect(getPhaseCountdownAtTime(0)).toBe(4);
    expect(getPhaseCountdownAtTime(3000)).toBe(1);
    expect(getPhaseCountdownAtTime(3999)).toBe(1);
    expect(getPhaseCountdownAtTime(4000)).toBe(4);
  });
});
