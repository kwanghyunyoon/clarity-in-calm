/**
 * First-launch language step — shown once, before the language toggle is
 * available on every other slide (see LanguagePicker's 'cards' variant).
 */
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import type { Locale } from '@/i18n/translations';
import { useTranslation } from '@/hooks/use-translation';
import { LanguagePicker } from './language-picker';
import type { ThemeColors } from './slide-visuals';

export function LanguageStepView({
  colors,
  t,
  selected,
  onSelect,
  onContinue,
  onRestorePress,
}: {
  colors: ThemeColors;
  t: ReturnType<typeof useTranslation>;
  selected: Locale | null;
  onSelect: (l: Locale) => void;
  onContinue: () => void;
  onRestorePress?: () => void;
}) {
  return (
    <View style={s.langStepRoot}>
      <Ionicons name="globe-outline" size={56} color={colors.primary} style={s.langStepIcon} />
      <Text style={[s.title, { color: colors.text }]}>{t.onboarding.languageStepTitle}</Text>
      <Text style={[s.body, { color: colors.textSecondary }]}>{t.onboarding.languageStepBody}</Text>

      <LanguagePicker colors={colors} selected={selected} onSelect={onSelect} variant="cards" />

      <Text style={[s.pillTip, { color: colors.textSecondary }]}>{t.onboarding.pillTip}</Text>

      <TouchableOpacity
        style={[s.btn, { backgroundColor: colors.primary }, !selected && s.btnDisabled]}
        onPress={onContinue}
        disabled={!selected}
        activeOpacity={0.85}
      >
        <Text style={s.btnText}>{t.onboarding.continueLabel}</Text>
      </TouchableOpacity>

      {onRestorePress && (
        <TouchableOpacity onPress={onRestorePress} activeOpacity={0.7} style={s.restoreEntryBtn}>
          <Text style={[s.restoreEntryTxt, { color: colors.textSecondary }]}>
            {t.onboarding.restoreEntry}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  langStepRoot:   { flex: 1, alignItems: 'center', justifyContent: 'center',
                    gap: Spacing.two, paddingHorizontal: Spacing.two },
  langStepIcon:   { marginBottom: Spacing.one },
  pillTip:        { fontSize: 13, lineHeight: 19, textAlign: 'center',
                    marginTop: Spacing.one, maxWidth: 300 },
  btnDisabled:    { opacity: 0.4 },

  title:        { fontSize: 28, fontWeight: '800', textAlign: 'center',
                  letterSpacing: -0.5, lineHeight: 36, alignSelf: 'stretch' },
  body:         { fontSize: 15, lineHeight: 23, textAlign: 'center', fontWeight: '500',
                  maxWidth: 300 },

  btn:          { paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 6,
                  borderRadius: 50, alignItems: 'center', width: '100%' },
  btnText:      { fontSize: 17, fontWeight: '700', color: '#ffffff' },

  restoreEntryBtn: { paddingVertical: 4, marginTop: Spacing.one },
  restoreEntryTxt: { fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' },
});
