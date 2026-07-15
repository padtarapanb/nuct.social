import { useEffect, useRef, useState } from "react";
import { Menu, X, Sun, ChevronDown } from "lucide-react";
import { useContent } from "../../context/ContentContext";

// แถบหลัก (โชว์ตลอด) — เหลือแค่เมนูที่คนกดบ่อยสุด/สำคัญสุด
const PRIMARY_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "activities", label: "Activities" },
  { id: "events", label: "Events" },
  { id: "contact", label: "Contact" },
];

// แถบรอง — ยุบไว้ใต้เมนู "เพิ่มเติม" กันแถบยาวเป็นพืด (Gallery/Team/Awards/Media
// เป็นหมวดที่คนดูเรื่อย ๆ ไม่ใช่เมนูที่ต้องกดถี่เท่า 5 อันด้านบน)
const MORE_LINKS = [
  { id: "gallery", label: "Gallery" },
  { id: "team", label: "Team" },
  { id: "achievements", label: "Awards" },
  { id: "connect", label: "Media" },
];

const ALL_LINKS = [...PRIMARY_LINKS.slice(0, 4), ...MORE_LINKS, ...PRIMARY_LINKS.slice(4)];

export default function Navbar() {
  const { content } = useContent();
  const joinUrl = content.settings.lineOAUrl || "#";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const moreRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const onClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [moreOpen]);

  const scrollTo = (id) => {
    setOpen(false);
    setMoreOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? "glass shadow-sm py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-3"
        >
          {logoError ? (
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899,#F59E0B)" }}
            >
              <Sun size={18} className="text-white" strokeWidth={2.4} />
            </div>
          ) : (
            <img
              src="/favicon.png"
              alt="NU Christian Club"
              className="h-10 w-10 object-contain shrink-0"
              onError={() => setLogoError(true)}
            />
          )}
          <div className="leading-tight text-left">
            <p className="font-display text-[16px] font-bold text-gray-900">NU Christian Club</p>
            <p className="text-[11px] text-gray-500 -mt-0.5">Naresuan University</p>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {PRIMARY_LINKS.slice(0, 4).map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="px-4 py-2 rounded-full text-[14px] font-medium text-gray-600 hover:text-pine-800 hover:bg-pine-50 transition-colors"
            >
              {l.label}
            </button>
          ))}

          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="px-4 py-2 rounded-full text-[14px] font-medium text-gray-600 hover:text-pine-800 hover:bg-pine-50 transition-colors flex items-center gap-1"
              aria-expanded={moreOpen}
            >
              More
              <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 glass rounded-2xl shadow-lg p-1.5 flex flex-col min-w-[140px] z-10">
                {MORE_LINKS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => scrollTo(l.id)}
                    className="text-left px-3.5 py-2 rounded-xl text-[14px] font-medium text-gray-600 hover:text-pine-800 hover:bg-pine-50 transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {PRIMARY_LINKS.slice(4).map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="px-4 py-2 rounded-full text-[14px] font-medium text-gray-600 hover:text-pine-800 hover:bg-pine-50 transition-colors"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:block">
          <a
            href={joinUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary !px-6 !py-2.5 text-[14px] inline-block"
          >
            Join Club
          </a>
        </div>

        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-pine-50 text-gray-700"
          onClick={() => setOpen((v) => !v)}
          aria-label="เมนู"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass mt-2 mx-4 rounded-3xl p-4 flex flex-col gap-1 shadow-lg max-h-[75vh] overflow-y-auto">
          {ALL_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="text-left px-4 py-3 rounded-2xl text-[15px] font-medium text-gray-700 hover:bg-pine-50 hover:text-pine-800"
            >
              {l.label}
            </button>
          ))}
          <a
            href={joinUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-2 text-[14px] !py-3 text-center inline-block"
          >
            Join Club
          </a>
        </div>
      )}
    </header>
  );
}
