import { useState } from "react";
import { ChevronRight, ChevronDown, X, Camera, Users } from "lucide-react";

function Avatar({ name, photo, onClick, size = "w-7 h-7" }) {
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
        <img
          src={photo}
          alt=""
          className={`${size} rounded-full object-cover shrink-0 border border-white shadow-sm hover:ring-2 hover:ring-pine-300 transition-shadow`}
        />
      ) : (
        <div
          className={`${size} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 border border-white shadow-sm`}
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
        {(node.ig || node.fb) && (
          <div className="flex items-center justify-center gap-3 mt-3">
            {node.ig && (
              <a
                href={node.ig}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pine-50 hover:text-pine-800 transition-colors"
                aria-label="Instagram"
              >
                <Camera size={16} />
              </a>
            )}
            {node.fb && (
              <a
                href={node.fb}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-pine-50 hover:text-pine-800 transition-colors"
                aria-label="Facebook"
              >
                <Users size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Node({ node, depth, onShowPhoto, isLast }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;

  const avatarSize = depth === 0 ? "w-11 h-11" : depth === 1 ? "w-9 h-9" : "w-7 h-7";
  const textClass =
    depth === 0
      ? "font-display font-bold text-gray-900 text-[15px]"
      : depth === 1
      ? "font-semibold text-gray-800 text-[14px]"
      : depth === 2
      ? "font-medium text-pine-800 text-[13px]"
      : "text-gray-600 text-[13px]";

  return (
    <div className={depth > 0 ? "relative pl-6" : ""}>
      {depth > 0 && (
        <span
          className={`absolute left-0 top-0 w-6 border-l-2 border-pine-100 ${isLast ? "h-6" : "h-full"}`}
          aria-hidden="true"
        />
      )}
      {depth > 0 && (
        <span
          className="absolute left-0 top-6 w-5 border-t-2 border-pine-100"
          aria-hidden="true"
        />
      )}

      <div
        className={`flex items-center gap-2.5 rounded-2xl px-3 py-2.5 mb-1.5 transition-colors ${
          depth === 0
            ? "bg-white border border-gray-200 shadow-sm"
            : depth === 1
            ? "bg-pine-50/60 border border-pine-100/70"
            : "hover:bg-gray-50"
        }`}
      >
        <button
          onClick={() => hasChildren && setExpanded((v) => !v)}
          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
            hasChildren ? "text-pine-700 hover:bg-pine-100 cursor-pointer" : "text-transparent"
          }`}
          disabled={!hasChildren}
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <Avatar name={node.name} photo={node.photo} onClick={() => onShowPhoto(node)} size={avatarSize} />

        <span className={`${textClass} truncate`}>{node.name}</span>

        {hasChildren && (
          <span className="ml-auto shrink-0 text-[11px] text-gray-400 font-medium bg-gray-100 rounded-full px-2 py-0.5">
            {node.children.length}
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="ml-5">
          {node.children.map((child, i) => (
            <Node
              key={child.id}
              node={child}
              depth={depth + 1}
              onShowPhoto={onShowPhoto}
              isLast={i === node.children.length - 1}
            />
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
    <div className="bg-gradient-to-b from-pine-50/40 to-transparent rounded-3xl p-4 sm:p-6 space-y-3">
      {tree.map((root) => (
        <Node key={root.id} node={root} depth={0} onShowPhoto={setPhotoNode} isLast />
      ))}
      {photoNode && <PhotoPopup node={photoNode} onClose={() => setPhotoNode(null)} />}
    </div>
  );
}
