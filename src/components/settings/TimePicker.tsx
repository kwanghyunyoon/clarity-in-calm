import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

// Displayed clock positions, 12 first so the row reads 12,1,2… like a clock.
const CLOCK_HOURS = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)];
const MINUTES = [0, 15, 30, 45];

/** 24h hour -> the 12h face number and its period. */
function to12h(h24: number): { h12: number; isPm: boolean } {
  return { h12: h24 % 12 === 0 ? 12 : h24 % 12, isPm: h24 >= 12 };
}

/** 12h face number + period -> the 24h hour we persist. */
function to24h(h12: number, isPm: boolean): number {
  return (h12 % 12) + (isPm ? 12 : 0);
}

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

  const [h12, setH12] = useState(() => to12h(hour).h12);
  const [isPm, setIsPm] = useState(() => to12h(hour).isPm);
  const [m, setM] = useState(minute);

  // The Modal stays mounted between opens, so useState's initial value only
  // ever applies once. Resync on each open, otherwise cancelling a change and
  // reopening shows the discarded value instead of the saved one.
  useEffect(() => {
    if (visible) {
      const { h12: nextH, isPm: nextPm } = to12h(hour);
      setH12(nextH);
      setIsPm(nextPm);
      setM(minute);
    }
  }, [visible, hour, minute]);

  const period = isPm ? tt.pm : tt.am;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.textSecondary }]}>{tt.title}</Text>

          {/* Hero: the pending value, as the focal point of the sheet. */}
          <Text style={[styles.hero, { color: colors.text, fontFamily: Fonts?.displaySans }]}>
            {String(h12).padStart(2, '0')}:{String(m).padStart(2, '0')}
            <Text style={[styles.heroPeriod, { color: colors.textSecondary }]}> {period}</Text>
          </Text>

          {/* AM / PM segmented control */}
          <View style={[styles.segment, { backgroundColor: colors.primary + '14' }]}>
            {[false, true].map(pm => {
              const selected = pm === isPm;
              return (
                <TouchableOpacity
                  key={String(pm)}
                  onPress={() => setIsPm(pm)}
                  style={[styles.segmentItem, selected && { backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: selected ? '#fff' : colors.textSecondary },
                    ]}
                  >
                    {pm ? tt.pm : tt.am}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Hour face: borderless, a soft filled pill marks the selection. */}
          <View style={styles.grid}>
            {CLOCK_HOURS.map(hh => {
              const selected = hh === h12;
              return (
                <TouchableOpacity
                  key={hh}
                  onPress={() => setH12(hh)}
                  style={styles.cell}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${tt.hourLabel} ${hh} ${period}`}
                >
                  <View style={[styles.cellPill, selected && { backgroundColor: colors.primary }]}>
                    <Text
                      style={[
                        styles.cellText,
                        { color: selected ? '#fff' : colors.text },
                        selected && styles.cellTextSelected,
                      ]}
                    >
                      {hh}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Minute segmented control */}
          <View style={[styles.segment, { backgroundColor: colors.primary + '14' }]}>
            {MINUTES.map(mm => {
              const selected = mm === m;
              return (
                <TouchableOpacity
                  key={mm}
                  onPress={() => setM(mm)}
                  style={[styles.segmentItem, selected && { backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${tt.minuteLabel} ${mm}`}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: selected ? '#fff' : colors.textSecondary },
                    ]}
                  >
                    :{String(mm).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.primary }]}
            onPress={() => onConfirm(to24h(h12, isPm), m)}
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
  title: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center' },
  hero: { fontSize: 44, fontWeight: '300', letterSpacing: -1.5, textAlign: 'center' },
  heroPeriod: { fontSize: 18, fontWeight: '600', letterSpacing: 0 },
  segment: { flexDirection: 'row', borderRadius: BorderRadius.pill, padding: 3, gap: 3 },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: BorderRadius.pill, alignItems: 'center' },
  segmentText: { fontSize: 14, fontWeight: '600' },
  // Percentage widths pin this to exactly 6 columns, so the 12 hours read as
  // two even rows (12-5, 6-11) at any screen width. A fixed cell width instead
  // lets wrapping vary with the sheet, which breaks the clock-like reading.
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: Spacing.one },
  cell: { width: '16.6666%', alignItems: 'center' },
  cellPill: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  cellText: { fontSize: 17, fontWeight: '500' },
  cellTextSelected: { fontWeight: '700' },
  btn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center', marginTop: Spacing.one },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: Spacing.two },
  cancelText: { fontSize: 14 },
});
