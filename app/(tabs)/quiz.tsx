import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, Card, ProgressBar, SectionHeader } from '../../components/ui';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { quizzes } from '../../data/quizzes';
import type { Quiz } from '../../types';

/** Зөв хариултын тоо. Тусдаа функц тул тест бичихэд хялбар. */
function scoreQuiz(quiz: Quiz, answers: number[]): number {
  return answers.filter((a, i) => quiz.questions[i] && a === quiz.questions[i].correctIndex).length;
}

export default function QuizScreen() {
  const { attempts, addAttempt } = useApp();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);

  function start(q: Quiz) {
    setQuiz(q);
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setAnswers([]);
    setFinished(false);
  }

  function next() {
    if (!quiz || selected === null) return;
    const all = [...answers, selected];
    setAnswers(all);
    if (index + 1 < quiz.questions.length) {
      setIndex(index + 1);
      setSelected(null);
      setChecked(false);
    } else {
      addAttempt({ quiz_title: quiz.title, score: scoreQuiz(quiz, all), total_questions: quiz.questions.length });
      setFinished(true);
    }
  }

  // ---------- Үр дүн ----------
  if (quiz && finished) {
    const score = scoreQuiz(quiz, answers);
    const total = quiz.questions.length;
    const pct = Math.round((score / total) * 100);
    const message = pct >= 80 ? 'Маш сайн! 🎉' : pct >= 50 ? 'Сайн байна, бага зэрэг давтаарай.' : 'Дахин давтаад оролдоорой.';
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Card style={{ alignItems: 'center', gap: 8 }}>
          <View style={[styles.scoreCircle, { borderColor: pct >= 50 ? colors.success : colors.danger }]}>
            <Text style={styles.scorePct}>{pct}%</Text>
            <Text style={styles.scoreSub}>
              {score}/{total}
            </Text>
          </View>
          <Text style={styles.resultTitle}>{quiz.title}</Text>
          <Text style={styles.muted}>{message}</Text>
        </Card>

        <SectionHeader title="Хариултын тойм" />
        {quiz.questions.map((q, i) => {
          const ok = answers[i] === q.correctIndex;
          return (
            <Card key={q.id} style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Ionicons name={ok ? 'checkmark-circle' : 'close-circle'} size={20} color={ok ? colors.success : colors.danger} />
                <Text style={[styles.reviewQ, { flex: 1 }]}>{q.question}</Text>
              </View>
              {!ok ? <Text style={styles.wrong}>Таны хариулт: {q.options[answers[i]]}</Text> : null}
              <Text style={styles.right}>Зөв хариулт: {q.options[q.correctIndex]}</Text>
            </Card>
          );
        })}

        <AppButton title="Дахин өгөх" icon="refresh" onPress={() => start(quiz)} />
        <AppButton title="Quiz жагсаалт руу буцах" variant="ghost" onPress={() => setQuiz(null)} />
      </ScrollView>
    );
  }

  // ---------- Асуулт ----------
  if (quiz) {
    const q = quiz.questions[index];
    const isLast = index + 1 === quiz.questions.length;
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <Pressable onPress={() => setQuiz(null)} hitSlop={10}>
            <Ionicons name="close" size={24} color={colors.muted} />
          </Pressable>
          <Text style={styles.muted}>
            Асуулт {index + 1}/{quiz.questions.length}
          </Text>
        </View>
        <ProgressBar value={(index + (checked ? 1 : 0)) / quiz.questions.length} />

        <Text style={styles.question}>{q.question}</Text>

        <View style={{ gap: 10 }}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex;
            const isSelected = i === selected;
            let border = colors.border;
            let bg = colors.card;
            if (checked && isCorrect) {
              border = colors.success;
              bg = colors.successSoft;
            } else if (checked && isSelected) {
              border = colors.danger;
              bg = colors.dangerSoft;
            } else if (isSelected) {
              border = colors.primary;
              bg = colors.primarySoft;
            }
            return (
              <Pressable
                key={opt}
                disabled={checked}
                onPress={() => setSelected(i)}
                style={[styles.option, { borderColor: border, backgroundColor: bg }]}
              >
                <View style={[styles.letter, isSelected && { backgroundColor: colors.primary }]}>
                  <Text style={[styles.letterText, isSelected && { color: '#FFFFFF' }]}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>

        {checked ? (
          <Card style={{ backgroundColor: selected === q.correctIndex ? colors.successSoft : colors.dangerSoft, gap: 4 }}>
            <Text style={{ fontWeight: '800', color: selected === q.correctIndex ? colors.success : colors.danger }}>
              {selected === q.correctIndex ? 'Зөв!' : 'Буруу'}
            </Text>
            <Text style={{ color: colors.text }}>{q.explanation}</Text>
          </Card>
        ) : null}

        {checked ? (
          <AppButton title={isLast ? 'Дуусгах' : 'Дараагийн асуулт'} icon="arrow-forward" onPress={next} />
        ) : (
          <AppButton title="Шалгах" icon="checkmark" disabled={selected === null} onPress={() => setChecked(true)} />
        )}
      </ScrollView>
    );
  }

  // ---------- Quiz жагсаалт ----------
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {quizzes.map((q) => {
        const mine = attempts.filter((a) => a.quiz_title === q.title);
        const best = mine.length ? Math.max(...mine.map((a) => Math.round((a.score / a.total_questions) * 100))) : null;
        return (
          <Card key={q.id} style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.quizTitle}>{q.title}</Text>
                <Text style={styles.muted}>
                  {q.subject} · {q.questions.length} асуулт
                </Text>
              </View>
              {best !== null ? (
                <View style={styles.best}>
                  <Text style={styles.bestText}>Шилдэг {best}%</Text>
                </View>
              ) : null}
            </View>
            <AppButton title={mine.length ? 'Дахин өгөх' : 'Эхлэх'} icon="play" onPress={() => start(q)} />
          </Card>
        );
      })}

      <SectionHeader title="Сүүлийн оролдлогууд" />
      {attempts.length === 0 ? (
        <Text style={styles.muted}>Одоогоор quiz өгөөгүй байна.</Text>
      ) : (
        attempts.slice(0, 5).map((a) => (
          <Card key={a.id} style={styles.attempt}>
            <Text style={{ flex: 1, fontWeight: '600', color: colors.text }}>{a.quiz_title}</Text>
            <Text style={{ fontWeight: '800', color: colors.primary }}>
              {a.score}/{a.total_questions}
            </Text>
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  muted: { color: colors.muted, fontSize: 13 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  question: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 4 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: radius.md, padding: 14 },
  letter: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontWeight: '800', color: colors.text },
  optionText: { flex: 1, fontSize: 15, color: colors.text },
  quizTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  best: { backgroundColor: colors.successSoft, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  bestText: { color: colors.success, fontWeight: '700', fontSize: 12 },
  attempt: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, alignItems: 'center', justifyContent: 'center' },
  scorePct: { fontSize: 30, fontWeight: '900', color: colors.text },
  scoreSub: { color: colors.muted, fontWeight: '600' },
  resultTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  reviewQ: { fontWeight: '600', color: colors.text },
  wrong: { color: colors.danger, fontSize: 13 },
  right: { color: colors.success, fontSize: 13, fontWeight: '600' },
});
