-- ============================================================
-- The PR (NU Christian Club) — Content schema for Supabase
-- วิธีใช้: เปิด Supabase Dashboard > SQL Editor > New query
-- แล้ววาง SQL ทั้งไฟล์นี้ลงไป กด Run ครั้งเดียวจบ
-- ============================================================

-- 1) ตารางเนื้อหาแต่ละส่วน -------------------------------------

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  emoji text default '',
  title text default '',
  "desc" text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists upcoming_events (
  id uuid primary key default gen_random_uuid(),
  day text default '',
  month text default '',
  title text default '',
  location text default '',
  poster_url text default '',
  register_link text default '',
  map_embed_url text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists socials (
  id uuid primary key default gen_random_uuid(),
  icon text default 'instagram',
  name text default '',
  tagline text default '',
  cta text default 'Follow',
  href text default '#',
  gradient text default 'linear-gradient(135deg,#7C3AED,#EC4899)',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists gallery_categories (
  id uuid primary key default gen_random_uuid(),
  key text default '',
  title text default '',
  image text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists gallery_albums (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  slug text not null default '',
  folder text not null default '',
  description text default '',
  cover_image text default '',
  images jsonb default '[]'::jsonb,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_gallery_album_updated on gallery_albums;
create trigger trg_gallery_album_updated
before update on gallery_albums
for each row execute function update_updated_at_column();

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  role text default '',
  name text default '',
  photo text default '',
  ig text default '#',
  fb text default '#',
  group_name text default 'committee', -- 'committee' หรือ 'pr' ใช้แยกแท็บในหน้า Team
  duty text default '', -- หน้าที่ประจำ (เฉพาะทีมประชาสัมพันธ์) เช่น "ถ่ายภาพ", "ตัดต่อวิดีโอ"
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists pr_tasks (
  id uuid primary key default gen_random_uuid(),
  title text default '',
  description text default '',
  status text default 'todo', -- 'todo' | 'doing' | 'done'
  assignee_id uuid references team_members(id) on delete set null,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists network_partners (
  id uuid primary key default gen_random_uuid(),
  name text default '',
  description text default '',
  link text default '',
  map_embed_url text default '',
  fb_link text default '',
  line_link text default '',
  youtube_link text default '',
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text default '',
  name text default '',
  faculty text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  q text default '',
  a text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists about_images (
  id uuid primary key default gen_random_uuid(),
  image_url text default '',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists history_images (
  id uuid primary key default gen_random_uuid(),
  image_url text default '',
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists shepherding_groups (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references shepherding_groups(id) on delete cascade,
  name text default '',
  photo text default '',
  ig text default '',
  fb text default '',
  sort_order int default 0,
  created_at timestamptz default now()
);

create table if not exists site_settings (
  key text primary key,
  value text default ''
);

-- 2) เปิด Row Level Security + policy ---------------------------
-- อ่านได้ทุกคน (public), เขียน/ลบ/แก้ ได้เฉพาะผู้ที่ login แล้วเท่านั้น

alter table activities enable row level security;
alter table upcoming_events enable row level security;
alter table socials enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_albums enable row level security;
alter table team_members enable row level security;
alter table testimonials enable row level security;
alter table faqs enable row level security;
alter table site_settings enable row level security;
alter table about_images enable row level security;
alter table history_images enable row level security;
alter table shepherding_groups enable row level security;
alter table network_partners enable row level security;
alter table pr_tasks enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array['activities','upcoming_events','socials','gallery_categories','gallery_albums','team_members','testimonials','faqs','about_images','history_images','shepherding_groups','site_settings','network_partners','pr_tasks']
  loop
    execute format('drop policy if exists "public read %1$s" on %1$s', t);
    execute format('create policy "public read %1$s" on %1$s for select using (true)', t);

    execute format('drop policy if exists "auth insert %1$s" on %1$s', t);
    execute format('create policy "auth insert %1$s" on %1$s for insert to authenticated with check (true)', t);

    execute format('drop policy if exists "auth update %1$s" on %1$s', t);
    execute format('create policy "auth update %1$s" on %1$s for update to authenticated using (true) with check (true)', t);

    execute format('drop policy if exists "auth delete %1$s" on %1$s', t);
    execute format('create policy "auth delete %1$s" on %1$s for delete to authenticated using (true)', t);
  end loop;
end $$;

-- 3) ข้อมูลตั้งต้น (ย้ายมาจาก src/data/content.js เดิม) -----------
-- แก้ไข/เพิ่ม/ลบได้ทั้งหมดผ่านหน้าแอดมินภายหลัง ไม่จำเป็นต้องแก้ตรงนี้

insert into activities (emoji, title, "desc", sort_order) values
  ('🎵', 'Worship Night', 'ค่ำคืนแห่งเสียงเพลงและการนมัสการร่วมกัน เปิดพื้นที่ให้ใจได้พักและเชื่อมสัมพันธ์กับพระเจ้า', 0),
  ('🏕', 'Camp', 'ทริปค่ายประจำปีที่ทุกคนได้ผูกมิตร เรียนรู้ และเติบโตไปด้วยกันนอกรั้วมหาวิทยาลัย', 1),
  ('☕', 'Cell Group', 'กลุ่มเล็กพูดคุยแบ่งปันชีวิตประจำสัปดาห์ พื้นที่ปลอดภัยสำหรับทุกคำถามและทุกช่วงชีวิต', 2),
  ('🎄', 'Christmas', 'งานเฉลิมฉลองส่งท้ายปีที่เปิดต้อนรับทุกคน ไม่ว่าจะเป็นคริสเตียนหรือไม่ก็ตาม', 3),
  ('❤️', 'Outreach', 'กิจกรรมออกไปแบ่งปันความรักและความช่วยเหลือสู่ชุมชนรอบมหาวิทยาลัย', 4),
  ('📖', 'Bible Study', 'ศึกษาพระคัมภีร์ร่วมกันแบบสบาย ๆ เปิดกว้างสำหรับทุกคำถามและทุกระดับความเข้าใจ', 5)
on conflict do nothing;

insert into upcoming_events (day, month, title, location, sort_order) values
  ('20', 'JUL', 'Welcome Freshmen', 'ลานกิจกรรม คณะ...', 0),
  ('28', 'JUL', 'Prayer Night', 'ห้องนมัสการ', 1),
  ('30', 'JUL', 'Camp', 'ค่ายนอกสถานที่', 2)
on conflict do nothing;

insert into socials (icon, name, tagline, cta, href, gradient, sort_order) values
  ('instagram', 'Instagram', 'Photos · Stories · Reels', 'Follow', '#', 'linear-gradient(135deg,#F58529,#DD2A7B,#8134AF,#515BD4)', 0),
  ('music2', 'TikTok', 'Funny · Worship · Camp', 'Watch', '#', 'linear-gradient(135deg,#25F4EE,#111111,#FE2C55)', 1),
  ('facebook', 'Facebook', 'Announcements · Events', 'Visit', '#', 'linear-gradient(135deg,#1877F2,#3B5998)', 2),
  ('x', 'X', 'Updates · Quotes', 'Follow', '#', 'linear-gradient(135deg,#111111,#3A3A3A)', 3)
on conflict do nothing;

insert into gallery_categories (key, title, image, sort_order) values
  ('camp', 'Camp', '', 0),
  ('christmas', 'Christmas', '', 1),
  ('sports', 'Sports', '', 2),
  ('cell', 'Cell', '', 3),
  ('baptism', 'Baptism', '', 4),
  ('welcome', 'Welcome Freshmen', '', 5)
on conflict do nothing;

insert into team_members (role, name, photo, ig, fb, group_name, sort_order) values
  ('President', 'ชื่อ นามสกุล', '', '#', '#', 'committee', 0),
  ('Vice President', 'ชื่อ นามสกุล', '', '#', '#', 'committee', 1),
  ('Worship Team', 'ชื่อ นามสกุล', '', '#', '#', 'committee', 2),
  ('ประชาสัมพันธ์', 'ชื่อ นามสกุล', '', '#', '#', 'pr', 3),
  ('ประชาสัมพันธ์', 'ชื่อ นามสกุล', '', '#', '#', 'pr', 4)
on conflict do nothing;

insert into testimonials (quote, name, faculty, sort_order) values
  ('เข้าชมรมนี้แล้วรู้สึกเหมือนมีบ้านหลังที่สองในมหาวิทยาลัย มีคนคอยถามไถ่และรับฟังจริง ๆ', 'รุ่นพี่ปี 3', 'คณะวิทยาศาสตร์', 0),
  ('ตอนแรกแค่ตามเพื่อนมา แต่กลายเป็นที่ที่ทำให้เห็นความเชื่อของตัวเองชัดขึ้นทุกสัปดาห์', 'สมาชิกปี 2', 'คณะบริหารธุรกิจฯ', 1),
  ('บรรยากาศอบอุ่น ไม่กดดัน เปิดให้ถามได้ทุกอย่างแม้จะไม่ใช่คริสเตียน', 'สมาชิกปี 1', 'คณะมนุษยศาสตร์', 2)
on conflict do nothing;

insert into faqs (q, a, sort_order) values
  ('ไม่ใช่คริสเตียนเข้าร่วมได้ไหม?', 'ได้แน่นอนครับ/ค่ะ ทุกกิจกรรมเปิดต้อนรับทุกคนโดยไม่มีเงื่อนไขเรื่องความเชื่อ มาลองสัมผัสบรรยากาศดูก่อนได้เลย', 0),
  ('ต้องเสียค่าใช้จ่ายในการเข้าร่วมไหม?', 'กิจกรรมประจำสัปดาห์ส่วนใหญ่ไม่มีค่าใช้จ่าย ส่วนกิจกรรมพิเศษอย่างค่ายจะแจ้งค่าใช้จ่ายล่วงหน้าเสมอ', 1),
  ('ต้องเข้าร่วมทุกกิจกรรมหรือเปล่า?', 'ไม่จำเป็นครับ/ค่ะ เลือกเข้าร่วมกิจกรรมที่สนใจหรือสะดวกได้ตามต้องการ', 2),
  ('จะติดตามข่าวสารกิจกรรมได้ทางไหน?', 'ติดตามผ่านโซเชียลมีเดียของชมรมได้ทุกช่องทางในหัวข้อ Connect With Us ด้านบน หรือกดปุ่ม Join Club เพื่อรับข่าวสารทาง LINE', 3)
on conflict do nothing;

insert into site_settings (key, value) values
  ('hero_tagline', 'THE PR'),
  ('hero_title_line1', 'NU Christian'),
  ('hero_title_line2', 'Club'),
  ('about_title_line1', 'We are a family,'),
  ('about_title_line2', 'not just a club.'),
  ('about_body', 'เราเชื่อว่ามหาวิทยาลัยไม่ใช่แค่ที่เรียน แต่เป็นที่ที่ทุกคนสามารถเติบโตในความเชื่อ สร้างมิตรภาพ และค้นพบพระเจ้า ไม่ว่าคุณจะเพิ่งเริ่มต้นค้นหาคำตอบ หรือเดินทางในความเชื่อมานาน ที่นี่มีที่ว่างสำหรับคุณเสมอ'),
  ('contact_email', 'nuchristianclub@gmail.com'),
  ('contact_address', 'ห้องชมรมคริสเตียน 99 หมู่ 9 ตำบลท่าโพธิ์ อำเภอเมืองพิษณุโลก จังหวัดพิษณุโลก รหัสไปรษณีย์ 65000 (ตั้งอยู่ในอาคารอเนกประสงค์ บริเวณตรงข้ามลานแอโรบิก)'),
  ('contact_person_name', 'นางสาวภัทรพรรณ บัญญัติศิลป์ (พี่อั้ม)'),
  ('contact_person_role', 'ประธานชมรมคริสเตียน'),
  ('stats_number', '100+'),
  ('stats_label', 'Growing Together'),
  ('google_calendar_embed_url', 'https://calendar.google.com/calendar/embed?src=q3r4fhparrkjjuo3m58oeoli8g%40group.calendar.google.com&ctz=Asia%2FBangkok'),
  ('google_maps_embed_url', 'https://www.google.com/maps?q=16.7479112,100.1919336&z=17&output=embed'),
  ('lineOAUrl', '#')
on conflict (key) do nothing;

-- โครงสร้างการอภิบาล (Shepherding) ตัวอย่างเริ่มต้น — สร้างครั้งเดียวถ้ายังไม่มีข้อมูล
do $$
declare
  root_id uuid;
  region_id uuid;
  nu1_id uuid;
  nu2_id uuid;
  nu3_id uuid;
begin
  if not exists (select 1 from shepherding_groups) then
    insert into shepherding_groups (parent_id, name, sort_order) values (null, 'หัวหน้าเขต', 0) returning id into root_id;
    insert into shepherding_groups (parent_id, name, sort_order) values (root_id, 'หัวหน้าแขวง', 0) returning id into region_id;
    insert into shepherding_groups (parent_id, name, sort_order) values (region_id, 'NU1', 0) returning id into nu1_id;
    insert into shepherding_groups (parent_id, name, sort_order) values (region_id, 'NU2', 1) returning id into nu2_id;
    insert into shepherding_groups (parent_id, name, sort_order) values (region_id, 'NU3', 2) returning id into nu3_id;

    insert into shepherding_groups (parent_id, name, sort_order) values
      (nu1_id, 'ศึกษาศาสตร์', 0),
      (nu1_id, 'มนุษยศาสตร์ 1', 1),
      (nu1_id, 'วิศวกรรมศาสตร์', 2),
      (nu2_id, 'นิติศาสตร์', 0),
      (nu2_id, 'มนุษยศาสตร์ 2', 1),
      (nu2_id, 'วิทยาศาสตร์', 2),
      (nu3_id, 'สายสุขภาพ', 0),
      (nu3_id, 'เกษตรศาสตร์', 1),
      (nu3_id, 'สถาปัตยกรรมศาสตร์', 2);
  end if;
end $$;
