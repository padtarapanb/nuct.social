import { useEffect, useState } from "react";
import { Users, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { normalizeImageUrl } from "../../lib/imageUrl";

// ถ้าเป็นรูปจาก Cloudinary ให้แทรก transformation "g_auto" (auto-focus/สมาร์ทครอป) เข้าไป
// เพื่อให้ตอนแสดงในกรอบสัดส่วนคงที่ (เช่น 4:5) แล้วไม่ตัดโดนหัวคนหรือจุดสำคัญของภาพ
// ถ้าไม่ใช่ลิงก์ Cloudinary (เช่น Google Drive) จะคืนค่าเดิมไว้เหมือนก่อน
function toSmartCropUrl(url) {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  if (/\/upload\/[^/]*g_/.test(url)) return url; // มี gravity ของตัวเองอยู่แล้ว ไม่ต้องแตะ
  return url.replace("/upload/", "/upload/c_fill,g_auto,f_auto,q_auto/");
}

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  const img = images[index];
  return (
    <div
      className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
        onClick={onClose}
        aria-label="ปิด"
      >
        <X size={26} />
      </button>
      {images.length > 1 && (
        <button
          className="absolute left-3 sm:left-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="ก่อนหน้า"
        >
          <ChevronLeft size={28} />
        </button>
      )}
      <img
        src={normalizeImageUrl(img.image_url ?? img.url)}
        alt=""
        className="max-w-full max-h-[85vh] rounded-2xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <button
          className="absolute right-3 sm:right-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="ถัดไป"
        >
          <ChevronRight size={28} />
        </button>
      )}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs">
          {index + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// สไลด์รูปอัตโนมัติทุก 5 วินาที ใช้ร่วมกันได้ทั้ง About และ History
// (ดึงรูปจากรายการที่แอดมินเปิดใช้งานไว้ใน tableKey ที่ส่งมา)
// จิ้ม/แตะที่รูปได้เพื่อเปิดดูรูปเต็ม ๆ (ไม่ถูกครอปโดยกรอบ 4:5)
export default function ImageSlider({ images, transitionMs = 700 }) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (images.length < 2) return;
    if (zoomOpen) return; // หยุดเลื่อนอัตโนมัติระหว่างเปิดดูรูปเต็มอยู่
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length, zoomOpen]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Users size={72} className="text-pine-800/25" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="absolute inset-0 w-full h-full cursor-zoom-in group"
        aria-label="ดูภาพขนาดเต็ม"
      >
        {images.map((img, i) => (
          <img
            key={img.id ?? img.image_url ?? img.url}
            src={toSmartCropUrl(normalizeImageUrl(img.image_url ?? img.url))}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity"
            style={{ opacity: i === index ? 1 : 0, transitionDuration: `${transitionMs}ms` }}
          />
        ))}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          <Maximize2 size={15} />
        </div>
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.image_url ?? img.url}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`รูปที่ ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white w-5" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {zoomOpen && (
        <Lightbox
          images={images}
          index={index}
          onClose={() => setZoomOpen(false)}
          onPrev={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          onNext={() => setIndex((i) => (i + 1) % images.length)}
        />
      )}
    </>
  );
}
