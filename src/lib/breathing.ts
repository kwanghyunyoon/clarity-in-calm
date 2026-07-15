export const PHASE_DURATIONS = [4000, 4000, 4000, 4000] as const; // 4-7-8 style, 4s each
export const PHASE_IDS = ['inhale', 'hold1', 'exhale', 'rest'] as const;
export type PhaseId = typeof PHASE_IDS[number];

export const CYCLE_MS = PHASE_DURATIONS.reduce((s, d) => s + d, 0); // 16 000 ms

export function getPhaseAtTime(elapsedMs: number): PhaseId {
  const t = elapsedMs % CYCLE_MS;
  let cum = 0;
  for (let i = 0; i < PHASE_DURATIONS.length; i++) {
    cum += PHASE_DURATIONS[i];
    if (t < cum) return PHASE_IDS[i];
  }
  return PHASE_IDS[PHASE_IDS.length - 1];
}

export function getPhaseCountdownAtTime(elapsedMs: number): number {
  const t = elapsedMs % CYCLE_MS;
  let cum = 0;
  for (const d of PHASE_DURATIONS) {
    cum += d;
    if (t < cum) return Math.max(1, Math.ceil((cum - t) / 1000));
  }
  return 1;
}
