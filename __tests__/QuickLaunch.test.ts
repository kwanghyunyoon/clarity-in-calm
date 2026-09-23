/**
 * The Quick Launch decision module (#81) holds every Quick Launch rule from
 * CONTEXT.md ("Exercise, Quick Launch, Launch point"); screens only act on its
 * output. A Quick Launch is the link contract `clarityincalm://breathe?autostart=1`
 * or `clarityincalm://ground?autostart=1`, which expo-router surfaces as the
 * pathname `/breathe` or `/ground` with the param `autostart: '1'`.
 */
import { decideQuickLaunch } from '@/lib/quick-launch';

describe('decideQuickLaunch — target', () => {
  it('Quick-Launches Breathe from /breathe?autostart=1', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' } });
    expect(d.isQuickLaunch).toBe(true);
    expect(d.isQuickLaunch && d.exercise).toBe('breathe');
  });

  it('Quick-Launches Grounding from /ground?autostart=1', () => {
    const d = decideQuickLaunch({ route: '/ground', params: { autostart: '1' } });
    expect(d.isQuickLaunch && d.exercise).toBe('ground');
  });

  it('accepts the route without a leading slash', () => {
    const d = decideQuickLaunch({ route: 'breathe', params: { autostart: '1' } });
    expect(d.isQuickLaunch && d.exercise).toBe('breathe');
  });
});

describe('decideQuickLaunch — autostart absent is a normal navigation', () => {
  it.each(['/breathe', '/ground'])('%s without autostart is not a Quick Launch', (route) => {
    expect(decideQuickLaunch({ route, params: {} }).isQuickLaunch).toBe(false);
  });

  it('a normal launch does not skip the splash or put Onboarding off', () => {
    const d = decideQuickLaunch({ route: '/', params: {}, hasSeenOnboarding: false });
    expect(d.skipSplash).toBe(false);
    expect(d.postponeOnboarding).toBe(false);
  });
});

describe('decideQuickLaunch — resume vs restart', () => {
  const quick = (exercise: 'breathe' | 'ground', exerciseState: 'not-started' | 'in-progress' | 'finished') =>
    decideQuickLaunch({ route: `/${exercise}`, params: { autostart: '1' }, exerciseState });

  it.each(['breathe', 'ground'] as const)('%s resumes when in progress', (exercise) => {
    const d = quick(exercise, 'in-progress');
    expect(d.isQuickLaunch && d.action).toBe('resume');
  });

  it.each(['breathe', 'ground'] as const)('%s restarts when finished', (exercise) => {
    const d = quick(exercise, 'finished');
    expect(d.isQuickLaunch && d.action).toBe('restart');
  });

  it.each(['breathe', 'ground'] as const)('%s restarts when never begun', (exercise) => {
    const d = quick(exercise, 'not-started');
    expect(d.isQuickLaunch && d.action).toBe('restart');
  });

  it('treats unknown Exercise state as never begun', () => {
    const d = decideQuickLaunch({ route: '/ground', params: { autostart: '1' } });
    expect(d.isQuickLaunch && d.action).toBe('restart');
  });
});

describe('decideQuickLaunch — Breathe lead-in', () => {
  it('runs the lead-in for a Quick-Launched Breathe that restarts', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' }, exerciseState: 'not-started' });
    expect(d.isQuickLaunch && d.leadIn).toBe(true);
  });

  it('skips the lead-in when resuming a Breathe already in progress', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' }, exerciseState: 'in-progress' });
    expect(d.isQuickLaunch && d.leadIn).toBe(false);
  });

  it('never runs the lead-in for Grounding', () => {
    const d = decideQuickLaunch({ route: '/ground', params: { autostart: '1' }, exerciseState: 'not-started' });
    expect(d.isQuickLaunch && d.leadIn).toBe(false);
  });
});

describe('decideQuickLaunch — splash', () => {
  it.each(['/breathe', '/ground'])('skips the splash on a Quick Launch into %s', (route) => {
    expect(decideQuickLaunch({ route, params: { autostart: '1' } }).skipSplash).toBe(true);
  });

  it('keeps the splash on a normal launch into Today', () => {
    expect(decideQuickLaunch({ route: '/', params: {} }).skipSplash).toBe(false);
  });
});

describe('decideQuickLaunch — Onboarding', () => {
  it('puts Onboarding off when it has not been seen', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' }, hasSeenOnboarding: false });
    expect(d.postponeOnboarding).toBe(true);
  });

  it('leaves Onboarding alone when it has already been seen', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' }, hasSeenOnboarding: true });
    expect(d.postponeOnboarding).toBe(false);
  });

  it('does not put Onboarding off when its state is unknown', () => {
    const d = decideQuickLaunch({ route: '/breathe', params: { autostart: '1' } });
    expect(d.postponeOnboarding).toBe(false);
  });
});

describe('decideQuickLaunch — malformed params fall back to normal', () => {
  it.each<[string, Record<string, string | string[] | undefined>]>([
    ['/breathe', { autostart: '0' }],
    ['/breathe', { autostart: 'true' }],
    ['/breathe', { autostart: '' }],
    ['/breathe', { autostart: ['1', '1'] }],
    ['/breathe', { autostart: undefined }],
    ['/journal', { autostart: '1' }],
    ['/crisis', { autostart: '1' }],
    ['/breathe/extra', { autostart: '1' }],
    ['', { autostart: '1' }],
  ])('%s %j is not a Quick Launch', (route, params) => {
    const d = decideQuickLaunch({ route, params, hasSeenOnboarding: false });
    expect(d.isQuickLaunch).toBe(false);
    expect(d.skipSplash).toBe(false);
    expect(d.postponeOnboarding).toBe(false);
  });

  it('handles a null route', () => {
    expect(decideQuickLaunch({ route: null, params: { autostart: '1' } }).isQuickLaunch).toBe(false);
  });
});
