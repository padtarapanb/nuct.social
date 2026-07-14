import { useState } from "react";
import { BookOpen, ChevronDown } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { useCloudinaryImages } from "../../hooks/useCloudinaryImages";
import { renderText } from "../../lib/renderText";
import ImageSlider from "./ImageSlider";

export default function History() {
  const { content } = useContent();
  const { history_title_line1, history_title_line2, history_body, history_full_body, history_images_folder } = content.settings;
  // เหมือนกับ About — ถ้าตั้งโฟลเดอร์ Cloudinary ไว้ จะดึงรูปทั้งโฟลเดอร์มาสไลด์อัตโนมัติ
  const folder = (history_images_folder || "").trim();
  const { images: folderImages, error: folderError } = useCloudinaryImages(
    folder ? `/api/gallery?folder=${encodeURIComponent(folder)}` : null
  );
  const historyImages = folder && !folderError && folderImages.length ? folderImages : content.historyImages;
  const textRef = useReveal();
  const imgRef = useReveal();
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      id="history"
      className="section"
      style={{ background: "linear-gradient(180deg,#FAF7FF,#FFFDFB)" }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div ref={textRef} className="reveal order-2 lg:order-1">
          <div className="badge mb-5">
            <BookOpen size={14} />
            Our Story
          </div>
          <h2 className="section-title">
            {history_title_line1}
            <br />
            {history_title_line2}
          </h2>
          <p className="section-subtitle rich-text" dangerouslySetInnerHTML={renderText(history_body)} />

          {history_full_body && (
            <>
              {expanded && (
                <p
                  className="section-subtitle rich-text mt-4"
                  dangerouslySetInnerHTML={renderText(history_full_body)}
                />
              )}
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-pine-800 hover:text-pine-900"
              >
                {expanded ? "ย่อประวัติ" : "อ่านประวัติเต็ม"}
                <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            </>
          )}
        </div>

        <div ref={imgRef} className="reveal order-1 lg:order-2 relative">
          <div
            className="aspect-[4/5] w-full rounded-[2rem] relative overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(140deg,#FCE7F3,#EDE4FE 55%,#FEF3C7)" }}
          >
            <ImageSlider images={historyImages} transitionMs={500} />
            <div className="absolute inset-0 border border-white/60 rounded-[2rem] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
