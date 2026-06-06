import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { EntryType } from '@/types/vocabulary';

const TYPES: { value: EntryType; label: string }[] = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'phrase', label: 'Phrase' },
];

type TypeSelectorProps = {
  value: EntryType;
  onChange: (type: EntryType) => void;
};

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = useThemeColors();
  const borderColor = colorScheme === 'light' ? '#E5E7EB' : '#2A2D2E';

  return (
    <View style={styles.container}>
      {TYPES.map((type) => {
        const selected = value === type.value;
        return (
          <Pressable
            key={type.value}
            onPress={() => onChange(type.value)}
            style={[
              styles.option,
              { borderColor },
              selected && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}>
            <ThemedText
              style={[
                styles.label,
                selected && { color: colors.onPrimary },
              ]}>
              {type.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
