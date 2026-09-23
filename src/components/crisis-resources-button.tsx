/**
 * CrisisResourcesButton — floating top-right icon shown on every tab.
 * Tapping it opens the same crisis-line content the journal's reactive
 * concern modal shows (src/i18n/translations.ts journal.crisis), but as a
 * standalone, always-available entry point rather than one triggered by
 * detected language.
 */

import { Ionicons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CrisisResourceLines } from '@/components/crisis-resource-lines';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export function CrisisResourcesButton() {
  const { colors } = useTheme();
  const t = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The breathing/grounding exercises already own the top-right corner with
  // their own Safe Exit button; avoid stacking a second control there.
  if (pathname.startsWith('/breathe') || pathname.startsWith('/ground')) return null;

  const crisis = t.journal.crisis;
  const resources = t.crisisResources;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          { top: insets.top + Spacing.one, backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={resources.navLabel}
      >
        <Ionicons name="help-buoy-outline" size={20} color={colors.text} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <ScrollView contentContainerStyle={styles.sheetContent}>
              <Text style={[styles.title, { color: colors.text }]}>{crisis.title}</Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>{crisis.body}</Text>
              <CrisisResourceLines lines={crisis.lines} colors={colors} />
              <TouchableOpacity
                style={[styles.closeBtn, { backgroundColor: colors.primary }]}
                onPress={() => setOpen(false)}
              >
                <Text style={styles.closeBtnText}>{resources.closeBtn}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: Spacing.two,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: Spacing.four,
  },
  sheet: {
    borderRadius: BorderRadius.xl,
    maxHeight: '85%',
  },
  sheetContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  body: { fontSize: 15, lineHeight: 22 },
  closeBtn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
