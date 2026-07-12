import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToFaq = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToFaq}
      className={`fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full pl-4 pr-5 py-3.5 text-white font-semibold text-sm shadow-xl transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
    >
      <HelpCircle size={18} />
      FAQ
    </button>
  );
}
