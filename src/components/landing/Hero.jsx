import { ArrowRight, Compass } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { useReveal } from "../../hooks/useReveal";

const journey = ["Grow in Faith", "Build Friendships", "Find Christ"];

export default function Hero() {
  const { content } = useContent();
  const { hero_title_line1, hero_title_line2, hero_tagline } = content.settings;
  const ref = useReveal();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* ambient gradient wash */}
      <div
        className="absolute inset-0 -z-20"
        style={{ background: "linear-gradient(180deg,#FFFDFB 0%,#FBF3FF 45%,#FFF7EA 100%)" }}
      />

      {/* floating blobs */}
      <div className="blob w-[420px] h-[420px] -top-24 -left-24 animate-floatSlow" style={{ background: "#A855F7" }} />
      <div className="blob w-[360px] h-[360px] top-1/3 -right-20 animate-float" style={{ background: "#F59E0B" }} />
      <div className="blob w-[300px] h-[300px] bottom-0 left-1/4 animate-floatSlow" style={{ background: "#EC4899", opacity: 0.35 }} />

      <div className="max-w-6xl w-full mx-auto px-5 sm:px-8 relative grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
        <div ref={ref} className="reveal">
          <div className="badge mb-6">
            <Compass size={14} />
            Media &amp; Communications · NU Christian Club
          </div>

          <p className="font-display text-[15px] tracking-[0.35em] text-pine-800 font-semibold mb-2">
            {hero_tagline}
          </p>
          <h1 className="font-display text-[13vw] leading-[0.98] sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6">
            {hero_title_line1}
            <br />
            <span className="gradient-text">{hero_title_line2}</span>
          </h1>

          <ul className="space-y-2 mb-9">
            {journey.map((line, i) => (
              <li
                key={line}
                className={`reveal reveal-delay-${i + 1} flex items-center gap-3 text-[17px] sm:text-lg text-gray-700 font-medium`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--gradient-brand)" }} />
                {line}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo("about")} className="btn-primary">
              Learn More <ArrowRight size={17} />
            </button>
            <button onClick={() => scrollTo("activities")} className="btn-secondary">
              Our Activities
            </button>
          </div>
        </div>

        {/* Signature visual: sunrise breaking over the campus skyline —
            echoes "Find Home. Find Hope. Find Christ." as a visual journey
            from dusk (purple) into dawn (gold). */}
        <div className="reveal reveal-delay-2 relative aspect-[4/5] w-full max-w-md mx-auto">
          <div className="absolute inset-0 rounded-[2.5rem] glass shadow-2xl overflow-hidden">
            <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMax slice">
              <defs>
                <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="55%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <radialGradient id="sun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF7DA" />
                  <stop offset="60%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="400" height="500" fill="url(#sky)" />
              <circle cx="200" cy="300" r="140" fill="url(#sun)" />
              <circle cx="200" cy="300" r="60" fill="#FFFBEB" opacity="0.9" />
              {/* campus skyline silhouette */}
              <g fill="#5B21B6" opacity="0.9">
                <rect x="0" y="420" width="60" height="80" />
                <rect x="55" y="380" width="50" height="120" />
                <rect x="100" y="400" width="40" height="100" />
                <polygon points="140,400 170,360 200,400" />
                <rect x="170" y="400" width="60" height="100" />
                <rect x="235" y="390" width="45" height="110" />
                <rect x="280" y="360" width="55" height="140" />
                <polygon points="280,360 307,320 335,360" />
                <rect x="340" y="410" width="60" height="90" />
              </g>
              {/* birds */}
              <g stroke="#FFFBEB" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85">
                <path d="M60 150 q10 -12 20 0 q10 -12 20 0" />
                <path d="M110 190 q8 -10 16 0 q8 -10 16 0" />
              </g>
            </svg>
          </div>
          <div className="absolute -bottom-5 -left-5 glass rounded-2xl px-5 py-3 shadow-lg">
            <p className="font-display text-sm font-bold text-pine-800">Find Home. Find Hope.</p>
            <p className="text-xs text-gray-500">Find Christ.</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 horizon-divider" />
    </section>
  );
}
