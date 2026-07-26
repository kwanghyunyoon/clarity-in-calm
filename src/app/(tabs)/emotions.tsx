import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BodyCheckIn } from '@/components/emotions/BodyCheckIn';
import { CopingActionsSelector } from '@/components/emotions/CopingActionsSelector';
import { ContextTagSelector } from '@/components/emotions/ContextTagSelector';
import { EmotionPillSelector, SelectedEmotion } from '@/components/emotions/EmotionPillSelector';
import { IntensitySlider } from '@/components/emotions/IntensitySlider';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { BASIC_EMOTIONS_BY_ID } from '@/constants/emotions';
import { BorderRadius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useEmotions } from '@/context/emotion-context';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function EmotionsScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const te = t.emotionsScreen;
  const insets = useSafeAreaInsets();
  const { emotionLogs, addEmotionLog, deleteEmotionLog } = useEmotions();
  const { customTags } = useWellness();

  const [selectedEmotion, setSelectedEmotion] = useState<SelectedEmotion | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [contextTags, setContextTags] = useState<string[]>([]);
  const [bodyRegions, setBodyRegions] = useState<string[]>([]);
  const [copingActions, setCopingActions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const accentColor = selectedEmotion?.color ?? colors.primary;
  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  function toggleTag(tag: string) {
    setContextTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function toggleBodyRegion(id: string) {
    setBodyRegions(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  }

  function toggleCopingAction(id: string) {
    setCopingActions(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  function handleSave() {
    if (!selectedEmotion) return;
    addEmotionLog({
      emotionId: selectedEmotion.id,
      emotionLabel: selectedEmotion.label,
      primaryEmotion: selectedEmotion.id,
      intensity,
      contextTags,
      bodyRegions,
      copingActions,
      note: note.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedEmotion(null);
      setIntensity(5);
      setContextTags([]);
      setBodyRegions([]);
      setCopingActions([]);
      setNote('');
    }, 1500);
  }

  function handleDelete(id: string) {
    Alert.alert(
      te.deleteConfirm.title,
      te.deleteConfirm.body,
      [
        { text: te.deleteConfirm.cancel, style: 'cancel' },
        { text: te.deleteConfirm.confirm, style: 'destructive', onPress: () => deleteEmotionLog(id) },
      ],
    );
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader>
          <View style={{ marginLeft: Spacing.six }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>{te.title}</Text>
            <Text style={[styles.headerSub, { color: colors.textSecondary }]}>{te.subtitle}</Text>
          </View>
        </ScreenHeader>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Wheel ── */}
          <Animated.View entering={FadeInDown.delay(50).springify()} style={styles.wheelSection}>
            {!selectedEmotion && (
              <Text style={[styles.wheelPrompt, { color: colors.textSecondary }]}>
                {te.selectEmotion}
              </Text>
            )}
            {selectedEmotion && (
              <Animated.View entering={FadeInUp.springify()} style={[styles.selectedBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
                <Text style={[styles.selectedLabel, { color: accentColor }]}>
                  {selectedEmotion.label}
                </Text>
                <TouchableOpacity onPress={() => setSelectedEmotion(null)} accessibilityLabel="Clear selected emotion" accessibilityRole="button">
                  <Ionicons name="close" size={14} color={colors.textSecondary} />
                </TouchableOpacity>
              </Animated.View>
            )}
            <EmotionPillSelector
              selected={selectedEmotion}
              onSelect={setSelectedEmotion}
              otherLabel={te.otherPill}
              customPlaceholder={te.customPlaceholder}
            />
          </Animated.View>
  
          {/* ── Intensity ── */}
          {selectedEmotion && (
            <Animated.View entering={SlideInDown.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.intensity}</Text>
              <IntensitySlider
                value={intensity}
                onChange={setIntensity}
                color={accentColor}
                lowLabel={te.intensityLow}
                highLabel={te.intensityHigh}
              />
            </Animated.View>
          )}
  
          {/* ── Context tags ── */}
          {selectedEmotion && (
            <Animated.View entering={SlideInDown.delay(60).springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.contextTags}</Text>
              <ContextTagSelector
                selected={contextTags}
                onToggle={toggleTag}
                customTags={customTags}
              />
            </Animated.View>
          )}
  
          {/* ── Body check-in ── */}
          {selectedEmotion && (
            <Animated.View entering={SlideInDown.delay(90).springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.bodyCheckIn}</Text>
              <BodyCheckIn
                selected={bodyRegions}
                onToggle={toggleBodyRegion}
                accentColor={accentColor}
              />
            </Animated.View>
          )}
  
          {/* ── Coping actions ── */}
          {selectedEmotion && (
            <Animated.View entering={SlideInDown.delay(120).springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.copingActions}</Text>
              <CopingActionsSelector
                selected={copingActions}
                onToggle={toggleCopingAction}
              />
            </Animated.View>
          )}
  
          {/* ── Note ── */}
          {selectedEmotion && (
            <Animated.View entering={SlideInDown.delay(150).springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.note}</Text>
              <TextInput
                style={[styles.noteInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundElement }]}
                placeholder={te.notePlaceholder}
                placeholderTextColor={colors.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </Animated.View>
          )}
  
          {/* ── Save button ── */}
          {selectedEmotion && (
            <Animated.View entering={FadeInDown.delay(180).springify()}>
              <AnimatedPressable
                onPress={handleSave}
                disabled={saved}
                style={[styles.saveBtn, { backgroundColor: saved ? colors.accent : accentColor }]}
                accessibilityRole="button"
                accessibilityLabel={saved ? te.savedBtn : te.saveBtn}
              >
                <Text style={styles.saveBtnText}>{saved ? te.savedBtn : te.saveBtn}</Text>
              </AnimatedPressable>
            </Animated.View>
          )}
  
          {/* ── Past logs ── */}
          {emotionLogs.length > 0 && (
            <View style={styles.pastSection}>
              <Text style={[styles.pastTitle, { color: colors.textSecondary }]}>{te.pastTitle}</Text>
              {emotionLogs.slice(0, 20).map((log, i) => {
                const emotion = BASIC_EMOTIONS_BY_ID[log.emotionId];
                const color = emotion?.color ?? colors.primary;
                return (
                  <Animated.View
                    key={log.id}
                    entering={FadeInDown.delay(i * 40).springify()}
                    style={[styles.logCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <View style={[styles.logColorBar, { backgroundColor: color }]} />
                    <View style={styles.logBody}>
                      <View style={styles.logHeader}>
                        <Text style={[styles.logEmotion, { color }]}>{log.emotionLabel}</Text>
                        <Text style={[styles.logIntensity, { color: colors.textSecondary }]}>·{log.intensity}/10</Text>
                        <View style={styles.logMeta}>
                          <Text style={[styles.logTime, { color: colors.textSecondary }]}>
                            {formatDate(log.date)} {formatTime(log.date)}
                          </Text>
                        </View>
                      </View>
                      {log.contextTags.length > 0 && (
                        <View style={styles.tagRow}>
                          {log.contextTags.slice(0, 4).map(tag => (
                            <View key={tag} style={[styles.miniChip, { backgroundColor: color + '18' }]}>
                              <Text style={[styles.miniChipText, { color }]}>{tag}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {log.note ? (
                        <Text style={[styles.logNote, { color: colors.textSecondary }]} numberOfLines={2}>
                          {log.note}
                        </Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDelete(log.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Delete emotion log"
                      accessibilityRole="button"
                    >
                      <Ionicons name="close" size={16} color={colors.textSecondary} style={styles.deleteBtn} />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}
  
          {/* ── Empty state ── */}
          {emotionLogs.length === 0 && !selectedEmotion && (
            <View style={styles.emptyState}>
              <Ionicons name="sync-outline" size={40} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{te.emptyTitle}</Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>{te.emptyBody}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  headerSub: { fontSize: 14, marginTop: 2 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  wheelSection: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  wheelPrompt: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  selectedLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two + 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  noteInput: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.three,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  saveBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  pastSection: { gap: Spacing.two },
  pastTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  logCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  logColorBar: { width: 4, alignSelf: 'stretch' },
  logBody: { flex: 1, padding: Spacing.three, gap: Spacing.one + 2 },
  logHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one + 2, flexWrap: 'wrap' },
  logEmotion: { fontSize: 15, fontWeight: '700' },
  logIntensity: { fontSize: 13 },
  logMeta: { flex: 1, alignItems: 'flex-end' },
  logTime: { fontSize: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  miniChip: {
    borderRadius: BorderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  miniChipText: { fontSize: 11, fontWeight: '500' },
  logNote: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  deleteBtn: { padding: Spacing.three },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
