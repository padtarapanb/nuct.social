import { useState } from "react";
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";

const TILE_GRADIENTS = [
  "linear-gradient(135deg,#7C3AED,#A855F7)",
  "linear-gradient(135deg,#EC4899,#F472B6)",
  "linear-gradient(135deg,#F59E0B,#FBBF24)",
  "linear-gradient(135deg,#8B32EA,#EC4899)",
  "linear-gradient(135deg,#A855F7,#F59E0B)",
  "linear-gradient(135deg,#5B21B6,#A855F7)",
];

function Tile({ item, index, onOpen }) {
  const ref = useReveal();
  const hasRealImage = isDisplayableImageUrl(item.image);
  const imageSrc = normalizeImageUrl(item.image);
  return (
    <button
      ref={ref}
      onClick={() => onOpen(index)}
      className={`reveal reveal-delay-${(index % 3) + 1} relative aspect-square rounded-3xl overflow-hidden group text-left`}
      style={{ background: TILE_GRADIENTS[index % TILE_GRADIENTS.length] }}
    >
      {hasRealImage ? (
        <img src={imageSrc} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover:opacity-35 transition-opacity">
          <Camera size={40} className="text-white" strokeWidth={1.2} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <p className="text-white font-semibold text-sm">{item.title}</p>
      </div>
    </button>
  );
}

// จำนวนรูปสูงสุดที่โชว์เป็นกริดแบบเดิม ถ้าเกินนี้จะเปลี่ยนเป็นแถวเลื่อนแนวนอนแทน
// เพื่อไม่ให้หน้าเว็บยาวเกินไปเมื่อแอดมินเพิ่มรูปเข้ามาเรื่อย ๆ
const GRID_LIMIT = 6;

export default function Gallery() {
  const { content } = useContent();
  const galleryCategories = content.galleryCategories;
  const headRef = useReveal();
  const [openIndex, setOpenIndex] = useState(null);
  const isScrollable = galleryCategories.length > GRID_LIMIT;

  const close = () => setOpenIndex(null);
  const prev = () => setOpenIndex((i) => (i - 1 + galleryCategories.length) % galleryCategories.length);
  const next = () => setOpenIndex((i) => (i + 1) % galleryCategories.length);

  const active = openIndex !== null ? galleryCategories[openIndex] : null;

  return (
    <section id="gallery" className="section">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14 flex items-end justify-between gap-4 w-full">
          <div>
            <div className="badge mb-5">Gallery</div>
            <h2 className="section-title">โมเมนต์ของเรา</h2>
            <p className="section-subtitle">ภาพความทรงจำจากกิจกรรมต่าง ๆ ตลอดปีที่ผ่านมา</p>
          </div>
          {isScrollable && (
            <p className="hidden sm:block text-sm text-gray-400 shrink-0 mb-1">เลื่อนดูรูปเพิ่มเติม →</p>
          )}
        </div>

        {isScrollable ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
            {galleryCategories.map((item, i) => (
              <div key={item.id ?? item.key} className="shrink-0 w-[45vw] sm:w-56 snap-start">
                <Tile item={item} index={i} onOpen={setOpenIndex} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {galleryCategories.map((item, i) => (
              <Tile key={item.id ?? item.key} item={item} index={i} onOpen={setOpenIndex} />
            ))}
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            onClick={close}
            aria-label="ปิด"
          >
            <X size={26} />
          </button>

          <button
            className="absolute left-3 sm:left-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="relative w-full max-w-2xl aspect-square rounded-3xl overflow-hidden"
            style={{ background: TILE_GRADIENTS[openIndex % TILE_GRADIENTS.length] }}
            onClick={(e) => e.stopPropagation()}
          >
            {isDisplayableImageUrl(active.image) ? (
              <img src={normalizeImageUrl(active.image)} alt={active.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Camera size={64} className="text-white" strokeWidth={1.2} />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white font-display text-xl font-bold">{active.title}</p>
            </div>
          </div>

          <button
            className="absolute right-3 sm:right-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="ถัดไป"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </section>
  );
}
