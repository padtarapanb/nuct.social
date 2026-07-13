import { useEffect, useState } from "react";

// ดึงรายชื่อรูปจาก endpoint ที่ระบุ (เช่น /api/gallery, /api/gallery?folder=...)
// ใช้โครงเดียวกันได้กับทุกจุดที่ต้องการดึงรูปทั้งโฟลเดอร์จาก Cloudinary
// ถ้า endpoint เป็นค่าว่าง/false จะไม่ยิง request เลย (เผื่อกรณียังไม่ได้ตั้งค่าโฟลเดอร์ Cloudinary)
// คืนค่า { images, loading, error }
// - images: [{ id, publicId, url (รูปเต็ม), thumbUrl (รูปย่อ), title, width, height, createdAt }]
export function useCloudinaryImages(endpoint) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(Boolean(endpoint));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpoint) {
      setImages([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || `โหลดรูปจาก ${endpoint} ไม่สำเร็จ`);
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
  }, [endpoint]);

  return { images, loading, error };
}
