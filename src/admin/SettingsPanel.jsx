import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { setSetting } from "../lib/contentApi";

const FIELDS = [
  { key: "hero_tagline", label: "แท็กไลน์เล็กบน Hero", placeholder: "THE PR" },
  { key: "hero_title_line1", label: "หัวข้อ Hero บรรทัดที่ 1", placeholder: "NU Christian" },
  { key: "hero_title_line2", label: "หัวข้อ Hero บรรทัดที่ 2 (สีไล่เฉด)", placeholder: "Club" },
  { key: "about_title_line1", label: "หัวข้อ About บรรทัดที่ 1", placeholder: "We are a family," },
  { key: "about_title_line2", label: "หัวข้อ About บรรทัดที่ 2", placeholder: "not just a club." },
  {
    key: "about_body",
    label: "เนื้อหา About (ใส่ข้อความล้วน หรือใช้ <strong>คำ</strong> เพื่อทำตัวหนาได้ — อย่าวางคำสั่ง SQL ในช่องนี้)",
    type: "textarea",
  },
  { key: "contact_email", label: "อีเมลติดต่อ (Footer)", placeholder: "hello@nuct.club" },
  { key: "contact_address", label: "ที่อยู่ (Footer)", placeholder: "มหาวิทยาลัยนเรศวร" },
  { key: "stats_number", label: "ตัวเลขสมาชิก (การ์ดมุมล่างขวาของรูป About)", placeholder: "100+" },
  { key: "stats_label", label: "ข้อความใต้ตัวเลข", placeholder: "Growing Together" },
  {
    key: "history_title_line1",
    label: "หัวข้อ ประวัติชมรม บรรทัดที่ 1",
    placeholder: "ประวัติ",
  },
  {
    key: "history_title_line2",
    label: "หัวข้อ ประวัติชมรม บรรทัดที่ 2",
    placeholder: "ชมรมคริสเตียน",
  },
  {
    key: "history_body",
    label:
      "เนื้อหาประวัติชมรม (ใส่ <strong>คำ</strong> เพื่อทำตัวหนา, ใส่ <br/><br/> เพื่อขึ้นย่อหน้าใหม่ — อย่าวางคำสั่ง SQL ในช่องนี้)",
    type: "textarea",
  },
  {
    key: "history_full_body",
    label:
      "ประวัติฉบับเต็ม (โชว์เมื่อกดปุ่ม \"อ่านประวัติเต็ม\" ใต้ประวัติย่อ — เว้นว่างไว้ถ้าไม่ต้องการให้มีปุ่มนี้)",
    type: "textarea",
  },
  {
    key: "lineOAUrl",
    label: "ลิงก์ปุ่ม Join Club (LINE OA หรือฟอร์มสมัคร)",
    placeholder: "https://line.me/R/ti/p/@yourclub",
  },
  {
    key: "google_calendar_embed_url",
    label:
      "ลิงก์ฝัง Google Calendar สำหรับเมนู Events (Google Calendar > ตั้งค่า > เลือกปฏิทิน > \"ผสานรวมปฏิทิน\" > คัดลอกลิงก์ในช่อง \"ลิงก์แบบฝัง\" เอามาแค่ URL ที่อยู่ใน src=\"...\" เท่านั้น ต้องขึ้นต้นด้วย https://calendar.google.com/ และต้องตั้งค่าปฏิทินเป็น \"สาธารณะ\" ก่อนด้วย ไม่งั้นจะฝังไม่ขึ้น)",
    placeholder: "https://calendar.google.com/calendar/embed?src=...",
  },
  {
    key: "google_maps_embed_url",
    label:
      "ลิงก์ฝัง Google Maps สำหรับ Contact (เปิด Google Maps > ค้นหาสถานที่ > แชร์ > ฝังแผนที่ > คัดลอก HTML > เอามาแค่ URL ที่อยู่ใน src=\"...\" เท่านั้น ต้องขึ้นต้นด้วย https://www.google.com/maps/embed)",
    placeholder: "https://www.google.com/maps/embed?pb=...",
  },
];

export default function SettingsPanel() {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.from("site_settings").select("*");
        if (error) throw error;
        const v = {};
        (data || []).forEach((row) => (v[row.key] = row.value));
        setValues(v);
      } catch (err) {
        setError("โหลดข้อมูลไม่สำเร็จ: " + err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await Promise.all(FIELDS.map((f) => setSetting(f.key, values[f.key] ?? "")));
      setMessage("บันทึกเรียบร้อย");
    } catch (err) {
      setError("บันทึกไม่สำเร็จ: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
        <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">ข้อความทั่วไปของเว็บ</h2>
        <p className="text-sm text-gray-500 mt-1">
          ข้อความ Hero, About, ข้อมูลติดต่อ และลิงก์ปุ่ม Join Club
        </p>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}
      {message && <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">{message}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                rows={4}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((s) => ({ ...s, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
              />
            )}
          </div>
        ))}

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-pine-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pine-900 transition-colors disabled:opacity-50"
        >
          <Save size={16} /> {saving ? "กำลังบันทึก..." : "บันทึกทั้งหมด"}
        </button>
      </div>
    </div>
  );
}
