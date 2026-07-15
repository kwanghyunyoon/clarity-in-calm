/**
 * FeedbackModal — "Report an issue" sheet. Posts to a Cloudflare Worker.
 * Unrelated to onboarding; rendered from OnboardingModal's "Report an issue" link
 * because that's currently the only entry point into it.
 */

import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const FEEDBACK_WORKER = 'https://app-feedback.kwangyoon.workers.dev';
const ISSUE_TYPES     = ['Bug', 'Suggestion', 'Other'];

export function FeedbackModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { colors } = useTheme();
  const [issueType, setIssueType]     = useState('Bug');
  const [description, setDescription] = useState('');
  const [status, setStatus]           = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const reset = () => {
    setIssueType('Bug');
    setDescription('');
    setStatus('idle');
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!description.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch(FEEDBACK_WORKER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issueType, description: description.trim(), source: 'clarity' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={fs.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={fs.backdrop} activeOpacity={1} onPress={handleClose} />
        <View style={[fs.sheet, { backgroundColor: colors.surface }]}>
          {status === 'success' ? (
            <View style={fs.centered}>
              <Text style={fs.successIcon}>✅</Text>
              <Text style={[fs.successTitle, { color: colors.text }]}>Thanks!</Text>
              <Text style={[fs.successBody, { color: colors.textSecondary }]}>
                Your feedback has been received.
              </Text>
              <TouchableOpacity
                style={[fs.submitBtn, { backgroundColor: colors.primary }]}
                onPress={handleClose}
              >
                <Text style={fs.submitBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[fs.sheetTitle, { color: colors.text }]}>Report an issue</Text>
              <Text style={[fs.fieldLabel, { color: colors.textSecondary }]}>Type</Text>
              <View style={fs.typeRow}>
                {ISSUE_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      fs.typeBtn,
                      { borderColor: colors.backgroundSelected },
                      issueType === t && { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
                    ]}
                    onPress={() => setIssueType(t)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      fs.typeText,
                      { color: issueType === t ? colors.primary : colors.textSecondary },
                      issueType === t && { fontWeight: '700' as const },
                    ]}>
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[fs.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
              <TextInput
                style={[fs.textInput, fs.textInputMulti, {
                  backgroundColor: colors.backgroundElement,
                  borderColor: colors.backgroundSelected,
                  color: colors.text,
                }]}
                placeholder="Describe what happened..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={description}
                onChangeText={setDescription}
              />
              {status === 'error' && (
                <Text style={fs.errorText}>Something went wrong. Please try again.</Text>
              )}
              <TouchableOpacity
                style={[
                  fs.submitBtn,
                  { backgroundColor: colors.primary },
                  (!description.trim() || status === 'sending') && fs.submitBtnDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!description.trim() || status === 'sending'}
                activeOpacity={0.85}
              >
                <Text style={fs.submitBtnText}>
                  {status === 'sending' ? 'Sending…' : 'Send feedback'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const fs = StyleSheet.create({
  overlay:           { flex: 1, justifyContent: 'flex-end' },
  backdrop:          { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)' },
  sheet:             { borderTopLeftRadius: 24, borderTopRightRadius: 24,
                       padding: Spacing.four, paddingBottom: Spacing.four + 16, gap: Spacing.two },
  sheetTitle:        { fontSize: 22, fontWeight: '800', marginBottom: Spacing.one },
  fieldLabel:        { fontSize: 12, fontWeight: '600', marginTop: Spacing.two },
  typeRow:           { flexDirection: 'row', gap: Spacing.two },
  typeBtn:           { flex: 1, paddingVertical: Spacing.two, borderRadius: 10,
                       borderWidth: 1.5, alignItems: 'center' },
  typeText:          { fontSize: 13, fontWeight: '500' },
  textInput:         { borderRadius: 10, borderWidth: 1,
                       paddingHorizontal: Spacing.two + 4, paddingVertical: Spacing.two,
                       fontSize: 15 },
  textInputMulti:    { height: 100 },
  errorText:         { fontSize: 12, color: '#d33', textAlign: 'center' },
  submitBtn:         { borderRadius: 50, paddingVertical: Spacing.two + 6,
                       alignItems: 'center', marginTop: Spacing.two },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText:     { fontSize: 16, fontWeight: '700', color: '#ffffff' },
  centered:          { alignItems: 'center', paddingVertical: Spacing.five, gap: Spacing.three },
  successIcon:       { fontSize: 48 },
  successTitle:      { fontSize: 24, fontWeight: '800' },
  successBody:       { fontSize: 15, textAlign: 'center' },
});
