import { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, ArrowLeft, ArrowRight, User } from "lucide-react";
import { listRows, createRow, updateRow, deleteRow } from "../lib/contentApi";
import { TASK_STATUSES } from "../lib/prBoard";

function emptyDraft() {
  return { title: "", description: "", assignee_id: "" };
}

export default function PRBoardEditor() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [newTask, setNewTask] = useState(emptyDraft());
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [taskRows, teamRows] = await Promise.all([listRows("prTasks"), listRows("team")]);
      setTasks(taskRows);
      setMembers(teamRows.filter((m) => m.group_name === "pr"));
      const d = {};
      taskRows.forEach((t) => (d[t.id] = { ...t }));
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

  const handleAdd = async () => {
    if (!newTask.title.trim()) return;
    setAdding(true);
    setError("");
    try {
      await createRow("prTasks", {
        title: newTask.title,
        description: newTask.description,
        assignee_id: newTask.assignee_id || null,
        status: "todo",
      });
      setNewTask(emptyDraft());
      await load();
    } catch (err) {
      console.error(err);
      setError("เพิ่มงานไม่สำเร็จ: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (id) => {
    setSavingId(id);
    setError("");
    try {
      const d = drafts[id] || {};
      await updateRow("prTasks", id, {
        title: d.title ?? "",
        description: d.description ?? "",
        assignee_id: d.assignee_id || null,
      });
      await load();
    } catch (err) {
      console.error(err);
      setError("บันทึกไม่สำเร็จ: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleMoveStatus = async (task, direction) => {
    const idx = TASK_STATUSES.findIndex((s) => s.value === task.status);
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= TASK_STATUSES.length) return;
    setError("");
    try {
      await updateRow("prTasks", task.id, { status: TASK_STATUSES[targetIdx].value });
      await load();
    } catch (err) {
      console.error(err);
      setError("เปลี่ยนสถานะไม่สำเร็จ: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ลบงานนี้ใช่ไหม?")) return;
    setError("");
    try {
      await deleteRow("prTasks", id);
      await load();
    } catch (err) {
      console.error(err);
      setError("ลบไม่สำเร็จ: " + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">บอร์ดงานเฉพาะกิจ (PR)</h2>
        <p className="text-sm text-gray-500 mt-1">
          มอบหมายงานให้สมาชิกทีมประชาสัมพันธ์ และย้ายสถานะด้วยลูกศร ← → แสดงผลเป็นบอร์ดในหน้าเว็บจริง
        </p>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">+ เพิ่มงานใหม่</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">ชื่องาน</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask((s) => ({ ...s, title: e.target.value }))}
              placeholder="เช่น ตัดวิดีโอสรุปค่าย"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">รายละเอียด</label>
            <textarea
              rows={2}
              value={newTask.description}
              onChange={(e) => setNewTask((s) => ({ ...s, description: e.target.value }))}
              placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">มอบหมายให้</label>
            <select
              value={newTask.assignee_id}
              onChange={(e) => setNewTask((s) => ({ ...s, assignee_id: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
            >
              <option value="">ยังไม่มอบหมาย</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.role}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="mt-4 inline-flex items-center gap-2 bg-pine-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pine-900 transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> {adding ? "กำลังเพิ่ม..." : "เพิ่มงาน"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {TASK_STATUSES.map((col, colIdx) => {
            const colTasks = tasks.filter((t) => t.status === col.value);
            return (
              <div key={col.value} className="bg-gray-50 border border-gray-200 rounded-2xl p-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
                  {col.label} <span className="text-gray-300">({colTasks.length})</span>
                </p>
                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-xl p-3">
                      <input
                        type="text"
                        value={drafts[task.id]?.title ?? ""}
                        onChange={(e) =>
                          setDrafts((s) => ({ ...s, [task.id]: { ...s[task.id], title: e.target.value } }))
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold mb-2 focus:outline-none focus:ring-2 focus:ring-pine-400"
                      />
                      <textarea
                        rows={2}
                        value={drafts[task.id]?.description ?? ""}
                        onChange={(e) =>
                          setDrafts((s) => ({ ...s, [task.id]: { ...s[task.id], description: e.target.value } }))
                        }
                        placeholder="รายละเอียด"
                        className="w-full px-2 py-1.5 rounded-lg border border-gray-200 text-xs mb-2 focus:outline-none focus:ring-2 focus:ring-pine-400"
                      />
                      <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500">
                        <User size={12} />
                        <select
                          value={drafts[task.id]?.assignee_id ?? ""}
                          onChange={(e) =>
                            setDrafts((s) => ({ ...s, [task.id]: { ...s[task.id], assignee_id: e.target.value } }))
                          }
                          className="flex-1 px-2 py-1 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-pine-400"
                        >
                          <option value="">ยังไม่มอบหมาย</option>
                          {members.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name || m.role}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleMoveStatus(task, -1)}
                          disabled={colIdx === 0}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          aria-label="ย้ายไปสถานะก่อนหน้า"
                        >
                          <ArrowLeft size={13} />
                        </button>
                        <button
                          onClick={() => handleMoveStatus(task, 1)}
                          disabled={colIdx === TASK_STATUSES.length - 1}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                          aria-label="ย้ายไปสถานะถัดไป"
                        >
                          <ArrowRight size={13} />
                        </button>
                        <button
                          onClick={() => handleSave(task.id)}
                          disabled={savingId === task.id}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
                          aria-label="บันทึก"
                        >
                          <Save size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                          aria-label="ลบ"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-gray-300 text-center py-4">ไม่มีงาน</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
