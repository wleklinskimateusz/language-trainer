import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  getCollectionById,
  getEntriesForCollection,
  getEntryById,
  getEntryCountForCollection,
} from '@/lib/vocabulary/selectors';
import { useVocabularyStore } from '@/stores/vocabulary-store';

export function useVocabularyHydration() {
  const hasHydrated = useVocabularyStore((s) => s._hasHydrated);
  const [ready, setReady] = useState(hasHydrated);

  useEffect(() => {
    const unsub = useVocabularyStore.persist.onFinishHydration(() => {
      setReady(true);
    });
    if (useVocabularyStore.persist.hasHydrated()) {
      setReady(true);
    }
    return unsub;
  }, []);

  return ready;
}

export function useCollections() {
  return useVocabularyStore((s) => s.collections);
}

export function useCollection(id: string) {
  const collections = useVocabularyStore((s) => s.collections);
  return useMemo(() => getCollectionById(collections, id), [collections, id]);
}

export function useCollectionEntries(collectionId: string) {
  const entries = useVocabularyStore((s) => s.entries);
  return useMemo(
    () => getEntriesForCollection(entries, collectionId),
    [entries, collectionId]
  );
}

export function useCollectionEntryCount(collectionId: string) {
  const entries = useVocabularyStore((s) => s.entries);
  return useMemo(
    () => getEntryCountForCollection(entries, collectionId),
    [entries, collectionId]
  );
}

export function useEntry(entryId: string) {
  const entries = useVocabularyStore((s) => s.entries);
  return useMemo(() => getEntryById(entries, entryId), [entries, entryId]);
}

export function useVocabularyActions() {
  return useVocabularyStore(
    useShallow((s) => ({
      createCollection: s.createCollection,
      deleteCollection: s.deleteCollection,
      addEntry: s.addEntry,
      updateEntry: s.updateEntry,
      deleteEntry: s.deleteEntry,
    }))
  );
}
