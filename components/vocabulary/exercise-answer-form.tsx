import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Exercise } from '@/types/exercises';

type ExerciseAnswerFormProps = {
  exercise: Exercise;
  checked: boolean;
  isCorrect: boolean | null;
  onCheck: (answer: string) => void;
  onReveal: () => void;
  onNext: () => void;
};

export function ExerciseAnswerForm({
  exercise,
  checked,
  isCorrect,
  onCheck,
  onReveal,
  onNext,
}: ExerciseAnswerFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';

  const [answer, setAnswer] = useState('');

  useEffect(() => {
    setAnswer('');
  }, [exercise.id]);

  const canCheck = answer.trim().length > 0 && !checked;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Your answer</ThemedText>
      <TextInput
        style={[
          styles.input,
          { color: colors.text, borderColor, backgroundColor: colors.background },
          checked && isCorrect === true && styles.inputCorrect,
          checked && isCorrect === false && styles.inputIncorrect,
        ]}
        value={answer}
        onChangeText={setAnswer}
        placeholder={
          exercise.exerciseId === 'noun_meaning_to_plural'
            ? 'e.g. die Hunde'
            : exercise.exerciseId === 'noun_meaning_to_singular'
              ? 'e.g. der Hund'
              : 'Type your answer'
        }
        placeholderTextColor="#9BA1A6"
        editable={!checked}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => canCheck && onCheck(answer)}
      />

      {!checked ? (
        <View style={styles.actions}>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: colorScheme === 'light' ? '#FFEBEE' : '#3D2020' },
            ]}
            onPress={onReveal}>
            <ThemedText style={styles.dontKnowText}>{"Don't know"}</ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: colors.primary },
              !canCheck && styles.actionButtonDisabled,
            ]}
            disabled={!canCheck}
            onPress={() => onCheck(answer)}>
            <ThemedText style={[styles.checkText, { color: colors.onPrimary }]}>Check</ThemedText>
          </Pressable>
        </View>
      ) : (
        <View style={styles.feedbackSection}>
          {isCorrect ? (
            <ThemedText style={styles.feedbackCorrect}>Correct</ThemedText>
          ) : (
            <View style={styles.feedbackIncorrect}>
              <ThemedText style={styles.feedbackWrong}>Incorrect</ThemedText>
              <ThemedText style={styles.correctAnswer}>
                Answer: {exercise.answer}
              </ThemedText>
            </View>
          )}

          <Pressable
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={onNext}>
            <ThemedText style={[styles.continueText, { color: colors.onPrimary }]}>
              Continue
            </ThemedText>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 18,
  },
  inputCorrect: {
    borderColor: '#4CAF50',
  },
  inputIncorrect: {
    borderColor: '#E53935',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  dontKnowText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 16,
  },
  checkText: {
    fontWeight: '600',
    fontSize: 16,
  },
  feedbackSection: {
    gap: 12,
    marginTop: 4,
  },
  feedbackCorrect: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '600',
  },
  feedbackIncorrect: {
    gap: 4,
  },
  feedbackWrong: {
    color: '#E53935',
    fontSize: 18,
    fontWeight: '600',
  },
  correctAnswer: {
    fontSize: 16,
    opacity: 0.8,
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
