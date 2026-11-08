import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Chip, confirmDelete, Field, priorityInfo } from '../components/ui';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import type { Priority, TaskKind } from '../types';
import { addDays, dateKey, parseDateTime, timeKey } from '../utils/date';

const quickDates = [
  { label: 'Өнөөдөр', days: 0 },
  { label: 'Маргааш', days: 1 },
  { label: '3 хоног', days: 3 },
  { label: '7 хоног', days: 7 },
];

export default function TaskFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const { tasks, subjects, addTask, updateTask, deleteTask } = useApp();
  const existing = tasks.find((t) => t.id === id);
  const defaultDue = existing ? new Date(existing.due_at) : addDays(1);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [subjectId, setSubjectId] = useState<string | null>(existing ? existing.subject_id : subjects[0]?.id ?? null);
  const [priority, setPriority] = useState<Priority>(existing?.priority ?? 'medium');
  const [kind, setKind] = useState<TaskKind>(existing?.kind ?? 'assignment');
  const [dateText, setDateText] = useState(dateKey(defaultDue));
  const [timeText, setTimeText] = useState(timeKey(defaultDue));
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({});

  function save() {
    const next: typeof errors = {};
    if (title.trim().length < 2) next.title = 'Гарчиг дор хаяж 2 тэмдэгт байна.';
    const due = parseDateTime(dateText, timeText);
    if (!due) next.date = 'Огноо ОООО-СС-ӨӨ, цаг ЦЦ:ММ хэлбэртэй байна.';
    setErrors(next);
    if (Object.keys(next).length || !due) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      subject_id: subjectId,
      priority,
      kind,
      due_at: due.toISOString(),
    };
    if (existing) updateTask(existing.id, payload);
    else addTask(payload);
    router.back();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: existing ? 'Даалгавар засах' : 'Шинэ даалгавар' }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Field label="Гарчиг *" value={title} onChangeText={setTitle} placeholder="Жишээ: Лаб ажил 7" error={errors.title} />
        <Field
          label="Тайлбар"
          value={description}
          onChangeText={setDescription}
          placeholder="Нэмэлт мэдээлэл"
          multiline
          style={{ minHeight: 80, textAlignVertical: 'top' }}
        />

        <Text style={styles.label}>Төрөл</Text>
        <View style={styles.chips}>
          <Chip label="Даалгавар" selected={kind === 'assignment'} onPress={() => setKind('assignment')} />
          <Chip label="Шалгалт" selected={kind === 'exam'} onPress={() => setKind('exam')} />
        </View>

        <Text style={styles.label}>Хичээл</Text>
        <View style={styles.chips}>
          <Chip label="Хичээлгүй" selected={subjectId === null} onPress={() => setSubjectId(null)} color={colors.text} />
          {subjects.map((s) => (
            <Chip key={s.id} label={s.name} color={s.color} selected={subjectId === s.id} onPress={() => setSubjectId(s.id)} />
          ))}
        </View>

        <Text style={styles.label}>Ач холбогдол</Text>
        <View style={styles.chips}>
          {(['low', 'medium', 'high'] as Priority[]).map((p) => (
            <Chip
              key={p}
              label={priorityInfo[p].label}
              color={priorityInfo[p].fg}
              selected={priority === p}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>

        <Text style={styles.label}>Хугацаа</Text>
        <View style={styles.chips}>
          {quickDates.map((q) => (
            <Chip
              key={q.label}
              label={q.label}
              selected={dateText === dateKey(addDays(q.days))}
              onPress={() => setDateText(dateKey(addDays(q.days)))}
            />
          ))}
        </View>
        <View style={styles.dateRow}>
          <View style={{ flex: 3 }}>
            <Field label="Огноо" value={dateText} onChangeText={setDateText} placeholder="2026-11-20" />
          </View>
          <View style={{ flex: 2 }}>
            <Field label="Цаг" value={timeText} onChangeText={setTimeText} placeholder="23:59" />
          </View>
        </View>
        {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}

        <AppButton title={existing ? 'Хадгалах' : 'Нэмэх'} icon="checkmark" onPress={save} style={{ marginTop: 8 }} />
        {existing ? (
          <>
            <AppButton
              title={existing.is_completed ? 'Дуусаагүй болгох' : 'Дууссан болгох'}
              variant="secondary"
              icon="checkmark-done"
              onPress={() => {
                updateTask(existing.id, { is_completed: !existing.is_completed });
                router.back();
              }}
            />
            <AppButton
              title="Устгах"
              variant="danger"
              icon="trash"
              onPress={() =>
                confirmDelete(existing.title, () => {
                  deleteTask(existing.id);
                  router.back();
                })
              }
            />
          </>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dateRow: { flexDirection: 'row', gap: 10 },
  error: { color: colors.danger, fontSize: 12 },
});
