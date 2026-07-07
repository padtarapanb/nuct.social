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

export function normalizeImageUrl(url) {
  if (!url) return url;

  for (const pattern of DRIVE_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) {
      const fileId = match[1];
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
    }
  }

  return url;
}

export function isDisplayableImageUrl(url) {
  return Boolean(url) && /^https?:\/\//.test(url);
}
