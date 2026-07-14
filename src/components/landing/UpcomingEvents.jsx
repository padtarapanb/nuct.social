import { useState } from "react";
import { ArrowRight, MapPin, X, ExternalLink } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";
import { toEmbeddableMapsUrl } from "../../lib/mapsUrl";

function EventDetailPopup({ event, onClose }) {
  const mapUrl = toEmbeddableMapsUrl(event.map_embed_url);
  const hasPoster = event.poster_url && /^https?:\/\//.test(event.poster_url);

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white text-gray-500 shadow-sm"
          aria-label="ปิด"
        >
          <X size={16} />
        </button>

        {hasPoster && (
          <img src={event.poster_url} alt={event.title} className="w-full aspect-[4/5] object-cover rounded-t-3xl" />
        )}

        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center text-white font-display"
              style={{ background: "var(--gradient-brand)" }}
            >
              <span className="text-base font-bold leading-none">{event.day}</span>
              <span className="text-[8px] tracking-widest mt-0.5">{event.month}</span>
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-gray-900">{event.title}</p>
              <p className="text-[13px] text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={12} /> {event.location}
              </p>
            </div>
          </div>

          {event.register_link && (
            <a
              href={event.register_link}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full flex items-center justify-center gap-2 mb-4"
            >
              ลงทะเบียนเข้าร่วม <ExternalLink size={15} />
            </a>
          )}

          {mapUrl && (
            <div className="rounded-2xl overflow-hidden border border-line">
              <iframe
                title={`แผนที่ ${event.title}`}
                src={mapUrl}
                className="w-full"
                style={{ border: 0, height: "220px" }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCard({ e, index, onOpen }) {
  const ref = useReveal();
  const hasDetail = e.poster_url || e.register_link || e.map_embed_url;
  return (
    <div
      ref={ref}
      onClick={() => hasDetail && onOpen(e)}
      className={`reveal reveal-delay-${index + 1} snap-start shrink-0 w-[220px] sm:w-[240px] flex flex-col gap-4 p-5 rounded-3xl bg-white border border-line hover:border-pine-100 hover:shadow-lg transition-all duration-300 ${
        hasDetail ? "cursor-pointer" : ""
      }`}
    >
      <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white font-display"
           style={{ background: "var(--gradient-brand)" }}>
        <span className="text-lg font-bold leading-none">{e.day}</span>
        <span className="text-[9px] tracking-widest mt-1">{e.month}</span>
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 leading-snug">{e.title}</p>
        <p className="text-[13px] text-gray-500 flex items-center gap-1 mt-1.5">
          <MapPin size={12} className="shrink-0" /> <span className="truncate">{e.location}</span>
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
  const [openEvent, setOpenEvent] = useState(null);

  return (
    <section id="events" className="section overflow-x-hidden">
      <div className={showCalendar ? "max-w-6xl mx-auto px-5 sm:px-8" : "max-w-4xl mx-auto px-5 sm:px-8"}>
        <div ref={ref} className="reveal text-center mb-12">
          <div className="badge mb-5">Upcoming Event</div>
          <h2 className="section-title">อีเวนต์ที่กำลังจะมาถึง</h2>
        </div>

        <div className={showCalendar ? "grid lg:grid-cols-[1fr,1.1fr] gap-10 items-start" : ""}>
          <div>
            <div className="relative -mx-5 sm:-mx-8 mb-10">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-5 sm:px-8 pb-3">
                {upcomingEvents.map((e, i) => (
                  <EventCard key={e.id ?? e.title} e={e} index={i} onOpen={setOpenEvent} />
                ))}
              </div>
            </div>

            {showCalendar && (
              <div className="text-center lg:text-left mb-4">
                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mx-auto lg:mx-0 inline-flex items-center gap-2"
                >
                  ดูปฏิทินกิจกรรมทั้งหมด <ArrowRight size={16} />
                </a>
              </div>
            )}
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

      {openEvent && <EventDetailPopup event={openEvent} onClose={() => setOpenEvent(null)} />}
    </section>
  );
}
