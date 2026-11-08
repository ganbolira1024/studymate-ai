export type Priority = 'low' | 'medium' | 'high';
export type TaskKind = 'assignment' | 'exam';
export type AIMode = 'summary' | 'explain' | 'review';

export interface Subject {
  id: string;
  name: string;
  instructor: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  subject_id: string | null;
  title: string;
  description: string;
  due_at: string;
  priority: Priority;
  kind: TaskKind;
  is_completed: boolean;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface StudySession {
  id: string;
  subject_id: string | null;
  duration_minutes: number;
  studied_at: string;
}

export interface Profile {
  full_name: string;
  email: string;
  daily_goal_minutes: number;
  show_completed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  mode?: AIMode;
  created_at: string;
}

export interface AppData {
  subjects: Subject[];
  tasks: Task[];
  attempts: QuizAttempt[];
  sessions: StudySession[];
  profile: Profile;
  chat: ChatMessage[];
}
