import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text } from 'react-native';

import { JournalComposer } from '@/components/journal/JournalComposer';
import { JournalEntryList } from '@/components/journal/JournalEntryList';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

export default function JournalScreen() {
  const { colors } = useTheme();
  const t = useTranslation();

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t.journal.title}</Text>
        </ScreenHeader>

        <JournalEntryList header={<JournalComposer />} />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginLeft: Spacing.six },
});
