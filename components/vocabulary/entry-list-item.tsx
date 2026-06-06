import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getEntryPrimaryText, getEntryTypeLabel } from '@/lib/vocabulary/selectors';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { VocabularyEntry } from '@/types/vocabulary';

type EntryListItemProps = {
  entry: VocabularyEntry;
  onPress: () => void;
  onDelete: () => void;
};

export function EntryListItem({ entry, onPress, onDelete }: EntryListItemProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';
  const badgeBg = colorScheme === 'light' ? '#E8F4F8' : '#1E3A44';

  return (
    <Pressable onPress={onPress}>
      <ThemedView style={[styles.card, { borderColor }]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: badgeBg }]}>
              <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
                {getEntryTypeLabel(entry.type)}
              </ThemedText>
            </View>
          </View>
          <ThemedText type="defaultSemiBold">{getEntryPrimaryText(entry)}</ThemedText>
          <ThemedText style={styles.meaning} numberOfLines={2}>
            {entry.meaning}
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
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  meaning: {
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
