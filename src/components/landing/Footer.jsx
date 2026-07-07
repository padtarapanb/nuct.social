import { Camera, Users, Music2, X as XIcon, Mail, MapPin, Sun } from "lucide-react";
import { useContent } from "../../context/ContentContext";

const ICONS = { instagram: Camera, facebook: Users, music2: Music2, x: XIcon };

// อนุญาตเฉพาะลิงก์ฝังของ Google Maps จริง ๆ เท่านั้น (กัน URL แปลกปลอมจากช่อง settings)
function isValidGoogleMapsUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "www.google.com" && parsed.pathname.startsWith("/maps/embed");
  } catch {
    return false;
  }
}

export default function Footer() {
  const { content } = useContent();
  const { socials, settings } = content;
  const year = new Date().getFullYear();
  const showMap = isValidGoogleMapsUrl(settings.google_maps_embed_url);

  return (
    <footer id="contact" className="relative pt-20 pb-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(160deg,#5B21B6,#7C3AED 55%,#EC4899 100%)" }}
      />
      <div className="blob w-[300px] h-[300px] -bottom-20 -right-10" style={{ background: "#F59E0B", opacity: 0.35 }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            พร้อมมาเป็นครอบครัวเดียวกันหรือยัง?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto">
            ทักหาเราได้ในช่องทางด้านล่างนี้ หรือกดปุ่ม Join Club ด้านบนของหน้าเว็บ
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-white/85 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Sun size={16} className="text-white" />
              </div>
              <p className="font-display font-bold text-white">NU Christian Club</p>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Find Home.
              <br />
              Find Hope.
              <br />
              Find Christ.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm tracking-wide">SOCIAL</p>
            <div className="flex gap-2.5">
              {socials.map((item) => {
                const Icon = ICONS[item.icon] || Camera;
                return (
                  <a
                    key={item.id ?? item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.name}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm tracking-wide">CONTACT</p>
            <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 text-sm mb-3 hover:text-white">
              <Mail size={15} /> {settings.contact_email}
            </a>
            <p className="flex items-center gap-2 text-sm">
              <MapPin size={15} /> {settings.contact_address}
            </p>
          </div>

          <div>
            <p className="font-semibold text-white mb-4 text-sm tracking-wide">EXPLORE</p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="#activities" className="hover:text-white">Activities</a>
              <a href="#gallery" className="hover:text-white">Gallery</a>
              <a href="#team" className="hover:text-white">Team</a>
            </div>
          </div>
        </div>

        {showMap && (
          <div className="rounded-3xl overflow-hidden border border-white/15 mb-12">
            <iframe
              title="แผนที่ NU Christian Club"
              src={settings.google_maps_embed_url}
              className="w-full grayscale-0"
              style={{ border: 0, height: "280px" }}
              loading="lazy"
            />
          </div>
        )}

        <div className="border-t border-white/15 pt-6 text-center text-white/60 text-xs">
          © {year} NU Christian Club — The PR
        </div>
      </div>
    </footer>
  );
}
