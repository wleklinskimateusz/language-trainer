import type { VocabularyEntry } from '@/types/vocabulary';

export type ExerciseId =
  | 'noun_meaning_to_singular'
  | 'noun_meaning_to_plural'
  | 'verb_meaning_to_infinitive'
  | 'verb_infinitive_to_past'
  | 'phrase_meaning_to_german';

export type Exercise = {
  id: string;
  entryId: string;
  exerciseId: ExerciseId;
  entry: VocabularyEntry;
  prompt: string;
  answer: string;
  label: string;
  instruction?: string;
  context?: string;
};
