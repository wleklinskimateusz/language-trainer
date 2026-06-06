import type { Collection, EntryType, VocabularyEntry } from '@/types/vocabulary';

export function getCollectionById(
  collections: Collection[],
  id: string
): Collection | undefined {
  return collections.find((c) => c.id === id);
}

export function getEntriesForCollection(
  entries: VocabularyEntry[],
  collectionId: string
): VocabularyEntry[] {
  return entries
    .filter((e) => e.collectionId === collectionId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function getEntryCountForCollection(
  entries: VocabularyEntry[],
  collectionId: string
): number {
  return entries.filter((e) => e.collectionId === collectionId).length;
}

export function getEntryById(
  entries: VocabularyEntry[],
  entryId: string
): VocabularyEntry | undefined {
  return entries.find((e) => e.id === entryId);
}

export function getEntryPrimaryText(entry: VocabularyEntry): string {
  switch (entry.type) {
    case 'noun':
      return `${entry.article} ${entry.singular}`;
    case 'verb':
      return entry.infinitive;
    case 'phrase':
      return entry.german;
  }
}

export function getEntryTypeLabel(type: EntryType): string {
  switch (type) {
    case 'noun':
      return 'Noun';
    case 'verb':
      return 'Verb';
    case 'phrase':
      return 'Phrase';
  }
}

export function getFlashcardFront(entry: VocabularyEntry): string {
  switch (entry.type) {
    case 'noun':
    case 'phrase':
      return entry.meaning;
    case 'verb':
      return entry.infinitive;
  }
}

export function getFlashcardBack(entry: VocabularyEntry): string {
  switch (entry.type) {
    case 'noun':
      return `${entry.article} ${entry.singular}\n${entry.plural}`;
    case 'verb':
      return `Präteritum: ${entry.pastTense}\n${entry.meaning}`;
    case 'phrase':
      return entry.german;
  }
}
