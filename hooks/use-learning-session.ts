import { useMemo, useState } from 'react';

import { checkAnswer } from '@/lib/exercises/check-answer';
import { buildExerciseQueue } from '@/lib/exercises/build-queue';
import type { Exercise } from '@/types/exercises';
import type { VocabularyEntry } from '@/types/vocabulary';

type LearningSessionState = {
  exercises: Exercise[];
  currentIndex: number;
  currentExercise: Exercise | undefined;
  checked: boolean;
  isCorrect: boolean | null;
  correctCount: number;
  incorrectCount: number;
  finished: boolean;
  total: number;
  check: (userInput: string) => void;
  revealAnswer: () => void;
  next: () => void;
};

export function useLearningSession(entries: VocabularyEntry[]): LearningSessionState {
  const exercises = useMemo(() => buildExerciseQueue(entries), [entries]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentExercise = exercises[currentIndex];

  const recordResult = (correct: boolean) => {
    if (correct) {
      setCorrectCount((c) => c + 1);
    } else {
      setIncorrectCount((c) => c + 1);
    }
    setIsCorrect(correct);
    setChecked(true);
  };

  const check = (userInput: string) => {
    if (!currentExercise || checked) return;
    recordResult(checkAnswer(currentExercise, userInput));
  };

  const revealAnswer = () => {
    if (!currentExercise || checked) return;
    recordResult(false);
  };

  const next = () => {
    if (!checked) return;

    if (currentIndex + 1 >= exercises.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setChecked(false);
      setIsCorrect(null);
    }
  };

  return {
    exercises,
    currentIndex,
    currentExercise,
    checked,
    isCorrect,
    correctCount,
    incorrectCount,
    finished,
    total: exercises.length,
    check,
    revealAnswer,
    next,
  };
}
