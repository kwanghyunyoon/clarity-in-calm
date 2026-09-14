import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 15, 30, 45];

export function TimePicker({
  visible,
  hour,
  minute,
  onConfirm,
  onClose,
}: {
  visible: boolean;
  hour: number;
  minute: number;
  onConfirm: (h: number, m: number) => void;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const tt = useTranslation().settingsScreen.timePicker;
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);

  // The Modal stays mounted between opens, so useState's initial value only
  // ever applies once. Resync on each open, otherwise cancelling a change and
  // reopening shows the discarded value instead of the saved one.
  useEffect(() => {
    if (visible) {
      setH(hour);
      setM(minute);
    }
  }, [visible, hour, minute]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{tt.title}</Text>

          <View style={styles.group}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{tt.hourLabel}</Text>
            <View style={styles.grid}>
              {HOURS.map(hh => {
                const selected = hh === h;
                return (
                  <TouchableOpacity
                    key={hh}
                    onPress={() => setH(hh)}
                    style={[
                      styles.cell,
                      { borderColor: colors.border },
                      selected && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${tt.hourLabel} ${String(hh).padStart(2, '0')}`}
                  >
                    <Text style={[styles.cellText, { color: selected ? '#fff' : colors.text }]}>
                      {String(hh).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.group}>
            <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>{tt.minuteLabel}</Text>
            <View style={styles.grid}>
              {MINUTES.map(mm => {
                const selected = mm === m;
                return (
                  <TouchableOpacity
                    key={mm}
                    onPress={() => setM(mm)}
                    style={[
                      styles.cell,
                      { borderColor: colors.border },
                      selected && { backgroundColor: colors.primary, borderColor: colors.primary },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${tt.minuteLabel} ${String(mm).padStart(2, '0')}`}
                  >
                    <Text style={[styles.cellText, { color: selected ? '#fff' : colors.text }]}>
                      {String(mm).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <Text style={[styles.preview, { color: colors.textSecondary }]}>
            {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}
          </Text>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={() => onConfirm(h, m)}
          >
            <Text style={styles.btnText}>{tt.confirm}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>{tt.cancel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.four },
  sheet: { borderRadius: BorderRadius.xl, padding: Spacing.four, gap: Spacing.three },
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  group: { gap: Spacing.two },
  groupLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  // Wraps to as many columns as the sheet fits, so narrow phones reflow
  // instead of overflowing.
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  cell: {
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: Spacing.two,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  cellText: { fontSize: 16, fontWeight: '600' },
  preview: { fontSize: 14, textAlign: 'center', fontWeight: '600' },
  btn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: Spacing.two },
  cancelText: { fontSize: 14 },
});
