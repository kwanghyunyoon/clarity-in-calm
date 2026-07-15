/**
 * LanguagePill — floating top-left pill shown on every screen except Settings
 * (which already has its own language section). Tapping opens a dropdown of
 * the four languages, each written in its own language.
 */

import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LANGUAGES } from '@/constants/languages';
import { Spacing } from '@/constants/theme';
import { useLocale } from '@/context/language-context';
import { useTheme } from '@/hooks/use-theme';

export function LanguagePill() {
  const { colors } = useTheme();
  const { locale, setLocale } = useLocale();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith('/settings')) return null;

  const current = LANGUAGES.find((l) => l.locale === locale) ?? LANGUAGES[0];

  return (
    <>
      <TouchableOpacity
        style={[
          styles.pill,
          { top: insets.top + Spacing.one, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        accessibilityLabel="Change language"
      >
        <Text style={styles.flag}>{current.flag}</Text>
        <Text style={[styles.code, { color: colors.text }]}>{current.locale.toUpperCase()}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.dropdown,
              { top: insets.top + Spacing.one + 44, backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {LANGUAGES.map((lang) => {
              const active = lang.locale === locale;
              return (
                <TouchableOpacity
                  key={lang.locale}
                  style={[styles.row, active && { backgroundColor: colors.backgroundElement }]}
                  onPress={() => { setLocale(lang.locale); setOpen(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={styles.rowFlag}>{lang.flag}</Text>
                  <Text style={[styles.rowLabel, { color: colors.text }, active && { fontWeight: '700' }]}>
                    {lang.nativeName}
                  </Text>
                  {active && <Text style={[styles.check, { color: colors.primary }]}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    position: 'absolute',
    left: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.two,
    paddingVertical: 6,
    zIndex: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  flag: { fontSize: 14 },
  code: { fontSize: 12, fontWeight: '700' },

  backdrop: { flex: 1 },
  dropdown: {
    position: 'absolute',
    left: Spacing.two,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 6,
    minWidth: 160,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.two + 4,
    paddingVertical: Spacing.two,
  },
  rowFlag: { fontSize: 16 },
  rowLabel: { fontSize: 14, flex: 1 },
  check: { fontSize: 14, fontWeight: '700' },
});
