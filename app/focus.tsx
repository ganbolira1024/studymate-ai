import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, Chip, ProgressBar } from '../components/ui';
import { colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { minutesOnDay, studyStreak } from '../utils/date';

/** Бонус функц: Pomodoro фокус таймер. Дууссан фокус бүр study_sessions-д бүртгэгдэнэ. */
const presets = [
  { key: 'focus', label: 'Фокус 25', minutes: 25, isBreak: false },
  { key: 'short', label: 'Фокус 15', minutes: 15, isBreak: false },
  { key: 'break', label: 'Завсарлага 5', minutes: 5, isBreak: true },
];

const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

export default function FocusScreen() {
  const { subjects, sessions, profile, addSession } = useApp();
  const [preset, setPreset] = useState(presets[0]);
  const [subjectId, setSubjectId] = useState<string | null>(subjects[0]?.id ?? null);
  const [remaining, setRemaining] = useState(presets[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
    }, 500);
    return () => clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (running && remaining === 0) {
      setRunning(false);
      if (!preset.isBreak) {
        addSession({ subject_id: subjectId, duration_minutes: preset.minutes });
        Alert.alert('Фокус дууслаа! 🎉', `${preset.minutes} минут бүртгэгдлээ. 5 минут амраарай.`);
      } else {
        Alert.alert('Завсарлага дууслаа', 'Дараагийн фокусаа эхлүүлэх үү?');
      }
      setRemaining(preset.minutes * 60);
    }
  }, [remaining, running, preset, subjectId, addSession]);

  function choose(p: (typeof presets)[number]) {
    setRunning(false);
    setPreset(p);
    setRemaining(p.minutes * 60);
  }

  function startPause() {
    if (running) {
      setRunning(false);
    } else {
      endAt.current = Date.now() + remaining * 1000;
      setRunning(true);
    }
  }

  function stopAndSave() {
    setRunning(false);
    const studied = Math.floor((preset.minutes * 60 - remaining) / 60);
    if (!preset.isBreak && studied >= 1) {
      addSession({ subject_id: subjectId, duration_minutes: studied });
      Alert.alert('Хадгалагдлаа', `${studied} минут бүртгэгдлээ.`);
    } else {
      Alert.alert('Бүртгэгдсэнгүй', 'Дор хаяж 1 минут фокус хийсэн үед бүртгэнэ.');
    }
    setRemaining(preset.minutes * 60);
  }

  const total = preset.minutes * 60;
  const today = minutesOnDay(sessions, new Date());

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.chips}>
        {presets.map((p) => (
          <Chip key={p.key} label={p.label} selected={preset.key === p.key} onPress={() => choose(p)} />
        ))}
      </View>

      <Card style={styles.timerCard}>
        <Text style={styles.mode}>{preset.isBreak ? 'Завсарлага' : 'Фокус'}</Text>
        <Text style={styles.timer}>{fmt(remaining)}</Text>
        <ProgressBar value={(total - remaining) / total} color={preset.isBreak ? colors.success : colors.primary} height={10} />
      </Card>

      {!preset.isBreak ? (
        <>
          <Text style={styles.label}>Аль хичээл дээр?</Text>
          <View style={styles.chips}>
            {subjects.map((s) => (
              <Chip key={s.id} label={s.name} color={s.color} selected={subjectId === s.id} onPress={() => setSubjectId(s.id)} />
            ))}
          </View>
        </>
      ) : null}

      <AppButton title={running ? 'Түр зогсоох' : 'Эхлүүлэх'} icon={running ? 'pause' : 'play'} onPress={startPause} />
      <AppButton title="Дуусгаад хадгалах" variant="ghost" icon="stop" onPress={stopAndSave} disabled={remaining === total} />

      <Card style={{ gap: 8 }}>
        <View style={styles.between}>
          <Text style={styles.value}>Өнөөдрийн зорилго</Text>
          <Text style={styles.value}>
            {today}/{profile.daily_goal_minutes} мин
          </Text>
        </View>
        <ProgressBar value={today / profile.daily_goal_minutes} color={colors.success} />
        <Text style={styles.muted}>🔥 {studyStreak(sessions)} өдөр дараалан хичээллэсэн</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timerCard: { alignItems: 'center', gap: 12, paddingVertical: 28 },
  mode: { color: colors.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  timer: { fontSize: 64, fontWeight: '900', color: colors.text, fontVariant: ['tabular-nums'] },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  value: { color: colors.text, fontWeight: '600' },
  muted: { color: colors.muted, fontSize: 13 },
});
