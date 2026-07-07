import { Quote } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { renderText } from "../../lib/renderText";

function Card({ t, index }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal reveal-delay-${index + 1} card p-7`}>
      <Quote size={26} className="text-pine-400 mb-4" strokeWidth={1.5} />
      <p className="text-[15px] text-gray-700 leading-relaxed mb-6">
        "<span className="rich-text" dangerouslySetInnerHTML={renderText(t.quote)} />"
      </p>
      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
      <p className="text-[12.5px] text-gray-500">{t.faculty}</p>
    </div>
  );
}

export default function Testimonials() {
  const { content } = useContent();
  const testimonials = content.testimonials;
  const headRef = useReveal();
  return (
    <section className="section">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Testimonials</div>
          <h2 className="section-title">เสียงจากสมาชิก</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <Card key={t.id ?? t.name} t={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
