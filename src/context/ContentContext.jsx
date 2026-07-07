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
  history_title_line1: "ประวัติ",
  history_title_line2: "ชมรมคริสเตียน",
  history_body:
    "ชมรมคริสเตียน มหาวิทยาลัยนเรศวร ก่อตั้งขึ้นเมื่อปี พ.ศ. 2541 (ค.ศ. 1998) โดยความมุ่งหมายที่จะรวบรวมผู้เชื่อคริสเตียนในมหาวิทยาลัยให้เป็นหนึ่งเดียวกัน ปฏิบัติศาสนกิจร่วมกัน และจัดกิจกรรมที่เป็นประโยชน์ต่อมหาวิทยาลัยและสังคม<br/><br/>ตลอดหลายปีที่ผ่านมา ชมรมมีเป้าประสงค์หลัก 2 ประเด็น ได้แก่ <strong>การส่งเสริมคุณธรรมจริยธรรม</strong> ผ่านการอบรมและกิจกรรมเชิงประจักษ์ และ <strong>การเสริมสร้างภาวะผู้นำ</strong> เพื่อให้นิสิตได้ใช้ศักยภาพของตนเองให้เป็นประโยชน์ต่อผู้อื่นและสังคม<br/><br/>เราเชื่อว่าชมรมคริสเตียนคือครอบครัว เปรียบเสมือนบ้านอีกหลังหนึ่งในรั้วมหาวิทยาลัย ที่ทุกคนได้เติบโตทั้งความคิด มุมมอง และจิตสาธารณะ โดยมีพระเจ้าเป็นศูนย์กลางร่วมกัน",
};

const defaultContent = {
  activities: fallback.activities,
  upcomingEvents: fallback.upcomingEvents,
  socials: fallback.socials,
  galleryCategories: fallback.galleryCategories,
  team: fallback.team,
  testimonials: fallback.testimonials,
  faqs: fallback.faqs,
  aboutImages: [],
  historyImages: [],
  shepherdingGroups: [],
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
        galleryCategories: data.galleryCategories?.length ? data.galleryCategories : fallback.galleryCategories,
        team: data.team?.length ? data.team : fallback.team,
        testimonials: data.testimonials?.length ? data.testimonials : fallback.testimonials,
        faqs: data.faqs?.length ? data.faqs : fallback.faqs,
        aboutImages: (data.aboutImages || []).filter((img) => img.is_active !== false),
        historyImages: (data.historyImages || []).filter((img) => img.is_active !== false),
        shepherdingGroups: data.shepherdingGroups || [],
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
