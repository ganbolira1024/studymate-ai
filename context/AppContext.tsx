import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '../constants/theme';
import { createSeed } from '../data/seed';
import type { AppData, ChatMessage, Profile, QuizAttempt, StudySession, Subject, Task } from '../types';
import { uid } from '../utils/date';

const STORAGE_KEY = 'studymate:data:v1';

type NewTask = Omit<Task, 'id' | 'created_at' | 'is_completed'>;
type NewSubject = Omit<Subject, 'id' | 'created_at'>;

interface AppActions {
  addSubject: (s: NewSubject) => void;
  updateSubject: (id: string, patch: Partial<NewSubject>) => void;
  deleteSubject: (id: string) => void;
  addTask: (t: NewTask) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addAttempt: (a: Omit<QuizAttempt, 'id' | 'completed_at'>) => void;
  addSession: (s: Omit<StudySession, 'id' | 'studied_at'>) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  addChat: (m: Omit<ChatMessage, 'id' | 'created_at'>) => void;
  clearChat: () => void;
  resetDemo: () => void;
}

type AppContextValue = AppData & AppActions;

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(createSeed);
  const [loaded, setLoaded] = useState(false);

  // Хадгалсан өгөгдлийг ачаална
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setData({ ...createSeed(), ...(JSON.parse(raw) as Partial<AppData>) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Өөрчлөлт бүрийг хадгална
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, loaded]);

  const actions = useMemo<AppActions>(() => {
    const now = () => new Date().toISOString();
    return {
      addSubject: (s) => setData((d) => ({ ...d, subjects: [...d.subjects, { ...s, id: uid(), created_at: now() }] })),
      updateSubject: (id, patch) =>
        setData((d) => ({ ...d, subjects: d.subjects.map((s) => (s.id === id ? { ...s, ...patch } : s)) })),
      deleteSubject: (id) =>
        setData((d) => ({
          ...d,
          subjects: d.subjects.filter((s) => s.id !== id),
          tasks: d.tasks.map((t) => (t.subject_id === id ? { ...t, subject_id: null } : t)),
        })),
      addTask: (t) =>
        setData((d) => ({ ...d, tasks: [...d.tasks, { ...t, id: uid(), is_completed: false, created_at: now() }] })),
      updateTask: (id, patch) =>
        setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      toggleTask: (id) =>
        setData((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, is_completed: !t.is_completed } : t)) })),
      deleteTask: (id) => setData((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) })),
      addAttempt: (a) =>
        setData((d) => ({ ...d, attempts: [{ ...a, id: uid(), completed_at: now() }, ...d.attempts] })),
      addSession: (s) =>
        setData((d) => ({ ...d, sessions: [{ ...s, id: uid(), studied_at: now() }, ...d.sessions] })),
      updateProfile: (patch) => setData((d) => ({ ...d, profile: { ...d.profile, ...patch } })),
      addChat: (m) => setData((d) => ({ ...d, chat: [...d.chat, { ...m, id: uid(), created_at: now() }] })),
      clearChat: () => setData((d) => ({ ...d, chat: [] })),
      resetDemo: () => setData(createSeed()),
    };
  }, []);

  const value = useMemo(() => ({ ...data, ...actions }), [data, actions]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
