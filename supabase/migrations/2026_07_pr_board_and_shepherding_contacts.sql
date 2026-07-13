-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor เพื่ออัปเดตฐานข้อมูลตามฟีเจอร์ใหม่:
--   1) ข้อมูลติดต่อ (IG/FB) ในผังโครงสร้างการอภิบาล (Shepherding)
--   2) ช่อง "หน้าที่ประจำ" (duty) ให้สมาชิกทีมประชาสัมพันธ์ (PR)
--   3) ตาราง pr_tasks — บอร์ดงานเฉพาะกิจของทีมประชาสัมพันธ์ (มอบหมาย + สถานะ)
--
-- หมายเหตุ: ให้รันไฟล์นี้พร้อมกับ/หลังจาก add_shepherding_photo.sql และ
-- 2026_07_site_updates.sql ถ้ายังไม่เคยรันสองไฟล์นั้นมาก่อน
-- ============================================================

-- 1) ข้อมูลติดต่อในผังโครงสร้างการอภิบาล (เหมือนฝั่ง Committee)
alter table shepherding_groups
  add column if not exists ig text default '',
  add column if not exists fb text default '';

-- 2) หน้าที่ประจำของสมาชิกทีมประชาสัมพันธ์ (เช่น "ถ่ายภาพ", "ตัดต่อวิดีโอ", "โพสต์คอนเทนต์")
alter table team_members
  add column if not exists duty text default '';

-- 3) บอร์ดงานเฉพาะกิจของทีมประชาสัมพันธ์
create table if not exists pr_tasks (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  description text default '',
  status text default 'todo', -- 'todo' | 'doing' | 'done'
  assignee_id uuid references team_members(id) on delete set null,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table pr_tasks enable row level security;

drop policy if exists "public read pr_tasks" on pr_tasks;
create policy "public read pr_tasks" on pr_tasks for select using (true);

drop policy if exists "auth insert pr_tasks" on pr_tasks;
create policy "auth insert pr_tasks" on pr_tasks for insert to authenticated with check (true);

drop policy if exists "auth update pr_tasks" on pr_tasks;
create policy "auth update pr_tasks" on pr_tasks for update to authenticated using (true) with check (true);

drop policy if exists "auth delete pr_tasks" on pr_tasks;
create policy "auth delete pr_tasks" on pr_tasks for delete to authenticated using (true);
