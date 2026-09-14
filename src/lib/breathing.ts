export const PHASE_DURATIONS = [4000, 4000, 4000, 4000] as const; // box breathing — 4s each
export const PHASE_IDS = ['inhale', 'hold1', 'exhale', 'rest'] as const;
export type PhaseId = typeof PHASE_IDS[number];

export const CYCLE_MS = PHASE_DURATIONS.reduce((s, d) => s + d, 0); // 16 000 ms

/** Milliseconds since the start of the current cycle, for any elapsed time. */
function cycleTime(elapsedMs: number): number {
  'worklet';
  return ((elapsedMs % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
}

export function getPhaseAtTime(elapsedMs: number): PhaseId {
  const t = cycleTime(elapsedMs);
  let cum = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    cum += PHASE_DURATIONS[i];
    if (t < cum) return PHASE_IDS[i];
  }
  return PHASE_IDS[PHASE_IDS.length - 1];
}

export function getPhaseCountdownAtTime(elapsedMs: number): number {
  const t = cycleTime(elapsedMs);
  let cum = 0;
  for (const d of PHASE_DURATIONS) {
    cum += d;
    if (t < cum) return Math.max(1, Math.ceil((cum - t) / 1000));
  }
  return 1;
}

/* ── Visual shape of the cycle ──────────────────────────────────────────────
 * The disc, the ring, the glow and the on-screen label are all derived from
 * the same elapsed time, so they cannot drift out of step with each other.
 * These run on Reanimated's UI thread as well as in plain JS, hence 'worklet'.
 */

/** Scale of the main disc: fully exhaled → fully inhaled. */
export const DISC_SCALE = { min: 0.58, max: 1.00 } as const;
/** Scale of the ring tracking just outside the disc. */
export const RING_SCALE = { min: 0.62, max: 1.08 } as const;
/** Opacity of the ring and outer glow. */
export const GLOW_OPACITY = { min: 0.25, max: 0.70 } as const;

/** One-second resolution position in the cycle: 0…15. */
export const TICKS_PER_CYCLE = CYCLE_MS / 1000;

function easeInOutCubic(t: number): number {
  'worklet';
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * How open the breath is at a given time: 0 = fully exhaled, 1 = fully inhaled.
 * Rises through inhale, holds at 1, falls through exhale, holds at 0 through rest.
 */
export function getOpennessAtTime(elapsedMs: number): number {
  'worklet';
  const t = cycleTime(elapsedMs);
  const inhale = PHASE_DURATIONS[0];
  const hold1 = PHASE_DURATIONS[1];
  const exhale = PHASE_DURATIONS[2];

  if (t < inhale) return easeInOutCubic(t / inhale);
  if (t < inhale + hold1) return 1;
  if (t < inhale + hold1 + exhale) return 1 - easeInOutCubic((t - inhale - hold1) / exhale);
  return 0;
}

/**
 * Which whole second of the cycle we are in: 0…15. The label and countdown only
 * change when this changes, so they update once a second rather than every frame.
 */
export function getTickAtTime(elapsedMs: number): number {
  'worklet';
  return Math.floor(cycleTime(elapsedMs) / 1000);
}
