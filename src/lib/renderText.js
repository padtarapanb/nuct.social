import DOMPurify from "dompurify";

// ใช้ตรงนี้ที่เดียว ทุกข้อความที่มาจากหลังบ้าน (Supabase) ที่อยากรองรับ
// แท็ก HTML พื้นฐานอย่าง <strong>, <br>, <em>, <a>, <ul>/<li> ให้เรียกผ่านฟังก์ชันนี้
// วันหลังอยากเปลี่ยนไปรองรับ Markdown ก็แก้ไฟล์นี้ไฟล์เดียวพอ
export function renderText(text = "") {
  return {
    __html: DOMPurify.sanitize(text || "", {
      ALLOWED_TAGS: ["strong", "b", "em", "i", "u", "br", "a", "ul", "ol", "li", "span", "p"],
      ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
    }),
  };
}
