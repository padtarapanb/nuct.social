import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

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
