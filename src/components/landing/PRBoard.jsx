import { useMemo } from "react";
import { ClipboardList, Users } from "lucide-react";
import { isDisplayableImageUrl, normalizeImageUrl } from "../../lib/imageUrl";
import { TASK_STATUSES } from "../../lib/prBoard";
import { renderText } from "../../lib/renderText";

function MemberChip({ member }) {
  const hasPhoto = isDisplayableImageUrl(member.photo);
  const initials = (member.name || member.role || "?").trim().slice(0, 2).toUpperCase();
  return (
    <div className="flex items-center gap-2 bg-white rounded-full border border-line pl-1 pr-3 py-1">
      {hasPhoto ? (
        <img src={normalizeImageUrl(member.photo)} alt="" className="w-6 h-6 rounded-full object-cover" />
      ) : (
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
          style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
        >
          {initials}
        </div>
      )}
      <span className="text-xs font-medium text-gray-700">{member.name || member.role}</span>
    </div>
  );
}

function DutyBoard({ members }) {
  const groups = useMemo(() => {
    const map = new Map();
    members.forEach((m) => {
      const duty = (m.duty || "").trim();
      if (!duty) return;
      if (!map.has(duty)) map.set(duty, []);
      map.get(duty).push(m);
    });
    return Array.from(map.entries());
  }, [members]);

  if (groups.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Users size={16} className="text-pine-700" />
        <h3 className="font-display font-bold text-gray-900">หน้าที่ประจำ</h3>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map(([duty, people]) => (
          <div key={duty} className="bg-white rounded-2xl border border-line p-4">
            <p className="text-sm font-semibold text-pine-800 mb-3">{duty}</p>
            <div className="flex flex-wrap gap-2">
              {people.map((p) => (
                <MemberChip key={p.id} member={p} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskBoard({ tasks, members }) {
  const memberById = useMemo(() => {
    const map = new Map();
    members.forEach((m) => map.set(m.id, m));
    return map;
  }, [members]);

  if (tasks.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList size={16} className="text-pine-700" />
        <h3 className="font-display font-bold text-gray-900">งานเฉพาะกิจ</h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {TASK_STATUSES.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.value);
          return (
            <div key={col.value} className="bg-gray-50 rounded-2xl border border-line p-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
                {col.label} <span className="text-gray-300">({colTasks.length})</span>
              </p>
              <div className="space-y-3">
                {colTasks.map((task) => {
                  const assignee = memberById.get(task.assignee_id);
                  return (
                    <div key={task.id} className="bg-white rounded-xl border border-line p-3">
                      <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 rich-text" dangerouslySetInnerHTML={renderText(task.description)} />
                      )}
                      {assignee && (
                        <div className="mt-2.5">
                          <MemberChip member={assignee} />
                        </div>
                      )}
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <p className="text-xs text-gray-300 text-center py-4">ไม่มีงาน</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PRBoard({ members, tasks }) {
  const hasDuties = members.some((m) => (m.duty || "").trim());
  const hasTasks = tasks.length > 0;

  if (!hasDuties && !hasTasks) return null;

  return (
    <div className="mt-10">
      <DutyBoard members={members} />
      <TaskBoard tasks={tasks} members={members} />
    </div>
  );
}
