import { Camera, Users, Music2, X as XIcon, Link2, ArrowUpRight } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";

const ICONS = { instagram: Camera, facebook: Users, music2: Music2, x: XIcon };

function SocialCard({ item, index }) {
  const ref = useReveal();
  // ถ้าค่า icon ที่บันทึกไว้ไม่ตรงกับรายการที่รองรับ ใช้ไอคอนสำรองแทน
  // เพื่อไม่ให้ทั้งหน้าเว็บพัง (React error #130) จากค่า icon ที่พิมพ์ผิดหรือว่างเปล่า
  const Icon = ICONS[item.icon] || Link2;
  const hasPreview = isDisplayableImageUrl(item.preview_image);
  return (
    <a
      ref={ref}
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className={`reveal reveal-delay-${index + 1} card overflow-hidden flex flex-col justify-between group ${hasPreview ? "p-0" : "p-7"}`}
    >
      {hasPreview ? (
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={normalizeImageUrl(item.preview_image)}
            alt={`พรีวิวหน้า ${item.name}`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute top-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md"
            style={{ background: item.gradient }}
          >
            <Icon size={17} />
          </div>
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 mt-7 mx-7 transition-transform duration-500 group-hover:scale-110"
          style={{ background: item.gradient }}
        >
          <Icon size={24} />
        </div>
      )}

      <div className={hasPreview ? "p-5" : ""}>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
        <p className="text-[13.5px] text-gray-500">{item.tagline}</p>
        <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-pine-800">
          {item.cta} <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
}

export default function Connect() {
  const { content } = useContent();
  const socials = content.socials;
  const headRef = useReveal();
  return (
    <section id="connect" className="section" style={{ background: "linear-gradient(180deg,#FAF7FF,#FFFDFB)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Media</div>
          <h2 className="section-title">Connect With Us</h2>
          <p className="section-subtitle">
            ตามติดทุกความเคลื่อนไหวของชมรมได้ในช่องทางเดียวที่คุณใช้อยู่แล้ว
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {socials.map((item, i) => (
            <SocialCard key={item.id ?? item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
