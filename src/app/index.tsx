import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { QUOTES } from '@/constants/quotes';
import { type Locale } from '@/i18n/translations';
import { useHelp } from '@/context/help-context';
import { useLocale } from '@/context/language-context';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useWellness } from '@/context/wellness-context';

// ── Language toggle config ────────────────────────────────────────────────────
const LANGUAGES: { locale: Locale; flag: string; label: string }[] = [
  { locale: 'en', flag: '🇺🇸', label: 'EN' },
  { locale: 'ko', flag: '🇰🇷', label: '한' },
  { locale: 'es', flag: '🇲🇽', label: 'ES' },
  { locale: 'hi', flag: '🇮🇳', label: 'हि' },
];

function getDailyQuote() {
  const day = Math.floor(Date.now() / 86400000);
  return QUOTES[day % QUOTES.length];
}

export default function HomeScreen() {
  const colors = useTheme();
  const t = useTranslation();
  const { locale, setLocale } = useLocale();
  const { showHelp } = useHelp();
  const { todayMood, entries, breathingSessions, streak } = useWellness();

  const moods = t.moods;
  const quote = getDailyQuote();
  const today = new Date();
  const h = today.getHours();
  const greeting =
    h < 12 ? t.home.greeting.morning :
    h < 17 ? t.home.greeting.afternoon :
             t.home.greeting.evening;
  const dateLabel = today.toLocaleDateString(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const todayEntries = entries.filter(
    (e) => new Date(e.date).toDateString() === today.toDateString()
  );

  // True when the user has never logged anything yet
  const isFirstTime = entries.length === 0 && breathingSessions === 0;

  return (
    <SafeAreaView edges={['top']} style={[s.root, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View style={s.headerLeft}>
              <Text style={[s.date, { color: colors.textSecondary }]}>{dateLabel}</Text>
              <Text style={[s.greeting, { color: colors.text }]}>
                {greeting} {t.home.greetingEmoji}
              </Text>
              <TouchableOpacity
                onPress={showHelp}
                activeOpacity={0.7}
                style={[s.helpBtn, { backgroundColor: colors.backgroundElement }]}
              >
                <Text style={s.helpBtnEmoji}>❓</Text>
                <Text style={[s.helpBtnTxt, { color: colors.textSecondary }]}>
                  {t.home.helpBtn}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Language toggle (4 languages) ── */}
            <View style={[s.langPill, { backgroundColor: colors.backgroundElement }]}>
              {LANGUAGES.map((lang, i) => {
                const active = locale === lang.locale;
                return (
                  <TouchableOpacity
                    key={lang.locale}
                    onPress={() => setLocale(lang.locale)}
                    activeOpacity={0.75}
                    style={[
                      s.langBtn,
                      active && { backgroundColor: colors.primary },
                      i === 0 && s.langBtnFirst,
                      i === LANGUAGES.length - 1 && s.langBtnLast,
                    ]}
                  >
                    <Text style={s.langFlag}>{lang.flag}</Text>
                    <Text style={[s.langLabel, { color: active ? '#fff' : colors.textSecondary }]}>
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Daily Quote ── */}
        <View style={[s.quoteCard, { backgroundColor: colors.backgroundElement }]}>
          <Text style={[s.quoteText, { color: colors.text }]}>"{quote.text}"</Text>
          <Text style={[s.quoteAuthor, { color: colors.textSecondary }]}>— {quote.author}</Text>
        </View>

        {/* ── Today's mood ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>
            {todayMood ? t.home.moodToday : t.home.moodPrompt}
          </Text>
          <View style={s.moodRow}>
            {moods.map((m) => {
              const active = todayMood === m.value;
              return (
                <TouchableOpacity
                  key={m.value}
                  onPress={() => router.push('/journal')}
                  activeOpacity={0.75}
                  style={[
                    s.moodBtn,
                    { backgroundColor: active ? m.color : colors.backgroundElement },
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

        {/* ── Quick actions ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>{t.home.startSession}</Text>
          <View style={s.actionsRow}>
            <TouchableOpacity
              style={[s.actionCard, { backgroundColor: colors.backgroundElement }]}
              activeOpacity={0.8}
              onPress={() => router.push('/breathe')}
            >
              <View style={[s.actionIcon, { backgroundColor: colors.accent + '33' }]}>
                <Text style={{ fontSize: 28 }}>🌬️</Text>
              </View>
              <Text style={[s.actionTitle, { color: colors.text }]}>{t.home.actions.breatheTitle}</Text>
              <Text style={[s.actionSub, { color: colors.textSecondary }]}>{t.home.actions.breatheSub}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.actionCard, { backgroundColor: colors.backgroundElement }]}
              activeOpacity={0.8}
              onPress={() => router.push('/journal')}
            >
              <View style={[s.actionIcon, { backgroundColor: colors.primary + '33' }]}>
                <Text style={{ fontSize: 28 }}>📖</Text>
              </View>
              <Text style={[s.actionTitle, { color: colors.text }]}>{t.home.actions.journalTitle}</Text>
              <Text style={[s.actionSub, { color: colors.textSecondary }]}>{t.home.actions.journalSub}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Progress / Getting started ── */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { color: colors.text }]}>
            {isFirstTime ? t.home.gettingStarted.title : t.home.progress.title}
          </Text>

          {isFirstTime ? (
            /* ── Getting-started checklist (shown only before any data) ── */
            <View style={[s.gettingStartedCard, { backgroundColor: colors.backgroundElement }]}>
              {(t.home.gettingStarted.steps as readonly { emoji: string; label: string; sub: string }[]).map((step, i) => (
                <View key={i} style={[s.stepRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.backgroundSelected }]}>
                  <Text style={s.stepEmoji}>{step.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.stepLabel, { color: colors.text }]}>{step.label}</Text>
                    <Text style={[s.stepSub, { color: colors.textSecondary }]}>{step.sub}</Text>
                  </View>
                  <Text style={[s.stepArrow, { color: colors.textSecondary }]}>→</Text>
                </View>
              ))}
            </View>
          ) : (
            /* ── Regular stats row ── */
            <View style={s.statsRow}>
              {[
                { emoji: '🔥', value: streak,            label: t.home.progress.streak   },
                { emoji: '📝', value: entries.length,    label: t.home.progress.entries  },
                { emoji: '🫁', value: breathingSessions, label: t.home.progress.sessions },
              ].map((stat) => (
                <View key={stat.label} style={[s.statCard, { backgroundColor: colors.backgroundElement }]}>
                  <Text style={s.statEmoji}>{stat.emoji}</Text>
                  <Text style={[s.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[s.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Streak explanation — shown once there is data but streak is 0 */}
          {!isFirstTime && streak === 0 && (
            <Text style={[s.streakHint, { color: colors.textSecondary }]}>
              💡 {t.home.streakHow}
            </Text>
          )}
        </View>

        {/* ── Today's journal entries ── */}
        {todayEntries.length > 0 && (
          <View style={s.section}>
            <Text style={[s.sectionTitle, { color: colors.text }]}>{t.home.todayEntries}</Text>
            {todayEntries.slice(0, 3).map((entry) => {
              const mood = moods[entry.mood - 1];
              return (
                <View key={entry.id} style={[s.entryCard, { backgroundColor: colors.backgroundElement }]}>
                  <Text style={s.entryEmoji}>{mood?.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.entryMood, { color: colors.text }]}>{mood?.label}</Text>
                    {!!entry.note && (
                      <Text style={[s.entryNote, { color: colors.textSecondary }]} numberOfLines={2}>
                        {entry.note}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1 },
  scroll:       { paddingHorizontal: Spacing.three, paddingBottom: Spacing.six },
  header:       { paddingTop: Spacing.three, paddingBottom: Spacing.two },
  headerTop:    { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: Spacing.two },
  headerLeft:   { flex: 1, gap: Spacing.half },
  date:         { fontSize: 13, fontWeight: '500' },
  greeting:     { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  helpBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
                  borderRadius: 20, paddingHorizontal: Spacing.two, paddingVertical: 5,
                  marginTop: Spacing.one },
  helpBtnEmoji: { fontSize: 12 },
  helpBtnTxt:   { fontSize: 12, fontWeight: '600' },

  // Language toggle pill — compact so 4 buttons fit
  langPill:     { flexDirection: 'row', borderRadius: 50, overflow: 'hidden', alignSelf: 'flex-start', marginTop: Spacing.one },
  langBtn:      { flexDirection: 'row', alignItems: 'center', gap: 3,
                  paddingHorizontal: Spacing.one + 4, paddingVertical: Spacing.one + 2 },
  langBtnFirst: { borderTopLeftRadius: 50, borderBottomLeftRadius: 50 },
  langBtnLast:  { borderTopRightRadius: 50, borderBottomRightRadius: 50 },
  langFlag:     { fontSize: 12 },
  langLabel:    { fontSize: 11, fontWeight: '700' },

  quoteCard:    { borderRadius: 16, padding: Spacing.three, gap: Spacing.one, marginBottom: Spacing.three },
  quoteText:    { fontSize: 15, lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  quoteAuthor:  { fontSize: 12, fontWeight: '600' },

  section:      { marginBottom: Spacing.three },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: Spacing.two },

  moodRow:      { flexDirection: 'row', gap: Spacing.one },
  moodBtn:      { flex: 1, alignItems: 'center', borderRadius: 14, paddingVertical: Spacing.two, gap: 4 },
  moodBtnActive:{ transform: [{ scale: 1.08 }] },
  moodEmoji:    { fontSize: 22 },
  moodLabel:    { fontSize: 10, fontWeight: '600' },

  actionsRow:   { flexDirection: 'row', gap: Spacing.two },
  actionCard:   { flex: 1, borderRadius: 18, padding: Spacing.three, gap: Spacing.two },
  actionIcon:   { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  actionTitle:  { fontSize: 16, fontWeight: '700' },
  actionSub:    { fontSize: 12, fontWeight: '500' },

  // Getting-started card
  gettingStartedCard: { borderRadius: 18, overflow: 'hidden' },
  stepRow:      { flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
                  paddingHorizontal: Spacing.three, paddingVertical: Spacing.two + 4 },
  stepEmoji:    { fontSize: 24, width: 32, textAlign: 'center' },
  stepLabel:    { fontSize: 14, fontWeight: '700' },
  stepSub:      { fontSize: 12, fontWeight: '500', marginTop: 2 },
  stepArrow:    { fontSize: 16 },

  statsRow:     { flexDirection: 'row', gap: Spacing.two },
  statCard:     { flex: 1, borderRadius: 16, padding: Spacing.two, alignItems: 'center', gap: Spacing.half },
  statEmoji:    { fontSize: 20 },
  statValue:    { fontSize: 22, fontWeight: '700' },
  statLabel:    { fontSize: 11, fontWeight: '500' },

  streakHint:   { fontSize: 12, fontWeight: '500', marginTop: Spacing.two,
                  textAlign: 'center', lineHeight: 18 },

  entryCard:    { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14,
                  padding: Spacing.two, gap: Spacing.two, marginBottom: Spacing.one },
  entryEmoji:   { fontSize: 24 },
  entryMood:    { fontSize: 14, fontWeight: '700' },
  entryNote:    { fontSize: 13, marginTop: 2, lineHeight: 18 },
});
