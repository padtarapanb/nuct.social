import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// เว็บจะยังทำงานได้แม้ยังไม่ได้ตั้งค่า Supabase (จะโชว์ข้อมูลตัวอย่างแทน)
// isSupabaseConfigured ใช้เช็คว่าตั้งค่าไว้แล้วหรือยัง
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
