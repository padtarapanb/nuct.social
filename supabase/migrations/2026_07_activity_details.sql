-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor
-- เพิ่มข้อมูล วัน/เวลา, สถานที่, รูปภาพ ให้แต่ละ "กิจกรรมของชมรม"
-- เพื่อให้คลิกที่การ์ดกิจกรรมหน้าเว็บแล้วเด้ง popup แสดงรายละเอียดได้
-- (เดิมกิจกรรมมีแค่ อิโมจิ/ชื่อ/คำอธิบาย ไม่พอสำหรับ popup)
-- ============================================================

alter table activities
  add column if not exists schedule_text text default '',
  add column if not exists location text default '',
  add column if not exists photo_url text default '';
