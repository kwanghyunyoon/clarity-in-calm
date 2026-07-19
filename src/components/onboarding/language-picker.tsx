/**
 * Single source of truth for "list LANGUAGES, highlight the selected one,
 * call onSelect" — used both as the always-visible compact toggle row
 * (every onboarding slide) and as the full card grid (first-launch language
 * step). The two contexts need different visual treatments, not different
 * selection logic, hence the variant switch rather than two components.
 */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LANGUAGES } from '@/constants/languages';
import { Spacing } from '@/constants/theme';
import type { Locale } from '@/i18n/translations';
import type { ThemeColors } from './slide-visuals';

interface LanguagePickerProps {
  colors: ThemeColors;
  selected: Locale | null;
  onSelect: (locale: Locale) => void;
  variant: 'compact' | 'cards';
}

export function LanguagePicker({ colors, selected, onSelect, variant }: LanguagePickerProps) {
  if (variant === 'compact') {
    return (
      <View style={s.langRow}>
        {LANGUAGES.map((lang, i) => {
          const active = selected === lang.locale;
          return (
            <TouchableOpacity
              key={lang.locale}
              onPress={() => onSelect(lang.locale)}
              activeOpacity={0.75}
              style={[
                s.langBtn,
                { backgroundColor: active ? colors.primary : colors.backgroundElement },
                i === 0 && s.langBtnFirst,
                i === LANGUAGES.length - 1 && s.langBtnLast,
              ]}
            >
              <Text style={s.langFlag}>{lang.flag}</Text>
              <Text style={[s.langLabel, { color: active ? '#fff' : colors.textSecondary }]}>
                {lang.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  return (
    <View style={s.langCards}>
      {LANGUAGES.map((opt) => {
        const active = selected === opt.locale;
        return (
          <TouchableOpacity
            key={opt.locale}
            onPress={() => onSelect(opt.locale)}
            activeOpacity={0.8}
            style={[
              s.langCard,
              { backgroundColor: colors.backgroundElement, borderColor: active ? colors.primary : 'transparent' },
            ]}
          >
            <Text style={s.langCardFlag}>{opt.flag}</Text>
            <Text style={[s.langCardLabel, { color: colors.text }]}>{opt.nativeName}</Text>
            {active && <Text style={[s.langCardCheck, { color: colors.primary }]}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  langRow:      { flexDirection: 'row', justifyContent: 'center',
                  borderRadius: 50, overflow: 'hidden', alignSelf: 'center',
                  marginTop: Spacing.four },
  langBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4,
                  paddingHorizontal: Spacing.two + 4, paddingVertical: Spacing.one + 4 },
  langBtnFirst: { borderTopLeftRadius: 50, borderBottomLeftRadius: 50 },
  langBtnLast:  { borderTopRightRadius: 50, borderBottomRightRadius: 50 },
  langFlag:     { fontSize: 14 },
  langLabel:    { fontSize: 12, fontWeight: '700' },

  langCards:      { width: '100%', gap: Spacing.two, marginTop: Spacing.two },
  langCard:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.two,
                    borderRadius: 14, borderWidth: 2,
                    paddingHorizontal: Spacing.three, paddingVertical: Spacing.two + 4 },
  langCardFlag:   { fontSize: 22 },
  langCardLabel:  { fontSize: 16, fontWeight: '700', flex: 1 },
  langCardCheck:  { fontSize: 18, fontWeight: '700' },
});
