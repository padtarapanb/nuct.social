import { useState } from "react";
import { ChevronRight, ChevronDown, X } from "lucide-react";

function Avatar({ name, photo, onClick }) {
  const hasRealPhoto = photo && /^https?:\/\//.test(photo);
  const initials = (name || "?").trim().slice(0, 2).toUpperCase();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="shrink-0"
      aria-label={`ดูรูป ${name || ""}`}
    >
      {hasRealPhoto ? (
        <img src={photo} alt="" className="w-6 h-6 rounded-full object-cover shrink-0 hover:ring-2 hover:ring-pine-300 transition-shadow" />
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
          style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
        >
          {initials}
        </div>
      )}
    </button>
  );
}

function PhotoPopup({ node, onClose }) {
  const hasRealPhoto = node.photo && /^https?:\/\//.test(node.photo);
  const initials = (node.name || "?").trim().slice(0, 2).toUpperCase();
  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl p-6 max-w-xs w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
          aria-label="ปิด"
        >
          <X size={16} />
        </button>
        <div className="w-28 h-28 mx-auto mb-4">
          {hasRealPhoto ? (
            <img src={node.photo} alt={node.name} className="w-full h-full rounded-full object-cover shadow-md" />
          ) : (
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-white font-display font-bold text-2xl shadow-md"
              style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
            >
              {initials}
            </div>
          )}
        </div>
        <p className="font-display font-bold text-gray-900">{node.name}</p>
      </div>
    </div>
  );
}

function Node({ node, depth, onShowPhoto }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 18 }}>
      <button
        onClick={() => hasChildren && setExpanded((v) => !v)}
        className={`w-full flex items-center gap-1.5 py-2 px-2 rounded-lg text-left ${
          hasChildren ? "hover:bg-pine-50 cursor-pointer" : "cursor-default"
        }`}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={15} className="text-pine-700 shrink-0" />
          ) : (
            <ChevronRight size={15} className="text-pine-700 shrink-0" />
          )
        ) : (
          <span className="w-[15px] shrink-0" />
        )}
        <Avatar name={node.name} photo={node.photo} onClick={() => onShowPhoto(node)} />
        <span
          className={
            depth === 0
              ? "font-display font-bold text-gray-900"
              : depth === 1
              ? "font-semibold text-gray-800 text-[15px]"
              : depth === 2
              ? "font-medium text-pine-800 text-sm"
              : "text-gray-600 text-sm"
          }
        >
          {node.name}
        </span>
      </button>

      {hasChildren && expanded && (
        <div className="border-l border-gray-100 ml-3.5 pl-1">
          {node.children.map((child) => (
            <Node key={child.id} node={child} depth={depth + 1} onShowPhoto={onShowPhoto} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShepherdingTree({ tree }) {
  const [photoNode, setPhotoNode] = useState(null);

  if (!tree.length) {
    return <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีข้อมูลโครงสร้างการอภิบาล</p>;
  }

  return (
    <div className="space-y-1">
      {tree.map((root) => (
        <Node key={root.id} node={root} depth={0} onShowPhoto={setPhotoNode} />
      ))}
      {photoNode && <PhotoPopup node={photoNode} onClose={() => setPhotoNode(null)} />}
    </div>
  );
}
