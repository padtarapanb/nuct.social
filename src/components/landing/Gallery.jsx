import { useState } from "react";
import { X, Camera, ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { useCloudinaryImages } from "../../hooks/useCloudinaryImages";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";
import { renderText } from "../../lib/renderText";

const TILE_GRADIENTS = [
  "linear-gradient(135deg,#7C3AED,#A855F7)",
  "linear-gradient(135deg,#EC4899,#F472B6)",
  "linear-gradient(135deg,#F59E0B,#FBBF24)",
  "linear-gradient(135deg,#8B32EA,#EC4899)",
  "linear-gradient(135deg,#A855F7,#F59E0B)",
  "linear-gradient(135deg,#5B21B6,#A855F7)",
];

function AlbumTile({ album, index, onOpen }) {
  const ref = useReveal();
  const coverImage = album.cover_image || album.images?.[0] || "";
  const hasRealImage = isDisplayableImageUrl(coverImage);
  const photoCount = album.images?.length || 0;
  return (
    <button
      ref={ref}
      onClick={() => onOpen(album)}
      className={`reveal reveal-delay-${(index % 3) + 1} relative aspect-square rounded-3xl overflow-hidden group text-left`}
      style={{ background: TILE_GRADIENTS[index % TILE_GRADIENTS.length] }}
    >
      {hasRealImage ? (
        <img src={normalizeImageUrl(coverImage)} alt={album.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center opacity-25 group-hover:opacity-35 transition-opacity">
          <Camera size={40} className="text-white" strokeWidth={1.2} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      {album.title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white font-semibold text-sm">{album.title}</p>
          {photoCount > 0 && (
            <p className="text-white/70 text-[11px] mt-0.5">{photoCount} รูป</p>
          )}
        </div>
      )}
    </button>
  );
}

// เปิดอัลบั้มแล้วเลื่อนดูรูปทั้งหมด "ในอัลบั้มนั้น" ได้
// ถ้าอัลบั้มตั้งค่า folder ของ Cloudinary ไว้ จะดึงรูปทั้งหมดในโฟลเดอร์นั้นมาโชว์อัตโนมัติ
// (อัปรูปใหม่เข้าโฟลเดอร์ปุ๊บ เห็นปั๊บ ไม่ต้องเข้า /admin) ถ้ายังไม่ได้ตั้งค่า Cloudinary หรือดึงไม่สำเร็จ
// จะใช้รูปที่แอดมินวางลิงก์ไว้ในอัลบั้มนั้นแทน (ช่อง "รูปภาพในอัลบั้ม" ในหลังบ้าน)
function AlbumModal({ album, onClose }) {
  const folder = (album.folder || "").trim();
  const endpoint = folder ? `/api/gallery?folder=${encodeURIComponent(folder)}` : null;
  const { images: cloudinaryImages, loading, error } = useCloudinaryImages(endpoint);
  const manualImages = (album.images || []).map((url, i) => ({ id: `manual-${i}`, url, thumbUrl: url }));
  const photos = folder && !error && cloudinaryImages.length ? cloudinaryImages : manualImages;

  const [zoomIndex, setZoomIndex] = useState(null);

  const openZoom = (i) => setZoomIndex(i);
  const closeZoom = () => setZoomIndex(null);
  const prevZoom = (e) => {
    e.stopPropagation();
    setZoomIndex((i) => (i - 1 + photos.length) % photos.length);
  };
  const nextZoom = (e) => {
    e.stopPropagation();
    setZoomIndex((i) => (i + 1) % photos.length);
  };

  const zoomed = zoomIndex !== null ? photos[zoomIndex] : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onClose}>
      <div
        className="relative w-full max-w-4xl bg-paper rounded-3xl overflow-hidden my-6 sm:my-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-line shrink-0">
          <div>
            <p className="font-display text-lg font-bold text-gray-900">{album.title}</p>
            {album.description && (
              <p className="text-xs text-gray-500 mt-0.5 rich-text" dangerouslySetInnerHTML={renderText(album.description)} />
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 shrink-0"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto">
          {folder && loading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-12 justify-center">
              <Loader2 size={16} className="animate-spin" /> กำลังโหลดรูปจากอัลบั้ม...
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center gap-2 text-gray-400 text-sm py-12">
              <ImageOff size={28} />
              ยังไม่มีรูปในอัลบั้มนี้
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <button
                  key={p.id ?? i}
                  onClick={() => openZoom(i)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group"
                >
                  <img
                    src={normalizeImageUrl(p.thumbUrl || p.url)}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {zoomed && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4" onClick={closeZoom}>
          <button
            className="absolute top-5 right-5 text-white/80 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10"
            onClick={closeZoom}
            aria-label="ปิด"
          >
            <X size={26} />
          </button>
          {photos.length > 1 && (
            <button
              className="absolute left-3 sm:left-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
              onClick={prevZoom}
              aria-label="ก่อนหน้า"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          <img
            src={normalizeImageUrl(zoomed.url)}
            alt=""
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              className="absolute right-3 sm:right-8 text-white/70 hover:text-white w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10"
              onClick={nextZoom}
              aria-label="ถัดไป"
            >
              <ChevronRight size={28} />
            </button>
          )}
          {photos.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/70 text-xs">
              {zoomIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// จำนวนอัลบั้มสูงสุดที่โชว์เป็นกริดแบบเดิม ถ้าเกินนี้จะเปลี่ยนเป็นแถวเลื่อนแนวนอนแทน
// เพื่อไม่ให้หน้าเว็บยาวเกินไปเมื่อแอดมินเพิ่มอัลบั้มเข้ามาเรื่อย ๆ
const GRID_LIMIT = 6;

export default function Gallery() {
  const { content } = useContent();

  const albums = (content.galleryAlbums || []).filter((album) => album.is_active !== false);
  const headRef = useReveal();
  const [openAlbum, setOpenAlbum] = useState(null);
  const isScrollable = albums.length > GRID_LIMIT;

  return (
    <section id="gallery" className="section">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14 flex items-end justify-between gap-4 w-full">
          <div>
            <div className="badge mb-5">Gallery</div>
            <h2 className="section-title">โมเมนต์ของเรา</h2>
            <p className="section-subtitle">ภาพความทรงจำจากกิจกรรมต่าง ๆ ตลอดปีที่ผ่านมา · คลิกอัลบั้มเพื่อเลื่อนดูรูปทั้งหมด</p>
          </div>
          {isScrollable && (
            <p className="hidden sm:block text-sm text-gray-400 shrink-0 mb-1">เลื่อนดูอัลบั้มเพิ่มเติม →</p>
          )}
        </div>

        {albums.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีอัลบั้มรูปภาพ</p>
        ) : isScrollable ? (
          <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
            {albums.map((album, i) => (
              <div key={album.id} className="shrink-0 w-[45vw] sm:w-56 snap-start">
                <AlbumTile album={album} index={i} onOpen={setOpenAlbum} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {albums.map((album, i) => (
              <AlbumTile key={album.id} album={album} index={i} onOpen={setOpenAlbum} />
            ))}
          </div>
        )}
      </div>

      {openAlbum && <AlbumModal album={openAlbum} onClose={() => setOpenAlbum(null)} />}
    </section>
  );
}
