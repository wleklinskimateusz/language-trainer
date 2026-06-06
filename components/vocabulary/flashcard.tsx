import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getEntryTypeLabel, getFlashcardBack, getFlashcardFront } from '@/lib/vocabulary/selectors';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { VocabularyEntry } from '@/types/vocabulary';

type FlashcardProps = {
  entry: VocabularyEntry;
  isFlipped: boolean;
  onFlip: () => void;
};

export function Flashcard({ entry, isFlipped, onFlip }: FlashcardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';
  const badgeBg = colorScheme === 'light' ? '#E8F4F8' : '#1E3A44';

  return (
    <Pressable onPress={onFlip} style={styles.pressable}>
      <ThemedView style={[styles.card, { borderColor }]}>
        <ThemedView style={[styles.badge, { backgroundColor: badgeBg }]}>
          <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
            {getEntryTypeLabel(entry.type)}
          </ThemedText>
        </ThemedView>

        <ThemedText style={styles.hint}>{isFlipped ? 'Answer' : 'Question'}</ThemedText>
        <ThemedText type="title" style={styles.content}>
          {isFlipped ? getFlashcardBack(entry) : getFlashcardFront(entry)}
        </ThemedText>
        <ThemedText style={styles.tapHint}>Tap to {isFlipped ? 'hide' : 'reveal'}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    minHeight: 280,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  hint: {
    fontSize: 14,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  content: {
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 36,
  },
  tapHint: {
    fontSize: 13,
    opacity: 0.4,
    marginTop: 8,
  },
});
