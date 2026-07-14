import { useState } from "react";
import { X, Clock, MapPin } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { renderText } from "../../lib/renderText";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";

function ActivityDetailPopup({ item, onClose }) {
  const hasPhoto = isDisplayableImageUrl(item.photo_url);
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-gray-500 shadow-sm"
          aria-label="ปิด"
        >
          <X size={16} />
        </button>

        {hasPhoto && (
          <img src={normalizeImageUrl(item.photo_url)} alt={item.title} className="w-full aspect-[4/3] object-cover rounded-t-3xl" />
        )}

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg,#F5F3FF,#FEF3C7)" }}
            >
              {item.emoji}
            </div>
            <p className="font-display text-lg font-bold text-gray-900">{item.title}</p>
          </div>

          {item.desc && (
            <p className="text-[14.5px] text-gray-500 leading-relaxed rich-text mb-4" dangerouslySetInnerHTML={renderText(item.desc)} />
          )}

          <div className="space-y-2.5">
            {item.schedule_text && (
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <Clock size={15} className="shrink-0 text-pine-700" /> {item.schedule_text}
              </p>
            )}
            {item.location && (
              <p className="flex items-center gap-2 text-sm text-gray-700">
                <MapPin size={15} className="shrink-0 text-pine-700" /> {item.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ item, index, onOpen }) {
  const ref = useReveal();
  const hasDetail = item.schedule_text || item.location || item.photo_url;
  return (
    <div
      ref={ref}
      onClick={() => hasDetail && onOpen(item)}
      className={`reveal reveal-delay-${(index % 3) + 1} card p-8 group ${hasDetail ? "cursor-pointer" : "cursor-default"}`}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
        style={{ background: "linear-gradient(135deg,#F5F3FF,#FEF3C7)" }}
      >
        {item.emoji}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
      <p className="text-[14.5px] text-gray-500 leading-relaxed rich-text" dangerouslySetInnerHTML={renderText(item.desc)} />
    </div>
  );
}

export default function Activities() {
  const { content } = useContent();
  const activities = content.activities;
  const headRef = useReveal();
  const [openActivity, setOpenActivity] = useState(null);
  return (
    <section id="activities" className="section" style={{ background: "linear-gradient(180deg,#FFFDFB,#FAF7FF)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Activities</div>
          <h2 className="section-title">โครงการและกิจกรรมสำคัญ</h2>
          <p className="section-subtitle">
            ขับเคลื่อนชีวิตและพันธกิจไปด้วยกัน ผ่านกิจกรรมหลากหลายที่ลงตัวกับทุกจังหวะชีวิต
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item, i) => (
            <ActivityCard key={item.id ?? item.title} item={item} index={i} onOpen={setOpenActivity} />
          ))}
        </div>
      </div>

      {openActivity && <ActivityDetailPopup item={openActivity} onClose={() => setOpenActivity(null)} />}
    </section>
  );
}
