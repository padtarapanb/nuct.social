// api/about-images.js
//
// Vercel Serverless Function: ดึงรายชื่อรูปทั้งหมดจากโฟลเดอร์ About ใน Cloudinary
// (คนละโฟลเดอร์กับ Gallery — ใช้กับสไลด์รูปฝั่งซ้ายของ About เท่านั้น)
// เรียกใช้ผ่าน GET /api/about-images
//
// Environment Variables ที่ต้องตั้งเพิ่ม (Vercel > Project Settings > Environment Variables):
//   CLOUDINARY_FOLDER_ABOUT  - ชื่อโฟลเดอร์รูป About เช่น "nuct-about" (ค่าเริ่มต้น "about")
//
// ใช้ CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET ชุดเดียวกับที่ตั้งไว้แล้ว
// สำหรับ /api/gallery ไม่ต้องตั้งใหม่

import { fetchCloudinaryFolder } from "./_cloudinary.js";

export default async function handler(req, res) {
  const folder = (process.env.CLOUDINARY_FOLDER_ABOUT || "about").trim();

  try {
    // รูปย่อขนาด 900x1125 (สัดส่วน 4/5 เท่ากับกรอบสไลด์ About จริง) จะได้ไม่เบลอ/ไม่โดนตัดแปลก ๆ
    const images = await fetchCloudinaryFolder({ folder, thumbTransform: "w_900,h_1125,c_fill,f_auto,q_auto" });

    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json({ images, total: images.length });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ" });
  }
}
