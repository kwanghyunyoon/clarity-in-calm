/**
 * Shared rendering for a crisis-resource line list (988, Crisis Text Line,
 * per-language equivalents — see src/i18n/translations.ts journal.crisis).
 * Used by both the reactive journal concern modal and the persistent
 * crisis-resources nav button so the two stay visually and behaviorally
 * identical.
 */

import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';

export interface CrisisLine {
  emoji: string;
  title: string;
  sub: string;
  action: string;
}

export async function openCrisisResourceUrl(rawUrl: string) {
  let url = rawUrl;
  if (Platform.OS === 'android' && url.startsWith('sms:') && url.includes('?')) {
    url = url.split('?')[0];
  }
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Cannot open', url);
  }
}

export function CrisisResourceLines({
  lines,
  colors,
}: {
  lines: readonly CrisisLine[];
  colors: { text: string; textSecondary: string; backgroundElement: string; border: string };
}) {
  return (
    <>
      {lines.map((line) => (
        <TouchableOpacity
          key={line.title}
          style={[styles.line, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
          onPress={() => openCrisisResourceUrl(line.action)}
        >
          <Text style={styles.emoji}>{line.emoji}</Text>
          <View style={styles.lineText}>
            <Text style={[styles.lineTitle, { color: colors.text }]}>{line.title}</Text>
            <Text style={[styles.lineSub, { color: colors.textSecondary }]}>{line.sub}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  emoji: { fontSize: 24 },
  lineText: { flex: 1 },
  lineTitle: { fontSize: 15, fontWeight: '600' },
  lineSub: { fontSize: 13, marginTop: 2 },
});
