import type { AppData } from '../types';
import { addDays, uid } from '../utils/date';

/** Demo өгөгдөл: апп анх нээгдэх үед болон "Demo сэргээх" дарахад ашиглана. */
export function createSeed(): AppData {
  const now = new Date().toISOString();
  return {
    subjects: [
      { id: 's-mobile', name: 'Мобайл програмчлал', instructor: 'Багш А', color: '#2A1AD8', created_at: now },
      { id: 's-db', name: 'Өгөгдлийн сан', instructor: 'Багш Б', color: '#E8590C', created_at: now },
      { id: 's-eng', name: 'Англи хэл', instructor: 'Багш В', color: '#1E9E5A', created_at: now },
    ],
    tasks: [
      {
        id: uid(), subject_id: 's-mobile', title: 'StudyMate AI төсөл илгээх',
        description: 'Эх код, README, screenshot-ууд', due_at: addDays(0).toISOString(),
        priority: 'high', kind: 'assignment', is_completed: false, created_at: now,
      },
      {
        id: uid(), subject_id: 's-db', title: 'Лабораторийн ажил 6',
        description: 'JOIN болон GROUP BY дасгал', due_at: addDays(2).toISOString(),
        priority: 'medium', kind: 'assignment', is_completed: false, created_at: now,
      },
      {
        id: uid(), subject_id: 's-db', title: 'Өгөгдлийн сангийн явцын шалгалт',
        description: '1-6 сэдэв', due_at: addDays(4, 10, 0).toISOString(),
        priority: 'high', kind: 'exam', is_completed: false, created_at: now,
      },
      {
        id: uid(), subject_id: 's-eng', title: 'Англи хэлний шалгалт',
        description: 'Unit 4-6', due_at: addDays(9, 9, 0).toISOString(),
        priority: 'medium', kind: 'exam', is_completed: false, created_at: now,
      },
      {
        id: uid(), subject_id: 's-eng', title: 'Unit 5 vocabulary давтах',
        description: '', due_at: addDays(1, 20, 0).toISOString(),
        priority: 'low', kind: 'assignment', is_completed: true, created_at: now,
      },
      {
        id: uid(), subject_id: 's-mobile', title: 'Expo Router-ийн заавар унших',
        description: '', due_at: addDays(-1, 18, 0).toISOString(),
        priority: 'medium', kind: 'assignment', is_completed: true, created_at: now,
      },
    ],
    attempts: [
      { id: uid(), quiz_title: 'SQL ба Supabase', score: 3, total_questions: 5, completed_at: addDays(-2, 14, 0).toISOString() },
    ],
    sessions: [
      { id: uid(), subject_id: 's-mobile', duration_minutes: 25, studied_at: addDays(-1, 15, 0).toISOString() },
      { id: uid(), subject_id: 's-db', duration_minutes: 40, studied_at: addDays(-2, 16, 0).toISOString() },
    ],
    profile: { full_name: 'Ганболор', email: '', daily_goal_minutes: 60, show_completed: true },
    chat: [],
  };
}
