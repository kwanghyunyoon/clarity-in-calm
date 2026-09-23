/**
 * OnboardingModal — shown on first launch AND whenever the user taps the help button.
 * Language toggle is available on every slide.
 * Each slide has a tailored visual component in addition to the text content.
 */

import { Ionicons } from '@expo/vector-icons';
import { useGlobalSearchParams, usePathname } from 'expo-router';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated2, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useHelp } from '@/context/help-context';
import { useLocale } from '@/context/language-context';
import { useRestoreFlow } from '@/hooks/use-restore-flow';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { useOnboardingFlow } from '@/hooks/use-onboarding-flow';

import { PassphrasePromptModal } from './passphrase-prompt-modal';
import { LanguagePicker } from './onboarding/language-picker';
import { LanguageStepView } from './onboarding/language-step';
import { SlideVisual } from './onboarding/slide-visuals';

export function OnboardingModal() {
  const { colors }            = useTheme();
  const t                     = useTranslation();
  const { locale, setLocale } = useLocale();
  const { isHelpVisible, hideHelp } = useHelp();
  const insets                = useSafeAreaInsets();
  const route = { route: usePathname(), params: useGlobalSearchParams() };

  const slides    = t.onboarding.slides as readonly { emoji: string; title: string; body: string }[];
  const checklist = t.onboarding.shieldChecklist as readonly string[];

  const {
    visible,
    showLanguageStep,
    langSelection,
    setLangSelection,
    page,
    isLast,
    handleNext,
    handleClose,
    handleLanguageContinue,
  } = useOnboardingFlow({ isHelpVisible, hideHelp, setLocale, slideCount: slides.length, route });

  const {
    tb: restoreTb,
    passphraseModalVisible,
    passphraseBusy,
    restoring,
    handleChooseRestoreFile,
    handlePassphraseConfirm,
    cancelPassphrase,
  } = useRestoreFlow(handleClose);

  const slide = slides[page];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      statusBarTranslucent
    >
      <View
        style={[
          s.root,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + Spacing.three,
            paddingBottom: insets.bottom + Spacing.three,
          },
        ]}
      >

        {/* ── Close / skip button (top-right) ── */}
        <TouchableOpacity
          style={[s.closeBtn, { top: insets.top + Spacing.two }]}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <Text style={[s.closeTxt, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>

        {showLanguageStep ? (
          <LanguageStepView
            colors={colors}
            t={t}
            selected={langSelection}
            onSelect={setLangSelection}
            onContinue={handleLanguageContinue}
            onRestorePress={restoring ? undefined : handleChooseRestoreFile}
          />
        ) : (
          <>
            {/* ── Language toggle ── */}
            <LanguagePicker colors={colors} selected={locale} onSelect={setLocale} variant="compact" />

            {/* ── Icon + text, centered together as one group ── */}
            <View style={s.contentCenter}>
              <Animated2.View key={`visual-${page}`} entering={FadeIn.duration(300)} style={s.visualWrap}>
                <SlideVisual page={page} colors={colors} t={t} />
              </Animated2.View>

              <Animated2.View key={`text-${page}`} entering={FadeIn.duration(280)} style={s.slide}>
                <Text style={[s.title, { color: colors.text }]}>{slide.title}</Text>
                <Text style={[s.body,  { color: colors.textSecondary }]}>{slide.body}</Text>
                {isLast && (
                  <View style={s.checklist}>
                    {checklist.map((item, i) => (
                      <View key={i} style={s.checklistRow}>
                        <Ionicons name="checkmark-circle" size={15} color={colors.primary} />
                        <Text style={[s.checklistText, { color: colors.text }]}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Animated2.View>
            </View>

            {/* ── Bottom ── */}
            <View style={s.bottom}>
              <View style={s.dots}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      s.dot,
                      {
                        backgroundColor: i === page ? colors.primary : colors.backgroundSelected,
                        width: i === page ? 20 : 8,
                      },
                    ]}
                  />
                ))}
              </View>

              <Text style={[s.privacy, { color: colors.textSecondary }]}>
                {t.onboarding.privacy}
              </Text>

              <TouchableOpacity
                style={[s.btn, { backgroundColor: colors.primary }]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={s.btnText}>
                  {isLast ? t.onboarding.getStarted : t.onboarding.next}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

      </View>

      <PassphrasePromptModal
        visible={passphraseModalVisible}
        title={restoreTb.restorePassphrasePrompt.title}
        body={restoreTb.restorePassphrasePrompt.body}
        placeholder={restoreTb.restorePassphrasePrompt.placeholder}
        confirmLabel={restoreTb.restorePassphrasePrompt.confirm}
        cancelLabel={restoreTb.restorePassphrasePrompt.cancel}
        busy={passphraseBusy}
        onCancel={cancelPassphrase}
        onConfirm={handlePassphraseConfirm}
      />
    </Modal>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, paddingHorizontal: Spacing.four },

  closeBtn:     { position: 'absolute', right: Spacing.four,
                  width: 36, height: 36, alignItems: 'center', justifyContent: 'center',
                  zIndex: 10 },
  closeTxt:     { fontSize: 18, fontWeight: '600' },

  // Icon + text block, centered as one group in the space between the
  // language row and the footer (see contentCenter below)
  contentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing.three },

  // Visual area
  visualWrap:   { alignItems: 'center', justifyContent: 'center' },

  // Slide text
  slide:        { alignItems: 'center', gap: Spacing.two,
                  paddingHorizontal: Spacing.two },
  title:        { fontSize: 28, fontWeight: '800', textAlign: 'center',
                  letterSpacing: -0.5, lineHeight: 36, alignSelf: 'stretch' },
  body:         { fontSize: 15, lineHeight: 23, textAlign: 'center', fontWeight: '500',
                  maxWidth: 300 },
  checklist:      { gap: Spacing.one + 4, alignSelf: 'stretch', marginTop: Spacing.one },
  checklistRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.one + 2 },
  checklistText:  { fontSize: 14, lineHeight: 20, fontWeight: '500', flex: 1 },

  bottom:       { gap: Spacing.two + 2, alignItems: 'center' },
  dots:         { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot:          { height: 8, borderRadius: 4 },
  privacy:      { fontSize: 13, fontWeight: '500', textAlign: 'center' },
  btn:          { paddingHorizontal: Spacing.five, paddingVertical: Spacing.two + 6,
                  borderRadius: 50, alignItems: 'center', width: '100%' },
  btnText:      { fontSize: 17, fontWeight: '700', color: '#ffffff' },
});
