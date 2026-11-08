import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskRow } from '../../components/TaskRow';
import { AppButton, Chip, EmptyState } from '../../components/ui';
import { colors } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { byDue } from '../../utils/date';

type Filter = 'all' | 'todo' | 'done' | 'high' | 'exam';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Бүгд' },
  { key: 'todo', label: 'Хийх' },
  { key: 'done', label: 'Дууссан' },
  { key: 'high', label: 'Өндөр ач холбогдол' },
  { key: 'exam', label: 'Шалгалт' },
];

export default function PlannerScreen() {
  const { tasks, subjects, profile } = useApp();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>(profile.show_completed ? 'all' : 'todo');
  const [subjectId, setSubjectId] = useState<string | null>(null);

  const list = useMemo(() => {
    return tasks
      .filter((t) => {
        if (subjectId && t.subject_id !== subjectId) return false;
        switch (filter) {
          case 'todo':
            return !t.is_completed;
          case 'done':
            return t.is_completed;
          case 'high':
            return t.priority === 'high' && !t.is_completed;
          case 'exam':
            return t.kind === 'exam';
          default:
            return true;
        }
      })
      .sort((a, b) => Number(a.is_completed) - Number(b.is_completed) || byDue(a, b));
  }, [tasks, filter, subjectId]);

  const header = (
    <View style={{ gap: 12, marginBottom: 12 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {filters.map((f) => (
          <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label="Бүх хичээл" selected={subjectId === null} onPress={() => setSubjectId(null)} color={colors.text} />
        {subjects.map((s) => (
          <Chip key={s.id} label={s.name} color={s.color} selected={subjectId === s.id} onPress={() => setSubjectId(s.id)} />
        ))}
      </ScrollView>
      <View style={styles.row}>
        <Text style={styles.count}>{list.length} даалгавар</Text>
        <AppButton title={`Хичээлүүд (${subjects.length})`} icon="book" variant="ghost" onPress={() => router.push('/subjects')} />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TaskRow task={item} showDelete />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState icon="clipboard-outline" title="Даалгавар олдсонгүй" subtitle="Шүүлтүүрээ өөрчлөх эсвэл + товчоор шинээр нэмнэ үү." />
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />
      <Pressable style={({ pressed }) => [styles.fab, pressed && { opacity: 0.85 }]} onPress={() => router.push('/task-form')}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  chips: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { color: colors.muted, fontWeight: '600' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
