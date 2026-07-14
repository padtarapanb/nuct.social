-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor
-- เพิ่มตาราง "achievements" สำหรับแท็บ "ผลงานและรางวัล" ใหม่บนหน้าเว็บ
-- (มีช่องแนบรูป + ชื่อรางวัล/ผลงาน + คำอธิบายสั้น ๆ ไม่บังคับ)
-- ============================================================

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  description text default '',
  image_url text default '',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table achievements enable row level security;

drop policy if exists "public read achievements" on achievements;
create policy "public read achievements" on achievements for select using (true);

drop policy if exists "auth insert achievements" on achievements;
create policy "auth insert achievements" on achievements for insert to authenticated with check (true);

drop policy if exists "auth update achievements" on achievements;
create policy "auth update achievements" on achievements for update to authenticated using (true) with check (true);

drop policy if exists "auth delete achievements" on achievements;
create policy "auth delete achievements" on achievements for delete to authenticated using (true);
