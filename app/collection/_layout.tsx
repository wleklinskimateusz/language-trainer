import { Stack } from 'expo-router';

export default function CollectionLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]/index" options={{ title: 'Collection' }} />
      <Stack.Screen name="[id]/add" options={{ title: 'Add word', presentation: 'modal' }} />
      <Stack.Screen
        name="[id]/edit/[entryId]"
        options={{ title: 'Edit word', presentation: 'modal' }}
      />
      <Stack.Screen name="[id]/learn" options={{ title: 'Learn', headerBackTitle: 'Back' }} />
    </Stack>
  );
}
