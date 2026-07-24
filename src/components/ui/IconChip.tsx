import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius } from '@/constants/theme';

interface Props {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
  chipSize?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Icon centered in a tinted, rounded chip. Tint derives from `color` at low alpha
 * via hex-alpha suffixing, so `color` must be a 6-digit hex string (not rgba()/named).
 */
export function IconChip({ name, color, size = 22, chipSize = 44, style }: Props) {
  return (
    <View
      style={[
        styles.chip,
        { width: chipSize, height: chipSize, backgroundColor: color + '22' },
        style,
      ]}
    >
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
