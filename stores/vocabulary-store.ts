import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { createId } from '@/lib/vocabulary/ids';
import { normalizeEntryInput, validateEntryInput } from '@/lib/vocabulary/validation';
import type { Collection, EntryInput, VocabularyEntry } from '@/types/vocabulary';

type VocabularyStore = {
  collections: Collection[];
  entries: VocabularyEntry[];
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  createCollection: (name: string) => Collection;
  deleteCollection: (id: string) => void;
  addEntry: (collectionId: string, input: EntryInput) => { entry?: VocabularyEntry; error?: string };
  updateEntry: (entryId: string, input: EntryInput) => { entry?: VocabularyEntry; error?: string };
  deleteEntry: (entryId: string) => void;
};

export const useVocabularyStore = create<VocabularyStore>()(
  persist(
    (set, get) => ({
      collections: [],
      entries: [],
      _hasHydrated: false,
      setHasHydrated: (value) => set({ _hasHydrated: value }),

      createCollection: (name) => {
        const now = new Date().toISOString();
        const collection: Collection = {
          id: createId(),
          name: name.trim(),
          language: 'de',
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          collections: [collection, ...state.collections],
        }));
        return collection;
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((c) => c.id !== id),
          entries: state.entries.filter((e) => e.collectionId !== id),
        }));
      },

      addEntry: (collectionId, input) => {
        const error = validateEntryInput(input);
        if (error) return { error };

        const normalized = normalizeEntryInput(input);
        const now = new Date().toISOString();
        const base = { id: createId(), collectionId, createdAt: now };

        let entry: VocabularyEntry;
        switch (normalized.type) {
          case 'noun':
            entry = { ...base, ...normalized };
            break;
          case 'verb':
            entry = { ...base, ...normalized };
            break;
          case 'phrase':
            entry = { ...base, ...normalized };
            break;
        }

        set((state) => ({
          entries: [...state.entries, entry],
          collections: state.collections.map((c) =>
            c.id === collectionId ? { ...c, updatedAt: now } : c
          ),
        }));
        return { entry };
      },

      updateEntry: (entryId, input) => {
        const error = validateEntryInput(input);
        if (error) return { error };

        const existing = get().entries.find((e) => e.id === entryId);
        if (!existing) return { error: 'Entry not found' };

        const normalized = normalizeEntryInput(input);
        const now = new Date().toISOString();
        const entry: VocabularyEntry = {
          ...existing,
          ...normalized,
        };

        set((state) => ({
          entries: state.entries.map((e) => (e.id === entryId ? entry : e)),
          collections: state.collections.map((c) =>
            c.id === existing.collectionId ? { ...c, updatedAt: now } : c
          ),
        }));
        return { entry };
      },

      deleteEntry: (entryId) => {
        const existing = get().entries.find((e) => e.id === entryId);
        if (!existing) return;

        const now = new Date().toISOString();
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== entryId),
          collections: state.collections.map((c) =>
            c.id === existing.collectionId ? { ...c, updatedAt: now } : c
          ),
        }));
      },
    }),
    {
      name: '@language-trainer/vocabulary',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        collections: state.collections,
        entries: state.entries,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
