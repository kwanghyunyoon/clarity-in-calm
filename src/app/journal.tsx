import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  ListRenderItemInfo,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { JOURNAL_TEMPLATES } from '@/constants/emotions';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { toLocalDateStr } from '@/lib/date-utils';
import type { MoodValue } from '@/types';

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

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = toLocalDateStr(d) === toLocalDateStr(today);
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

// ── Date picker modal ─────────────────────────────────────────────────────────
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function DatePickerModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const { colors } = useTheme();
  const today = new Date();
  const minYear = today.getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => minYear + i);

  const [selYear,  setSelYear]  = useState(minYear);
  const [selMonth, setSelMonth] = useState(today.getMonth());
  const [selDay,   setSelDay]   = useState(today.getDate() + 1 > 28 ? 1 : today.getDate() + 1);

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
      <View style={dp.overlay}>
        <TouchableOpacity style={dp.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[dp.sheet, { backgroundColor: colors.surface }]}>
          <Text style={[dp.title, { color: colors.text }]}>Set unlock date</Text>
          <Text style={[dp.subtitle, { color: colors.textSecondary }]}>
            Letter will be hidden until this date
          </Text>
          <View style={dp.pickerRow}>
            {/* Month */}
            <ScrollView style={dp.col} showsVerticalScrollIndicator={false}>
              {MONTHS.map((m, idx) => (
                <TouchableOpacity key={m} onPress={() => setSelMonth(idx)} style={dp.item}>
                  <Text style={[dp.itemText, { color: idx === selMonth ? colors.primary : colors.textSecondary },
                    idx === selMonth && dp.itemSelected]}>
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Day */}
            <ScrollView style={dp.col} showsVerticalScrollIndicator={false}>
              {days.map(d => (
                <TouchableOpacity key={d} onPress={() => setSelDay(d)} style={dp.item}>
                  <Text style={[dp.itemText, { color: d === safeDay ? colors.primary : colors.textSecondary },
                    d === safeDay && dp.itemSelected]}>
                    {String(d).padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {/* Year */}
            <ScrollView style={dp.col} showsVerticalScrollIndicator={false}>
              {years.map(y => (
                <TouchableOpacity key={y} onPress={() => setSelYear(y)} style={dp.item}>
                  <Text style={[dp.itemText, { color: y === selYear ? colors.primary : colors.textSecondary },
                    y === selYear && dp.itemSelected]}>
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TouchableOpacity
            style={[dp.btn, { backgroundColor: colors.primary }]}
            onPress={handleConfirm}
          >
            <Text style={dp.btnText}>Set date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={dp.cancel}>
            <Text style={[dp.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const dp = StyleSheet.create({
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

export default function JournalScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const tj = t.journal;
  const te = t.journalExtended;
  const insets = useSafeAreaInsets();
  const { entries, addEntry, deleteEntry, customTags, addCustomTag } = useWellness();

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState('');
  const [savedAnim, setSavedAnim] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [pendingSave, setPendingSave] = useState<{ mood: MoodValue; note: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<typeof JOURNAL_TEMPLATES[number]>(JOURNAL_TEMPLATES[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagText, setNewTagText] = useState('');
  const [unlockDate, setUnlockDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const bottomPad = 88 + insets.bottom;

  // Daily rotating prompt (only for free write)
  const promptIdx = Math.floor(Date.now() / 86400000) % tj.prompts.length;
  const placeholder = selectedTemplate.id === 'free'
    ? tj.prompts[promptIdx]
    : selectedTemplate.prompts.join('\n\n');

  // Filtered entries
  const filteredEntries = searchQuery
    ? entries.filter(e =>
        e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : entries;

  function checkCrisis(text: string): boolean {
    const lower = text.toLowerCase();
    return (tj.crisisKeywords as readonly string[]).some(kw => lower.includes(kw));
  }

  function handleSaveAttempt() {
    if (!mood) return;
    if (note.trim() && checkCrisis(note)) {
      setPendingSave({ mood, note });
      setShowCrisis(true);
    } else {
      doSave(mood, note);
    }
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

  function handleCrisisConfirm() {
    setShowCrisis(false);
    if (pendingSave) doSave(pendingSave.mood, pendingSave.note);
    setPendingSave(null);
  }

  function handleCrisisSave() {
    setShowCrisis(false);
    if (pendingSave) doSave(pendingSave.mood, pendingSave.note);
    setPendingSave(null);
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

  type EntryItem = typeof filteredEntries[number];

  const renderEntry = useCallback(({ item: entry, index: i }: ListRenderItemInfo<EntryItem>) => {
    const moodDef = t.moods.find(m => m.value === entry.mood);
    const isSealed = entry.isFutureSelf && entry.unlockAt && new Date() < new Date(entry.unlockAt);

    if (isSealed) {
      const unlockDateObj = new Date(entry.unlockAt!);
      return (
        <Animated.View
          entering={FadeInDown.delay(Math.min(i, 8) * 30).springify()}
          style={[styles.entryCard, styles.sealedCard, { backgroundColor: colors.surface, borderColor: colors.primary + '44' }]}
        >
          <Text style={styles.sealedEnvelope}>💌</Text>
          <Text style={[styles.sealedTitle, { color: colors.text }]}>{te.futureSelfLocked}</Text>
          <Text style={[styles.sealedDate, { color: colors.primary }]}>
            {unlockDateObj.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
          <Text style={[styles.sealedHint, { color: colors.textSecondary }]}>
            {formatTimestamp(entry.date)}
          </Text>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        entering={FadeInDown.delay(Math.min(i, 8) * 30).springify()}
        style={[styles.entryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        {entry.isFutureSelf && (
          <View style={[styles.futureSelfBadge, { backgroundColor: colors.primary + '18' }]}>
            <Text style={[styles.futureSelfBadgeText, { color: colors.primary }]}>💌 {te.futureSelfUnlock}</Text>
          </View>
        )}
        <View style={styles.entryHeader}>
          <View style={styles.entryMoodRow}>
            <View style={[styles.moodDot, { backgroundColor: moodDef?.color ?? colors.border }]} />
            <Text style={[styles.entryMoodLabel, { color: colors.text }]}>{moodDef?.label}</Text>
            {entry.templateId && (
              <View style={[styles.templateBadge, { backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.templateBadgeText, { color: colors.textSecondary }]}>
                  {JOURNAL_TEMPLATES.find(t => t.id === entry.templateId)?.emoji ?? '📝'}{' '}
                  {entry.templateId}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.entryTime, { color: colors.textSecondary }]}>
            {formatTimestamp(entry.date)}
          </Text>
        </View>

        {entry.note ? (
          <Text style={[styles.entryNote, { color: colors.text }]} numberOfLines={4}>
            {entry.note}
          </Text>
        ) : null}

        {(entry.tags ?? []).length > 0 && (
          <View style={styles.entryTagRow}>
            {(entry.tags ?? []).map(tag => (
              <View key={tag} style={[styles.entryTag, { backgroundColor: colors.backgroundElement }]}>
                <Text style={[styles.entryTagText, { color: colors.textSecondary }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => Alert.alert(
            tj.deleteConfirm.title,
            tj.deleteConfirm.body,
            [
              { text: tj.deleteConfirm.cancel, style: 'cancel' },
              { text: tj.deleteConfirm.confirm, style: 'destructive', onPress: () => deleteEntry(entry.id) },
            ],
          )}
          style={styles.deleteRow}
          accessibilityLabel="Delete entry"
          accessibilityRole="button"
        >
          <Text style={[styles.deleteText, { color: colors.textSecondary }]}>{te.deleteEntry}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [colors, t.moods, tj, te, deleteEntry]);

  const listHeader = (
    <>
      {/* ── Template selector ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{te.templates}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.templateRow}>
          {JOURNAL_TEMPLATES.map(tmpl => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <AnimatedPressable
                key={tmpl.id}
                onPress={() => {
                  setSelectedTemplate(tmpl);
                  if (tmpl.id !== 'free') setNote(tmpl.prompts.join('\n\n'));
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
                <Text style={styles.templateEmoji}>{tmpl.emoji}</Text>
                <Text style={[styles.templateLabel, { color: isSelected ? colors.primary : colors.text }]}>
                  {tmpl.label}
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
      <View style={[styles.inputCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
          <Text style={styles.unlockBannerIcon}>💌</Text>
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
          <Text style={[styles.unlockBannerChevron, { color: colors.textSecondary }]}>›</Text>
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
                  #{tag}
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

      {/* ── Search ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{tj.pastTitle}</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={te.searchPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={[styles.searchClear, { color: colors.textSecondary }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );

  const listEmpty = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📖</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery ? te.noResults : tj.emptyTitle}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Header ── */}
      <View style={[styles.header, {
        paddingTop: insets.top + Spacing.two,
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
      }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{tj.title}</Text>
      </View>

      <FlatList
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        data={filteredEntries}
        keyExtractor={item => item.id}
        renderItem={renderEntry}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ItemSeparatorComponent={() => <View style={styles.entrySeparator} />}
        removeClippedSubviews
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
      />

      {/* ── Future Self date picker ── */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={(d) => setUnlockDate(d)}
      />

      {/* ── Crisis modal ── */}
      <Modal visible={showCrisis} transparent animationType="fade" onRequestClose={() => { setShowCrisis(false); setPendingSave(null); }}>
        <View style={styles.modalOverlay}>
          <View style={[styles.crisisModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.crisisTitle, { color: colors.text }]}>{tj.crisis.title}</Text>
            <Text style={[styles.crisisBody, { color: colors.textSecondary }]}>{tj.crisis.body}</Text>
            {tj.crisis.lines.map((line) => (
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
              <Text style={styles.crisisBtnText}>{tj.crisis.confirmBtn}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCrisisSave}>
              <Text style={[styles.crisisSaveLink, { color: colors.textSecondary }]}>{tj.crisis.saveBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two + 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginLeft: Spacing.six },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  section: { gap: Spacing.two },
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
  templateEmoji: { fontSize: 22 },
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 15 },
  searchClear: { fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.six, gap: Spacing.two },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  entrySeparator: { height: Spacing.two + 4 },
  entryCard: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  entryMoodRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  moodDot: { width: 10, height: 10, borderRadius: 5 },
  entryMoodLabel: { fontSize: 14, fontWeight: '600' },
  templateBadge: {
    borderRadius: BorderRadius.sm,
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  templateBadgeText: { fontSize: 11 },
  entryTime: { fontSize: 12 },
  entryNote: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
  },
  entryTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  entryTag: { borderRadius: BorderRadius.sm, paddingVertical: 2, paddingHorizontal: 7 },
  entryTagText: { fontSize: 11, fontWeight: '500' },
  deleteRow: { alignItems: 'flex-end' },
  deleteText: { fontSize: 12 },
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
  unlockBannerIcon:    { fontSize: 22 },
  unlockBannerText:    { flex: 1, gap: 2 },
  unlockBannerLabel:   { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  unlockBannerValue:   { fontSize: 15, fontWeight: '700' },
  unlockBannerChevron: { fontSize: 22, fontWeight: '300' },

  sealedCard:     { alignItems: 'center', paddingVertical: Spacing.five },
  sealedEnvelope: { fontSize: 48, marginBottom: Spacing.one },
  sealedTitle:    { fontSize: 14, fontWeight: '600' },
  sealedDate:     { fontSize: 18, fontWeight: '800' },
  sealedHint:     { fontSize: 12, marginTop: Spacing.one },

  futureSelfBadge:     { borderRadius: BorderRadius.sm, paddingVertical: 4, paddingHorizontal: Spacing.two, alignSelf: 'flex-start' },
  futureSelfBadgeText: { fontSize: 12, fontWeight: '700' },
});
