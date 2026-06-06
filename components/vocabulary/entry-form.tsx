import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TypeSelector } from '@/components/vocabulary/type-selector';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { Article, EntryInput, EntryType, VocabularyEntry } from '@/types/vocabulary';

const ARTICLES: Article[] = ['der', 'die', 'das'];

type EntryFormProps = {
  initialEntry?: VocabularyEntry;
  onSubmit: (input: EntryInput) => { error?: string };
};

function getInitialInput(entry?: VocabularyEntry): EntryInput {
  if (!entry) {
    return { type: 'noun', article: 'der', singular: '', plural: '', meaning: '' };
  }
  switch (entry.type) {
    case 'noun':
      return {
        type: 'noun',
        article: entry.article,
        singular: entry.singular,
        plural: entry.plural,
        meaning: entry.meaning,
      };
    case 'verb':
      return {
        type: 'verb',
        infinitive: entry.infinitive,
        pastTense: entry.pastTense,
        meaning: entry.meaning,
      };
    case 'phrase':
      return {
        type: 'phrase',
        german: entry.german,
        meaning: entry.meaning,
      };
  }
}

export function EntryForm({ initialEntry, onSubmit }: EntryFormProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';

  const [input, setInput] = useState<EntryInput>(getInitialInput(initialEntry));
  const [error, setError] = useState<string | null>(null);

  const handleTypeChange = (type: EntryType) => {
    switch (type) {
      case 'noun':
        setInput({ type: 'noun', article: 'der', singular: '', plural: '', meaning: '' });
        break;
      case 'verb':
        setInput({ type: 'verb', infinitive: '', pastTense: '', meaning: '' });
        break;
      case 'phrase':
        setInput({ type: 'phrase', german: '', meaning: '' });
        break;
    }
    setError(null);
  };

  const handleSubmit = () => {
    const result = onSubmit(input);
    if (result.error) {
      setError(result.error);
    }
  };

  const inputStyle = [
    styles.input,
    { color: colors.text, borderColor, backgroundColor: colors.background },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Word type
      </ThemedText>
      {initialEntry ? (
        <ThemedText style={styles.typeLocked}>
          {input.type.charAt(0).toUpperCase() + input.type.slice(1)} (cannot change when editing)
        </ThemedText>
      ) : (
        <TypeSelector value={input.type} onChange={handleTypeChange} />
      )}

      <View style={styles.fields}>
        {input.type === 'noun' && (
          <>
            <ThemedText style={styles.label}>Article</ThemedText>
            <View style={styles.articleRow}>
              {ARTICLES.map((article) => {
                const selected = input.article === article;
                return (
                  <Pressable
                    key={article}
                    onPress={() => setInput({ ...input, article })}
                    style={[
                      styles.articleOption,
                      { borderColor },
                      selected && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}>
                    <ThemedText
                      style={[
                        styles.articleLabel,
                        selected && { color: colors.onPrimary },
                      ]}>
                      {article}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
            <FormField
              label="Singular"
              value={input.singular}
              onChangeText={(singular) => setInput({ ...input, singular })}
              inputStyle={inputStyle}
            />
            <FormField
              label="Plural"
              value={input.plural}
              onChangeText={(plural) => setInput({ ...input, plural })}
              inputStyle={inputStyle}
            />
            <FormField
              label="Meaning"
              value={input.meaning}
              onChangeText={(meaning) => setInput({ ...input, meaning })}
              inputStyle={inputStyle}
            />
          </>
        )}

        {input.type === 'verb' && (
          <>
            <FormField
              label="Infinitive"
              value={input.infinitive}
              onChangeText={(infinitive) => setInput({ ...input, infinitive })}
              inputStyle={inputStyle}
            />
            <FormField
              label="Präteritum"
              value={input.pastTense}
              onChangeText={(pastTense) => setInput({ ...input, pastTense })}
              inputStyle={inputStyle}
            />
            <FormField
              label="Meaning"
              value={input.meaning}
              onChangeText={(meaning) => setInput({ ...input, meaning })}
              inputStyle={inputStyle}
            />
          </>
        )}

        {input.type === 'phrase' && (
          <>
            <FormField
              label="German phrase"
              value={input.german}
              onChangeText={(german) => setInput({ ...input, german })}
              inputStyle={inputStyle}
              multiline
            />
            <FormField
              label="Meaning"
              value={input.meaning}
              onChangeText={(meaning) => setInput({ ...input, meaning })}
              inputStyle={inputStyle}
              multiline
            />
          </>
        )}
      </View>

      {error && <ThemedText style={styles.error}>{error}</ThemedText>}

      <Pressable
        style={[styles.submitButton, { backgroundColor: colors.primary }]}
        onPress={handleSubmit}>
        <ThemedText style={[styles.submitText, { color: colors.onPrimary }]}>
          {initialEntry ? 'Save changes' : 'Add word'}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  inputStyle: object[];
  multiline?: boolean;
};

function FormField({ label, value, onChangeText, inputStyle, multiline }: FormFieldProps) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      <TextInput
        style={[...inputStyle, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#9BA1A6"
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
  },
  typeLocked: {
    fontSize: 15,
    opacity: 0.7,
  },
  fields: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  multiline: {
    minHeight: 80,
    paddingTop: 10,
  },
  articleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  articleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  articleLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#E53935',
    fontSize: 14,
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
