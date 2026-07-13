import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

function Avatar({ name, photo }) {
  const hasRealPhoto = photo && /^https?:\/\//.test(photo);
  const initials = (name || "?").trim().slice(0, 2).toUpperCase();

  return hasRealPhoto ? (
    <img src={photo} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
  ) : (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
      style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
    >
      {initials}
    </div>
  );
}

function Node({ node, depth }) {
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
        <Avatar name={node.name} photo={node.photo} />
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
            <Node key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShepherdingTree({ tree }) {
  if (!tree.length) {
    return <p className="text-sm text-gray-400 text-center py-10">ยังไม่มีข้อมูลโครงสร้างการอภิบาล</p>;
  }

  return (
    <div className="space-y-1">
      {tree.map((root) => (
        <Node key={root.id} node={root} depth={0} />
      ))}
    </div>
  );
}
