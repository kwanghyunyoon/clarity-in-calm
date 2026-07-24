import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

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

  const HOURS = Array.from({ length: 24 }, (_, i) => i);
  const MINUTES = [0, 15, 30, 45];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>{tt.title}</Text>

          <View style={styles.row}>
            {/* Hour picker */}
            <View style={styles.col}>
              <Text style={[styles.colLabel, { color: colors.textSecondary }]}>{tt.hourLabel}</Text>
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {HOURS.map(hh => (
                  <TouchableOpacity
                    key={hh}
                    onPress={() => setH(hh)}
                    style={[styles.item, hh === h && { backgroundColor: colors.primary + '22' }]}
                  >
                    <Text style={[styles.itemText, { color: hh === h ? colors.primary : colors.text }]}>
                      {String(hh).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <Text style={[styles.colon, { color: colors.text }]}>:</Text>

            {/* Minute picker */}
            <View style={styles.col}>
              <Text style={[styles.colLabel, { color: colors.textSecondary }]}>{tt.minuteLabel}</Text>
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {MINUTES.map(mm => (
                  <TouchableOpacity
                    key={mm}
                    onPress={() => setM(mm)}
                    style={[styles.item, mm === m && { backgroundColor: colors.primary + '22' }]}
                  >
                    <Text style={[styles.itemText, { color: mm === m ? colors.primary : colors.text }]}>
                      {String(mm).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.four },
  col: { alignItems: 'center', gap: Spacing.two },
  colLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.5 },
  scroll: { height: 180 },
  item: { paddingVertical: 10, paddingHorizontal: Spacing.three, borderRadius: BorderRadius.md, minWidth: 56, alignItems: 'center' },
  itemText: { fontSize: 18, fontWeight: '600' },
  colon: { fontSize: 24, fontWeight: '700', marginTop: 28 },
  btn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: Spacing.two },
  cancelText: { fontSize: 14 },
});
