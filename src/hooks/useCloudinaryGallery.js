import { useEffect, useState } from "react";

// ดึงรายชื่อรูปทั้งหมดจากโฟลเดอร์ Cloudinary ผ่าน /api/gallery
// คืนค่า { images, loading, error }
// - images: [{ id, publicId, url (รูปเต็ม), thumbUrl (รูปย่อสำหรับกริด), title, width, height, createdAt }]
// - ถ้าดึงไม่สำเร็จ (เช่น ยังไม่ตั้งค่า env vars) images จะเป็น [] และ error จะมีข้อความ
export function useCloudinaryGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || "โหลดรูปจาก Cloudinary ไม่สำเร็จ");
          setImages([]);
        } else {
          setImages(data.images || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setImages([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { images, loading, error };
}
