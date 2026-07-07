import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { buildTree } from "../../lib/tree";
import ShepherdingTree from "./ShepherdingTree";

function CommitteeCard({ person }) {
  const initials = person.role.slice(0, 2).toUpperCase();
  const hasRealPhoto = person.photo && /^https?:\/\//.test(person.photo);

  return (
    <div className="text-center">
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3">
        {hasRealPhoto ? (
          <img src={person.photo} alt={person.name} className="w-full h-full rounded-full object-cover shadow-md" />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white font-display font-bold text-xl shadow-md"
            style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
          >
            {initials}
          </div>
        )}
      </div>
      <p className="font-semibold text-gray-900 text-sm">{person.role}</p>
      <p className="text-xs text-gray-500">{person.name}</p>
    </div>
  );
}

export default function LeadershipModal({ open, onClose, team, shepherding = [] }) {
  const [tab, setTab] = useState("committee");
  const shepherdingTree = useMemo(() => buildTree(shepherding), [shepherding]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div>
            <div className="badge mb-2">Leadership</div>
            <h3 className="font-display text-xl font-bold text-gray-900">ทีมผู้นำของชมรม</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
            aria-label="ปิด"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4 shrink-0">
          <button
            onClick={() => setTab("committee")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === "committee" ? "bg-pine-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Committee
          </button>
          <button
            onClick={() => setTab("shepherding")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              tab === "shepherding" ? "bg-pine-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Shepherding
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {tab === "committee" ? (
            team.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
                {team.map((person) => (
                  <CommitteeCard key={person.id ?? person.role} person={person} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีข้อมูลกรรมการชมรม</p>
            )
          ) : (
            <ShepherdingTree tree={shepherdingTree} />
          )}
        </div>
      </div>
    </div>
  );
}
