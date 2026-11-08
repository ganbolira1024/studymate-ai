import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { colors } from '../constants/theme';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="task-form" options={{ presentation: 'modal', title: 'Даалгавар' }} />
        <Stack.Screen name="subjects" options={{ title: 'Хичээлүүд' }} />
        <Stack.Screen name="focus" options={{ title: 'Фокус таймер' }} />
      </Stack>
    </AppProvider>
  );
}
