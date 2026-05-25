import { Alert, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { MoodValue, useWellness } from '@/context/wellness-context';

/**
 * Cross-platform URL opener.
 * - SMS body params don't work reliably on Android, so we strip them there.
 * - Falls back to an Alert if the URL scheme can't be handled (e.g. simulator).
 */
async function openUrl(rawUrl: string) {
  // Android: sms body params are unreliable — use bare number only
  let url = rawUrl;
  if (Platform.OS === 'android' && url.startsWith('sms:') && url.includes('?')) {
    url = url.split('?')[0];
  }

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else if (url.startsWith('http')) {
    // Try opening HTTP links via the in-app browser as a fallback
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Cannot open link', `Please visit:\n\n${rawUrl}`);
    }
  } else {
    Alert.alert(
      'Cannot open link',
      `Please contact the helpline directly:\n\n${rawUrl}`,
    );
  }
}

function formatEntryDate(iso: string) {
  const d = new Date(iso);
  const today = new Date().toDateString();
  if (d.toDateString() === today) {
    return `Today · ${d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}`;
  }
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export default function JournalScreen() {
  const colors = useTheme();
  const t = useTranslation();
  const { entries, addEntry, deleteEntry } = useWellness();

  const moods   = t.moods;
  const prompts = t.journal.prompts;
  // Day-of-year index so prompt is consistent all day and cycles meaningfully
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const todayPrompt = prompts[dayOfYear % prompts.length];

  const [selectedMood,    setSelectedMood]    = useState<MoodValue | null>(null);
  const [note,            setNote]            = useState('');
  const [saved,           setSaved]           = useState(false);
  const [showCrisis,      setShowCrisis]      = useState(false);
  const [deleteTargetId,  setDeleteTargetId]  = useState<string | null>(null);

  function containsCrisisLanguage(text: string): boolean {
    const lower = text.toLowerCase();
    return t.journal.crisisKeywords.some((kw) => lower.includes(kw));
  }

  const handleNoteChange = (text: string) => {
    setNote(text);
    if (containsCrisisLanguage(text)) setShowCrisis(true);
  };

  const handleSave = () => {
    if (!selectedMood) return;
    if (containsCrisisLanguage(note)) { setShowCrisis(true); return; }
    addEntry(selectedMood, note.trim());
    setSelectedMood(null);
    setNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) deleteEntry(deleteTargetId);
    setDeleteTargetId(null);
  };

  const handleSaveWithCrisis = () => {
    if (!selectedMood) return;
    addEntry(selectedMood, note.trim());
    setSelectedMood(null);
    setNote('');
    setSaved(true);
    setShowCrisis(false);
    setTimeout(() => setSaved(false), 3000);
  };

  // Close crisis modal without saving — entry is intentionally not saved
  const handleCrisisClose = () => {
    setShowCrisis(false);
    // Keep the text so user can edit it if they want to save after reading resources
  };

  return (
    <SafeAreaView edges={['top']} style={[s.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: Spacing.three, paddingBottom: Spacing.six }}
        >
          {/* Header */}
          <View style={s.header}>
            <Text style={[s.title, { color: colors.text }]}>{t.journal.title}</Text>
            <Text style={[s.subtitle, { color: colors.textSecondary }]}>{t.journal.subtitle}</Text>
          </View>

          {/* ── No-filter safe space banner ── */}
          <View style={[s.safeCard, { backgroundColor: colors.accent + '22', borderColor: colors.accent + '55' }]}>
            <Text style={s.safeEmoji}>🔒</Text>
            <View style={{ flex: 1 }}>
              <Text style={[s.safeTitle, { color: colors.text }]}>{t.journal.safeSpace.title}</Text>
              <Text style={[s.safeText, { color: colors.textSecondary }]}>{t.journal.safeSpace.body}</Text>
            </View>
          </View>

          {/* ── Mood picker ── */}
          <View style={[s.card, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.cardLabel, { color: colors.text }]}>{t.journal.moodLabel}</Text>
            <View style={s.moodRow}>
              {moods.map((m) => {
                const active = selectedMood === m.value;
                return (
                  <TouchableOpacity
                    key={m.value}
                    onPress={() => setSelectedMood(m.value as MoodValue)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityLabel={m.label}
                    accessibilityState={{ selected: active }}
                    style={[
                      s.moodBtn,
                      { backgroundColor: active ? m.color : colors.backgroundSelected },
                      active && s.moodBtnActive,
                    ]}
                  >
                    <Text style={s.moodEmoji}>{m.emoji}</Text>
                    <Text style={[s.moodLabel, { color: active ? '#2C2C3E' : colors.textSecondary }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* ── Text input ── */}
          <View style={[s.card, { backgroundColor: colors.backgroundElement }]}>
            <Text style={[s.cardLabel, { color: colors.text }]}>
              {t.journal.reflectionLabel}{' '}
              <Text style={{ fontWeight: '400', color: colors.textSecondary }}>{t.journal.optionalLabel}</Text>
            </Text>
            <Text style={[s.prompt, { color: colors.textSecondary }]}>{todayPrompt}</Text>
            <TextInput
              style={[
                s.input,
                { color: colors.text, borderColor: colors.backgroundSelected, backgroundColor: colors.surface },
              ]}
              placeholder={t.journal.placeholder}
              placeholderTextColor={colors.textSecondary}
              value={note}
              onChangeText={handleNoteChange}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          {/* ── Save button ── */}
          <TouchableOpacity
            style={[
              s.saveBtn,
              { backgroundColor: selectedMood ? (saved ? colors.accent : colors.primary) : colors.backgroundSelected },
              (!selectedMood || saved) && { opacity: 0.55 },
            ]}
            onPress={handleSave}
            disabled={!selectedMood || saved}
            activeOpacity={selectedMood && !saved ? 0.8 : 1}
          >
            <Text style={[s.saveTxt, { color: selectedMood ? '#ffffff' : colors.textSecondary }]}>
              {saved ? t.journal.savedBtn : t.journal.saveBtn}
            </Text>
          </TouchableOpacity>

          {/* ── Past entries ── */}
          {entries.length > 0 && (
            <View style={s.history}>
              <Text style={[s.historyTitle, { color: colors.text }]}>{t.journal.pastTitle}</Text>
              {entries.map((entry) => {
                const mood = moods[Math.max(0, Math.min(4, entry.mood - 1))];
                // Defensive: skip rendering if mood lookup returns undefined (corrupt data)
                if (!mood) return null;
                return (
                  <Animated.View
                    key={entry.id}
                    entering={FadeInDown.duration(250)}
                    exiting={FadeOutUp.duration(200)}
                  >
                    <View style={[s.entryCard, { backgroundColor: colors.backgroundElement }]}>
                      <View style={s.entryHeader}>
                        <View style={[s.entryBadge, { backgroundColor: mood.color }]}>
                          <Text style={s.entryEmoji}>{mood.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[s.entryMoodLabel, { color: colors.text }]}>{mood.label}</Text>
                          <Text style={[s.entryDate, { color: colors.textSecondary }]}>
                            {formatEntryDate(entry.date)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDeleteEntry(entry.id)}
                          activeOpacity={0.7}
                          style={s.deleteBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Text style={s.deleteTxt}>🗑</Text>
                        </TouchableOpacity>
                      </View>
                      {!!entry.note && (
                        <Text style={[s.entryNote, { color: colors.textSecondary }]}>
                          {entry.note}
                        </Text>
                      )}
                    </View>
                  </Animated.View>
                );
              })}
            </View>
          )}

          {entries.length === 0 && (
            <View style={[s.emptyCard, { backgroundColor: colors.backgroundElement }]}>
              <Text style={s.emptyEmoji}>🌸</Text>
              <Text style={[s.emptyTxt, { color: colors.textSecondary }]}>{t.journal.emptyTitle}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Delete confirmation modal ── */}
      <Modal
        visible={deleteTargetId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTargetId(null)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={{ fontSize: 36, textAlign: 'center' }}>🗑️</Text>
            <Text style={[s.modalTitle, { color: colors.text, fontSize: 20 }]}>
              {t.journal.deleteConfirm.title}
            </Text>
            <Text style={[s.modalBody, { color: colors.textSecondary }]}>
              {t.journal.deleteConfirm.body}
            </Text>
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtnPrimary, { backgroundColor: '#E53935' }]}
                onPress={confirmDelete}
                activeOpacity={0.8}
              >
                <Text style={s.modalBtnPrimaryText}>{t.journal.deleteConfirm.confirm}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.modalBtnGhost}
                onPress={() => setDeleteTargetId(null)}
                activeOpacity={0.7}
              >
                <Text style={[s.modalBtnGhostText, { color: colors.textSecondary }]}>
                  {t.journal.deleteConfirm.cancel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Crisis helpline modal ── */}
      <Modal
        visible={showCrisis}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCrisis(false)}
      >
        <View style={s.modalOverlay}>
          <View style={[s.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={s.modalEmoji}>💙</Text>
            <Text style={[s.modalTitle, { color: colors.text }]}>{t.journal.crisis.title}</Text>
            <Text style={[s.modalBody, { color: colors.textSecondary }]}>{t.journal.crisis.body}</Text>

            {/* Helplines — from locale-specific list */}
            {t.journal.crisis.lines.map((line) => (
              <View key={line.title} style={[s.helplineBox, { backgroundColor: colors.backgroundElement }]}>
                <TouchableOpacity onPress={() => openUrl(line.action)} activeOpacity={0.75}>
                  <Text style={[s.helplineTitle, { color: colors.text }]}>{line.emoji} {line.title}</Text>
                  <Text style={[s.helplineSub, { color: colors.textSecondary }]}>{line.sub}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Actions */}
            <View style={s.modalActions}>
              <TouchableOpacity
                style={[s.modalBtnPrimary, { backgroundColor: colors.primary }]}
                onPress={handleCrisisClose}
                activeOpacity={0.8}
              >
                <Text style={s.modalBtnPrimaryText}>{t.journal.crisis.confirmBtn}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modalBtnGhost} onPress={handleSaveWithCrisis} activeOpacity={0.7}>
                <Text style={[s.modalBtnGhostText, { color: colors.textSecondary }]}>
                  {t.journal.crisis.saveBtn}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:          { flex: 1 },
  header:        { paddingTop: Spacing.three, paddingBottom: Spacing.two, gap: Spacing.half },
  title:         { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle:      { fontSize: 14, fontWeight: '500' },

  card:          { borderRadius: 18, padding: Spacing.three, marginBottom: Spacing.two, gap: Spacing.two },
  cardLabel:     { fontSize: 15, fontWeight: '700' },
  prompt:        { fontSize: 13, fontStyle: 'italic', fontWeight: '500', marginTop: -Spacing.one },

  moodRow:       { flexDirection: 'row', gap: Spacing.one },
  moodBtn:       { flex: 1, alignItems: 'center', borderRadius: 14, paddingVertical: Spacing.two, gap: 4 },
  moodBtnActive: { transform: [{ scale: 1.1 }] },
  moodEmoji:     { fontSize: 24 },
  moodLabel:     { fontSize: 10, fontWeight: '700' },

  input:         { borderRadius: 12, borderWidth: 1, padding: Spacing.two,
                   fontSize: 15, lineHeight: 22, minHeight: 110 },

  saveBtn:       { borderRadius: 50, paddingVertical: Spacing.two + 4, alignItems: 'center',
                   marginBottom: Spacing.four },
  saveTxt:       { fontSize: 16, fontWeight: '700' },

  history:       { gap: Spacing.two },
  historyTitle:  { fontSize: 17, fontWeight: '700', marginBottom: Spacing.one },

  entryCard:     { borderRadius: 16, padding: Spacing.three, gap: Spacing.two },
  entryHeader:   { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  entryBadge:    { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  entryEmoji:    { fontSize: 22 },
  entryMoodLabel:{ fontSize: 14, fontWeight: '700' },
  entryDate:     { fontSize: 12, fontWeight: '500', marginTop: 2 },
  entryNote:     { fontSize: 14, lineHeight: 20 },
  deleteBtn:     { padding: 4 },
  deleteTxt:     { fontSize: 18 },

  emptyCard:     { borderRadius: 18, padding: Spacing.five, alignItems: 'center', gap: Spacing.two, marginTop: Spacing.two },
  emptyEmoji:    { fontSize: 36 },
  emptyTxt:      { fontSize: 14, lineHeight: 20, textAlign: 'center', fontWeight: '500' },

  // Safe space banner
  safeCard:      { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two, borderRadius: 16,
                   borderWidth: 1, padding: Spacing.three, marginBottom: Spacing.three },
  safeEmoji:     { fontSize: 22, marginTop: 1 },
  safeTitle:     { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  safeText:      { fontSize: 13, lineHeight: 19, fontWeight: '500' },

  // Crisis modal
  modalOverlay:        { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center',
                         alignItems: 'center', paddingHorizontal: Spacing.three },
  modalCard:           { width: '100%', borderRadius: 24, padding: Spacing.four, gap: Spacing.three,
                         maxWidth: 420 },
  modalEmoji:          { fontSize: 40, textAlign: 'center' },
  modalTitle:          { fontSize: 22, fontWeight: '800', textAlign: 'center', letterSpacing: -0.3 },
  modalBody:           { fontSize: 14, lineHeight: 21, fontWeight: '500', textAlign: 'center' },

  helplineBox:         { borderRadius: 14, padding: Spacing.three, gap: 3 },
  helplineTitle:       { fontSize: 14, fontWeight: '700' },
  helplineSub:         { fontSize: 12, fontWeight: '500' },

  modalActions:        { gap: Spacing.two, marginTop: Spacing.one },
  modalBtnPrimary:     { borderRadius: 50, paddingVertical: Spacing.two + 4, alignItems: 'center' },
  modalBtnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  modalBtnGhost:       { alignItems: 'center', paddingVertical: Spacing.two },
  modalBtnGhostText:   { fontSize: 14, fontWeight: '600' },
});
