/**
 * App shortcuts Launch point (#82): long-press the app icon for "Breathe" and
 * "Grounding", each firing its Quick Launch link (see src/lib/quick-launch.ts).
 *
 * Static shortcuts (res/xml/shortcuts.xml), not dynamic ones, so they exist
 * straight after install and the launcher can pin them to the home screen.
 * Labels follow the device language via per-locale string resources, reusing
 * the Breathe/Grounding title translations. Android-only.
 *
 * Loaded through tsx (see app.config.js) so it can import the app's TS modules.
 */
/// <reference types="node" />
import fs from 'fs';
import path from 'path';
import { AndroidConfig, withAndroidManifest, withDangerousMod, type ConfigPlugin } from 'expo/config-plugins';

import { TRANSLATIONS, type Locale } from '../src/i18n/translations';
import { quickLaunchLink, type ExerciseId } from '../src/lib/quick-launch';

const SHORTCUTS: readonly ExerciseId[] = ['breathe', 'ground'];

/** Resource dir per locale; en is the default `values`. */
const LOCALE_DIRS: Record<Locale, string> = {
  en: 'values',
  ko: 'values-ko',
  es: 'values-es',
  hi: 'values-hi',
};

const SHORTCUTS_RESOURCE = 'shortcuts';
const STRINGS_FILE = 'app_shortcuts_strings.xml';

function escapeXmlAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Android string resources also treat ' and " as special. */
function escapeStringResource(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function label(locale: Locale, id: ExerciseId): string {
  return id === 'breathe' ? TRANSLATIONS[locale].breathe.title : TRANSLATIONS[locale].ground.title;
}

export interface AppShortcutsOutput {
  /** Contents of res/xml/shortcuts.xml. */
  shortcutsXml: string;
  /** Strings file contents keyed by resource dir (`values`, `values-ko`, …). */
  strings: Record<string, string>;
}

/** Pure generator for the shortcut and label resources. */
export function buildAppShortcuts({ scheme, packageName }: { scheme: string; packageName: string }): AppShortcutsOutput {
  const entries = SHORTCUTS.map(id => `  <shortcut
    android:shortcutId="${id}"
    android:enabled="true"
    android:icon="@mipmap/ic_launcher"
    android:shortcutShortLabel="@string/shortcut_${id}">
    <intent
      android:action="android.intent.action.VIEW"
      android:data="${escapeXmlAttr(quickLaunchLink(scheme, id))}"
      android:targetPackage="${packageName}"
      android:targetClass="${packageName}.MainActivity" />
  </shortcut>`);

  const shortcutsXml = `<?xml version="1.0" encoding="utf-8"?>
<shortcuts xmlns:android="http://schemas.android.com/apk/res/android">
${entries.join('\n')}
</shortcuts>
`;

  const strings: Record<string, string> = {};
  for (const locale of Object.keys(LOCALE_DIRS) as Locale[]) {
    const lines = SHORTCUTS.map(id => `  <string name="shortcut_${id}">${escapeStringResource(label(locale, id))}</string>`);
    strings[LOCALE_DIRS[locale]] = `<?xml version="1.0" encoding="utf-8"?>
<resources>
${lines.join('\n')}
</resources>
`;
  }

  return { shortcutsXml, strings };
}

const withAppShortcuts: ConfigPlugin = config => {
  const scheme = Array.isArray(config.scheme) ? config.scheme[0] : config.scheme;
  const packageName = config.android?.package;
  if (!scheme || !packageName) {
    throw new Error('app-shortcuts plugin needs `scheme` and `android.package` in the app config');
  }

  config = withAndroidManifest(config, cfg => {
    // ManifestActivity's type omits meta-data, which activities do allow.
    const activity = AndroidConfig.Manifest.getMainActivityOrThrow(cfg.modResults) as AndroidConfig.Manifest.ManifestActivity & {
      'meta-data'?: AndroidConfig.Manifest.ManifestMetaData[];
    };
    const metaData = (activity['meta-data'] ??= []);
    if (!metaData.some(m => m.$['android:name'] === 'android.app.shortcuts')) {
      metaData.push({
        $: { 'android:name': 'android.app.shortcuts', 'android:resource': `@xml/${SHORTCUTS_RESOURCE}` },
      });
    }
    return cfg;
  });

  return withDangerousMod(config, [
    'android',
    cfg => {
      const res = path.join(cfg.modRequest.platformProjectRoot, 'app/src/main/res');
      const { shortcutsXml, strings } = buildAppShortcuts({ scheme, packageName });

      fs.mkdirSync(path.join(res, 'xml'), { recursive: true });
      fs.writeFileSync(path.join(res, 'xml', `${SHORTCUTS_RESOURCE}.xml`), shortcutsXml);
      for (const [dir, xml] of Object.entries(strings)) {
        fs.mkdirSync(path.join(res, dir), { recursive: true });
        fs.writeFileSync(path.join(res, dir, STRINGS_FILE), xml);
      }
      return cfg;
    },
  ]);
};

export default withAppShortcuts;
