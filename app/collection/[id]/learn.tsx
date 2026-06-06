import { router, Stack, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ExerciseAnswerForm } from '@/components/vocabulary/exercise-answer-form';
import { ExercisePrompt } from '@/components/vocabulary/exercise-prompt';
import { useLearningSession } from '@/hooks/use-learning-session';
import { useCollection, useCollectionEntries } from '@/hooks/use-vocabulary';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function LearnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColors();

  const collection = useCollection(id);
  const entries = useCollectionEntries(id);

  const {
    currentExercise,
    currentIndex,
    checked,
    isCorrect,
    correctCount,
    incorrectCount,
    finished,
    total,
    check,
    revealAnswer,
    next,
  } = useLearningSession(entries);

  if (!collection) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Collection not found</ThemedText>
      </ThemedView>
    );
  }

  if (entries.length === 0 || total === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No words to learn</ThemedText>
      </ThemedView>
    );
  }

  if (finished) {
    return (
      <>
        <Stack.Screen options={{ title: 'Summary' }} />
        <ThemedView style={styles.summary}>
          <ThemedText type="title" style={styles.summaryTitle}>
            Session complete
          </ThemedText>
          <ThemedText style={styles.summarySubtitle}>{collection.name}</ThemedText>

          <View style={styles.stats}>
            <Stat label="Total" value={total} />
            <Stat label="Correct" value={correctCount} color="#4CAF50" />
            <Stat label="Incorrect" value={incorrectCount} color="#E53935" />
          </View>

          <Pressable
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}>
            <ThemedText style={[styles.doneButtonText, { color: colors.onPrimary }]}>
              Back to collection
            </ThemedText>
          </Pressable>
        </ThemedView>
      </>
    );
  }

  if (!currentExercise) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No exercises available</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learn · ${currentIndex + 1}/${total}`,
        }}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ThemedView style={styles.container}>
            <ExercisePrompt
              exercise={currentExercise}
              currentIndex={currentIndex}
              total={total}
            />
            <ExerciseAnswerForm
              exercise={currentExercise}
              checked={checked}
              isCorrect={isCorrect}
              onCheck={check}
              onReveal={revealAnswer}
              onNext={next}
            />
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="title" style={[styles.statValue, color ? { color } : undefined]}>
        {value}
      </ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 24,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  summaryTitle: {
    textAlign: 'center',
  },
  summarySubtitle: {
    opacity: 0.6,
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginVertical: 24,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 36,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  doneButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  doneButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
