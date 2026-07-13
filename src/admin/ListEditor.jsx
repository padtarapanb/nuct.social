import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ArrowUp, ArrowDown, Loader2, ImageOff } from "lucide-react";
import { listRows, createRow, updateRow, deleteRow, reorderRows } from "../lib/contentApi";
import { normalizeImageUrl, isDisplayableImageUrl } from "../lib/imageUrl";

function emptyValues(fields) {
  const v = {};
  fields.forEach((f) => (v[f.name] = f.default ?? ""));
  return v;
}

function ImagePreview({ url }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [url]);

  if (!isDisplayableImageUrl(url)) return null;

  return (
    <div className="mt-2 flex items-center gap-2">
      {failed ? (
        <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-400">
          <ImageOff size={18} />
        </div>
      ) : (
        <img
          src={normalizeImageUrl(url)}
          alt="ตัวอย่าง"
          onError={() => setFailed(true)}
          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        />
      )}
      <p className="text-xs text-gray-400">
        {failed ? "ลิงก์นี้โหลดรูปไม่ขึ้น ลองเช็กว่าตั้งค่าแชร์เป็น \"ทุกคนที่มีลิงก์\" แล้วหรือยัง" : "ตัวอย่างรูป — ถ้าเห็นรูปนี้แปลว่าใช้ได้"}
      </p>
    </div>
  );
}

function Field({ field, value, onChange }) {
  if (field.type === "checkbox") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none cursor-pointer">
        <input
          type="checkbox"
          checked={value !== false}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-pine-800 focus:ring-pine-400"
        />
        {field.label}
      </label>
    );
  }
  const commonProps = {
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    className:
      "w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pine-400 text-sm",
    placeholder: field.placeholder || field.label,
  };
  if (field.type === "textarea") {
    return <textarea rows={3} {...commonProps} />;
  }
  if (field.type === "select") {
    return (
      <select {...commonProps}>
        <option value="" disabled>
          {field.placeholder || "เลือก"}
        </option>
        {field.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "image") {
    const hasText = Boolean((value || "").trim());
    const looksLikeUrl = isDisplayableImageUrl(value);
    return (
      <div>
        <input type="text" {...commonProps} />
        {hasText && !looksLikeUrl && (
          <p className="mt-1 text-xs text-amber-600">
            ช่องนี้ต้องเป็นลิงก์รูปภาพ (ขึ้นต้นด้วย http:// หรือ https://) ไม่ใช่ข้อความ — ลองวางลิงก์รูปจริงแทน
          </p>
        )}
        <ImagePreview url={value} />
      </div>
    );
  }
  return <input type="text" {...commonProps} />;
}

function RowForm({ fields, values, onChange }) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {fields.map((f) => (
        <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
          {f.type !== "checkbox" && (
            <label className="block text-xs font-medium text-gray-500 mb-1">{f.label}</label>
          )}
          <Field field={f} value={values[f.name]} onChange={(v) => onChange(f.name, v)} />
        </div>
      ))}
    </div>
  );
}

function slugify(text = "") {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ListEditor({ tableKey, title, description, fields }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [newRow, setNewRow] = useState(emptyValues(fields));
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listRows(tableKey);
      setRows(data);
      const d = {};
      data.forEach((r) => (d[r.id] = { ...r }));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);
const handleAdd = async () => {
  setAdding(true);
  setError("");

  try {
    const row = { ...newRow };

    if (tableKey === "galleryAlbums") {
      row.slug = slugify(row.title);
      row.folder = `NUCT Gallery/${row.title}`;
    }

    await createRow(tableKey, row);

    setNewRow(emptyValues(fields));
    await load();
  } catch (err) {
    console.error(err);
    setError("เพิ่มข้อมูลไม่สำเร็จ: " + err.message);
  } finally {
    setAdding(false);
  }
};

const handleSave = async (id) => {
  setSavingId(id);
  setError("");

  try {
    const values = { ...drafts[id] };

    if (tableKey === "galleryAlbums") {
      values.slug = slugify(values.title);
      values.folder = `NUCT Gallery/${values.title}`;
    }

    const { id: _id, sort_order, created_at, ...payload } = values;

    await updateRow(tableKey, id, payload);
    await load();
  } catch (err) {
    console.error(err);
    setError("บันทึกไม่สำเร็จ: " + err.message);
  } finally {
    setSavingId(null);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("ลบรายการนี้ใช่ไหม?")) return;
    setError("");
    try {
      await deleteRow(tableKey, id);
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
      await reorderRows(tableKey, newRows.map((r) => r.id));
    } catch (err) {
      console.error(err);
      setError("จัดลำดับใหม่ไม่สำเร็จ: " + err.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">+ เพิ่มรายการใหม่</p>
        <RowForm
          fields={fields}
          values={newRow}
          onChange={(name, v) => setNewRow((s) => ({ ...s, [name]: v }))}
        />
        <button
          onClick={handleAdd}
          disabled={adding}
          className="mt-4 inline-flex items-center gap-2 bg-pine-800 text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-pine-900 transition-colors disabled:opacity-50"
        >
          <Plus size={16} /> {adding ? "กำลังเพิ่ม..." : "เพิ่มรายการ"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> กำลังโหลด...
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">ยังไม่มีข้อมูล เพิ่มรายการแรกด้านบนได้เลย</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row, index) => (
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
                <button
                  onClick={() => handleDelete(row.id)}
                  className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  <Trash2 size={14} /> ลบ
                </button>
              </div>

              <RowForm
                fields={fields}
                values={drafts[row.id] || row}
                onChange={(name, v) =>
                  setDrafts((s) => ({ ...s, [row.id]: { ...s[row.id], [name]: v } }))
                }
              />

              <button
                onClick={() => handleSave(row.id)}
                disabled={savingId === row.id}
                className="mt-4 inline-flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Save size={14} /> {savingId === row.id ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
