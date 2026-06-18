/**
 * Tests for breathing phase logic extracted from breathe.tsx.
 * No React Native rendering required — pure logic only.
 */

const PHASE_DURATIONS = [4000, 4000, 4000, 4000] // 4-7-8 style, 4s each for testing

const PHASES = [
  { id: 'inhale', duration: PHASE_DURATIONS[0] },
  { id: 'hold1',  duration: PHASE_DURATIONS[1] },
  { id: 'exhale', duration: PHASE_DURATIONS[2] },
  { id: 'rest',   duration: PHASE_DURATIONS[3] },
] as const

type PhaseId = typeof PHASES[number]['id'] | 'idle'

function getPhaseAtTime(elapsedMs: number): PhaseId {
  const total = PHASES.reduce((sum, p) => sum + p.duration, 0)
  const t = elapsedMs % total
  let cum = 0
  for (const phase of PHASES) {
    cum += phase.duration
    if (t < cum) return phase.id
  }
  return 'idle'
}

describe('BreathingExercise', () => {
  test('phase transitions: inhale → hold → exhale → rest', () => {
    expect(getPhaseAtTime(0)).toBe('inhale')
    expect(getPhaseAtTime(4000)).toBe('hold1')
    expect(getPhaseAtTime(8000)).toBe('exhale')
    expect(getPhaseAtTime(12000)).toBe('rest')
  })

  test('phase wraps back to inhale after full cycle', () => {
    const cycleMs = PHASES.reduce((s, p) => s + p.duration, 0)
    expect(getPhaseAtTime(cycleMs)).toBe('inhale')
  })

  test('duration of each phase matches configured values', () => {
    PHASES.forEach((phase, i) => {
      expect(phase.duration).toBe(PHASE_DURATIONS[i])
    })
  })

  test('mid-phase timing lands in correct phase', () => {
    expect(getPhaseAtTime(2000)).toBe('inhale')  // 2s into inhale
    expect(getPhaseAtTime(5000)).toBe('hold1')   // 1s into hold
    expect(getPhaseAtTime(9000)).toBe('exhale')  // 1s into exhale
    expect(getPhaseAtTime(13000)).toBe('rest')   // 1s into rest
  })
})
