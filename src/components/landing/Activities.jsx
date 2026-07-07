import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { renderText } from "../../lib/renderText";

function ActivityCard({ item, index }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal reveal-delay-${(index % 3) + 1} card p-8 group cursor-default`}
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
  return (
    <section id="activities" className="section" style={{ background: "linear-gradient(180deg,#FFFDFB,#FAF7FF)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Activities</div>
          <h2 className="section-title">สิ่งที่เราทำร่วมกัน</h2>
          <p className="section-subtitle">
            ขับเคลื่อนชีวิตและพันธกิจไปด้วยกัน ผ่านกิจกรรมหลากหลายที่ลงตัวกับทุกจังหวะชีวิต
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((item, i) => (
            <ActivityCard key={item.id ?? item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
