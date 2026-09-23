/**
 * App shortcuts (#82): the config plugin writes two static Android shortcuts,
 * Breathe and Grounding, each firing its Quick Launch link, labelled in the
 * device language by reusing the existing Breathe/Grounding title translations.
 */
import { buildAppShortcuts } from '../plugins/app-shortcuts';
import { TRANSLATIONS } from '@/i18n/translations';

const out = buildAppShortcuts({ scheme: 'clarityincalm', packageName: 'com.clarityincalm.app' });

/** The <shortcut> element for one shortcut id. */
function shortcut(id: string): string {
  const m = out.shortcutsXml.match(new RegExp(`<shortcut\\b[^>]*android:shortcutId="${id}"[\\s\\S]*?</shortcut>`));
  if (!m) throw new Error(`no shortcut "${id}"`);
  return m[0];
}

describe('buildAppShortcuts — shortcuts', () => {
  it('contains exactly the Breathe and Grounding shortcuts', () => {
    const ids = [...out.shortcutsXml.matchAll(/android:shortcutId="([^"]+)"/g)].map(m => m[1]);
    expect(ids).toEqual(['breathe', 'ground']);
  });

  it.each([
    ['breathe', 'clarityincalm://breathe?autostart=1'],
    ['ground', 'clarityincalm://ground?autostart=1'],
  ])('%s points at exactly its Quick Launch link', (id, link) => {
    const data = [...shortcut(id).matchAll(/android:data="([^"]+)"/g)].map(m => m[1]);
    expect(data).toEqual([link]);
  });

  // Launchers start shortcuts with NEW_TASK|CLEAR_TASK. Aimed at MainActivity,
  // that recreates it over the live JS runtime: the app got stuck on the splash
  // and would lose unsaved journal text. The trampoline takes that hit instead.
  it.each(['breathe', 'ground'])('%s opens the Quick Launch trampoline, not MainActivity', (id) => {
    const s = shortcut(id);
    expect(s).toContain('android:action="android.intent.action.VIEW"');
    expect(s).toContain('android:targetPackage="com.clarityincalm.app"');
    expect(s).toContain('android:targetClass="com.clarityincalm.app.QuickLaunchActivity"');
  });

  it.each(['breathe', 'ground'])('%s labels come from string resources', (id) => {
    expect(shortcut(id)).toContain(`android:shortcutShortLabel="@string/shortcut_${id}"`);
  });
});

describe('buildAppShortcuts — Quick Launch trampoline', () => {
  it('lives in its own task so the launcher’s CLEAR_TASK never touches the app’s task', () => {
    expect(out.trampoline.manifest).toMatchObject({
      'android:name': '.QuickLaunchActivity',
      'android:taskAffinity': '',
      'android:excludeFromRecents': 'true',
      'android:noHistory': 'true',
    });
  });

  it('forwards the link to MainActivity with NEW_TASK only, so the running app is reused', () => {
    const kt = out.trampoline.kotlin;
    expect(kt).toMatch(/^package com\.clarityincalm\.app$/m);
    expect(kt).toContain('MainActivity::class.java');
    expect(kt).toContain('Intent.FLAG_ACTIVITY_NEW_TASK');
    expect(kt).not.toContain('CLEAR_TASK');
    expect(kt).toContain('finish()');
  });

  it('only forwards the app’s own scheme', () => {
    expect(out.trampoline.kotlin).toContain('"clarityincalm"');
  });
});

describe('buildAppShortcuts — labels', () => {
  it('writes a strings file for the default (en) and each of ko, es, hi', () => {
    expect(Object.keys(out.strings).sort()).toEqual(['values', 'values-es', 'values-hi', 'values-ko']);
  });

  it.each([
    ['values', 'en'],
    ['values-ko', 'ko'],
    ['values-es', 'es'],
    ['values-hi', 'hi'],
  ] as const)('%s reuses the %s Breathe/Grounding titles', (dir, locale) => {
    expect(out.strings[dir]).toContain(`<string name="shortcut_breathe">${TRANSLATIONS[locale].breathe.title}</string>`);
    expect(out.strings[dir]).toContain(`<string name="shortcut_ground">${TRANSLATIONS[locale].ground.title}</string>`);
  });
});
