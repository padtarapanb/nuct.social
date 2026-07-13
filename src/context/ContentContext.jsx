import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { fetchAllContent } from "../lib/contentApi";
import * as fallback from "../data/content";

const defaultSettings = {
  lineOAUrl: fallback.lineOAUrl,
  hero_title_line1: "NU Christian",
  hero_title_line2: "Club",
  hero_tagline: "THE PR",
  about_title_line1: "We are a family,",
  about_title_line2: "not just a club.",
  about_body:
    "เราเชื่อว่ามหาวิทยาลัยไม่ใช่แค่ที่เรียน แต่เป็นที่ที่ทุกคนสามารถเติบโตในความเชื่อ สร้างมิตรภาพ และค้นพบพระเจ้า ไม่ว่าคุณจะเพิ่งเริ่มต้นค้นหาคำตอบ หรือเดินทางในความเชื่อมานาน ที่นี่มีที่ว่างสำหรับคุณเสมอ",
  contact_email: "hello@nuct.club",
  contact_address: "มหาวิทยาลัยนเรศวร",
  stats_number: "100+",
  stats_label: "Growing Together",
  google_calendar_embed_url: "",
  google_maps_embed_url: "",
  history_title_line1: "ประวัติ",
  history_title_line2: "ชมรมคริสเตียน",
  history_body:
    "ชมรมคริสเตียน มหาวิทยาลัยนเรศวร ก่อตั้งขึ้นเมื่อปี <strong>พ.ศ. 2541 (ค.ศ. 1998)</strong> ด้วยความตั้งใจที่จะเป็นศูนย์กลางของนิสิตคริสเตียนในการนมัสการพระเจ้า เรียนรู้พระวจนะ และเติบโตในความเชื่อร่วมกัน พร้อมทั้งสร้างประโยชน์ให้แก่มหาวิทยาลัยและสังคมผ่านการรับใช้ด้วยความรัก<br/><br/>ตลอดระยะเวลาที่ผ่านมา ชมรมมุ่งเน้นการพัฒนานิสิตในสองด้านสำคัญ คือ <strong>การปลูกฝังคุณธรรมและจริยธรรม</strong> ผ่านกิจกรรมและการเรียนรู้จากพระคัมภีร์ และ <strong>การพัฒนาภาวะผู้นำ</strong> เพื่อเตรียมคนรุ่นใหม่ให้พร้อมรับใช้ผู้อื่น สร้างผลกระทบเชิงบวกต่อสังคม และดำเนินชีวิตตามแบบอย่างของพระคริสต์<br/><br/>เราเชื่อว่า <strong>ชมรมคริสเตียนคือ \"บ้านหลังที่สอง\"</strong> ของนิสิตทุกคน ไม่ว่าคุณจะเป็นคริสเตียนหรือกำลังค้นหาความหมายของชีวิต ที่นี่คือพื้นที่แห่งมิตรภาพ การยอมรับ และการเติบโตร่วมกัน โดยมี <strong>พระเยซูคริสต์เป็นศูนย์กลาง</strong> ของทุกความสัมพันธ์และทุกการเดินทางแห่งความเชื่อ",
  history_full_body:
    "<strong>พ.ศ. 2545 (ค.ศ. 2002)</strong> เนื่องจากกิจกรรมส่วนใหญ่ของชมรมในขณะนั้นเป็นกิจกรรมด้านสาธารณประโยชน์ ทางส่วนกลางจึงแนะนำให้เปลี่ยนชื่อเป็น <strong>\"ชมรมคริสเตียนเพื่อสังคม\"</strong> และย้ายไปสังกัดกลุ่มด้านบำเพ็ญประโยชน์<br/><br/>ต่อมา เนื่องจากชมรมมีการจัดอบรมส่งเสริมคุณธรรมจริยธรรมและปฏิบัติศาสนกิจอย่างต่อเนื่อง ส่วนกลางจึงมีนโยบายให้ย้ายไปสังกัดกลุ่มด้านส่งเสริมคุณธรรมจริยธรรม และเปลี่ยนชื่อกลับมาเป็น <strong>\"ชมรมคริสเตียน\"</strong> ดังเดิม ต่อเนื่องมาจนถึงปัจจุบัน<br/><br/><strong>วัตถุประสงค์ของชมรม</strong><br/>1. ส่งเสริมกิจกรรมการปฏิบัติศาสนกิจคริสเตียนตามหลักพระคริสตธรรมคัมภีร์<br/>2. เปิดโอกาสให้นิสิตและบุคคลทั่วไปได้สัมผัสถึงพระคุณความรักของพระเจ้า<br/>3. จัดกิจกรรมที่เป็นประโยชน์ต่อการพัฒนาคุณภาพชีวิตตามหลักพระคริสตธรรมคัมภีร์ โดยมุ่งเน้นกลุ่มเด็กและเยาวชน<br/>4. เสริมสร้างภาวะผู้นำและส่งเสริมการใช้ศักยภาพของนิสิตให้เกิดประโยชน์ต่อผู้อื่นและสังคม<br/>5. เสริมสร้างทักษะการทำงานร่วมกันของสมาชิกชมรมอย่างเป็นเอกภาพ ตามหลักพระคริสตธรรมคัมภีร์",
};

const defaultContent = {
  activities: fallback.activities,
  upcomingEvents: fallback.upcomingEvents,
  socials: fallback.socials,
  galleryAlbums: [],
  team: fallback.team,
  testimonials: fallback.testimonials,
  faqs: fallback.faqs,
  aboutImages: [],
  historyImages: [],
  shepherdingGroups: [],
  prTasks: [],
  settings: defaultSettings,
};

const ContentContext = createContext({
  content: defaultContent,
  loading: false,
  error: null,
  usingFallback: true,
  refresh: () => {},
});

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(!isSupabaseConfigured);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUsingFallback(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchAllContent();
      // ถ้ายังไม่มีข้อมูลในตารางไหนเลย (ยังไม่ได้ seed) ให้ใช้ค่าเริ่มต้นแทนช่องนั้น ๆ
      const merged = {
  activities: data.activities?.length ? data.activities : fallback.activities,
  upcomingEvents: data.upcomingEvents?.length ? data.upcomingEvents : fallback.upcomingEvents,
  socials: data.socials?.length ? data.socials : fallback.socials,

  galleryAlbums: data.galleryAlbums || [],

  team: data.team?.length ? data.team : fallback.team,
  testimonials: data.testimonials?.length ? data.testimonials : fallback.testimonials,
  faqs: data.faqs?.length ? data.faqs : fallback.faqs,

  aboutImages: (data.aboutImages || []).filter((img) => img.is_active !== false),
  historyImages: (data.historyImages || []).filter((img) => img.is_active !== false),

  shepherdingGroups: data.shepherdingGroups || [],
  prTasks: data.prTasks || [],
  settings: { ...defaultSettings, ...data.settings },
};
      setContent(merged);
      setUsingFallback(false);
      setError(null);
    } catch (err) {
      console.error("โหลดข้อมูลจาก Supabase ไม่สำเร็จ, ใช้ข้อมูลตัวอย่างแทน:", err);
      setContent(defaultContent);
      setUsingFallback(true);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ContentContext.Provider value={{ content, loading, error, usingFallback, refresh: load }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
