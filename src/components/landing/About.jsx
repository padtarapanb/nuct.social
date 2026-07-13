import { useState } from "react";
import { Heart, Users, Sparkles } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { useCloudinaryImages } from "../../hooks/useCloudinaryImages";
import { renderText } from "../../lib/renderText";
import LeadershipModal from "./LeadershipModal";
import ImageSlider from "./ImageSlider";

const points = [
  { icon: Sparkles, text: "เติบโตในความเชื่อ" },
  { icon: Users, text: "สร้างมิตรภาพ" },
  { icon: Heart, text: "ค้นพบพระเจ้า" },
];

export default function About() {
  const { content } = useContent();
  const { about_title_line1, about_title_line2, about_body, stats_number, stats_label, about_images_folder } = content.settings;
  // ถ้าตั้งค่าโฟลเดอร์ Cloudinary ไว้ (ช่อง "โฟลเดอร์รูป About" ในหน้าตั้งค่า) จะดึงรูปทั้งหมด
  // ในโฟลเดอร์นั้นมาสไลด์อัตโนมัติ เหมือนแกลลอรี — อัปรูปใหม่ปุ๊บ โชว์ปั๊บ ไม่ต้องเข้า /admin
  // ถ้ายังไม่ได้ตั้งค่า จะใช้รูปที่แอดมินวางลิงก์ไว้ทีละรูปในเมนู "รูปภาพ About (Slider)" แทนตามเดิม
  const folder = (about_images_folder || "").trim();
  const { images: folderImages, error: folderError } = useCloudinaryImages(
    folder ? `/api/gallery?folder=${encodeURIComponent(folder)}` : null
  );
  const aboutImages = folder && !folderError && folderImages.length ? folderImages : content.aboutImages;
  const imgRef = useReveal();
  const textRef = useReveal();
  const [leadershipOpen, setLeadershipOpen] = useState(false);

  return (
    <section id="about" className="section">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div ref={imgRef} className="reveal relative">
          <div
            className="aspect-[4/5] w-full rounded-[2rem] relative overflow-hidden shadow-xl"
            style={{ background: "linear-gradient(140deg,#EDE4FE,#FCE7F3 55%,#FEF3C7)" }}
          >
            <ImageSlider images={aboutImages} />
            <div className="absolute inset-0 border border-white/60 rounded-[2rem] pointer-events-none" />
          </div>
          <button
            onClick={() => setLeadershipOpen(true)}
            className="absolute -bottom-6 -right-6 glass rounded-2xl px-5 py-4 shadow-lg hidden sm:block text-left hover:shadow-xl transition-shadow"
          >
            <p className="font-display text-2xl font-extrabold text-pine-800">{stats_number}</p>
            <p className="text-xs text-gray-500">{stats_label}</p>
            <p className="text-[11px] text-pine-700 font-semibold mt-1">คลิกเพื่อดูทีมผู้นำ →</p>
          </button>
        </div>

        <LeadershipModal
          open={leadershipOpen}
          onClose={() => setLeadershipOpen(false)}
          team={content.team}
          shepherding={content.shepherdingGroups}
        />

        <div ref={textRef} className="reveal">
          <div className="badge mb-5">About Us</div>
          <h2 className="section-title">
            {about_title_line1}
            <br />
            {about_title_line2}
          </h2>
          <p className="section-subtitle mb-8" dangerouslySetInnerHTML={renderText(about_body)} />
          <div className="flex flex-wrap gap-3">
            {points.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-pine-50 text-pine-800 text-sm font-medium">
                <Icon size={15} />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
