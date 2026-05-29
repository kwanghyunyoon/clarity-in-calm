import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props { children: React.ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.root}>
        <Text style={styles.emoji}>🫁</Text>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          Clarity in Calm ran into an unexpected error. Your journal is safe — it's encrypted on your device.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => this.setState({ hasError: false })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emoji:  { fontSize: 48, marginBottom: 24 },
  title:  { fontSize: 22, fontWeight: '700', color: '#1a2b3c', textAlign: 'center', marginBottom: 12 },
  body:   { fontSize: 15, color: '#3a4a5a', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  btn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#208AEF',
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});
