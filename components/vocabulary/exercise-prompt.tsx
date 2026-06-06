import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Exercise } from '@/types/exercises';

type ExercisePromptProps = {
  exercise: Exercise;
  currentIndex: number;
  total: number;
};

export function ExercisePrompt({ exercise, currentIndex, total }: ExercisePromptProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const isPlural = exercise.exerciseId === 'noun_meaning_to_plural';
  const badgeBg = isPlural
    ? colorScheme === 'light'
      ? '#EDE7F6'
      : '#2D2640'
    : colorScheme === 'light'
      ? '#E8F4F8'
      : '#1E3A44';
  const badgeColor = isPlural ? '#5E35B1' : colors.primary;
  const contextBg = colorScheme === 'light' ? '#F5F5F5' : '#252829';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedView style={[styles.badge, { backgroundColor: badgeBg }]}>
          <ThemedText style={[styles.badgeText, { color: badgeColor }]}>
            {exercise.label}
          </ThemedText>
        </ThemedView>
        <ThemedText style={styles.progress}>
          {currentIndex + 1} / {total}
        </ThemedText>
      </View>

      {exercise.context && (
        <ThemedView style={[styles.contextBox, { backgroundColor: contextBg }]}>
          <ThemedText style={styles.contextLabel}>Singular</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.contextValue}>
            {exercise.context}
          </ThemedText>
          {isPlural && (
            <ThemedText style={[styles.pluralArrow, { color: badgeColor }]}>
              → plural form
            </ThemedText>
          )}
        </ThemedView>
      )}

      {exercise.instruction && (
        <ThemedText style={[styles.instruction, isPlural && { color: badgeColor }]}>
          {exercise.instruction}
        </ThemedText>
      )}

      <ThemedText style={styles.promptLabel}>Meaning</ThemedText>
      <ThemedText type="title" style={styles.prompt}>
        {exercise.prompt}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  progress: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '600',
  },
  contextBox: {
    padding: 14,
    borderRadius: 10,
    gap: 4,
  },
  contextLabel: {
    fontSize: 12,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  contextValue: {
    fontSize: 20,
  },
  pluralArrow: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  instruction: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.85,
  },
  promptLabel: {
    fontSize: 14,
    opacity: 0.5,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prompt: {
    fontSize: 28,
    lineHeight: 36,
  },
});
