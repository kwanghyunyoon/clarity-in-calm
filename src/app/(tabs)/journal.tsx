import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { JournalComposer } from '@/components/journal/JournalComposer';
import { JournalEntryList } from '@/components/journal/JournalEntryList';
import { Screen, ScreenHeader } from '@/components/ui/Screen';
import { SpotlightRect, TourOverlay } from '@/components/tour/TourOverlay';
import { JOURNAL_TOUR } from '@/constants/tour-keys';
import { Spacing } from '@/constants/theme';
import { useScreenTour } from '@/hooks/use-screen-tour';
import { useTheme } from '@/hooks/use-theme';
import { useTranslation } from '@/hooks/use-translation';
import { measureWhenSettled } from '@/utils/measureWhenSettled';

const JOURNAL_TOUR_STEP_IDS = ['templates', 'input', 'save', 'past'] as const;

export default function JournalScreen() {
  const { colors } = useTheme();
  const t = useTranslation();
  const insets = useSafeAreaInsets();

  const templatesRef = useRef<View>(null);
  const noteInputRef = useRef<View>(null);
  const saveBtnRef = useRef<View>(null);
  const pastSectionRef = useRef<View>(null);
  const listRef = useRef<FlatList>(null);

  const anchorRefs = { templates: templatesRef, input: noteInputRef, save: saveBtnRef, past: pastSectionRef };

  const { visible, step, totalSteps, next, skip } = useScreenTour({
    tourId: JOURNAL_TOUR.tourId,
    storageKey: JOURNAL_TOUR.storageKey,
    stepIds: JOURNAL_TOUR_STEP_IDS,
  });

  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [focused, setFocused] = useState(true);

  // The overlay portals to a root-level host outside the tab's tree;
  // react-navigation freezes (doesn't unmount) inactive tabs, so force-hide
  // on blur.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  useEffect(() => {
    if (!visible) return;
    if (step.id === 'past') listRef.current?.scrollToEnd({ animated: true });

    const anchorRef = anchorRefs[step.id as keyof typeof anchorRefs];
    if (!anchorRef.current) {
      setSpotlight(null);
      return;
    }

    // Measure repeatedly until the anchor's position (and, for 'past', the
    // scroll-to-end) has actually settled, rather than guessing a fixed
    // delay — a one-shot measurement after a fixed timeout was stale
    // whenever the anchor was still settling into position.
    let stopped = false;
    const cancel = measureWhenSettled(
      (callback) => {
        const node = anchorRef.current;
        if (!node) {
          stopped = true;
          setSpotlight(null);
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
      (box) => setSpotlight({ ...box, y: box.y + insets.top }),
    );

    return () => { stopped = true; cancel(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, step.id]);

  const stepCopy = t.tour.journal.steps[step.index];

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScreenHeader>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t.journal.title}</Text>
        </ScreenHeader>

        <JournalEntryList
          header={<JournalComposer templatesRef={templatesRef} noteInputRef={noteInputRef} saveBtnRef={saveBtnRef} />}
          listRef={listRef}
          pastSectionRef={pastSectionRef}
        />
      </KeyboardAvoidingView>

      <TourOverlay
        visible={visible && focused}
        spotlight={spotlight}
        title={stepCopy.title}
        body={stepCopy.body}
        stepIndex={step.index}
        totalSteps={totalSteps}
        isLast={step.isLast}
        skipLabel={t.tour.common.skip}
        nextLabel={t.tour.common.next}
        doneLabel={t.tour.common.done}
        onNext={next}
        onSkip={skip}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginLeft: Spacing.six },
});
