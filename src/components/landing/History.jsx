import { BookOpen } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { renderText } from "../../lib/renderText";
import ImageSlider from "./ImageSlider";

export default function History() {
  const { content } = useContent();
  const { history_title_line1, history_title_line2, history_body } = content.settings;
  const historyImages = content.historyImages;
  const textRef = useReveal();
  const imgRef = useReveal();

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
        </div>

        <div ref={imgRef} className="reveal order-1 lg:order-2 relative">
          <div
            className="aspect-[4/5] w-full rounded-[2rem] relative overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(140deg,#FCE7F3,#EDE4FE 55%,#FEF3C7)" }}
          >
            <ImageSlider images={historyImages} />
            <div className="absolute inset-0 border border-white/60 rounded-[2rem] pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
