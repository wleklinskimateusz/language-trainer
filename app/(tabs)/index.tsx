import { type Href, router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CollectionCard } from '@/components/vocabulary/collection-card';
import { EmptyState } from '@/components/vocabulary/empty-state';
import {
  useCollectionEntryCount,
  useCollections,
  useVocabularyActions,
  useVocabularyHydration,
} from '@/hooks/use-vocabulary';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { Collection } from '@/types/vocabulary';

function CollectionCardItem({
  collection,
  onPress,
  onDelete,
}: {
  collection: Collection;
  onPress: () => void;
  onDelete: () => void;
}) {
  const entryCount = useCollectionEntryCount(collection.id);
  return (
    <CollectionCard
      collection={collection}
      entryCount={entryCount}
      onPress={onPress}
      onDelete={onDelete}
    />
  );
}

export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';

  const hydrated = useVocabularyHydration();
  const collections = useCollections();
  const { createCollection, deleteCollection } = useVocabularyActions();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const collection = createCollection(name);
    setNewName('');
    setShowCreateForm(false);
    router.push(`/collection/${collection.id}` as Href);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete collection',
      `Delete "${name}" and all its words? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCollection(id) },
      ]
    );
  };

  if (!hydrated) {
    return (
      <ThemedView style={[styles.loading, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title">Collections</ThemedText>
        <ThemedText style={styles.subtitle}>German vocabulary</ThemedText>
      </View>

      {showCreateForm ? (
        <View style={[styles.createForm, { borderColor }]}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor }]}
            value={newName}
            onChangeText={setNewName}
            placeholder="Collection name"
            placeholderTextColor="#9BA1A6"
            autoFocus
            onSubmitEditing={handleCreate}
          />
          <View style={styles.createActions}>
            <Pressable onPress={() => { setShowCreateForm(false); setNewName(''); }}>
              <ThemedText style={styles.cancelText}>Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={handleCreate}>
              <ThemedText style={[styles.createButtonText, { color: colors.onPrimary }]}>
                Create
              </ThemedText>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          style={[styles.newButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateForm(true)}>
          <ThemedText style={[styles.newButtonText, { color: colors.onPrimary }]}>
            New Collection
          </ThemedText>
        </Pressable>
      )}

      {collections.length === 0 ? (
        <EmptyState
          title="No collections yet"
          description="Create a collection to start adding German words and phrases."
          actionLabel="Create your first collection"
          onAction={() => setShowCreateForm(true)}
        />
      ) : (
        <FlatList
          data={collections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <CollectionCardItem
              collection={item}
              onPress={() => router.push(`/collection/${item.id}` as Href)}
              onDelete={() => handleDelete(item.id, item.name)}
            />
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 20,
    gap: 4,
  },
  subtitle: {
    opacity: 0.6,
    fontSize: 16,
  },
  newButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  newButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  createForm: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  createActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  cancelText: {
    fontSize: 15,
    opacity: 0.7,
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    fontWeight: '600',
  },
  list: {
    gap: 12,
    paddingBottom: 32,
  },
});
