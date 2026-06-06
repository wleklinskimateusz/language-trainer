export type Language = 'de';

export type Article = 'der' | 'die' | 'das';

export type EntryType = 'noun' | 'verb' | 'phrase';

export type Collection = {
  id: string;
  name: string;
  language: Language;
  createdAt: string;
  updatedAt: string;
};

export type NounEntry = {
  id: string;
  collectionId: string;
  type: 'noun';
  article: Article;
  singular: string;
  plural: string;
  meaning: string;
  createdAt: string;
};

export type VerbEntry = {
  id: string;
  collectionId: string;
  type: 'verb';
  infinitive: string;
  pastTense: string;
  meaning: string;
  createdAt: string;
};

export type PhraseEntry = {
  id: string;
  collectionId: string;
  type: 'phrase';
  german: string;
  meaning: string;
  createdAt: string;
};

export type VocabularyEntry = NounEntry | VerbEntry | PhraseEntry;

export type NounInput = {
  type: 'noun';
  article: Article;
  singular: string;
  plural: string;
  meaning: string;
};

export type VerbInput = {
  type: 'verb';
  infinitive: string;
  pastTense: string;
  meaning: string;
};

export type PhraseInput = {
  type: 'phrase';
  german: string;
  meaning: string;
};

export type EntryInput = NounInput | VerbInput | PhraseInput;
