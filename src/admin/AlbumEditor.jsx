import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Loader2, ImageOff, X } from "lucide-react";
import { listRows, createRow, updateRow, deleteRow, reorderRows } from "../lib/contentApi";
import { normalizeImageUrl, isDisplayableImageUrl } from "../lib/imageUrl";

const ROOT_FOLDER = "NUCT Gallery";

// สร้าง slug จากชื่ออัลบั้ม รองรับทั้งภาษาไทยและอังกฤษ
function slugify(str) {
  return (str || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function folderFromTitle(title) {
  const trimmed = (title || "").trim();
  return trimmed ? `${ROOT_FOLDER}/${trimmed}` : "";
}

function isDuplicateTitle(title, rows, excludeId) {
  const target = (title || "").trim().toLowerCase();
  if (!target) return false;
  return rows.some(
    (r) => r.id !== excludeId && (r.title || "").trim().toLowerCase() === target
  );
}

function Thumb({ url, onRemove }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  return (
    <div className="relative group">
      {failed || !isDisplayableImageUrl(url) ? (
        <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400">
          <ImageOff size={16} />
        </div>
      ) : (
        <img
          src={normalizeImageUrl(url)}
          alt=""
          onError={() => setFailed(true)}
          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="ลบรูปนี้"
      >
        <X size={12} />
      </button>
    </div>
  );
}

function ImagesField({ images, onAdd, onRemove }) {
  const [url, setUrl] = useState("");

  const add = () => {
    const v = url.trim();
    if (!v) return;
    onAdd(v);
    setUrl("");
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        รูปภาพในอัลบั้ม ({images.length} รูป)
      </label>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img, i) => (
            <Thumb key={i} url={img} onRemove={() => onRemove(i)} />
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="วางลิงก์รูป (จาก Cloudinary หรือ Google Drive) แล้วกด Enter"
          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}

const EMPTY_NEW_ALBUM = { title: "", description: "", cover_image: "", images: [] };

export default function AlbumEditor() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [newAlbum, setNewAlbum] = useState(EMPTY_NEW_ALBUM);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listRows("galleryAlbums");
      setRows(data);
      const d = {};
      data.forEach((r) => (d[r.id] = { ...r, images: Array.isArray(r.images) ? r.images : [] }));
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
    setError("");
    const title = newAlbum.title.trim();
    if (!title) {
      setError("กรุณาใส่ชื่ออัลบั้ม");
      return;
    }
    if (isDuplicateTitle(title, rows)) {
      setError("มีอัลบั้มนี้อยู่แล้ว");
      return;
    }
    setAdding(true);
    try {
      await createRow("galleryAlbums", {
        title,
        slug: slugify(title),
        folder: folderFromTitle(title),
        description: newAlbum.description.trim(),
        cover_image: newAlbum.cover_image.trim() || newAlbum.images[0] || "",
        images: newAlbum.images,
        is_active: true,
      });
      setNewAlbum(EMPTY_NEW_ALBUM);
      await load();
    } catch (err) {
      console.error(err);
      setError("เพิ่มอัลบั้มไม่สำเร็จ: " + err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleSave = async (id) => {
    setError("");
    const draft = drafts[id];
    const title = (draft.title || "").trim();
    if (!title) {
      setError("กรุณาใส่ชื่ออัลบั้ม");
      return;
    }
    if (isDuplicateTitle(title, rows, id)) {
      setError("มีอัลบั้มนี้อยู่แล้ว");
      return;
    }
    setSavingId(id);
    try {
      await updateRow("galleryAlbums", id, {
        title,
        slug: slugify(title),
        folder: folderFromTitle(title),
        description: (draft.description || "").trim(),
        cover_image: (draft.cover_image || "").trim() || (draft.images || [])[0] || "",
        images: draft.images,
        is_active: draft.is_active ?? true,
      });
      await load();
    } catch (err) {
      console.error(err);
      setError("บันทึกไม่สำเร็จ: " + err.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("ลบอัลบั้มนี้ใช่ไหม?")) return;
    setError("");
    try {
      await deleteRow("galleryAlbums", id);
      await load();
    } catch (err) {
      console.error(err);
      setError("ลบไม่สำเร็จ: " + err.message);
    }
  };

  const handleMove = async (index, direction) => {
    const newRows = [...rows];
    const target = index + direction;
    if (target < 0 || target >= newRows.length) return;
    [newRows[index], newRows[target]] = [newRows[target], newRows[index]];
    setRows(newRows);
    try {
      await reorderRows("galleryAlbums", newRows.map((r) => r.id));
    } catch (err) {
      console.error(err);
      setError("จัดลำดับใหม่ไม่สำเร็จ: " + err.message);
    }
  };

  const updateDraft = (id, patch) =>
    setDrafts((s) => ({ ...s, [id]: { ...s[id], ...patch } }));

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">อัลบั้มรูปภาพ</h2>
        <p className="text-sm text-gray-500 mt-1">
          พิมพ์แค่ชื่ออัลบั้ม ระบบจะตั้งชื่อโฟลเดอร์ Cloudinary ให้ตรงกันอัตโนมัติ ({ROOT_FOLDER}/ชื่ออัลบั้ม)
          — ถ้าอัปโหลดรูปเข้าโฟลเดอร์นั้นใน Cloudinary โดยตรง หน้าเว็บจะดึงรูปทั้งหมดในโฟลเดอร์มาโชว์ให้เองอัตโนมัติ
          ไม่ต้องมาวางลิงก์ทีละรูปที่นี่ (คลิกอัลบั้มในหน้าเว็บแล้วเลื่อนดูได้เลย) ส่วนช่อง "รูปภาพในอัลบั้ม" ด้านล่าง
          ใช้เผื่อกรณีไม่ได้ใช้ Cloudinary หรืออยากวางลิงก์รูปจากที่อื่น (เช่น Google Drive) แทน — ถ้าโฟลเดอร์ Cloudinary
          มีรูปอยู่แล้ว หน้าเว็บจะใช้รูปจากโฟลเดอร์นั้นก่อนเสมอ
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">+ เพิ่มอัลบั้มใหม่</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ชื่ออัลบั้ม</label>
            <input
              type="text"
              value={newAlbum.title}
              onChange={(e) => setNewAlbum((s) => ({ ...s, title: e.target.value }))}
              placeholder="Christmas 2026"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
            />
            {newAlbum.title.trim() && (
              <p className="text-xs text-gray-400 mt-1">
                folder: {folderFromTitle(newAlbum.title)} · slug: {slugify(newAlbum.title)}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">คำอธิบาย (ไม่บังคับ)</label>
            <textarea
              value={newAlbum.description}
              onChange={(e) => setNewAlbum((s) => ({ ...s, description: e.target.value }))}
              rows={2}
              placeholder="รายละเอียดสั้น ๆ เกี่ยวกับอัลบั้มนี้"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              รูปปก (ไม่บังคับ — ถ้าไม่ใส่จะใช้รูปแรกในอัลบั้ม)
            </label>
            <input
              type="text"
              value={newAlbum.cover_image}
              onChange={(e) => setNewAlbum((s) => ({ ...s, cover_image: e.target.value }))}
              placeholder="วางลิงก์รูปปก (ไม่บังคับ)"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
            />
          </div>
          <ImagesField
            images={newAlbum.images}
            onAdd={(url) => setNewAlbum((s) => ({ ...s, images: [...s.images, url] }))}
            onRemove={(i) =>
              setNewAlbum((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))
            }
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={adding}
          className="mt-4 inline-flex items-center gap-2 bg-pine-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pine-900 transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> {adding ? "กำลังเพิ่ม..." : "เพิ่มอัลบั้ม"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีอัลบั้ม เพิ่มอัลบั้มแรกด้านบนได้เลย</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => {
            const draft = drafts[row.id] || { ...row, images: [] };
            return (
              <div key={row.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      aria-label="เลื่อนขึ้น"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === rows.length - 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                      aria-label="เลื่อนลง"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <input
                      type="checkbox"
                      checked={draft.is_active ?? true}
                      onChange={(e) => updateDraft(row.id, { is_active: e.target.checked })}
                      className="rounded border-gray-300 text-pine-700 focus:ring-pine-400"
                    />
                    เปิดใช้งาน
                  </label>
                  <button
                    onClick={() => handleDelete(row.id)}
                    className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    <Trash2 size={14} /> ลบ
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">ชื่ออัลบั้ม</label>
                    <input
                      type="text"
                      value={draft.title ?? ""}
                      onChange={(e) => updateDraft(row.id, { title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      folder: {folderFromTitle(draft.title)} · slug: {slugify(draft.title)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">คำอธิบาย (ไม่บังคับ)</label>
                    <textarea
                      value={draft.description ?? ""}
                      onChange={(e) => updateDraft(row.id, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      รูปปก (ไม่บังคับ — ถ้าไม่ใส่จะใช้รูปแรกในอัลบั้ม)
                    </label>
                    <input
                      type="text"
                      value={draft.cover_image ?? ""}
                      onChange={(e) => updateDraft(row.id, { cover_image: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm"
                    />
                  </div>
                  <ImagesField
                    images={draft.images || []}
                    onAdd={(url) =>
                      updateDraft(row.id, { images: [...(draft.images || []), url] })
                    }
                    onRemove={(i) =>
                      updateDraft(row.id, {
                        images: (draft.images || []).filter((_, idx) => idx !== i),
                      })
                    }
                  />
                </div>

                <button
                  onClick={() => handleSave(row.id)}
                  disabled={savingId === row.id}
                  className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  <Save size={14} /> {savingId === row.id ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
