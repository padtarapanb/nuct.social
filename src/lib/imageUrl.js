// รูปที่แอดมินอัปโหลดไว้ใน Google Drive แล้วคัดลอกลิงก์แบบ "แชร์" มาวาง
// (เช่น https://drive.google.com/file/d/XXXX/view?usp=sharing) จะเปิดเป็นหน้าเว็บดูไฟล์
// ไม่ใช่ไฟล์รูปโดยตรง ทำให้ <img src="..."> โหลดไม่ขึ้น ฟังก์ชันนี้แปลงลิงก์ Google Drive
// ให้เป็นลิงก์รูปตรง ๆ ที่ใช้กับ <img> ได้ ส่วนลิงก์รูปจากที่อื่น (เช่น imgur, Supabase storage)
// จะถูกส่งคืนตามเดิมโดยไม่แตะต้อง

const DRIVE_PATTERNS = [
  /drive\.google\.com\/file\/d\/([^/]+)/, // .../file/d/FILE_ID/view
  /drive\.google\.com\/open\?id=([^&]+)/, // .../open?id=FILE_ID
  /drive\.google\.com\/uc\?id=([^&]+)/, // .../uc?id=FILE_ID (already close, but normalize anyway)
];

// ไฟล์ Google Drive บางไฟล์ (โดยเฉพาะที่แชร์หลังปี 2021) ต้องมีพารามิเตอร์
// resourcekey แนบไปด้วย ไม่งั้นรูปจะโหลดไม่ขึ้นแม้ตั้งค่าแชร์ถูกต้องแล้ว
// ดึงค่านี้จาก URL เดิมมาต่อท้ายลิงก์รูปที่แปลงแล้วด้วย
function extractResourceKey(url) {
  const match = url.match(/[?&]resourcekey=([^&]+)/);
  return match?.[1] || null;
}

export function normalizeImageUrl(url) {
  if (!url) return url;

  for (const pattern of DRIVE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const fileId = match[1];
      const resourceKey = extractResourceKey(url);
      const rk = resourceKey ? `&resourcekey=${resourceKey}` : "";
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600${rk}`;
    }
  }

  return url;
}

export function isDisplayableImageUrl(url) {
  return Boolean(url) && /^https?:\/\//.test(url);
}
