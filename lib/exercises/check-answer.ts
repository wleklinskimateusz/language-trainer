import { normalizeAnswer } from '@/lib/exercises/normalize';
import type { Exercise } from '@/types/exercises';

function stripArticle(text: string): string {
  return text.replace(/^(der|die|das)\s+/i, '').trim();
}

export function checkAnswer(exercise: Exercise, userInput: string): boolean {
  const normalized = normalizeAnswer(userInput);
  const expected = normalizeAnswer(exercise.answer);

  if (!normalized) return false;

  switch (exercise.exerciseId) {
    case 'noun_meaning_to_singular': {
      const expectedSingular = normalizeAnswer(stripArticle(exercise.answer));
      const inputWithoutArticle = normalizeAnswer(stripArticle(userInput));
      return normalized === expected || inputWithoutArticle === expectedSingular;
    }
    case 'noun_meaning_to_plural': {
      const expectedPlural = normalizeAnswer(stripArticle(exercise.answer));
      const inputWithoutArticle = normalizeAnswer(stripArticle(userInput));
      return normalized === expected || inputWithoutArticle === expectedPlural;
    }
    default:
      return normalized === expected;
  }
}
