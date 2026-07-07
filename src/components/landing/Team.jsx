import { Camera, Users } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";

function TeamCard({ person, index }) {
  const ref = useReveal();
  const initials = person.role.slice(0, 2).toUpperCase();
  const hasRealPhoto = isDisplayableImageUrl(person.photo);

  return (
    <div ref={ref} className={`reveal reveal-delay-${(index % 4) + 1} text-center group`}>
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto mb-4">
        {hasRealPhoto ? (
          <img src={normalizeImageUrl(person.photo)} alt={person.name} className="w-full h-full rounded-full object-cover shadow-lg" />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-display font-bold text-2xl shadow-lg transition-transform duration-500 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
          >
            {initials}
          </div>
        )}
        <div className="absolute inset-0 rounded-full flex items-center justify-center gap-3 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a href={person.ig} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
            <Camera size={15} />
          </a>
          <a href={person.fb} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
            <Users size={15} />
          </a>
        </div>
      </div>
      <p className="font-semibold text-gray-900 text-[15px]">{person.role}</p>
      <p className="text-[13px] text-gray-500">{person.name}</p>
    </div>
  );
}

export default function Team() {
  const { content } = useContent();
  const team = content.team;
  const headRef = useReveal();
  return (
    <section id="team" className="section" style={{ background: "linear-gradient(180deg,#FFFDFB,#FAF7FF)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-14">
          <div className="badge mb-5">Team</div>
          <h2 className="section-title">คณะกรรมการชมรม</h2>
          <p className="section-subtitle">ทีมงานที่ตั้งใจดูแลทุกกิจกรรมและทุกคนในชมรม</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
          {team.map((person, i) => (
            <TeamCard key={person.id ?? person.role} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
