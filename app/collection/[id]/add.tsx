import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { EntryForm } from '@/components/vocabulary/entry-form';
import { useVocabularyActions } from '@/hooks/use-vocabulary';

export default function AddWordScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addEntry } = useVocabularyActions();

  const handleSubmit = (input: Parameters<typeof addEntry>[1]) => {
    const result = addEntry(id, input);
    if (!result.error) {
      router.back();
    }
    return result;
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <EntryForm onSubmit={handleSubmit} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
});
