// สถานะของงานเฉพาะกิจในบอร์ด PR ใช้ร่วมกันทั้งฝั่งแอดมินและหน้าเว็บ
export const TASK_STATUSES = [
  { value: "todo", label: "ยังไม่เริ่ม" },
  { value: "doing", label: "กำลังทำ" },
  { value: "done", label: "เสร็จแล้ว" },
];

export function statusLabel(value) {
  return TASK_STATUSES.find((s) => s.value === value)?.label || value;
}
