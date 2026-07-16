import { Award } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";
import { renderText } from "../../lib/renderText";

function AchievementCard({ item, index }) {
  const ref = useReveal();
  const hasPhoto = isDisplayableImageUrl(item.image_url);

  return (
    <div
      ref={ref}
      className={`reveal reveal-delay-${(index % 3) + 1} card overflow-hidden group cursor-default`}
    >
      <div
        className="aspect-[4/3] w-full relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#F5F3FF,#FEF3C7)" }}
      >
        {hasPhoto ? (
          <img
            src={normalizeImageUrl(item.image_url)}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-pine-800/40">
            <Award size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1.5">{item.title}</h3>
        {item.description && (
          <p className="text-[14px] text-gray-500 leading-relaxed rich-text" dangerouslySetInnerHTML={renderText(item.description)} />
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const { content } = useContent();
  const achievements = content.achievements || [];
  const headRef = useReveal();

  return (
    <section id="achievements" className="section" style={{ background: "linear-gradient(180deg,#FFFDFB,#FAF7FF)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Achievements</div>
          <h2 className="section-title">ผลงานและรางวัล</h2>
          <p className="section-subtitle">ความภาคภูมิใจที่เกิดจากความตั้งใจของทุกคนในชมรม</p>
        </div>

        {achievements.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีข้อมูลผลงานและรางวัล</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item, i) => (
              <AchievementCard key={item.id ?? item.title} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
