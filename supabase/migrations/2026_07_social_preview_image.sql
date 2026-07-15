-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor
-- เพิ่มรูปพรีวิวหน้าแอพ/เพจจริง ให้การ์ด "Connect With Us" แต่ละอัน
-- (เช่น แคปหน้าจอ IG/Facebook/TikTok/X ของชมรม) ถ้าไม่ใส่จะแสดงไอคอนแบบเดิม
-- ============================================================

alter table socials
  add column if not exists preview_image text default '';
