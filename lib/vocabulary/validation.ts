import type { Article, EntryInput } from '@/types/vocabulary';

const ARTICLES: Article[] = ['der', 'die', 'das'];

function capitalizeGerman(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function requireField(value: string, fieldName: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return `${fieldName} is required`;
  return null;
}

export function validateEntryInput(input: EntryInput): string | null {
  switch (input.type) {
    case 'noun': {
      if (!ARTICLES.includes(input.article)) return 'Article must be der, die, or das';
      return (
        requireField(input.singular, 'Singular') ??
        requireField(input.plural, 'Plural') ??
        requireField(input.meaning, 'Meaning')
      );
    }
    case 'verb':
      return (
        requireField(input.infinitive, 'Infinitive') ??
        requireField(input.pastTense, 'Präteritum') ??
        requireField(input.meaning, 'Meaning')
      );
    case 'phrase':
      return (
        requireField(input.german, 'German phrase') ??
        requireField(input.meaning, 'Meaning')
      );
  }
}

export function normalizeEntryInput(input: EntryInput): EntryInput {
  switch (input.type) {
    case 'noun':
      return {
        ...input,
        singular: capitalizeGerman(input.singular),
        plural: capitalizeGerman(input.plural),
        meaning: input.meaning.trim(),
      };
    case 'verb':
      return {
        ...input,
        infinitive: input.infinitive.trim(),
        pastTense: input.pastTense.trim(),
        meaning: input.meaning.trim(),
      };
    case 'phrase':
      return {
        ...input,
        german: input.german.trim(),
        meaning: input.meaning.trim(),
      };
  }
}
