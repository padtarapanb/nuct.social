import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Loader2, ChevronRight, ChevronDown, Camera, Users } from "lucide-react";
import {
  fetchShepherdingFlat,
  createShepherdingNode,
  updateShepherdingNode,
  deleteShepherdingNode,
  reorderShepherdingSiblings,
} from "../lib/contentApi";
import { buildTree } from "../lib/tree";

export default function TreeEditor() {
  const [flatRows, setFlatRows] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchShepherdingFlat();
      setFlatRows(rows);
      const d = {};
      rows.forEach(
        (r) =>
          (d[r.id] = {
            name: r.name || "",
            photo: r.photo || "",
            ig: r.ig || "",
            fb: r.fb || "",
          })
      );
      setDrafts(d);
    } catch (err) {
      console.error(err);
      setError("โหลดข้อมูลไม่สำเร็จ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const tree = buildTree(flatRows);

  const handleAddRoot = async () => {
    setAdding(true);
    setError("");
    try {
      await createShepherdingNode(null, "หัวข้อใหม่");
      await load();
    } catch (err) {
      setError("เพิ่มไม่สำเร็จ: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleAddChild = async (parentId) => {
    setError("");
    try {
      await createShepherdingNode(parentId, "หัวข้อย่อยใหม่");
      await load();
    } catch (err) {
      setError("เพิ่มไม่สำเร็จ: " + err.message);
    }
  };

  const handleSave = async (id) => {
    setSavingId(id);
    setError("");
    try {
      const draft = drafts[id] || {};
      await updateShepherdingNode(id, {
        name: draft.name ?? "",
        photo: draft.photo ?? "",
        ig: draft.ig ?? "",
        fb: draft.fb ?? "",
      });
      await load();
    } catch (err) {
      setError("บันทึกไม่สำเร็จ: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ลบรายการนี้ (และรายการย่อยทั้งหมดข้างใต้) ใช่ไหม?")) return;
    setError("");
    try {
      await deleteShepherdingNode(id);
      await load();
    } catch (err) {
      setError("ลบไม่สำเร็จ: " + err.message);
    }
  };

  const handleMove = async (node, direction) => {
    const siblings = flatRows
      .filter((r) => r.parent_id === node.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order);
    const index = siblings.findIndex((s) => s.id === node.id);
    const target = index + direction;
    if (target < 0 || target >= siblings.length) return;
    [siblings[index], siblings[target]] = [siblings[target], siblings[index]];
    setError("");
    try {
      await reorderShepherdingSiblings(siblings.map((s) => s.id));
      await load();
    } catch (err) {
      setError("จัดลำดับใหม่ไม่สำเร็จ: " + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">โครงสร้างการอภิบาล (Shepherding)</h2>
        <p className="text-sm text-gray-500 mt-1">
          เพิ่ม/ลบ/แก้ไข/เรียงลำดับได้ทุกชั้น กด "ลูก" เพื่อเพิ่มหัวข้อย่อยใต้รายการนั้น ๆ (ลบรายการแม่จะลบลูกทั้งหมดด้วย)
        </p>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

      <button
        onClick={handleAddRoot}
        disabled={adding}
        className="mb-5 inline-flex items-center gap-2 bg-pine-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pine-900 transition-colors disabled:opacity-50"
      >
        <Plus size={16} /> {adding ? "กำลังเพิ่ม..." : "เพิ่มหัวข้อระดับบนสุด"}
      </button>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
        </div>
      ) : tree.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีข้อมูล กดปุ่มด้านบนเพื่อเริ่มสร้าง</p>
      ) : (
        <div>
          {tree.map((root) => (
            <RootBranch
              key={root.id}
              node={root}
              siblings={tree}
              drafts={drafts}
              setDrafts={setDrafts}
              onAddChild={handleAddChild}
              onDelete={handleDelete}
              onMove={handleMove}
              onSave={handleSave}
              savingId={savingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RootBranch({ node, siblings, drafts, setDrafts, onAddChild, onDelete, onMove, onSave, savingId }) {
  return (
    <BranchNode
      node={node}
      depth={0}
      siblings={siblings}
      drafts={drafts}
      setDrafts={setDrafts}
      onAddChild={onAddChild}
      onDelete={onDelete}
      onMove={onMove}
      onSave={onSave}
      savingId={savingId}
    />
  );
}

function BranchNode({ node, depth, siblings, drafts, setDrafts, onAddChild, onDelete, onMove, onSave, savingId }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const index = siblings.findIndex((s) => s.id === node.id);
  const draft = drafts[node.id] || {};
  const setField = (name, value) =>
    setDrafts((s) => ({ ...s, [node.id]: { ...s[node.id], [name]: value } }));

  const photo = draft.photo || "";
  const hasPhoto = /^https?:\/\//.test(photo);

  return (
    <div style={{ marginLeft: depth === 0 ? 0 : 22 }} className={depth > 0 ? "mt-3 border-l-2 border-pine-100 pl-4" : "mt-3"}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 mt-2 text-gray-400 hover:text-gray-700"
            disabled={!hasChildren}
          >
            {hasChildren ? (
              expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />
            ) : (
              <span className="inline-block w-4" />
            )}
          </button>

          {hasPhoto ? (
            <img src={photo} alt="" className="shrink-0 w-11 h-11 rounded-full object-cover border border-gray-200" />
          ) : (
            <div className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-pine-100 to-pine-50 border border-gray-200" />
          )}

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={draft.name ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="ชื่อ (เช่น หัวหน้าเขต, NU1, คณะวิทยาศาสตร์)"
                className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm font-medium"
              />
              <input
                type="text"
                value={draft.photo ?? ""}
                onChange={(e) => setField("photo", e.target.value)}
                placeholder="ลิงก์รูปภาพ (ไม่บังคับ)"
                className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="flex-1 min-w-[180px] flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5">
                <Camera size={13} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={draft.ig ?? ""}
                  onChange={(e) => setField("ig", e.target.value)}
                  placeholder="ลิงก์ Instagram (ไม่บังคับ)"
                  className="flex-1 min-w-0 text-sm focus:outline-none"
                />
              </div>
              <div className="flex-1 min-w-[180px] flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5">
                <Users size={13} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={draft.fb ?? ""}
                  onChange={(e) => setField("fb", e.target.value)}
                  placeholder="ลิงก์ Facebook (ไม่บังคับ)"
                  className="flex-1 min-w-0 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 pl-[52px] flex-wrap">
          <button
            onClick={() => onSave(node.id)}
            disabled={savingId === node.id}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50"
          >
            <Save size={13} /> บันทึก
          </button>

          <button
            onClick={() => onMove(node, -1)}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
            aria-label="เลื่อนขึ้น"
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => onMove(node, 1)}
            disabled={index === siblings.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
            aria-label="เลื่อนลง"
          >
            <ArrowDown size={14} />
          </button>

          <button
            onClick={() => onAddChild(node.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-pine-800 bg-pine-50 hover:bg-pine-100"
          >
            <Plus size={13} /> ลูก
          </button>

          <button
            onClick={() => onDelete(node.id)}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
            aria-label="ลบ"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map((child) => (
            <BranchNode
              key={child.id}
              node={child}
              depth={depth + 1}
              siblings={node.children}
              drafts={drafts}
              setDrafts={setDrafts}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onMove={onMove}
              onSave={onSave}
              savingId={savingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
