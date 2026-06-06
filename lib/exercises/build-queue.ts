import type { Exercise, ExerciseId } from '@/types/exercises';
import type { VocabularyEntry } from '@/types/vocabulary';

type ExerciseDefinition = {
  exerciseId: ExerciseId;
  label: string;
  getPrompt: (entry: VocabularyEntry) => string;
  getAnswer: (entry: VocabularyEntry) => string;
  getInstruction?: (entry: VocabularyEntry) => string | undefined;
  getContext?: (entry: VocabularyEntry) => string | undefined;
};

const NOUN_EXERCISES: ExerciseDefinition[] = [
  {
    exerciseId: 'noun_meaning_to_singular',
    label: 'Singular + article',
    getPrompt: (entry) => entry.meaning,
    getAnswer: (entry) => {
      if (entry.type !== 'noun') return '';
      return `${entry.article} ${entry.singular}`;
    },
    getInstruction: (entry) => {
      if (entry.type !== 'noun') return undefined;
      return `Type the singular with ${entry.article}`;
    },
  },
  {
    exerciseId: 'noun_meaning_to_plural',
    label: 'Plural + article (die)',
    getPrompt: (entry) => entry.meaning,
    getAnswer: (entry) => {
      if (entry.type !== 'noun') return '';
      return `die ${entry.plural}`;
    },
    getContext: (entry) => {
      if (entry.type !== 'noun') return undefined;
      return `${entry.article} ${entry.singular}`;
    },
    getInstruction: () => 'Type the plural form with die',
  },
];

const VERB_EXERCISES: ExerciseDefinition[] = [
  {
    exerciseId: 'verb_meaning_to_infinitive',
    label: 'Infinitive',
    getPrompt: (entry) => entry.meaning,
    getAnswer: (entry) => {
      if (entry.type !== 'verb') return '';
      return entry.infinitive;
    },
  },
  {
    exerciseId: 'verb_infinitive_to_past',
    label: 'Präteritum',
    getPrompt: (entry) => {
      if (entry.type !== 'verb') return '';
      return entry.infinitive;
    },
    getAnswer: (entry) => {
      if (entry.type !== 'verb') return '';
      return entry.pastTense;
    },
  },
];

const PHRASE_EXERCISES: ExerciseDefinition[] = [
  {
    exerciseId: 'phrase_meaning_to_german',
    label: 'German phrase',
    getPrompt: (entry) => entry.meaning,
    getAnswer: (entry) => {
      if (entry.type !== 'phrase') return '';
      return entry.german;
    },
  },
];

function getDefinitionsForEntry(entry: VocabularyEntry): ExerciseDefinition[] {
  switch (entry.type) {
    case 'noun':
      return NOUN_EXERCISES;
    case 'verb':
      return VERB_EXERCISES;
    case 'phrase':
      return PHRASE_EXERCISES;
  }
}

function buildExercise(entry: VocabularyEntry, definition: ExerciseDefinition): Exercise {
  return {
    id: `${entry.id}:${definition.exerciseId}`,
    entryId: entry.id,
    exerciseId: definition.exerciseId,
    entry,
    prompt: definition.getPrompt(entry),
    answer: definition.getAnswer(entry),
    label: definition.label,
    instruction: definition.getInstruction?.(entry),
    context: definition.getContext?.(entry),
  };
}

export function buildExerciseQueue(entries: VocabularyEntry[]): Exercise[] {
  return entries.flatMap((entry) =>
    getDefinitionsForEntry(entry).map((definition) => buildExercise(entry, definition))
  );
}

export function getExerciseCount(entries: VocabularyEntry[]): number {
  return entries.reduce((count, entry) => count + getDefinitionsForEntry(entry).length, 0);
}
