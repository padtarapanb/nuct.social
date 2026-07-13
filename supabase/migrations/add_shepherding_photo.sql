-- รันครั้งเดียวใน Supabase SQL editor เพื่อเพิ่มช่องรูปภาพให้โครงสร้างการอภิบาล (Shepherding)
-- ให้ใส่รูปได้เหมือนส่วน Committee

alter table shepherding_groups
  add column if not exists photo text default '';
