-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor
--   1) เครือข่ายความร่วมมือ: เพิ่มแผนที่ + ลิงก์โซเชียล (YouTube/Facebook/Line) ต่อรายการ
--   2) อีเวนต์ที่กำลังจะมาถึง: เพิ่มโปสเตอร์ + ลิงก์ลงทะเบียน + แผนที่สถานที่ ต่อรายการ
-- (หมายเหตุ: บั๊ก "โหลดข้อมูลไม่สำเร็จ: Invalid relation name" ของเครือข่ายความร่วมมือ
--  แก้ที่โค้ดฝั่ง contentApi.js แล้ว ไม่เกี่ยวกับฐานข้อมูล — แค่รันไฟล์นี้เพิ่มคอลัมน์ใหม่พอ)
-- ============================================================

alter table network_partners
  add column if not exists map_embed_url text default '',
  add column if not exists fb_link text default '',
  add column if not exists line_link text default '',
  add column if not exists youtube_link text default '';

alter table upcoming_events
  add column if not exists poster_url text default '',
  add column if not exists register_link text default '',
  add column if not exists map_embed_url text default '';
