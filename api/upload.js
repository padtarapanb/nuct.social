// api/upload.js
//
// Vercel Serverless Function: อัปโหลดรูปจากหลังบ้านแอดมิน "โดยตรง" ขึ้น Cloudinary
// แก้ปัญหาที่ต้องเปิด Cloudinary console ไปคัดลอกลิงก์รูปทีละรูปมาวาง —
// ตอนนี้แอดมินกดเลือกไฟล์ในหน้าเว็บได้เลย ระบบอัปโหลดแล้วเติมลิงก์ให้อัตโนมัติ
//
// เรียกใช้ผ่าน POST /api/upload  body: { image: "data:image/...;base64,....", folder?: "team" }
//
// ใช้ signed upload (เซ็นชื่อคำขอด้วย CLOUDINARY_API_SECRET ฝั่งเซิร์ฟเวอร์เท่านั้น)
// ปลอดภัยกว่า unsigned upload preset เพราะไม่เปิดให้ใครก็อัปโหลดเข้าบัญชีได้แบบไม่จำกัดสิทธิ์
//
// ต้องตั้งค่า Environment Variables เดียวกับ api/gallery.js:
//   CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET

import crypto from "crypto";

export const config = {
  api: {
    bodyParser: { sizeLimit: "12mb" }, // เผื่อรูปต้นฉบับจากมือถือที่ไฟล์ใหญ่
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "ใช้ได้เฉพาะ POST" });
  }

  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      error: "ยังไม่ได้ตั้งค่า Cloudinary environment variables (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)",
    });
  }

  const { image, folder } = req.body || {};
  if (!image || typeof image !== "string") {
    return res.status(400).json({ error: "ไม่พบข้อมูลรูปภาพที่จะอัปโหลด" });
  }

  const uploadFolder = String(folder || "nuct-uploads")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  const timestamp = Math.floor(Date.now() / 1000);

  // ต้องเรียงพารามิเตอร์ตามตัวอักษร (a-z) ก่อนเซ็นชื่อ ตามสเปคของ Cloudinary
  const paramsToSign = { folder: uploadFolder, timestamp };
  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  const signature = crypto
    .createHash("sha1")
    .update(stringToSign + CLOUDINARY_API_SECRET)
    .digest("hex");

  const form = new URLSearchParams();
  form.append("file", image); // Cloudinary รับ data URI (data:image/png;base64,...) ตรง ๆ ได้เลย
  form.append("api_key", CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", uploadFolder);

  try {
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = await uploadRes.json();

    if (!uploadRes.ok) {
      return res.status(uploadRes.status).json({ error: data?.error?.message || "อัปโหลดรูปไม่สำเร็จ" });
    }

    return res.status(200).json({ url: data.secure_url });
  } catch (err) {
    return res.status(500).json({ error: err.message || "อัปโหลดรูปไม่สำเร็จ" });
  }
}
