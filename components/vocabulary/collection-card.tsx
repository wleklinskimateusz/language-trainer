import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Collection } from '@/types/vocabulary';

type CollectionCardProps = {
  collection: Collection;
  entryCount: number;
  onPress: () => void;
  onDelete: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function CollectionCard({ collection, entryCount, onPress, onDelete }: CollectionCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';

  return (
    <Pressable onPress={onPress}>
      <ThemedView style={[styles.card, { borderColor }]}>
        <View style={styles.content}>
          <ThemedText type="defaultSemiBold" style={styles.name}>
            {collection.name}
          </ThemedText>
          <ThemedText style={styles.meta}>
            {entryCount} {entryCount === 1 ? 'word' : 'words'} · German · Updated{' '}
            {formatDate(collection.updatedAt)}
          </ThemedText>
        </View>
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.deletePressed]}>
          <ThemedText style={[styles.deleteText, { color: colors.primary }]}>
            Delete
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 18,
  },
  meta: {
    fontSize: 14,
    opacity: 0.7,
  },
  deleteButton: {
    padding: 8,
  },
  deletePressed: {
    opacity: 0.6,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
