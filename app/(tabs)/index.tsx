import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TaskRow } from '../../components/TaskRow';
import { Card, EmptyState, IconName, ProgressBar, SectionHeader, StatTile } from '../../components/ui';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { byDue, dayDiff, minutesOnDay, studyStreak } from '../../utils/date';

export default function HomeScreen() {
  const { tasks, attempts, profile, sessions } = useApp();
  const router = useRouter();

  const open = tasks.filter((t) => !t.is_completed);
  const todayTasks = open.filter((t) => dayDiff(t.due_at) <= 0).sort(byDue);
  const exams = open.filter((t) => t.kind === 'exam' && dayDiff(t.due_at) >= 0).sort(byDue).slice(0, 3);
  const upcoming = open.filter((t) => t.kind === 'assignment' && dayDiff(t.due_at) > 0).sort(byDue).slice(0, 3);

  const doneCount = tasks.length - open.length;
  const completion = tasks.length ? doneCount / tasks.length : 0;
  const quizAvg = attempts.length
    ? Math.round((attempts.reduce((sum, a) => sum + a.score / a.total_questions, 0) / attempts.length) * 100)
    : 0;
  const todayMinutes = minutesOnDay(sessions, new Date());
  const streak = studyStreak(sessions);

  const quickActions: { label: string; icon: IconName; onPress: () => void }[] = [
    { label: 'Даалгавар нэмэх', icon: 'add-circle', onPress: () => router.push('/task-form') },
    { label: 'AI-аас асуух', icon: 'chatbubbles', onPress: () => router.push('/tutor') },
    { label: 'Quiz өгөх', icon: 'help-circle', onPress: () => router.push('/quiz') },
    { label: 'Фокус таймер', icon: 'timer', onPress: () => router.push('/focus') },
  ];

  const today = new Date();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroDate}>
          {today.getFullYear()} оны {today.getMonth() + 1}-р сарын {today.getDate()}
        </Text>
        <Text style={styles.heroTitle}>Сайн байна уу, {profile.full_name || 'оюутан'}!</Text>
        <Text style={styles.heroText}>
          Өнөөдөр {todayTasks.length} даалгавар, ойртож буй {exams.length} шалгалт байна.
        </Text>
        <View style={{ gap: 6, marginTop: 8 }}>
          <View style={styles.heroRow}>
            <Text style={styles.heroSmall}>Нийт гүйцэтгэл</Text>
            <Text style={styles.heroSmall}>
              {doneCount}/{tasks.length} · {Math.round(completion * 100)}%
            </Text>
          </View>
          <ProgressBar value={completion} color="#FFFFFF" />
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatTile icon="trophy" label="Quiz дундаж" value={`${quizAvg}%`} tint={colors.warning} />
        <StatTile icon="time" label="Өнөөдөр" value={`${todayMinutes} мин`} tint={colors.success} />
        <StatTile icon="flame" label="Streak" value={`${streak} өдөр`} tint={colors.danger} />
      </View>

      <View style={styles.actions}>
        {quickActions.map((a) => (
          <Pressable key={a.label} onPress={a.onPress} style={({ pressed }) => [styles.action, pressed && { opacity: 0.8 }]}>
            <Ionicons name={a.icon} size={24} color={colors.primary} />
            <Text style={styles.actionText}>{a.label}</Text>
          </Pressable>
        ))}
      </View>

      <SectionHeader title="Өнөөдөр хийх" action={{ label: 'Бүгд', onPress: () => router.push('/planner') }} />
      {todayTasks.length ? (
        <View style={styles.list}>{todayTasks.map((t) => <TaskRow key={t.id} task={t} />)}</View>
      ) : (
        <Card>
          <EmptyState icon="sunny" title="Өнөөдөр хийх даалгавар алга" subtitle="Шинэ даалгавар нэмэх эсвэл давтлага хийгээрэй." />
        </Card>
      )}

      <SectionHeader title="Ойртож буй шалгалт" />
      {exams.length ? (
        <View style={styles.list}>{exams.map((t) => <TaskRow key={t.id} task={t} />)}</View>
      ) : (
        <Card>
          <EmptyState icon="school" title="Ойрын шалгалт алга" subtitle="Даалгавар нэмэхдээ төрлийг 'Шалгалт' гэж сонгоно." />
        </Card>
      )}

      <SectionHeader title="Удахгүй дуусах хугацаа" />
      {upcoming.length ? (
        <View style={styles.list}>{upcoming.map((t) => <TaskRow key={t.id} task={t} />)}</View>
      ) : (
        <Card>
          <EmptyState icon="checkmark-done" title="Бүх зүйл хийгдсэн байна" />
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  hero: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: 18, gap: 4 },
  heroDate: { color: '#C9C5FF', fontSize: 13, fontWeight: '600' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  heroText: { color: '#E6E4FF', fontSize: 14 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-between' },
  heroSmall: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  statsRow: { flexDirection: 'row', gap: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  action: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
  },
  actionText: { fontSize: 14, fontWeight: '700', color: colors.text },
  list: { gap: 10 },
});
