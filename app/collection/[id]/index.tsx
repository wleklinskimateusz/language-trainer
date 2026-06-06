import { type Href, router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { EmptyState } from '@/components/vocabulary/empty-state';
import { EntryListItem } from '@/components/vocabulary/entry-list-item';
import {
  useCollection,
  useCollectionEntries,
  useVocabularyActions,
} from '@/hooks/use-vocabulary';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();

  const collection = useCollection(id);
  const entries = useCollectionEntries(id);
  const { deleteEntry } = useVocabularyActions();

  if (!collection) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Collection not found</ThemedText>
      </ThemedView>
    );
  }

  const handleDeleteEntry = (entryId: string, label: string) => {
    Alert.alert('Delete word', `Delete "${label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteEntry(entryId) },
    ]);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: collection.name,
          headerRight: () => (
            <Pressable
              onPress={() => router.push(`/collection/${id}/add` as Href)}
              hitSlop={8}>
              <ThemedText style={[styles.headerAction, { color: colors.primary }]}>Add</ThemedText>
            </Pressable>
          ),
        }}
      />

      <ThemedView style={styles.container}>
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.learnButton,
              { backgroundColor: colors.primary },
              entries.length === 0 && styles.learnButtonDisabled,
            ]}
            disabled={entries.length === 0}
            onPress={() => router.push(`/collection/${id}/learn` as Href)}>
            <ThemedText style={[styles.learnButtonText, { color: colors.onPrimary }]}>
              Start Learning ({entries.length})
            </ThemedText>
          </Pressable>
        </View>

        {entries.length === 0 ? (
          <EmptyState
            title="No words yet"
            description="Add nouns, verbs, or phrases to start learning."
            actionLabel="Add word"
            onAction={() => router.push(`/collection/${id}/add` as Href)}
          />
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <EntryListItem
                entry={item}
                onPress={() =>
                  router.push(`/collection/${id}/edit/${item.id}` as Href)
                }
                onDelete={() => handleDeleteEntry(item.id, item.meaning)}
              />
            )}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAction: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    padding: 16,
  },
  learnButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  learnButtonDisabled: {
    opacity: 0.4,
  },
  learnButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  list: {
    paddingHorizontal: 16,
    gap: 10,
    paddingBottom: 32,
  },
});
