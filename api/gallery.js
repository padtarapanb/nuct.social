// api/gallery.js
//
// Vercel Serverless Function: ดึงรายชื่อรูปทั้งหมดจากโฟลเดอร์ที่กำหนดใน Cloudinary
// เรียกใช้ผ่าน GET /api/gallery
//
// ต้องตั้งค่า Environment Variables ใน Vercel (Project Settings > Environment Variables):
//   CLOUDINARY_CLOUD_NAME  - ชื่อ cloud (ดูได้จาก Cloudinary Dashboard)
//   CLOUDINARY_API_KEY     - API Key (Cloudinary Dashboard > Settings > Access Keys)
//   CLOUDINARY_API_SECRET  - API Secret (อันเดียวกัน อย่าเผยแพร่ค่านี้)
//   CLOUDINARY_FOLDER      - ชื่อโฟลเดอร์ที่จะดึงรูป เช่น "nuct-gallery" (ถ้าไม่ตั้งจะใช้ "gallery")
//
// เมื่ออัปโหลดรูปใหม่เข้าโฟลเดอร์นี้ใน Cloudinary endpoint นี้จะเห็นรูปใหม่ (หลังแคชหมดอายุ)
//
// จุดที่ป้องกันไว้เผื่อกรณีแอดมินอัปโหลดรูปเพิ่ม:
//   - กรองเอาเฉพาะไฟล์รูปภาพจริง ๆ (เผื่อมีคนอัปโหลดไฟล์อื่นปนเข้าโฟลเดอร์เดียวกัน)
//   - ดึงครบทุกรูปแม้มีเกิน 500 รูป (วน pagination ด้วย next_cursor)
//   - คืน URL แบบรูปย่อ (thumbnail) แยกจาก URL เต็ม เพื่อไม่ให้หน้าเว็บช้าเมื่อรูปมีขนาดไฟล์ใหญ่
//   - จำกัดจำนวนรอบดึงข้อมูลสูงสุด กันกรณีโฟลเดอร์มีรูปเยอะผิดปกติจนกระทบเวลาโหลด

const MAX_TOTAL_IMAGES = 1000; // เพดานสูงสุดที่จะดึง กันโฟลเดอร์ใหญ่ผิดปกติทำให้หน้าเว็บช้า
const PAGE_SIZE = 200; // Cloudinary Search API อนุญาตสูงสุด 500 ต่อ 1 คำขอ ใช้ 200 เพื่อความเสถียร
const MAX_PAGES = Math.ceil(MAX_TOTAL_IMAGES / PAGE_SIZE);

// แทรก transformation string เข้าไปใน secure_url เพื่อขอรูปย่อจาก Cloudinary
// เช่น .../upload/v123/folder/img.jpg -> .../upload/w_500,h_500,c_fill,f_auto,q_auto/v123/folder/img.jpg
function buildThumbUrl(secureUrl) {
  if (!secureUrl) return secureUrl;
  return secureUrl.replace("/upload/", "/upload/w_500,h_500,c_fill,f_auto,q_auto/");
}

async function fetchPage({ cloudName, auth, expression, cursor }) {
  const body = {
    expression,
    sort_by: [{ created_at: "desc" }],
    max_results: PAGE_SIZE,
    resource_type: "image", // กันไฟล์ที่ไม่ใช่รูป (วิดีโอ/pdf/raw) ไม่ให้หลุดเข้ามา
  };
  if (cursor) body.next_cursor = cursor;

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Cloudinary error (${res.status}): ${errText}`);
  }
  return res.json();
}

// รูปแบบไฟล์ที่โชว์เป็น <img> ได้จริงบนเว็บทั่วไป (กันไฟล์แปลก ๆ เช่น .psd, .ai ที่ Cloudinary
// จัดเป็น resource_type: image เหมือนกันแต่เบราว์เซอร์เปิดไม่ได้)
const DISPLAYABLE_FORMATS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "svg", "heic"]);

export default async function handler(req, res) {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  // รองรับ ?folder=... เพื่อดึงรูปจากโฟลเดอร์ใดก็ได้ (เช่น โฟลเดอร์เฉพาะของแต่ละอัลบั้ม
  // หรือโฟลเดอร์ของสไลด์ About/History) ถ้าไม่ส่งมาจะใช้โฟลเดอร์เริ่มต้นจาก env ตามเดิม
  const requestedFolder = Array.isArray(req.query.folder) ? req.query.folder[0] : req.query.folder;
  const folder = (requestedFolder || process.env.CLOUDINARY_FOLDER || "gallery").trim();

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return res.status(500).json({
      error:
        "ยังไม่ได้ตั้งค่า Cloudinary environment variables (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)",
    });
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");
  // ครอบคลุมทั้งรูปที่อยู่ตรงในโฟลเดอร์ และรูปในโฟลเดอร์ย่อย (เผื่อแอดมินสร้างโฟลเดอร์ย่อยแยกงาน/ปี)
  const expression = `folder:${folder}/* OR folder:${folder}`;

  try {
    let resources = [];
    let cursor = undefined;
    let page = 0;

    do {
      const data = await fetchPage({ cloudName: CLOUDINARY_CLOUD_NAME, auth, expression, cursor });
      resources = resources.concat(data.resources || []);
      cursor = data.next_cursor;
      page += 1;
    } while (cursor && page < MAX_PAGES && resources.length < MAX_TOTAL_IMAGES);

    const images = resources
      // กันไฟล์ที่ไม่ใช่รูปภาพที่เปิดดูได้จริง หลุดเข้ามาปนในโฟลเดอร์เดียวกัน
      .filter((r) => DISPLAYABLE_FORMATS.has((r.format || "").toLowerCase()))
      .slice(0, MAX_TOTAL_IMAGES)
      .map((r) => ({
        id: r.asset_id || r.public_id,
        publicId: r.public_id,
        url: r.secure_url,
        thumbUrl: buildThumbUrl(r.secure_url),
        width: r.width,
        height: r.height,
        createdAt: r.created_at,
        // ตั้งชื่อรูปจากชื่อไฟล์ (ตัด path โฟลเดอร์ออก, เปลี่ยน - / _ เป็นช่องว่าง)
        // ถ้าตั้งชื่อไฟล์เป็นตัวเลขล้วน (เช่นชื่อที่กล้อง/มือถือตั้งให้อัตโนมัติ) ให้ปล่อยว่างไว้แทน
        // เพื่อไม่ให้ขึ้นข้อความที่ไม่มีความหมาย เช่น "img 20250612 143210"
        title: deriveTitle(r.public_id),
      }));

    // แคชผลลัพธ์ไว้ที่ CDN ของ Vercel 30 วินาที (สั้นพอให้เห็นรูปใหม่เร็ว แต่ยังลดโหลด Cloudinary ได้)
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    return res.status(200).json({ images, total: images.length });
  } catch (err) {
    return res.status(500).json({ error: err.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ" });
  }
}

function deriveTitle(publicId) {
  const raw = (publicId.split("/").pop() || "").replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  // ชื่อไฟล์อัตโนมัติจากกล้อง/มือถือ เช่น "IMG 20250612 143210" หรือตัวเลขล้วน ๆ -> ไม่มีความหมาย ปล่อยว่าง
  const looksAutoGenerated = /^(img|dsc|photo)?\s*\d{6,}\s*\d*$/i.test(raw) || /^\d+$/.test(raw);
  return looksAutoGenerated ? "" : raw;
}
