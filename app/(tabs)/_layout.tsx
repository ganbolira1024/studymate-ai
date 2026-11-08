import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { colors } from '../../constants/theme';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const tabIcon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) => <Ionicons name={name} size={size} color={color} />;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarHideOnKeyboard: true,
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { fontWeight: '800', color: colors.text },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Нүүр', headerTitle: 'StudyMate AI', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="planner" options={{ title: 'Төлөвлөгч', tabBarIcon: tabIcon('calendar') }} />
      <Tabs.Screen name="tutor" options={{ title: 'AI Tutor', tabBarIcon: tabIcon('chatbubbles') }} />
      <Tabs.Screen name="quiz" options={{ title: 'Quiz', tabBarIcon: tabIcon('help-circle') }} />
      <Tabs.Screen name="progress" options={{ title: 'Ахиц', headerTitle: 'Ахиц ба профайл', tabBarIcon: tabIcon('person-circle') }} />
    </Tabs>
  );
}
