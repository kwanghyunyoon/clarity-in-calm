import React from 'react';
import { StyleSheet, View } from 'react-native';

import { BorderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function SettingsGroup({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.group, { borderColor: colors.border }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
