import { useState } from "react";
import { Camera, Users, Music2, X as XIcon, Mail, MapPin, Sun, User, Link2, ArrowUpRight, PlayCircle, MessageCircle } from "lucide-react";
import { useContent } from "../../context/ContentContext";
import { toEmbeddableMapsUrl } from "../../lib/mapsUrl";

const ICONS = { instagram: Camera, facebook: Users, music2: Music2, x: XIcon };

function ContactTab({ settings, mapUrl }) {
  return (
    <div className="grid sm:grid-cols-2 gap-10 text-white/85">
      <div className="space-y-4">
        <div>
          <p className="font-semibold text-white mb-2 text-sm tracking-wide">ที่ตั้ง</p>
          {settings.google_maps_embed_url ? (
            <a
              href={settings.google_maps_embed_url}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 text-sm leading-relaxed hover:text-white hover:underline w-fit"
            >
              <MapPin size={15} className="shrink-0 mt-0.5" /> {settings.contact_address}
            </a>
          ) : (
            <p className="flex items-start gap-2 text-sm leading-relaxed">
              <MapPin size={15} className="shrink-0 mt-0.5" /> {settings.contact_address}
            </p>
          )}
        </div>
        {settings.contact_person_name && (
          <div>
            <p className="font-semibold text-white mb-2 text-sm tracking-wide">
              {settings.contact_person_role || "ผู้ดูแล"}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <User size={15} /> {settings.contact_person_name}
            </p>
          </div>
        )}
        <div>
          <p className="font-semibold text-white mb-2 text-sm tracking-wide">ติดต่อ</p>
          <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 text-sm hover:text-white">
            <Mail size={15} /> {settings.contact_email}
          </a>
        </div>
      </div>

      {mapUrl && (
        <div className="rounded-3xl overflow-hidden border border-white/15">
          <iframe
            title="แผนที่ NU Christian Club"
            src={mapUrl}
            className="w-full"
            style={{ border: 0, height: "260px" }}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

function PartnerSocialIcon({ href, label, Icon }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={label}
      className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
    >
      <Icon size={14} />
    </a>
  );
}

function NetworkTab({ partners }) {
  if (!partners.length) {
    return (
      <p className="text-sm text-white/60 py-6">
        ยังไม่มีข้อมูลเครือข่ายความร่วมมือ — แอดมินเพิ่มได้ที่เมนู "เครือข่ายความร่วมมือ" ในหลังบ้าน
      </p>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {partners.map((p) => {
        const mapUrl = toEmbeddableMapsUrl(p.map_embed_url);
        return (
          <div
            key={p.id ?? p.name}
            className="rounded-2xl bg-white/10 hover:bg-white/15 transition-colors p-5 flex flex-col gap-1.5"
          >
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white text-sm flex items-center gap-1.5 hover:underline w-fit"
              >
                {p.name}
                <ArrowUpRight size={13} />
              </a>
            ) : (
              <p className="font-semibold text-white text-sm">{p.name}</p>
            )}
            {p.description && <p className="text-white/70 text-xs leading-relaxed">{p.description}</p>}

            {(p.fb_link || p.line_link || p.youtube_link) && (
              <div className="flex items-center gap-2 mt-2">
                <PartnerSocialIcon href={p.fb_link} label="Facebook" Icon={Users} />
                <PartnerSocialIcon href={p.line_link} label="Line" Icon={MessageCircle} />
                <PartnerSocialIcon href={p.youtube_link} label="YouTube" Icon={PlayCircle} />
              </div>
            )}

            {mapUrl && (
              <div className="rounded-xl overflow-hidden border border-white/15 mt-3">
                <iframe
                  title={`แผนที่ ${p.name}`}
                  src={mapUrl}
                  className="w-full"
                  style={{ border: 0, height: "160px" }}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Footer() {
  const { content } = useContent();
  const { socials, settings, networkPartners = [] } = content;
  const year = new Date().getFullYear();
  const mapUrl = toEmbeddableMapsUrl(settings.google_maps_embed_url);
  const activePartners = networkPartners.filter((p) => p.is_active !== false);
  const [tab, setTab] = useState("contact");

  return (
    <footer id="contact" className="relative isolate pt-20 pb-10 overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(160deg,#5B21B6,#7C3AED 55%,#EC4899 100%)" }}
      />
      <div className="blob w-[300px] h-[300px] -bottom-20 -right-10" style={{ background: "#F59E0B", opacity: 0.35 }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            พร้อมมาเป็นครอบครัวเดียวกันหรือยัง?
          </h2>
          <p className="text-white/80 max-w-lg mx-auto">
            ทักหาเราได้ในช่องทางด้านล่างนี้ หรือกดปุ่ม Join Club ด้านบนของหน้าเว็บ
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex items-center gap-2.5 mr-auto">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Sun size={16} className="text-white" />
            </div>
            <p className="font-display font-bold text-white hidden sm:block">NU Christian Club</p>
          </div>
          <div className="flex gap-2">
            {[
              { key: "contact", label: "ติดต่อ" },
              { key: "network", label: "เครือข่าย" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  tab === t.key ? "bg-white text-pine-900" : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          {tab === "contact" ? (
            <ContactTab settings={settings} mapUrl={mapUrl} />
          ) : (
            <NetworkTab partners={activePartners} />
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-10 text-white/85 mb-12">
          <div>
            <p className="font-semibold text-white mb-4 text-sm tracking-wide">SOCIAL</p>
            <div className="flex gap-2.5">
              {socials.map((item) => {
                const Icon = ICONS[item.icon] || Link2;
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
            <p className="font-semibold text-white mb-4 text-sm tracking-wide">EXPLORE</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href="#activities" className="hover:text-white">Activities</a>
              <a href="#gallery" className="hover:text-white">Gallery</a>
              <a href="#team" className="hover:text-white">Team</a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/15 pt-6 text-center text-white/60 text-xs">
          © {year} NU Christian Club — The PR
        </div>
      </div>
    </footer>
  );
}
