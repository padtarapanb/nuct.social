import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { renderText } from "../../lib/renderText";

function Item({ item, index, openIndex, setOpenIndex }) {
  const ref = useReveal();
  const isOpen = openIndex === index;
  return (
    <div ref={ref} className={`reveal reveal-delay-${(index % 4) + 1} border border-line rounded-2xl bg-white overflow-hidden`}>
      <button
        onClick={() => setOpenIndex(isOpen ? null : index)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-gray-900 text-[15px]">{item.q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-pine-800 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-[14px] text-gray-500 leading-relaxed rich-text" dangerouslySetInnerHTML={renderText(item.a)} />
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { content } = useContent();
  const faqs = content.faqs;
  const [openIndex, setOpenIndex] = useState(0);
  const headRef = useReveal();

  return (
    <section className="section" style={{ background: "linear-gradient(180deg,#FAF7FF,#FFFDFB)" }}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal text-center mb-12">
          <div className="badge mb-5">FAQ</div>
          <h2 className="section-title">คำถามที่พบบ่อย</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <Item key={item.id ?? item.q} item={item} index={i} openIndex={openIndex} setOpenIndex={setOpenIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}
