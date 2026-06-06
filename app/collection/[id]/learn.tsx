import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Flashcard } from '@/components/vocabulary/flashcard';
import { useCollection, useCollectionEntries } from '@/hooks/use-vocabulary';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LearnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();

  const collection = useCollection(id);
  const entries = useCollectionEntries(id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knowCount, setKnowCount] = useState(0);
  const [dontKnowCount, setDontKnowCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!collection) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Collection not found</ThemedText>
      </ThemedView>
    );
  }

  if (entries.length === 0) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>No words to learn</ThemedText>
      </ThemedView>
    );
  }

  const currentEntry = entries[currentIndex];

  const advance = (knew: boolean) => {
    if (knew) {
      setKnowCount((c) => c + 1);
    } else {
      setDontKnowCount((c) => c + 1);
    }

    if (currentIndex + 1 >= entries.length) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setIsFlipped(false);
    }
  };

  if (finished) {
    return (
      <>
        <Stack.Screen options={{ title: 'Summary' }} />
        <ThemedView style={styles.summary}>
          <ThemedText type="title" style={styles.summaryTitle}>
            Session complete
          </ThemedText>
          <ThemedText style={styles.summarySubtitle}>{collection.name}</ThemedText>

          <View style={styles.stats}>
            <Stat label="Total" value={entries.length} />
            <Stat label="Know" value={knowCount} color="#4CAF50" />
            <Stat label={"Don't know"} value={dontKnowCount} color="#E53935" />
          </View>

          <Pressable
            style={[styles.doneButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}>
            <ThemedText style={[styles.doneButtonText, { color: colors.onPrimary }]}>
              Back to collection
            </ThemedText>
          </Pressable>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learn · ${currentIndex + 1}/${entries.length}`,
        }}
      />

      <ThemedView style={styles.container}>
        <Flashcard
          entry={currentEntry}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped((f) => !f)}
        />

        <View style={styles.actions}>
          <Pressable
            style={[
              styles.actionButton,
              { backgroundColor: colorScheme === 'light' ? '#FFEBEE' : '#3D2020' },
            ]}
            onPress={() => advance(false)}>
            <ThemedText style={styles.dontKnowText}>{"Don't know"}</ThemedText>
          </Pressable>
          <Pressable
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => advance(true)}>
            <ThemedText style={[styles.knowText, { color: colors.onPrimary }]}>Know</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="title" style={[styles.statValue, color ? { color } : undefined]}>
        {value}
      </ThemedText>
      <ThemedText style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dontKnowText: {
    color: '#E53935',
    fontWeight: '600',
    fontSize: 16,
  },
  knowText: {
    fontWeight: '600',
    fontSize: 16,
  },
  summary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  summaryTitle: {
    textAlign: 'center',
  },
  summarySubtitle: {
    opacity: 0.6,
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 32,
    marginVertical: 24,
  },
  stat: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 36,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  doneButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
  },
  doneButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
