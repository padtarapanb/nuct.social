import { useMemo, useState } from "react";
import { Camera, Users } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { normalizeImageUrl, isDisplayableImageUrl } from "../../lib/imageUrl";
import { buildTree } from "../../lib/tree";
import ShepherdingTree from "./ShepherdingTree";
import PRBoard from "./PRBoard";

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

const TABS = [
  { key: "committee", label: "Committee" },
  { key: "pr", label: "The PR Team" },
  { key: "shepherding", label: "Leadership" },
];

export default function Team() {
  const { content } = useContent();
  const team = content.team || [];
  const headRef = useReveal();
  const [tab, setTab] = useState("committee");

  const committee = useMemo(() => team.filter((p) => (p.group_name || "committee") === "committee"), [team]);
  const prTeam = useMemo(() => team.filter((p) => p.group_name === "pr"), [team]);
  const shepherdingTree = useMemo(() => buildTree(content.shepherdingGroups || []), [content.shepherdingGroups]);

  const activeList = tab === "committee" ? committee : tab === "pr" ? prTeam : null;

  return (
    <section id="team" className="section" style={{ background: "linear-gradient(180deg,#FFFDFB,#FAF7FF)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div ref={headRef} className="reveal max-w-xl mb-8 flex items-end justify-between gap-4 w-full flex-wrap">
          <div>
            <div className="badge mb-5">Team</div>
            <h2 className="section-title">NUCT Team</h2>
            <p className="section-subtitle">ทีมงานที่ตั้งใจดูแลทุกกิจกรรมและทุกคนในชมรม</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                tab === t.key ? "bg-pine-800 text-white" : "bg-white text-gray-600 border border-line hover:bg-pine-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "shepherding" ? (
          <div className="bg-white rounded-3xl border border-line p-5 sm:p-8 max-w-2xl">
            <ShepherdingTree tree={shepherdingTree} />
          </div>
        ) : activeList.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            {tab === "pr" ? "ยังไม่มีข้อมูลทีมประชาสัมพันธ์" : "ยังไม่มีข้อมูลกรรมการชมรม"}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-4">
              {activeList.map((person, i) => (
                <TeamCard key={person.id ?? `${person.role}-${i}`} person={person} index={i} />
              ))}
            </div>
            {tab === "pr" && <PRBoard members={prTeam} tasks={content.prTasks || []} />}
          </>
        )}
      </div>
    </section>
  );
}
