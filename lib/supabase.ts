/**
 * Supabase холболтын бэлтгэл (дараагийн шат).
 * Одоогийн хувилбар local (AsyncStorage) өгөгдлөөр ажилладаг тул энэ файлыг апп импортлоогүй.
 * Ашиглахдаа: .env файлд EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY бичнэ.
 * Түлхүүрийг кодонд шууд бичихгүй.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
      })
    : null;

/** Жишээ: нэвтэрсэн хэрэглэгчийн даалгаврыг унших (RLS нь зөвхөн өөрийнхийг буцаана). */
export async function fetchTasks() {
  if (!supabase) return [];
  const { data, error } = await supabase.from('tasks').select('*').order('due_at', { ascending: true });
  if (error) throw error;
  return data;
}
