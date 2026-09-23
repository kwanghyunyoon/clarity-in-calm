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

  it.each(['breathe', 'ground'])('%s opens the app’s own MainActivity', (id) => {
    const s = shortcut(id);
    expect(s).toContain('android:action="android.intent.action.VIEW"');
    expect(s).toContain('android:targetPackage="com.clarityincalm.app"');
    expect(s).toContain('android:targetClass="com.clarityincalm.app.MainActivity"');
  });

  it.each(['breathe', 'ground'])('%s labels come from string resources', (id) => {
    expect(shortcut(id)).toContain(`android:shortcutShortLabel="@string/shortcut_${id}"`);
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
