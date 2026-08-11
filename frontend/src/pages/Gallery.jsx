import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import { IMAGES } from "../lib/data";
import api from "../lib/api";

const FALLBACK = [
  { url: IMAGES.founderDemo, title: "Live Demonstration", media_type: "image", category: "Demo", span: "md:col-span-2 md:row-span-2" },
  { url: IMAGES.train3, title: "Knife Defense Drill", media_type: "image", category: "Combat", span: "" },
  { url: IMAGES.train4, title: "Briefing the Squad", media_type: "image", category: "Founder", span: "" },
  { url: IMAGES.train1, title: "Firearm Disarm", media_type: "image", category: "Law Enforcement", span: "md:col-span-2" },
  { url: IMAGES.train2, title: "Ground Control", media_type: "image", category: "Combat", span: "" },
  { url: IMAGES.train5, title: "Weapon Threat Response", media_type: "image", category: "Tactical", span: "" },
  { url: IMAGES.grappling, title: "Krav Maga Sparring", media_type: "image", category: "Krav Maga", span: "md:col-span-2" },
  { url: IMAGES.g1, title: "Discipline", media_type: "image", category: "Training", span: "" },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/gallery").then((r) => {
      const data = r.data || [];
      setItems(data.length ? data.map((d, i) => ({ ...d, span: FALLBACK[i % FALLBACK.length].span })) : FALLBACK);
    }).catch(() => setItems(FALLBACK));
  }, []);

  return (
    <div data-testid="gallery-page">
      <PageHero overline="In the Field" title="Gallery" subtitle="Moments from the mat, the dojo and the field. This is what readiness looks like." image={IMAGES.g1} height="h-[55vh]" />

      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-4 gap-3 auto-rows-[220px]" data-testid="gallery-grid">
          {items.map((it, i) => (
            <Reveal key={it.id || i} delay={(i % 4) * 0.06} className={it.span || ""}>
              <div className="group relative w-full h-full overflow-hidden border border-white/10 crosshair" data-testid="gallery-item">
                <img src={it.url} alt={it.title} className="absolute inset-0 w-full h-full object-cover img-grade group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {it.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 border-2 border-[#FFC107] flex items-center justify-center bg-black/40"><Play className="w-6 h-6 text-[#FFC107]" /></div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="overline">{it.category || "Training"}</div>
                  <div className="font-display text-2xl leading-none">{it.title}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
