import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { Task } from '../types';
import { formatDue, isOverdue } from '../utils/date';
import { confirmDelete, PriorityBadge } from './ui';

/** Нэг даалгаврын мөр: дуусгах, засах, устгах. Home болон Planner хоёуланд дахин ашиглагдана. */
export function TaskRow({ task, showDelete = false }: { task: Task; showDelete?: boolean }) {
  const { subjects, toggleTask, deleteTask } = useApp();
  const router = useRouter();
  const subject = subjects.find((s) => s.id === task.subject_id);
  const overdue = !task.is_completed && isOverdue(task.due_at);

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/task-form', params: { id: task.id } })}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <Pressable onPress={() => toggleTask(task.id)} hitSlop={10} accessibilityLabel="Дууссан болгох">
        <Ionicons
          name={task.is_completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={task.is_completed ? colors.success : colors.muted}
        />
      </Pressable>

      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.titleLine}>
          {task.kind === 'exam' ? <Ionicons name="school" size={14} color={colors.primary} /> : null}
          <Text style={[styles.title, task.is_completed && styles.done]} numberOfLines={2}>
            {task.title}
          </Text>
        </View>
        <View style={styles.meta}>
          {subject ? (
            <View style={styles.subject}>
              <View style={[styles.dot, { backgroundColor: subject.color }]} />
              <Text style={styles.metaText} numberOfLines={1}>{subject.name}</Text>
            </View>
          ) : null}
          <Text style={[styles.metaText, overdue && { color: colors.danger, fontWeight: '700' }]}>
            {task.is_completed ? 'Дууссан' : formatDue(task.due_at)}
          </Text>
        </View>
      </View>

      <PriorityBadge priority={task.priority} />
      {showDelete ? (
        <Pressable onPress={() => confirmDelete(task.title, () => deleteTask(task.id))} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color={colors.muted} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
  },
  titleLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  done: { textDecorationLine: 'line-through', color: colors.muted },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  subject: { flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: 150 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  metaText: { fontSize: 12, color: colors.muted },
});
