/**
 * Tests for the breathing phase logic shipped in src/lib/breathing.ts
 * and used by breathe.tsx. No React Native rendering required — pure logic only.
 */
import {
  CYCLE_MS,
  DISC_SCALE,
  getOpennessAtTime,
  getPhaseAtTime,
  getPhaseCountdownAtTime,
  getTickAtTime,
  PHASE_DURATIONS,
  TICKS_PER_CYCLE,
} from '@/lib/breathing';

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

  test('openness spans the full range across a cycle', () => {
    expect(getOpennessAtTime(0)).toBeCloseTo(0);      // start of inhale — fully exhaled
    expect(getOpennessAtTime(4000)).toBeCloseTo(1);   // end of inhale — fully inhaled
    expect(getOpennessAtTime(8000)).toBeCloseTo(1);   // still held open
    expect(getOpennessAtTime(12000)).toBeCloseTo(0);  // end of exhale — fully closed
  });

  test('the circle always moves in the direction the label says', () => {
    // The bug this guards: the label and the animation were driven by two
    // independent clocks, so "Inhale" could show while the circle shrank.
    const STEP = 50;
    for (let ms = 0; ms + STEP <= CYCLE_MS * 3; ms += STEP) {
      const phase = getPhaseAtTime(ms);
      const delta = getOpennessAtTime(ms + STEP) - getOpennessAtTime(ms);

      // Skip samples that straddle a phase boundary — the phase read at `ms`
      // no longer describes the whole step.
      if (getPhaseAtTime(ms + STEP) !== phase) continue;

      if (phase === 'inhale') {
        expect(delta).toBeGreaterThan(0);
      } else if (phase === 'exhale') {
        expect(delta).toBeLessThan(0);
      } else {
        expect(delta).toBeCloseTo(0);
      }
    }
  });

  test('holds sit at the extremes, not somewhere in between', () => {
    expect(getOpennessAtTime(6000)).toBe(1);   // mid hold — fully open
    expect(getOpennessAtTime(14000)).toBe(0);  // mid rest — fully closed
  });

  test('openness repeats every cycle and handles times before the start', () => {
    expect(getOpennessAtTime(CYCLE_MS + 2000)).toBeCloseTo(getOpennessAtTime(2000));
    expect(getOpennessAtTime(-2000)).toBeCloseTo(getOpennessAtTime(CYCLE_MS - 2000));
  });

  test('disc scale range is a genuine expand-and-shrink', () => {
    expect(DISC_SCALE.min).toBeLessThan(DISC_SCALE.max);
  });

  test('tick advances once a second and wraps with the cycle', () => {
    expect(getTickAtTime(0)).toBe(0);
    expect(getTickAtTime(999)).toBe(0);
    expect(getTickAtTime(1000)).toBe(1);
    expect(getTickAtTime(CYCLE_MS - 1)).toBe(TICKS_PER_CYCLE - 1);
    expect(getTickAtTime(CYCLE_MS)).toBe(0);
  });

  test('every tick maps to the same phase the clock reports', () => {
    for (let tick = 0; tick < TICKS_PER_CYCLE; tick++) {
      expect(getPhaseAtTime(tick * 1000)).toBe(getPhaseAtTime(tick * 1000 + 999));
    }
  });
});
