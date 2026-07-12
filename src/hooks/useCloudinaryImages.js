import { useEffect, useState } from "react";

// ดึงรายชื่อรูปจาก endpoint ที่ระบุ (เช่น /api/gallery, /api/about-images)
// ใช้โครงเดียวกันได้กับทุกจุดที่ต้องการดึงรูปทั้งโฟลเดอร์จาก Cloudinary
// คืนค่า { images, loading, error }
// - images: [{ id, publicId, url (รูปเต็ม), thumbUrl (รูปย่อ), title, width, height, createdAt }]
export function useCloudinaryImages(endpoint) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
