import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EntryForm } from '@/components/vocabulary/entry-form';
import { useEntry, useVocabularyActions } from '@/hooks/use-vocabulary';

export default function EditWordScreen() {
  const { entryId } = useLocalSearchParams<{ entryId: string }>();
  const entry = useEntry(entryId);
  const { updateEntry } = useVocabularyActions();

  if (!entry) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Word not found</ThemedText>
      </ThemedView>
    );
  }

  const handleSubmit = (input: Parameters<typeof updateEntry>[1]) => {
    const result = updateEntry(entryId, input);
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
          <EntryForm initialEntry={entry} onSubmit={handleSubmit} />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
