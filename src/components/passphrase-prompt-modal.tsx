/**
 * PassphrasePromptModal — a cross-platform stand-in for Alert.prompt (iOS
 * only) so the restore flow (issue #61) can ask for a passphrase on Android
 * too. Purely a text-entry sheet; the caller owns validation and errors.
 */
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface PassphrasePromptModalProps {
  visible: boolean;
  title: string;
  body: string;
  placeholder: string;
  confirmLabel: string;
  cancelLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: (passphrase: string) => void;
}

export function PassphrasePromptModal({
  visible,
  title,
  body,
  placeholder,
  confirmLabel,
  cancelLabel,
  busy,
  onCancel,
  onConfirm,
}: PassphrasePromptModalProps) {
  const { colors } = useTheme();
  const [passphrase, setPassphrase] = useState('');

  const handleCancel = () => { setPassphrase(''); onCancel(); };
  const handleConfirm = () => {
    if (!passphrase) return;
    onConfirm(passphrase);
    setPassphrase('');
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleCancel}>
      <KeyboardAvoidingView style={pm.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={pm.backdrop} activeOpacity={1} onPress={handleCancel} />
        <View style={[pm.card, { backgroundColor: colors.surface }]}>
          <Text style={[pm.title, { color: colors.text }]}>{title}</Text>
          <Text style={[pm.body, { color: colors.textSecondary }]}>{body}</Text>
          <TextInput
            style={[pm.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.backgroundElement }]}
            value={passphrase}
            onChangeText={setPassphrase}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            autoFocus
            editable={!busy}
          />
          <View style={pm.buttonRow}>
            <TouchableOpacity style={pm.cancelBtn} onPress={handleCancel} disabled={busy}>
              <Text style={[pm.cancelText, { color: colors.textSecondary }]}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[pm.confirmBtn, { backgroundColor: colors.primary }, (!passphrase || busy) && pm.disabled]}
              onPress={handleConfirm}
              disabled={!passphrase || busy}
            >
              {busy ? <ActivityIndicator color="#fff" /> : <Text style={pm.confirmText}>{confirmLabel}</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: Spacing.four },
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.55)' },
  card: { width: '100%', borderRadius: 16, padding: Spacing.four, gap: Spacing.two },
  title: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two + 4, fontSize: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.three, marginTop: Spacing.one },
  cancelBtn: { paddingVertical: Spacing.two, paddingHorizontal: Spacing.two },
  cancelText: { fontSize: 15, fontWeight: '600' },
  confirmBtn: { borderRadius: 10, paddingVertical: Spacing.two, paddingHorizontal: Spacing.three + 4 },
  disabled: { opacity: 0.5 },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
