import type { StudySession, Task } from '../types';

const pad = (n: number) => String(n).padStart(2, '0');

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function addDays(n: number, hour = 23, minute = 59): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function timeKey(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function startOfDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

/** Өнөөдрөөс хэдэн хоногийн зайтай вэ (өчигдөр = -1, өнөөдөр = 0, маргааш = 1). */
export function dayDiff(iso: string): number {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(new Date())) / 86400000);
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

export function formatDue(iso: string): string {
  const d = new Date(iso);
  const diff = dayDiff(iso);
  if (isOverdue(iso)) return 'Хугацаа хэтэрсэн';
  if (diff === 0) return `Өнөөдөр ${timeKey(d)}`;
  if (diff === 1) return `Маргааш ${timeKey(d)}`;
  return `${diff} хоногийн дараа · ${d.getMonth() + 1}/${d.getDate()}`;
}

/** "2026-11-20" + "23:59" -> Date, буруу бол null. */
export function parseDateTime(dateText: string, timeText: string): Date | null {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText.trim());
  const tm = /^(\d{1,2}):(\d{2})$/.exec(timeText.trim());
  if (!dm || !tm) return null;
  const y = Number(dm[1]);
  const m = Number(dm[2]);
  const day = Number(dm[3]);
  const h = Number(tm[1]);
  const min = Number(tm[2]);
  if (h > 23 || min > 59) return null;
  const d = new Date(y, m - 1, day, h, min, 0, 0);
  if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
  return d;
}

export const byDue = (a: Task, b: Task) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime();

export function minutesOnDay(sessions: StudySession[], day: Date): number {
  const key = dateKey(day);
  return sessions
    .filter((s) => dateKey(new Date(s.studied_at)) === key)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
}

export function minutesLastDays(sessions: StudySession[], days: number): number {
  const from = startOfDay(new Date()) - (days - 1) * 86400000;
  return sessions
    .filter((s) => new Date(s.studied_at).getTime() >= from)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
}

/** Дараалан хичээллэсэн өдрийн тоо (streak). */
export function studyStreak(sessions: StudySession[]): number {
  const days = new Set(sessions.map((s) => dateKey(new Date(s.studied_at))));
  const cursor = new Date();
  if (!days.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(dateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
