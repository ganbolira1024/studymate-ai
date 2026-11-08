import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { AppButton, Card, Chip, Field, ProgressBar, SectionHeader, StatTile } from '../../components/ui';
import { colors } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { minutesLastDays, minutesOnDay, studyStreak } from '../../utils/date';

const goalOptions = [30, 60, 90, 120];

export default function ProgressScreen() {
  const { tasks, subjects, attempts, sessions, profile, updateProfile, resetDemo, clearChat } = useApp();
  const router = useRouter();
  const [name, setName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [error, setError] = useState<string | undefined>();

  const done = tasks.filter((t) => t.is_completed).length;
  const completion = tasks.length ? done / tasks.length : 0;
  const quizAvg = attempts.length
    ? Math.round((attempts.reduce((s, a) => s + a.score / a.total_questions, 0) / attempts.length) * 100)
    : 0;
  const bestQuiz = attempts.length ? Math.max(...attempts.map((a) => Math.round((a.score / a.total_questions) * 100))) : 0;
  const today = minutesOnDay(sessions, new Date());
  const week = minutesLastDays(sessions, 7);
  const streak = studyStreak(sessions);
  const supabaseReady = Boolean(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);

  function saveProfile() {
    if (name.trim().length < 2) {
      setError('Нэр дор хаяж 2 тэмдэгт байна.');
      return;
    }
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Имэйл хаяг буруу байна.');
      return;
    }
    setError(undefined);
    updateProfile({ full_name: name.trim(), email: email.trim() });
    Alert.alert('Хадгалагдлаа', 'Профайл шинэчлэгдлээ.');
  }

  function confirmReset() {
    Alert.alert('Demo өгөгдөл сэргээх үү?', 'Таны оруулсан бүх өгөгдөл устаж, анхны жишээ өгөгдөл ачаалагдана.', [
      { text: 'Болих', style: 'cancel' },
      { text: 'Сэргээх', style: 'destructive', onPress: resetDemo },
    ]);
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.statsRow}>
        <StatTile icon="checkmark-done" label="Дууссан" value={`${done}/${tasks.length}`} tint={colors.success} />
        <StatTile icon="trophy" label="Quiz дундаж" value={`${quizAvg}%`} tint={colors.warning} />
        <StatTile icon="flame" label="Streak" value={`${streak} өдөр`} tint={colors.danger} />
      </View>

      <Card style={{ gap: 10 }}>
        <Text style={styles.cardTitle}>Даалгаврын гүйцэтгэл</Text>
        <ProgressBar value={completion} color={colors.success} height={10} />
        <Text style={styles.muted}>{Math.round(completion * 100)}% дууссан</Text>
      </Card>

      <Card style={{ gap: 10 }}>
        <Text style={styles.cardTitle}>Суралцсан хугацаа</Text>
        <View style={styles.between}>
          <Text style={styles.muted}>Өнөөдөр</Text>
          <Text style={styles.value}>
            {today} / {profile.daily_goal_minutes} мин
          </Text>
        </View>
        <ProgressBar value={today / profile.daily_goal_minutes} />
        <View style={styles.between}>
          <Text style={styles.muted}>Сүүлийн 7 хоног</Text>
          <Text style={styles.value}>{week} мин</Text>
        </View>
        <AppButton title="Фокус таймер эхлүүлэх" icon="timer" variant="secondary" onPress={() => router.push('/focus')} />
      </Card>

      <Card style={{ gap: 12 }}>
        <Text style={styles.cardTitle}>Хичээл тус бүрээр</Text>
        {subjects.length === 0 ? <Text style={styles.muted}>Хичээл нэмээгүй байна.</Text> : null}
        {subjects.map((s) => {
          const list = tasks.filter((t) => t.subject_id === s.id);
          const d = list.filter((t) => t.is_completed).length;
          return (
            <View key={s.id} style={{ gap: 6 }}>
              <View style={styles.between}>
                <Text style={styles.value}>{s.name}</Text>
                <Text style={styles.muted}>
                  {d}/{list.length}
                </Text>
              </View>
              <ProgressBar value={list.length ? d / list.length : 0} color={s.color} />
            </View>
          );
        })}
      </Card>

      <Card style={{ gap: 6 }}>
        <Text style={styles.cardTitle}>Quiz</Text>
        <Text style={styles.muted}>
          Нийт {attempts.length} оролдлого · Хамгийн өндөр {bestQuiz}%
        </Text>
      </Card>

      <SectionHeader title="Профайл" />
      <Card style={{ gap: 12 }}>
        <Field label="Нэр" value={name} onChangeText={setName} error={error} />
        <Field label="Имэйл" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="name@example.com" />
        <AppButton title="Профайл хадгалах" icon="save" onPress={saveProfile} />
      </Card>

      <SectionHeader title="Тохиргоо" />
      <Card style={{ gap: 14 }}>
        <Text style={styles.value}>Өдрийн суралцах зорилго</Text>
        <View style={styles.chips}>
          {goalOptions.map((g) => (
            <Chip
              key={g}
              label={`${g} мин`}
              selected={profile.daily_goal_minutes === g}
              onPress={() => updateProfile({ daily_goal_minutes: g })}
            />
          ))}
        </View>
        <View style={styles.between}>
          <Text style={[styles.value, { flex: 1 }]}>Төлөвлөгчид дууссан даалгаврыг харуулах</Text>
          <Switch
            value={profile.show_completed}
            onValueChange={(v) => updateProfile({ show_completed: v })}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
        <View style={styles.between}>
          <Text style={styles.value}>Supabase</Text>
          <Text style={[styles.muted, { color: supabaseReady ? colors.success : colors.muted }]}>
            {supabaseReady ? 'Тохируулсан' : 'Холбоогүй (local өгөгдөл)'}
          </Text>
        </View>
        <AppButton title="AI чатын түүх цэвэрлэх" variant="ghost" icon="chatbubbles-outline" onPress={clearChat} />
        <AppButton title="Demo өгөгдөл сэргээх" variant="danger" icon="refresh" onPress={confirmReset} />
      </Card>

      <Text style={[styles.muted, { textAlign: 'center' }]}>StudyMate AI · v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  statsRow: { flexDirection: 'row', gap: 10 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  muted: { color: colors.muted, fontSize: 13 },
  value: { color: colors.text, fontWeight: '600', fontSize: 14 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
