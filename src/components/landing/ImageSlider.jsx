import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { normalizeImageUrl } from "../../lib/imageUrl";

// สไลด์รูปอัตโนมัติทุก 5 วินาที ใช้ร่วมกันได้ทั้ง About และ History
// (ดึงรูปจากรายการที่แอดมินเปิดใช้งานไว้ใน tableKey ที่ส่งมา)
export default function ImageSlider({ images, transitionMs = 700 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Users size={72} className="text-pine-800/25" strokeWidth={1.2} />
      </div>
    );
  }

  return (
    <>
      {images.map((img, i) => (
        <img
          key={img.id ?? img.image_url ?? img.url}
          src={normalizeImageUrl(img.image_url ?? img.url)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity"
          style={{ opacity: i === index ? 1 : 0, transitionDuration: `${transitionMs}ms` }}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.image_url ?? img.url}
              onClick={() => setIndex(i)}
              aria-label={`รูปที่ ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all ${
                i === index ? "bg-white w-5" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}
