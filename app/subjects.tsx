import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, confirmDelete, EmptyState, Field } from '../components/ui';
import { colors, subjectColors } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function SubjectsScreen() {
  const { subjects, tasks, addSubject, updateSubject, deleteSubject } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState(subjectColors[0]);
  const [error, setError] = useState<string | undefined>();

  function reset() {
    setEditingId(null);
    setName('');
    setInstructor('');
    setColor(subjectColors[subjects.length % subjectColors.length]);
    setError(undefined);
  }

  function startEdit(id: string) {
    const s = subjects.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setName(s.name);
    setInstructor(s.instructor);
    setColor(s.color);
    setError(undefined);
  }

  function save() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Хичээлийн нэр дор хаяж 2 тэмдэгт байна.');
      return;
    }
    const duplicate = subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase() && s.id !== editingId);
    if (duplicate) {
      setError('Ийм нэртэй хичээл аль хэдийн байна.');
      return;
    }
    const payload = { name: trimmed, instructor: instructor.trim(), color };
    if (editingId) updateSubject(editingId, payload);
    else addSubject(payload);
    reset();
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 12 }}>
          <Text style={styles.cardTitle}>{editingId ? 'Хичээл засах' : 'Шинэ хичээл'}</Text>
          <Field label="Нэр *" value={name} onChangeText={setName} placeholder="Жишээ: Веб програмчлал" error={error} />
          <Field label="Багш" value={instructor} onChangeText={setInstructor} placeholder="Багшийн нэр" />
          <Text style={styles.label}>Өнгө</Text>
          <View style={styles.colors}>
            {subjectColors.map((c) => (
              <Pressable key={c} onPress={() => setColor(c)} style={[styles.swatch, { backgroundColor: c }, color === c && styles.swatchOn]}>
                {color === c ? <Ionicons name="checkmark" size={16} color="#FFFFFF" /> : null}
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <AppButton title={editingId ? 'Хадгалах' : 'Нэмэх'} icon="checkmark" onPress={save} style={{ flex: 1 }} />
            {editingId ? <AppButton title="Болих" variant="ghost" onPress={reset} /> : null}
          </View>
        </Card>

        {subjects.length === 0 ? (
          <EmptyState icon="book-outline" title="Хичээл алга" subtitle="Дээрх формоор эхний хичээлээ нэмнэ үү." />
        ) : (
          subjects.map((s) => {
            const count = tasks.filter((t) => t.subject_id === s.id).length;
            return (
              <Pressable key={s.id} onPress={() => startEdit(s.id)}>
                <Card style={styles.row}>
                  <View style={[styles.bar, { backgroundColor: s.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{s.name}</Text>
                    <Text style={styles.meta}>
                      {s.instructor || 'Багш тодорхойгүй'} · {count} даалгавар
                    </Text>
                  </View>
                  <Ionicons name="create-outline" size={20} color={colors.muted} />
                  <Pressable
                    hitSlop={10}
                    onPress={() =>
                      confirmDelete(s.name, () => {
                        deleteSubject(s.id);
                        if (editingId === s.id) reset();
                      })
                    }
                  >
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </Card>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12, paddingBottom: 40 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted },
  colors: { flexDirection: 'row', gap: 10 },
  swatch: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  swatchOn: { borderWidth: 3, borderColor: colors.primarySoft },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bar: { width: 6, alignSelf: 'stretch', borderRadius: 3 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
