import { Stack } from 'expo-router';

export default function TasksLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Tasks', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: 'Task', headerShown: false }} />
    </Stack>
  );
}
