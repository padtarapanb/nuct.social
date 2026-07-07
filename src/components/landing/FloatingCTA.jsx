import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useContent } from "../../context/ContentContext";

export default function FloatingCTA() {
  const { content } = useContent();
  const lineOAUrl = content.settings.lineOAUrl;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={lineOAUrl}
      target="_blank"
      rel="noreferrer"
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full pl-4 pr-5 py-3.5 text-white font-semibold text-sm shadow-xl transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
    >
      <MessageCircle size={18} />
      Join Club
    </a>
  );
}
