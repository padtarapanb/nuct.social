import { ArrowRight, MapPin } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";

function EventRow({ e, index }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal reveal-delay-${index + 1} flex items-center gap-5 p-5 sm:p-6 rounded-3xl bg-white border border-line hover:border-pine-100 hover:shadow-lg transition-all duration-300`}
    >
      <div className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-display"
           style={{ background: "var(--gradient-brand)" }}>
        <span className="text-xl font-bold leading-none">{e.day}</span>
        <span className="text-[10px] tracking-widest mt-1">{e.month}</span>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{e.title}</p>
        <p className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
          <MapPin size={12} /> {e.location}
        </p>
      </div>
    </div>
  );
}

// อนุญาตเฉพาะลิงก์ฝังของ Google Calendar จริง ๆ เท่านั้น (กัน URL แปลกปลอมจากช่อง settings)
function isValidGoogleCalendarUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "calendar.google.com";
  } catch {
    return false;
  }
}

export default function UpcomingEvents() {
  const { content } = useContent();
  const upcomingEvents = content.upcomingEvents;
  const calendarUrl = content.settings?.google_calendar_embed_url;
  const ref = useReveal();
  const calendarRef = useReveal();
  const showCalendar = isValidGoogleCalendarUrl(calendarUrl);

  return (
    <section id="events" className="section">
      <div className={showCalendar ? "max-w-6xl mx-auto px-5 sm:px-8" : "max-w-4xl mx-auto px-5 sm:px-8"}>
        <div ref={ref} className="reveal text-center mb-12">
          <div className="badge mb-5">Upcoming Event</div>
          <h2 className="section-title">อีเวนต์ที่กำลังจะมาถึง</h2>
        </div>

        <div className={showCalendar ? "grid lg:grid-cols-[1fr,1.1fr] gap-10 items-start" : ""}>
          <div>
            <div className="space-y-4 mb-10">
              {upcomingEvents.map((e, i) => (
                <EventRow key={e.id ?? e.title} e={e} index={i} />
              ))}
            </div>

            <div className={showCalendar ? "text-center lg:text-left mb-4" : "text-center mb-4"}>
              <button className="btn-secondary mx-auto lg:mx-0">
                View All Activities <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {showCalendar && (
            <div ref={calendarRef} className="reveal rounded-3xl overflow-hidden border border-line shadow-sm lg:sticky lg:top-24">
              <iframe
                title="ปฏิทินกิจกรรม NU Christian Club"
                src={calendarUrl}
                className="w-full"
                style={{ border: 0, height: "600px" }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
