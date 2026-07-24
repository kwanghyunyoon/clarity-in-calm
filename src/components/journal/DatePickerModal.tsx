import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

export function DatePickerModal({ visible, onClose, onConfirm }: DatePickerModalProps) {
  const { colors } = useTheme();
  const today = new Date();
  const minYear = today.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => minYear + i);

  const [selYear, setSelYear] = useState(minYear);
  const [selMonth, setSelMonth] = useState(today.getMonth());
  const [selDay, setSelDay] = useState(today.getDate() + 1 > 28 ? 1 : today.getDate() + 1);

  const daysInMonth = new Date(selYear, selMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Keep selDay in range when month/year changes
  const safeDay = Math.min(selDay, daysInMonth);

  function handleConfirm() {
    const d = new Date(selYear, selMonth, safeDay, 12, 0, 0);
    if (d <= today) return; // must be future
    onConfirm(d);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.text }]}>Set unlock date</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Letter will be hidden until this date
          </Text>
          <View style={styles.pickerRow}>
            {/* Month */}
            <ScrollView style={styles.col} showsVerticalScrollIndicator={false}>
              {MONTHS.map((m, idx) => (
                <TouchableOpacity key={m} onPress={() => setSelMonth(idx)} style={styles.item}>
                  <Text style={[styles.itemText, { color: idx === selMonth ? colors.primary : colors.textSecondary },
                    idx === selMonth && styles.itemSelected]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Day */}
            <ScrollView style={styles.col} showsVerticalScrollIndicator={false}>
              {days.map(d => (
                <TouchableOpacity key={d} onPress={() => setSelDay(d)} style={styles.item}>
                  <Text style={[styles.itemText, { color: d === safeDay ? colors.primary : colors.textSecondary },
                    d === safeDay && styles.itemSelected]}>
                    {String(d).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Year */}
            <ScrollView style={styles.col} showsVerticalScrollIndicator={false}>
              {years.map(y => (
                <TouchableOpacity key={y} onPress={() => setSelYear(y)} style={styles.item}>
                  <Text style={[styles.itemText, { color: y === selYear ? colors.primary : colors.textSecondary },
                    y === selYear && styles.itemSelected]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={handleConfirm}
          >
            <Text style={styles.btnText}>Set date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cancel}>
            <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay:    { flex: 1, justifyContent: 'flex-end' },
  backdrop:   { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet:      { borderTopLeftRadius: 24, borderTopRightRadius: 24,
                padding: Spacing.four, paddingBottom: Spacing.four + 16, gap: Spacing.two },
  title:      { fontSize: 20, fontWeight: '800' },
  subtitle:   { fontSize: 13, fontWeight: '500' },
  pickerRow:  { flexDirection: 'row', gap: Spacing.two, height: 180 },
  col:        { flex: 1 },
  item:       { paddingVertical: Spacing.two, alignItems: 'center' },
  itemText:   { fontSize: 16, fontWeight: '500' },
  itemSelected: { fontWeight: '700' as const },
  btn:        { borderRadius: 50, paddingVertical: Spacing.two + 6,
                alignItems: 'center', marginTop: Spacing.two },
  btnText:    { fontSize: 16, fontWeight: '700', color: '#fff' },
  cancel:     { alignItems: 'center', paddingVertical: Spacing.two },
  cancelText: { fontSize: 15, fontWeight: '500' },
});
