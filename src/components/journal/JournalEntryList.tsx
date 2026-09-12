import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode, useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TEMPLATE_ICONS, TEMPLATE_LABEL_KEYS } from '@/constants/journal-templates';
import { BorderRadius, Spacing, TAB_BAR_CLEARANCE } from '@/constants/theme';
import { useWellness } from '@/context/wellness-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { toLocalDateStr } from '@/lib/date-utils';

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const isToday = toLocalDateStr(d) === toLocalDateStr(today);
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

interface JournalEntryListProps {
  header: ReactNode;
}

export function JournalEntryList({ header }: JournalEntryListProps) {
  const { colors } = useTheme();
  const t = useTranslation();
  const tj = t.journal;
  const te = t.journalExtended;
  const insets = useSafeAreaInsets();
  const { entries, deleteEntry } = useWellness();

  const [searchQuery, setSearchQuery] = useState('');

  const bottomPad = TAB_BAR_CLEARANCE + insets.bottom;

  const filteredEntries = searchQuery
    ? entries.filter(e =>
        e.note.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : entries;

  const templateLabel = useCallback((id: string) => {
    const key = TEMPLATE_LABEL_KEYS[id as keyof typeof TEMPLATE_LABEL_KEYS];
    return key ? te[key] : id;
  }, [te]);

  const tagLabel = useCallback((tag: string) => {
    const tagLabels = te.tagLabels as Record<string, string>;
    return tagLabels[tag] ?? tag;
  }, [te]);

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
          <Ionicons name="mail-outline" size={48} color={colors.primary} accessibilityLabel="Sealed future self entry" style={styles.sealedEnvelope} />
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
            <Ionicons name="mail-outline" size={12} color={colors.primary} />
            <Text style={[styles.futureSelfBadgeText, { color: colors.primary }]}>{te.futureSelfUnlock}</Text>
          </View>
        )}
        <View style={styles.entryHeader}>
          <View style={styles.entryMoodRow}>
            <View style={[styles.moodDot, { backgroundColor: moodDef?.color ?? colors.border }]} />
            <Text style={[styles.entryMoodLabel, { color: colors.text }]}>{moodDef?.label}</Text>
            {entry.templateId && (
              <View style={[styles.templateBadge, { backgroundColor: colors.backgroundElement }]}>
                <Ionicons
                  name={TEMPLATE_ICONS[entry.templateId] ?? 'document-outline'}
                  size={11}
                  color={colors.textSecondary}
                />
                <Text style={[styles.templateBadgeText, { color: colors.textSecondary }]}>
                  {templateLabel(entry.templateId)}
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
                <Text style={[styles.entryTagText, { color: colors.textSecondary }]}>#{tagLabel(tag)}</Text>
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
  }, [colors, t.moods, tj, te, deleteEntry, tagLabel, templateLabel]);

  const listHeader = (
    <>
      {header}

      {/* ── Search ── */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>{tj.pastTitle}</Text>
        <View style={[styles.searchBar, { backgroundColor: colors.backgroundElement, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={14} color={colors.textSecondary} accessibilityLabel="Search" />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder={te.searchPlaceholder}
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={14} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );

  const listEmpty = (
    <View style={styles.emptyState}>
      <Ionicons
        name="book-outline"
        size={40}
        color={colors.textSecondary}
        accessibilityLabel="No journal entries"
      />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {searchQuery ? te.noResults : tj.emptyTitle}
      </Text>
    </View>
  );

  return (
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
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  section: { gap: Spacing.three },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  searchInput: { flex: 1, fontSize: 15 },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.six, gap: Spacing.two },
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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

  sealedCard:     { alignItems: 'center', paddingVertical: Spacing.five },
  sealedEnvelope: { marginBottom: Spacing.one },
  sealedTitle:    { fontSize: 14, fontWeight: '600' },
  sealedDate:     { fontSize: 18, fontWeight: '800' },
  sealedHint:     { fontSize: 12, marginTop: Spacing.one },

  futureSelfBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: BorderRadius.sm, paddingVertical: 4, paddingHorizontal: Spacing.two, alignSelf: 'flex-start' },
  futureSelfBadgeText: { fontSize: 12, fontWeight: '700' },
});
