import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import Animated, { FadeInDown, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BodyCheckIn } from '@/components/emotions/BodyCheckIn';
import { CopingActionsSelector } from '@/components/emotions/CopingActionsSelector';
import { ContextTagSelector } from '@/components/emotions/ContextTagSelector';
import { EmotionPillSelector, SelectedEmotion } from '@/components/emotions/EmotionPillSelector';
import { IntensitySlider } from '@/components/emotions/IntensitySlider';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { SpotlightRect, TourOverlay } from '@/components/tour/TourOverlay';
import { BASIC_EMOTIONS_BY_ID } from '@/constants/emotions';
import { BorderRadius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { EMOTIONS_TOUR } from '@/constants/tour-keys';
import { useWellness } from '@/context/wellness-context';
import { useScreenTour } from '@/hooks/use-screen-tour';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { ensureContrastText } from '@/lib/color-contrast';
import { canAdvance, EMOTION_LOG_STEPS, nextStepIndex, prevStepIndex } from '@/lib/emotion-log-steps';
import { filterEmotionEntries } from '@/lib/insights-analytics';
import { MoodValue } from '@/types';
import { measureWhenSettled } from '@/utils/measureWhenSettled';

// Only 'picker' has a real anchor visible before a selection is made — every
// other section (intensity/context/note/save) only mounts once the user
// picks an emotion, so instead of a run of anchorless centered-dialogue
// steps (one per section), they're collapsed into a single 'more' step.
const EMOTIONS_TOUR_STEP_IDS = ['picker', 'more'] as const;

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
  const { entries, addEntry, deleteEntry, customTags } = useWellness();
  const emotionEntries = useMemo(() => filterEmotionEntries(entries), [entries]);

  const [selectedEmotion, setSelectedEmotion] = useState<SelectedEmotion | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [contextTags, setContextTags] = useState<string[]>([]);
  const [bodyRegions, setBodyRegions] = useState<string[]>([]);
  const [copingActions, setCopingActions] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const step = EMOTION_LOG_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const canGoNext = canAdvance(step, !!selectedEmotion);

  const accentColor = selectedEmotion?.color ?? colors.primary;
  const accentTextColor = ensureContrastText(accentColor, colors.surface);
  const trimmedNote = note.trim();
  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  const pickerRef = useRef<View>(null);

  const { visible: tourVisible, step: tourStep, totalSteps: tourTotalSteps, next: tourNext, skip: tourSkip } = useScreenTour({
    tourId: EMOTIONS_TOUR.tourId,
    storageKey: EMOTIONS_TOUR.storageKey,
    stepIds: EMOTIONS_TOUR_STEP_IDS,
  });

  const [tourSpotlight, setTourSpotlight] = useState<SpotlightRect | null>(null);
  const [tourFocused, setTourFocused] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setTourFocused(true);
      return () => setTourFocused(false);
    }, []),
  );

  useEffect(() => {
    if (!tourVisible || tourStep.id !== 'picker') return;
    if (!pickerRef.current) {
      setTourSpotlight(null);
      return;
    }
    let stopped = false;
    const cancel = measureWhenSettled(
      (callback) => {
        const node = pickerRef.current;
        if (!node) {
          stopped = true;
          setTourSpotlight(null);
          return;
        }
        node.measureInWindow((x, y, width, height) => {
          if (stopped) return;
          callback({ x, y, width, height });
        });
      },
      // measureInWindow() on Android reports coordinates that exclude the
      // status-bar inset, while the tour overlay (a root-level portal) draws
      // in full edge-to-edge window space — so every anchor comes back
      // insets.top too high unless corrected here.
      (box) => setTourSpotlight({ ...box, y: box.y + insets.top }),
    );
    return () => { stopped = true; cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourVisible, tourStep.id]);

  const tourStepCopy = t.tour.emotions.steps[tourStep.index];

  const bodyRegionLabels = t.emotionsCatalog.bodyRegions as Record<string, string>;
  const copingActionLabels = t.emotionsCatalog.copingActions as Record<string, string>;

  function toggleTag(tag: string) {
    setContextTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  function toggleBodyRegion(id: string) {
    setBodyRegions(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  }

  function toggleCopingAction(id: string) {
    setCopingActions(prev => (prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]));
  }

  function handleNext() {
    if (!canAdvance(step, !!selectedEmotion)) return;
    setStepIndex(i => nextStepIndex(i));
  }

  function handleBack() {
    setStepIndex(i => prevStepIndex(i));
  }

  function handleSave() {
    if (!selectedEmotion) return;
    // Intensity (1-10) is UI-only precision — storage keeps mood (1-5), per
    // #66/#70's ceil(intensity / 2) mapping, so native and migrated entries
    // share one scale.
    const mood = Math.ceil(intensity / 2) as MoodValue;
    addEntry(mood, trimmedNote, {
      emotionId: selectedEmotion.id,
      emotionLabel: selectedEmotion.label,
      primaryEmotion: selectedEmotion.id,
      contextTags,
      bodyRegions,
      copingActions,
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
      setStepIndex(0);
    }, 1500);
  }

  function handleDelete(id: string) {
    Alert.alert(
      te.deleteConfirm.title,
      te.deleteConfirm.body,
      [
        { text: te.deleteConfirm.cancel, style: 'cancel' },
        { text: te.deleteConfirm.confirm, style: 'destructive', onPress: () => deleteEntry(id) },
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
          <View
            style={styles.progressRow}
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 1, max: EMOTION_LOG_STEPS.length, now: stepIndex + 1 }}
          >
            {EMOTION_LOG_STEPS.map((id, i) => (
              <View
                key={id}
                style={[
                  styles.progressDot,
                  { backgroundColor: i === stepIndex ? accentColor : colors.border },
                ]}
              />
            ))}
          </View>

          {/* ── Step: Emotion ── */}
          {step === 'emotion' && (
            <Animated.View entering={FadeInDown.springify()} style={styles.wheelSection} ref={pickerRef}>
              {!selectedEmotion && (
                <Text style={[styles.wheelPrompt, { color: colors.textSecondary }]}>
                  {te.selectEmotion}
                </Text>
              )}
              {selectedEmotion && (
                <Animated.View entering={FadeInUp.springify()} style={[styles.selectedBadge, { backgroundColor: accentColor + '22', borderColor: accentColor + '55' }]}>
                  <Text style={[styles.selectedLabel, { color: accentTextColor }]}>
                    {selectedEmotion.label}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedEmotion(null)}
                    accessibilityLabel="Clear selected emotion"
                    accessibilityRole="button"
                  >
                    <Ionicons name="close" size={16} color={colors.textSecondary} />
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
          )}

          {/* ── Step: Intensity ── */}
          {step === 'intensity' && (
            <Animated.View entering={SlideInRight.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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

          {/* ── Step: Context tags + body check-in ── */}
          {step === 'context' && (
            <>
              <Animated.View entering={SlideInRight.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.contextTags}</Text>
                <ContextTagSelector
                  selected={contextTags}
                  onToggle={toggleTag}
                  customTags={customTags}
                  tagLabels={te.contextTagLabels}
                />
              </Animated.View>
              <Animated.View entering={SlideInRight.delay(60).springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.bodyCheckIn}</Text>
                <BodyCheckIn
                  selected={bodyRegions}
                  onToggle={toggleBodyRegion}
                  accentColor={accentColor}
                />
              </Animated.View>
            </>
          )}

          {/* ── Step: Coping actions ── */}
          {step === 'coping' && (
            <Animated.View entering={SlideInRight.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.copingActions}</Text>
              <CopingActionsSelector
                selected={copingActions}
                onToggle={toggleCopingAction}
              />
            </Animated.View>
          )}

          {/* ── Step: Note ── */}
          {step === 'note' && (
            <Animated.View entering={SlideInRight.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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

          {/* ── Step: Review ── */}
          {step === 'review' && selectedEmotion && (
            <Animated.View entering={SlideInRight.springify()} style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{te.reviewTitle}</Text>

              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.selectedEmotion}</Text>
                <Text style={[styles.reviewValue, { color: accentTextColor }]}>{selectedEmotion.label}</Text>
              </View>

              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.intensity}</Text>
                <Text style={[styles.reviewValue, { color: colors.text }]}>{intensity}/10</Text>
              </View>

              {contextTags.length > 0 && (
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.contextTags}</Text>
                  <Text style={[styles.reviewValue, { color: colors.text }]}>
                    {contextTags.map(tag => te.contextTagLabels[tag as keyof typeof te.contextTagLabels] ?? tag).join(', ')}
                  </Text>
                </View>
              )}

              {bodyRegions.length > 0 && (
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.bodyCheckIn}</Text>
                  <Text style={[styles.reviewValue, { color: colors.text }]}>
                    {bodyRegions.map(id => bodyRegionLabels[id] ?? id).join(', ')}
                  </Text>
                </View>
              )}

              {copingActions.length > 0 && (
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.copingActions}</Text>
                  <Text style={[styles.reviewValue, { color: colors.text }]}>
                    {copingActions.map(id => copingActionLabels[id] ?? id).join(', ')}
                  </Text>
                </View>
              )}

              {trimmedNote.length > 0 && (
                <View style={styles.reviewRow}>
                  <Text style={[styles.reviewLabel, { color: colors.textSecondary }]}>{te.note}</Text>
                  <Text style={[styles.reviewValue, { color: colors.text }]}>{trimmedNote}</Text>
                </View>
              )}

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

          {/* ── Step navigation ── */}
          <View style={styles.navRow}>
            {!isFirstStep && (
              <TouchableOpacity
                onPress={handleBack}
                style={[styles.backBtn, { borderColor: colors.border }]}
                accessibilityRole="button"
                accessibilityLabel={te.back}
              >
                <Text style={[styles.backBtnText, { color: colors.textSecondary }]}>{te.back}</Text>
              </TouchableOpacity>
            )}
            {step !== 'review' && (
              <AnimatedPressable
                onPress={handleNext}
                disabled={!canGoNext}
                style={[
                  styles.nextBtn,
                  { backgroundColor: canGoNext ? accentColor : colors.border },
                ]}
                accessibilityRole="button"
                accessibilityLabel={te.next}
              >
                <Text style={[styles.nextBtnText, { color: canGoNext ? '#fff' : colors.textSecondary }]}>
                  {te.next}
                </Text>
              </AnimatedPressable>
            )}
          </View>

          {/* ── Past logs ── */}
          {step === 'emotion' && emotionEntries.length > 0 && (
            <View style={styles.pastSection}>
              <Text style={[styles.pastTitle, { color: colors.textSecondary }]}>{te.pastTitle}</Text>
              {emotionEntries.slice(0, 20).map((log, i) => {
                const emotion = BASIC_EMOTIONS_BY_ID[log.emotionId];
                const color = ensureContrastText(emotion?.color ?? colors.primary, colors.surface);
                const tags = log.contextTags ?? [];
                return (
                  <Animated.View
                    key={log.id}
                    entering={FadeInDown.delay(i * 40).springify()}
                    style={[styles.logCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  >
                    <View style={[styles.logColorBar, { backgroundColor: emotion?.color ?? colors.primary }]} />
                    <View style={styles.logBody}>
                      <View style={styles.logHeader}>
                        <Text style={[styles.logEmotion, { color }]}>{log.emotionLabel}</Text>
                        <Text style={[styles.logIntensity, { color: colors.textSecondary }]}>·{log.mood}/5</Text>
                        <View style={styles.logMeta}>
                          <Text style={[styles.logTime, { color: colors.textSecondary }]}>
                            {formatDate(log.date)} {formatTime(log.date)}
                          </Text>
                        </View>
                      </View>
                      {tags.length > 0 && (
                        <View style={styles.tagRow}>
                          {tags.slice(0, 4).map(tag => (
                            <View key={tag} style={[styles.miniChip, { backgroundColor: color + '18' }]}>
                              <Text style={[styles.miniChipText, { color }]}>
                                {te.contextTagLabels[tag as keyof typeof te.contextTagLabels] ?? tag}
                              </Text>
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
                      <Ionicons name="close-circle-outline" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}

          {/* ── Empty state ── */}
          {step === 'emotion' && emotionEntries.length === 0 && !selectedEmotion && (
            <View style={styles.emptyState}>
              <Ionicons
                name="sync-circle-outline"
                size={48}
                color={colors.textSecondary}
                accessibilityLabel="No emotion logs yet"
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>{te.emptyTitle}</Text>
              <Text style={[styles.emptyBody, { color: colors.textSecondary }]}>{te.emptyBody}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <TourOverlay
        visible={tourVisible && tourFocused}
        spotlight={tourStep.id === 'picker' ? tourSpotlight : null}
        title={tourStepCopy.title}
        body={tourStepCopy.body}
        stepIndex={tourStep.index}
        totalSteps={tourTotalSteps}
        isLast={tourStep.isLast}
        skipLabel={t.tour.common.skip}
        nextLabel={t.tour.common.next}
        doneLabel={t.tour.common.done}
        onNext={tourNext}
        onSkip={tourSkip}
      />
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  reviewRow: {
    gap: 2,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  reviewValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  backBtn: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  backBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  nextBtn: {
    flex: 1,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  saveBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.two,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
    gap: Spacing.two,
  },
  emptyTitle: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
