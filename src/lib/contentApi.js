import { supabase, isSupabaseConfigured } from "./supabaseClient";

// รายชื่อตารางทั้งหมดที่แอดมินแก้ไขได้ผ่านหน้าเว็บ
export const TABLES = {
  activities: "activities",
  upcomingEvents: "upcoming_events",
  socials: "socials",
  galleryCategories: "gallery_categories",
  galleryAlbums: "gallery_albums",
  team: "team_members",
  testimonials: "testimonials",
  faqs: "faqs",
  aboutImages: "about_images",
  historyImages: "history_images",
  prTasks: "pr_tasks",
  networkPartners: "network_partners",
};

// ดึงข้อมูลทุกตาราง + settings มาในก้อนเดียว เรียงตาม sort_order
export async function fetchAllContent() {
  if (!isSupabaseConfigured) return null;

  const tableKeys = Object.entries(TABLES);
  const results = await Promise.all(
    tableKeys.map(([, table]) =>
      supabase.from(table).select("*").order("sort_order", { ascending: true })
    )
  );

  const settingsRes = await supabase.from("site_settings").select("*");
  const shepherdingRes = await supabase
    .from("shepherding_groups")
    .select("*")
    .order("sort_order", { ascending: true });

  const data = {};
  tableKeys.forEach(([key], i) => {
    const { data: rows, error } = results[i];
    if (error) throw error;
    data[key] = rows || [];
  });

  const settings = {};
  (settingsRes.data || []).forEach((row) => {
    settings[row.key] = row.value;
  });
  data.settings = settings;
  data.shepherdingGroups = shepherdingRes.data || [];

  return data;
}

export async function listRows(tableKey) {
  const table = TABLES[tableKey];
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createRow(tableKey, values) {
  const table = TABLES[tableKey];
  // เอาแถวไว้ท้ายสุดเสมอ
  const { data: existing } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = existing && existing.length ? existing[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from(table)
    .insert([{ ...values, sort_order: nextOrder }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateRow(tableKey, id, values) {
  const table = TABLES[tableKey];
  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteRow(tableKey, id) {
  const table = TABLES[tableKey];
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export async function reorderRows(tableKey, orderedIds) {
  const table = TABLES[tableKey];
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from(table).update({ sort_order: index }).eq("id", id)
    )
  );
}

export async function getSetting(key, fallback = "") {
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data ? data.value : fallback;
}

export async function setSetting(key, value) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw error;
}

// --- Shepherding tree (self-referencing table) ---------------------------

export async function fetchShepherdingFlat() {
  const { data, error } = await supabase
    .from("shepherding_groups")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data;
}

export async function createShepherdingNode(parentId, name = "") {
  const { data: siblings } = await supabase
    .from("shepherding_groups")
    .select("sort_order")
    .eq("parent_id", parentId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = siblings && siblings.length ? siblings[0].sort_order + 1 : 0;

  const { data, error } = await supabase
    .from("shepherding_groups")
    .insert([{ parent_id: parentId, name, sort_order: nextOrder }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateShepherdingNode(id, values) {
  const { data, error } = await supabase
    .from("shepherding_groups")
    .update(values)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteShepherdingNode(id) {
  // ลูกทั้งหมดจะถูกลบตามด้วย (on delete cascade ที่ตั้งไว้ใน schema)
  const { error } = await supabase.from("shepherding_groups").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderShepherdingSiblings(orderedIds) {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("shepherding_groups").update({ sort_order: index }).eq("id", id)
    )
  );
}
