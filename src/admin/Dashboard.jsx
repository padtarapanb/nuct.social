import { useState } from "react";
import {
  Sparkles,
  CalendarDays,
  Share2,
  Images,
  Users,
  Quote,
  HelpCircle,
  Settings,
  LogOut,
  ExternalLink,
  Award,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import ListEditor from "./ListEditor";
import AlbumEditor from "./AlbumEditor";
import SettingsPanel from "./SettingsPanel";
import TreeEditor from "./TreeEditor";
import PRBoardEditor from "./PRBoardEditor";

const SECTIONS = [
  { key: "settings", label: "ข้อความทั่วไป", icon: Settings },
  { key: "aboutImages", label: "รูปภาพ About (Slider)", icon: Images },
  { key: "historyImages", label: "รูปภาพ ประวัติชมรม (Slider)", icon: Images },
  { key: "activities", label: "กิจกรรม", icon: Sparkles },
  { key: "upcomingEvents", label: "อีเวนต์ที่จะมาถึง", icon: CalendarDays },
  { key: "socials", label: "Connect With Us", icon: Share2 },
  { key: "galleryCategories", label: "แกลเลอรี", icon: Images },
  { key: "galleryAlbums", label: "อัลบั้มรูปภาพ", icon: Images },
  { key: "team", label: "Team", icon: Users },
  { key: "achievements", label: "ผลงานและรางวัล", icon: Award },
  { key: "testimonials", label: "เสียงจากสมาชิก", icon: Quote },
  { key: "faqs", label: "คำถามที่พบบ่อย", icon: HelpCircle },
  { key: "networkPartners", label: "เครือข่ายความร่วมมือ", icon: Share2 },
];

export default function Dashboard() {
  const { signOut } = useAuth();
  const [active, setActive] = useState("settings");
  const [teamTab, setTeamTab] = useState("committee");

  const renderSection = () => {
    switch (active) {
      case "settings":
        return <SettingsPanel />;
      case "aboutImages":
        return (
          <ListEditor
            tableKey="aboutImages"
            title="รูปภาพ About (Auto Slider)"
            description="รูปที่ 'เปิดใช้งาน' จะแสดงในสไลด์ฝั่งซ้ายของ About เลื่อนอัตโนมัติทุก 5 วินาที เรียงลำดับด้วยปุ่มลูกศร · วางลิงก์แชร์จาก Google Drive ได้เลย (ตั้งค่าแชร์เป็น 'ทุกคนที่มีลิงก์' ก่อน)"
            fields={[
              { name: "image_url", label: "ลิงก์รูปภาพ (URL หรือลิงก์แชร์ Google Drive)", type: "image", placeholder: "https://...", wide: true },
              { name: "is_active", label: "เปิดใช้งาน (แสดงในสไลด์)", type: "checkbox", default: true },
            ]}
          />
        );
      case "historyImages":
        return (
          <ListEditor
            tableKey="historyImages"
            title="รูปภาพ ประวัติชมรม (Auto Slider)"
            description="รูปที่ 'เปิดใช้งาน' จะแสดงในสไลด์ของส่วนประวัติชมรม เลื่อนอัตโนมัติทุก 5 วินาที เรียงลำดับด้วยปุ่มลูกศร · วางลิงก์แชร์จาก Google Drive ได้เลย (ตั้งค่าแชร์เป็น 'ทุกคนที่มีลิงก์' ก่อน)"
            fields={[
              { name: "image_url", label: "ลิงก์รูปภาพ (URL หรือลิงก์แชร์ Google Drive)", type: "image", placeholder: "https://...", wide: true },
              { name: "is_active", label: "เปิดใช้งาน (แสดงในสไลด์)", type: "checkbox", default: true },
            ]}
          />
        );
      case "activities":
        return (
          <ListEditor
            tableKey="activities"
            title="กิจกรรมของชมรม"
            description="แสดงเป็นการ์ด 3 คอลัมน์ในหน้าเว็บ · ในช่องคำอธิบายใส่ <strong>ข้อความ</strong> เพื่อทำตัวหนาสีธีมได้ · ถ้าใส่ วัน-เวลา หรือ สถานที่ หรือ รูปภาพ อย่างน้อย 1 อย่าง การ์ดจะคลิกเปิด popup แสดงรายละเอียดได้ (ถ้าไม่ใส่เลย การ์ดจะเป็นแบบเดิมไม่มี popup)"
            fields={[
              { name: "emoji", label: "อิโมจิ", placeholder: "🎵" },
              { name: "title", label: "ชื่อกิจกรรม", placeholder: "Worship Night" },
              { name: "desc", label: "คำอธิบาย", type: "textarea", wide: true },
              { name: "schedule_text", label: "วัน-เวลาที่จัดเป็นประจำ (ไม่บังคับ)", placeholder: "ทุกวันศุกร์ เวลา 18:00 น." },
              { name: "location", label: "สถานที่ (ไม่บังคับ)", placeholder: "ห้องนมัสการ ชั้น 2" },
              { name: "photo_url", label: "ลิงก์รูปภาพกิจกรรม (ไม่บังคับ)", type: "image", placeholder: "https://...", wide: true },
            ]}
          />
        );
      case "upcomingEvents":
        return (
          <ListEditor
            tableKey="upcomingEvents"
            title="อีเวนต์ที่กำลังจะมาถึง"
            description="เรียงตามลำดับที่จัดไว้ด้านล่าง (ใช้ปุ่มลูกศรจัดลำดับเอง) — ใส่โปสเตอร์/ลิงก์ลงทะเบียน/แผนที่ได้ (ไม่บังคับ) กดที่การ์ดอีเวนต์หน้าเว็บจะเด้ง popup แสดงข้อมูลเหล่านี้"
            fields={[
              { name: "day", label: "วันที่ (ตัวเลข)", placeholder: "20" },
              { name: "month", label: "เดือน (ย่อ)", placeholder: "JUL" },
              { name: "title", label: "ชื่ออีเวนต์", placeholder: "Welcome Freshmen" },
              { name: "location", label: "สถานที่", placeholder: "ลานกิจกรรม คณะ..." },
              { name: "poster_url", label: "ลิงก์รูปโปสเตอร์ (ไม่บังคับ)", type: "image", placeholder: "https://...", wide: true },
              { name: "register_link", label: "ลิงก์ลงทะเบียน (ไม่บังคับ)", placeholder: "https://forms.gle/..." },
              {
                name: "map_embed_url",
                label: "ลิงก์ Google Maps ของสถานที่นี้ (ไม่บังคับ)",
                placeholder: "https://www.google.com/maps/place/... หรือ .../maps/embed?pb=...",
                wide: true,
              },
            ]}
          />
        );
      case "socials":
        return (
          <ListEditor
            tableKey="socials"
            title="Connect With Us"
            description="เลือกไอคอนจากรายการที่รองรับเท่านั้น (พิมพ์เองไม่ได้แล้ว กันสะกดผิดจนหน้าเว็บพัง)"
            fields={[
              {
                name: "icon",
                label: "ไอคอน",
                type: "select",
                options: [
                  { value: "instagram", label: "Instagram" },
                  { value: "music2", label: "TikTok" },
                  { value: "facebook", label: "Facebook" },
                  { value: "line", label: "LINE" },
                  { value: "x", label: "X (Twitter)" },
                ],
                default: "instagram",
              },
              { name: "name", label: "ชื่อแพลตฟอร์ม", placeholder: "Instagram" },
              { name: "tagline", label: "แท็กไลน์", placeholder: "Photos · Stories · Reels" },
              { name: "cta", label: "ข้อความปุ่ม", placeholder: "Follow" },
              { name: "href", label: "ลิงก์จริง", placeholder: "https://instagram.com/..." },
              {
                name: "preview_image",
                label: "รูปพรีวิวหน้าแอพ/เพจ (ไม่บังคับ, แคปหน้าจอจริงของเพจ)",
                type: "image",
                uploadFolder: "socials-preview",
                placeholder: "https://...",
                wide: true,
              },
              {
                name: "gradient",
                label: "สีพื้นหลังไอคอน (CSS gradient, ไม่แก้ก็ได้)",
                placeholder: "linear-gradient(135deg,#F58529,#DD2A7B)",
                wide: true,
              },
            ]}
          />
        );
      case "galleryCategories":
        return (
          <ListEditor
            tableKey="galleryCategories"
            title="แกลเลอรี"
            description="ใส่ลิงก์รูปภาพ (URL) หรือลิงก์แชร์จาก Google Drive ก็ได้ (ตั้งค่าแชร์เป็น 'ทุกคนที่มีลิงก์' ก่อน) ถ้าเว้นว่างจะเป็นการ์ดสีไล่เฉดแทน"
            fields={[
              { name: "key", label: "รหัสหมวด (ภาษาอังกฤษ ไม่ซ้ำ)", placeholder: "camp" },
              { name: "title", label: "ชื่อหมวด", placeholder: "Camp" },
              { name: "image", label: "ลิงก์รูปภาพ", type: "image", placeholder: "https://...", wide: true },
            ]}
          />
        );
      case "galleryAlbums":
        return <AlbumEditor />;
      case "team": {
        const teamTabs = [
          { key: "committee", label: "Committee" },
          { key: "pr", label: "ประชาสัมพันธ์ (PR)" },
          { key: "shepherding", label: "โครงสร้างการอภิบาล" },
        ];
        return (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              {teamTabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTeamTab(t.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    teamTab === t.key ? "bg-pine-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {teamTab === "committee" && (
              <ListEditor
                tableKey="team"
                title="Committee — กรรมการชมรม"
                description="ใส่ลิงก์รูปภาพ (URL) หรือลิงก์แชร์จาก Google Drive เพื่อให้ขึ้นรูปจริงแทนตัวอักษรย่อ (ตั้งค่าแชร์เป็น 'ทุกคนที่มีลิงก์' ก่อน) แสดงทั้งในหน้า Team และแท็บ Committee ของ Leadership popup"
                rowFilter={(r) => (r.group_name || "committee") === "committee"}
                extraValues={{ group_name: "committee" }}
                fields={[
                  { name: "role", label: "ตำแหน่ง", placeholder: "President" },
                  { name: "name", label: "ชื่อ-นามสกุล", placeholder: "ชื่อ นามสกุล" },
                  { name: "photo", label: "ลิงก์รูปภาพ", type: "image", placeholder: "https://..." },
                  { name: "ig", label: "ลิงก์ Instagram ส่วนตัว", placeholder: "https://instagram.com/..." },
                  { name: "fb", label: "ลิงก์ Facebook ส่วนตัว", placeholder: "https://facebook.com/..." },
                ]}
              />
            )}

            {teamTab === "pr" && (
              <div>
                <ListEditor
                  tableKey="team"
                  title="ประชาสัมพันธ์ — ทีม PR"
                  description="ช่อง 'หน้าที่ประจำ' จะถูกใช้จัดกลุ่มแสดงเป็นบอร์ดในหน้าเว็บ (คนที่หน้าที่เดียวกันจะถูกจัดไว้ด้วยกัน) — เว้นว่างได้ถ้ายังไม่กำหนด"
                  rowFilter={(r) => r.group_name === "pr"}
                  extraValues={{ group_name: "pr" }}
                  fields={[
                    { name: "role", label: "ตำแหน่ง", placeholder: "หัวหน้าฝ่ายประชาสัมพันธ์" },
                    { name: "name", label: "ชื่อ-นามสกุล", placeholder: "ชื่อ นามสกุล" },
                    { name: "duty", label: "หน้าที่ประจำ", placeholder: "เช่น ถ่ายภาพ, ตัดต่อวิดีโอ, โพสต์คอนเทนต์" },
                    { name: "photo", label: "ลิงก์รูปภาพ", type: "image", placeholder: "https://..." },
                    { name: "ig", label: "ลิงก์ Instagram ส่วนตัว", placeholder: "https://instagram.com/..." },
                    { name: "fb", label: "ลิงก์ Facebook ส่วนตัว", placeholder: "https://facebook.com/..." },
                  ]}
                />
                <div className="mt-10 pt-8 border-t border-gray-100">
                  <PRBoardEditor />
                </div>
              </div>
            )}

            {teamTab === "shepherding" && <TreeEditor key="shepherding-tree" />}
          </div>
        );
      }
      case "achievements":
        return (
          <ListEditor
            tableKey="achievements"
            title="ผลงานและรางวัล"
            description="แสดงเป็นการ์ด 3 คอลัมน์ในหน้าเว็บ (แท็บ/เมนู Awards) — ใส่รูปผลงานหรือใบประกาศ + ชื่อรางวัล ส่วนคำอธิบายไม่บังคับ"
            fields={[
              { name: "image_url", label: "ลิงก์รูปภาพผลงาน/รางวัล (ไม่บังคับ)", type: "image", placeholder: "https://...", wide: true },
              { name: "title", label: "ชื่อรางวัล/ผลงาน", placeholder: "รางวัลชนะเลิศ โครงการ..." },
              { name: "description", label: "คำอธิบายสั้น ๆ (ไม่บังคับ)", type: "textarea", wide: true },
              { name: "is_active", label: "เปิดใช้งาน (แสดงในหน้าเว็บ)", type: "checkbox", default: true },
            ]}
          />
        );
      case "testimonials":
        return (
          <ListEditor
            tableKey="testimonials"
            title="เสียงจากสมาชิก"
            description="ใส่ <strong>ข้อความ</strong> ในข้อความรีวิวเพื่อทำตัวหนาสีธีมได้"
            fields={[
              { name: "quote", label: "ข้อความรีวิว", type: "textarea", wide: true },
              { name: "name", label: "ชื่อ/นามแฝง", placeholder: "สมาชิกปี 2" },
              { name: "faculty", label: "คณะ", placeholder: "คณะวิทยาศาสตร์" },
            ]}
          />
        );
      case "networkPartners":
        return (
          <ListEditor
            tableKey="networkPartners"
            title="เครือข่ายความร่วมมือ"
            description={'คริสตจักรหรือหน่วยงานอื่นที่เกี่ยวข้อง แสดงในแท็บ "เครือข่าย" ใต้หัวข้อติดต่อของหน้าเว็บ — ใส่แผนที่และลิงก์โซเชียลได้ (ไม่บังคับ)'}
            fields={[
              { name: "name", label: "ชื่อองค์กร/คริสตจักร", placeholder: "คริสตจักร..." },
              { name: "description", label: "คำอธิบายสั้น ๆ (กด Enter เว้นบรรทัดได้)", type: "textarea", wide: true },
              { name: "logo_url", label: "ลิงก์โลโก้ (ไม่บังคับ, วงกลมเล็กข้างชื่อ)", type: "image", uploadFolder: "network-partners/logos", placeholder: "https://..." },
              { name: "photo_url", label: "ลิงก์รูปภาพคริสตจักร/สถานที่ (ไม่บังคับ, โชว์คู่กับแผนที่)", type: "image", uploadFolder: "network-partners/photos", placeholder: "https://...", wide: true },
              { name: "link", label: "ลิงก์เว็บไซต์ (ไม่บังคับ)", placeholder: "https://..." },
              { name: "fb_link", label: "ลิงก์ Facebook (ไม่บังคับ)", placeholder: "https://facebook.com/..." },
              { name: "line_link", label: "ลิงก์ Line (ไม่บังคับ)", placeholder: "https://line.me/..." },
              { name: "youtube_link", label: "ลิงก์ YouTube (ไม่บังคับ)", placeholder: "https://youtube.com/..." },
              {
                name: "map_embed_url",
                label: "ลิงก์ Google Maps (ไม่บังคับ)",
                placeholder: "https://www.google.com/maps/place/... หรือ .../maps/embed?pb=...",
                wide: true,
              },
              { name: "is_active", label: "เปิดใช้งาน", type: "checkbox", default: true },
            ]}
          />
        );
      case "faqs":
        return (
          <ListEditor
            tableKey="faqs"
            title="คำถามที่พบบ่อย"
            description="ในช่องคำตอบใส่ <strong>ข้อความ</strong> เพื่อทำตัวหนาสีธีมได้"
            fields={[
              { name: "q", label: "คำถาม", wide: true },
              { name: "a", label: "คำตอบ", type: "textarea", wide: true },
            ]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="font-display font-bold text-gray-900">The PR — แอดมิน</p>
          <p className="text-xs text-gray-400 mt-0.5">จัดการเนื้อหาเว็บไซต์</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {SECTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active === key ? "bg-pine-50 text-pine-800" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <ExternalLink size={16} /> ดูหน้าเว็บจริง
          </a>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50"
          >
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </aside>

      <main key={active} className="flex-1 px-6 sm:px-10 py-8 max-w-4xl">{renderSection()}</main>
    </div>
  );
}
