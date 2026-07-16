-- ============================================================
-- รันครั้งเดียวใน Supabase SQL Editor
-- แก้บั๊ก: "Could not find the 'logo_url' column of 'network_partners'"
-- (หน้าแอดมินมีช่องให้ใส่โลโก้เครือข่ายความร่วมมือ แต่ตารางฐานข้อมูลยังไม่มีคอลัมน์นี้)
-- ============================================================

alter table network_partners
  add column if not exists logo_url text default '';

notify pgrst, 'reload schema';
