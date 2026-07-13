-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor เพื่ออัปเดตฐานข้อมูลตามฟีเจอร์ใหม่:
--   1) ช่อง "group" ใน team_members (แยก Committee / ประชาสัมพันธ์)
--   2) ตาราง network_partners (แท็บ "เครือข่าย" ใต้ Contact)
--   3) เติมค่าเริ่มต้นของข้อมูลติดต่อ/ปฏิทิน/แผนที่ ที่ก่อนหน้านี้ว่างอยู่
--
-- หมายเหตุ: ถ้ายังไม่เคยรัน supabase/migrations/add_shepherding_photo.sql
-- (เพิ่มช่องรูปให้โครงสร้างการอภิบาล) ให้รันไฟล์นั้นก่อน/พร้อมกับไฟล์นี้ด้วย
-- ไม่งั้นหน้าแอดมินจะยังขึ้น error "Could not find the 'photo' column of
-- 'shepherding_groups'" อยู่เหมือนเดิม
-- ============================================================

-- 1) เพิ่มช่อง group ให้ team_members (ใช้ "group_name" เพราะ "group" เป็นคำสงวนใน SQL)
alter table team_members
  add column if not exists group_name text default 'committee';

update team_members set group_name = 'committee' where group_name is null;

-- 2) ตารางเครือข่ายความร่วมมือ
create table if not exists network_partners (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  description text default '',
  link text default '',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table network_partners enable row level security;

drop policy if exists "public read network_partners" on network_partners;
create policy "public read network_partners" on network_partners for select using (true);

drop policy if exists "auth insert network_partners" on network_partners;
create policy "auth insert network_partners" on network_partners for insert to authenticated with check (true);

drop policy if exists "auth update network_partners" on network_partners;
create policy "auth update network_partners" on network_partners for update to authenticated using (true) with check (true);

drop policy if exists "auth delete network_partners" on network_partners;
create policy "auth delete network_partners" on network_partners for delete to authenticated using (true);

-- 3) เติม/แก้ค่าเริ่มต้นของข้อมูลติดต่อ ปฏิทิน และแผนที่ ให้ตรงกับที่ชมรมใช้จริง
--    (ถ้าเคยแก้ไว้แล้วในหน้าแอดมิน ค่าที่แก้ไว้จะยังคงอยู่ — เฉพาะช่องที่ "ยังไม่เคยตั้งค่า" เท่านั้นที่จะถูกเติม)
insert into site_settings (key, value) values
  ('contact_email', 'nuchristianclub@gmail.com'),
  ('contact_address', 'ห้องชมรมคริสเตียน 99 หมู่ 9 ตำบลท่าโพธิ์ อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก รหัสไปรษณีย์ 65000 (ตั้งอยู่ในอาคารอเนกประสงค์ บริเวณตรงข้ามลานแอโรบิก)'),
  ('contact_person_name', 'นางสาวภัทรพรรณ บัญญัติศิลป์ (พี่อั้ม)'),
  ('contact_person_role', 'ประธานชมรมคริสเตียน'),
  ('google_calendar_embed_url', 'https://calendar.google.com/calendar/embed?src=q3r4fhparrkjjuo3m58oeoli8g%40group.calendar.google.com&ctz=Asia%2FBangkok'),
  ('google_maps_embed_url', 'https://www.google.com/maps?q=16.7479112,100.1919336&z=17&output=embed'),
  ('about_images_folder', ''),
  ('history_images_folder', '')
on conflict (key) do nothing;

-- ถ้าอยากบังคับอัปเดตทับค่าเดิมที่เคยตั้งไว้ (เช่นเคยลองตั้งเป็นค่าว่างไว้ก่อนหน้านี้)
-- ให้ลบ "on conflict (key) do nothing" ด้านบนแล้วรันคำสั่งนี้แทน:
-- insert into site_settings (key, value) values (...) on conflict (key) do update set value = excluded.value;
