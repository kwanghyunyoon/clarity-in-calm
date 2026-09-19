import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { DatePickerModal } from '@/components/journal/DatePickerModal';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { JOURNAL_TEMPLATES } from '@/constants/emotions';
import { IoniconsName, TEMPLATE_ICONS, TEMPLATE_LABEL_KEYS } from '@/constants/journal-templates';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { detectConcern, detectPattern, shouldShowPatternNotice, type ConcernType, type PatternConcern } from '@/lib/crisis-detection';
import type { MoodValue } from '@/types';

type ModalConcernType = ConcernType | 'pattern';

interface JournalComposerProps {
  /** Anchor refs for the Journal tour's spotlight steps (all optional). */
  templatesRef?: React.RefObject<View | null>;
  noteInputRef?: React.RefObject<View | null>;
  saveBtnRef?: React.RefObject<View | null>;
}

async function openUrl(rawUrl: string) {
  let url = rawUrl;
  if (Platform.OS === 'android' && url.startsWith('sms:') && url.includes('?')) {
    url = url.split('?')[0];
  }
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert('Cannot open', url);
  }
}

export function JournalComposer({ templatesRef, noteInputRef, saveBtnRef }: JournalComposerProps) {
  const { colors } = useTheme();
  const t = useTranslation();
  const tj = t.journal;
  const te = t.journalExtended;
  const { addEntry, customTags, addCustomTag, entries, lastPatternNotice, recordPatternNotice } = useWellness();

  const templateLabel = useCallback((id: string) => {
    const key = TEMPLATE_LABEL_KEYS[id as keyof typeof TEMPLATE_LABEL_KEYS];
    return key ? te[key] : id;
  }, [te]);
  const templatePrompts = useCallback((tmpl: typeof JOURNAL_TEMPLATES[number]) => {
    return te.templatePrompts?.[tmpl.id as keyof typeof te.templatePrompts] ?? tmpl.prompts;
  }, [te]);

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState('');
  const [savedAnim, setSavedAnim] = useState(false);
  const [concernType, setConcernType] = useState<ModalConcernType | null>(null);
  const [patternConcern, setPatternConcern] = useState<PatternConcern | null>(null);
  const [pendingSave, setPendingSave] = useState<{ mood: MoodValue; note: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof JOURNAL_TEMPLATES[number]>(JOURNAL_TEMPLATES[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Daily rotating prompt (only for free write)
  const promptIdx = Math.floor(Date.now() / 86400000) % tj.prompts.length;
  const placeholder = selectedTemplate.id === 'free'
    ? tj.prompts[promptIdx]
    : templatePrompts(selectedTemplate).join('\n\n');

  function handleSaveAttempt() {
    if (!mood) return;
    const concern = note.trim() ? detectConcern(note, tj.crisisKeywords, tj.traumaKeywords) : null;
    if (concern) {
      setPendingSave({ mood, note });
      setConcernType(concern);
      return;
    }
    // Per-save keyword hits (crisis/trauma) already covered above, so this
    // entry itself can never be the one completing a pattern below — only
    // its already-saved history can.
    const now = new Date();
    const pattern = detectPattern(entries, now, tj.crisisKeywords, tj.traumaKeywords);
    if (pattern && shouldShowPatternNotice(pattern, lastPatternNotice, now)) {
      setPendingSave({ mood, note });
      setPatternConcern(pattern);
      setConcernType('pattern');
      return;
    }
    doSave(mood, note);
  }

  function doSave(m: MoodValue, n: string) {
    const isFuture = selectedTemplate.id === 'future-self';
    addEntry(m, n, {
      templateId: selectedTemplate.id !== 'free' ? selectedTemplate.id : undefined,
      tags: selectedTags.length > 0 ? [...selectedTags] : undefined,
      isFutureSelf: isFuture || undefined,
      unlockAt: isFuture && unlockDate ? unlockDate.toISOString() : undefined,
    });
    setSavedAnim(true);
    setTimeout(() => {
      setSavedAnim(false);
      setMood(null);
      setNote('');
      setSelectedTags([]);
      setUnlockDate(null);
    }, 1600);
  }

  function resolveConcernModal() {
    if (concernType === 'pattern' && patternConcern) recordPatternNotice(patternConcern);
    setConcernType(null);
    setPatternConcern(null);
    if (pendingSave) doSave(pendingSave.mood, pendingSave.note);
    setPendingSave(null);
  }

  function handleCrisisConfirm() {
    resolveConcernModal();
  }

  function handleCrisisSave() {
    resolveConcernModal();
  }

  function toggleTag(tag: string) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag],
    );
  }

  function handleAddCustomTag() {
    if (newTagText.trim()) {
      addCustomTag(newTagText.trim());
      setSelectedTags(prev => [...prev, newTagText.trim().toLowerCase()]);
      setNewTagText('');
      setShowTagInput(false);
    }
  }

  const allTags = [
    'work', 'home', 'family', 'health', 'relationship', 'growth',
    'gratitude', 'stress', 'joy', 'sleep',
    ...customTags,
  ];

  const tagLabel = useCallback((tag: string) => {
    const tagLabels = te.tagLabels as Record<string, string>;
    return tagLabels[tag] ?? tag;
  }, [te]);

  const concernNotice = concernType === 'crisis' ? tj.crisis
    : concernType === 'trauma' ? tj.traumaNotice
    : concernType === 'pattern' ? tj.patternNotice
    : null;

  return (
    <>
      {/* The composer renders inside the entry list's ListHeaderComponent, which
       * flattens it into a single wrapper View — so the list's contentContainer
       * gap never reaches these blocks. They own their own vertical rhythm. */}
      <View style={styles.blocks}>
        {/* ── Template selector ── */}
        <View style={styles.section} ref={templatesRef}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{te.templates}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
            {JOURNAL_TEMPLATES.map(tmpl => {
              const isSelected = selectedTemplate.id === tmpl.id;
              const iconName: IoniconsName = TEMPLATE_ICONS[tmpl.id] ?? 'document-outline';
              return (
                <AnimatedPressable
                  key={tmpl.id}
                  onPress={() => {
                    setSelectedTemplate(tmpl);
                    if (tmpl.id !== 'free') setNote(templatePrompts(tmpl).join('\n\n'));
                    else setNote('');
                    if (tmpl.id !== 'future-self') setUnlockDate(null);
                  }}
                  style={[
                    styles.templateCard,
                    {
                      backgroundColor: isSelected ? colors.primary + '18' : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={isSelected ? colors.primary : colors.textSecondary}
                    accessibilityLabel={templateLabel(tmpl.id)}
                  />
                  <Text style={[styles.templateLabel, { color: isSelected ? colors.primary : colors.text }]}>
                    {templateLabel(tmpl.id)}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Mood picker ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{tj.moodLabel}</Text>
          <View style={styles.moodRow}>
            {t.moods.map(m => {
              const isSelected = mood === m.value;
              return (
                <AnimatedPressable
                  key={m.value}
                  onPress={() => setMood(m.value as MoodValue)}
                  style={[
                    styles.moodBtn,
                    {
                      backgroundColor: isSelected ? m.color + '33' : colors.backgroundElement,
                      borderColor: isSelected ? m.color : 'transparent',
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={m.label}
                >
                  <Text style={styles.moodEmoji}>{m.emoji}</Text>
                  <Text style={[styles.moodLabel, { color: isSelected ? colors.text : colors.textSecondary }]}>
                    {m.label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* ── Note input ── */}
        <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]} ref={noteInputRef}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={note}
            onChangeText={setNote}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Journal entry"
          />
        </View>

        {/* ── Future Self unlock date ── */}
        {selectedTemplate.id === 'future-self' && (
          <TouchableOpacity
            style={[styles.unlockBanner, { backgroundColor: colors.surface, borderColor: colors.primary + '55' }]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="mail-outline" size={22} color={colors.primary} accessibilityLabel="Future self" />
            <View style={styles.unlockBannerText}>
              <Text style={[styles.unlockBannerLabel, { color: colors.textSecondary }]}>
                {te.unlockDate}
              </Text>
              <Text style={[styles.unlockBannerValue, { color: unlockDate ? colors.primary : colors.textSecondary }]}>
                {unlockDate
                  ? unlockDate.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })
                  : te.setDate}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} accessibilityLabel="" />
          </TouchableOpacity>
        )}

        {/* ── Tags ── */}
        <View style={styles.section}>
          <View style={styles.tagsHeader}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{te.tags}</Text>
            <TouchableOpacity onPress={() => setShowTagInput(!showTagInput)}>
              <Text style={[styles.addTagBtn, { color: colors.primary }]}>{te.addTag}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    {
                      backgroundColor: isSelected ? colors.accent + '22' : colors.backgroundElement,
                      borderColor: isSelected ? colors.accent : colors.border,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                >
                  <Text style={[styles.tagText, { color: isSelected ? colors.accent : colors.textSecondary }]}>
                    #{tagLabel(tag)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {showTagInput && (
            <Animated.View entering={FadeInDown.springify()} style={styles.tagInputRow}>
              <TextInput
                style={[styles.tagInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.backgroundElement }]}
                placeholder={te.customTagPlaceholder}
                placeholderTextColor={colors.textSecondary}
                value={newTagText}
                onChangeText={setNewTagText}
                onSubmitEditing={handleAddCustomTag}
                returnKeyType="done"
                autoFocus
              />
              <TouchableOpacity onPress={handleAddCustomTag} style={[styles.tagAddConfirm, { backgroundColor: colors.primary }]}>
                <Text style={styles.tagAddConfirmText}>{te.addTagConfirm}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* ── Save button ── */}
        <View ref={saveBtnRef}>
          <AnimatedPressable
            onPress={handleSaveAttempt}
            disabled={!mood || savedAnim}
            style={[
              styles.saveBtn,
              {
                backgroundColor: savedAnim ? colors.accent : mood ? colors.primary : colors.backgroundElement,
                opacity: mood ? 1 : 0.5,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={savedAnim ? tj.savedBtn : tj.saveBtn}
          >
            <Text style={[styles.saveBtnText, { color: mood ? '#fff' : colors.textSecondary }]}>
              {savedAnim ? tj.savedBtn : tj.saveBtn}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      {/* ── Future Self date picker ── */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(d) => setUnlockDate(d)}
      />

      {/* ── Crisis / trauma-notice modal ── */}
      {concernNotice && (
        <Modal visible transparent animationType="fade" onRequestClose={() => { setConcernType(null); setPatternConcern(null); setPendingSave(null); }}>
          <View style={styles.modalOverlay}>
            <View style={[styles.crisisModal, { backgroundColor: colors.surface }]}>
              <Text style={[styles.crisisTitle, { color: colors.text }]}>{concernNotice.title}</Text>
              <Text style={[styles.crisisBody, { color: colors.textSecondary }]}>{concernNotice.body}</Text>
              {concernNotice.lines.map((line) => (
                <TouchableOpacity
                  key={line.title}
                  style={[styles.crisisLine, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}
                  onPress={() => openUrl(line.action)}
                >
                  <Text style={styles.crisisEmoji}>{line.emoji}</Text>
                  <View style={styles.crisisLineText}>
                    <Text style={[styles.crisisLineTitle, { color: colors.text }]}>{line.title}</Text>
                    <Text style={[styles.crisisLineSub, { color: colors.textSecondary }]}>{line.sub}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.crisisBtn, { backgroundColor: colors.primary }]}
                onPress={handleCrisisConfirm}
              >
                <Text style={styles.crisisBtnText}>{concernNotice.confirmBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCrisisSave}>
                <Text style={[styles.crisisSaveLink, { color: colors.textSecondary }]}>{concernNotice.saveBtn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  blocks: { gap: Spacing.four },
  section: { gap: Spacing.three },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  templateRow: { gap: Spacing.two },
  templateCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    alignItems: 'center',
    gap: Spacing.one,
    minWidth: 88,
  },
  templateLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  moodRow: { flexDirection: 'row', gap: Spacing.two },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    paddingVertical: Spacing.two + 2,
    gap: 4,
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
  inputCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    padding: Spacing.three,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 140,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
  tagsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addTagBtn: { fontSize: 13, fontWeight: '600' },
  tagRow: { gap: Spacing.two },
  tagChip: {
    borderRadius: BorderRadius.pill,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: Spacing.two + 2,
  },
  tagText: { fontSize: 13, fontWeight: '500' },
  tagInputRow: { flexDirection: 'row', gap: Spacing.two, alignItems: 'center' },
  tagInput: {
    flex: 1,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 14,
  },
  tagAddConfirm: {
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  tagAddConfirmText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  saveBtn: {
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
    padding: Spacing.four,
  },
  crisisModal: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.four,
    gap: Spacing.three,
    maxHeight: '85%',
  },
  crisisTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  crisisBody: { fontSize: 15, lineHeight: 22 },
  crisisLine: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  crisisEmoji: { fontSize: 24 },
  crisisLineText: { flex: 1 },
  crisisLineTitle: { fontSize: 15, fontWeight: '600' },
  crisisLineSub: { fontSize: 13, marginTop: 2 },
  crisisBtn: { borderRadius: BorderRadius.xl, paddingVertical: Spacing.three, alignItems: 'center' },
  crisisBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  crisisSaveLink: { textAlign: 'center', fontSize: 14, paddingVertical: Spacing.two },

  // Future Self
  unlockBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  unlockBannerText:    { flex: 1, gap: 2 },
  unlockBannerLabel:   { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  unlockBannerValue:   { fontSize: 15, fontWeight: '700' },
});
