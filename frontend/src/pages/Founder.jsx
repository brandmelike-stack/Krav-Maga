import { Link } from "react-router-dom";
import { Award, Target, Users, ArrowRight } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import { IMAGES } from "../lib/data";

const CREDS = [
  { icon: Award, t: "Certified Instructor", d: "Krav Maga & tactical defense certifications with a commitment to continuous training." },
  { icon: Users, t: "Trained Hundreds", d: "Civilians, corporate teams and law-enforcement personnel across the region." },
  { icon: Target, t: "Field Experience", d: "Real-world scenario training grounded in practical, tested methodology." },
];

export default function Founder() {
  return (
    <div data-testid="founder-page">
      <PageHero overline="Meet the Founder" title="Anjan Gogoi" subtitle="Instructor. Practitioner. Builder of willing minds." image={IMAGES.martialDark} />

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-5 gap-12">
        <Reveal className="lg:col-span-2">
          <div className="relative">
            <img src={IMAGES.train4} alt="Anjan Gogoi briefing recruits at a training session" className="w-full object-cover object-center img-grade border border-white/10 aspect-[4/5]" />
            <div className="absolute -bottom-4 -right-4 bg-[#FFC107] text-black px-5 py-3 font-display text-2xl">FOUNDER</div>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-3">
          <div className="overline mb-3">The Story</div>
          <h2 className="font-display text-4xl lg:text-5xl leading-[0.95] mb-6">Driven by a single belief: everyone deserves to feel safe.</h2>
          <p className="text-white/60 leading-relaxed mb-4">Anjan Gogoi is a certified Krav Maga and tactical defense instructor with years of field-tested experience training civilians, corporates, and law enforcement personnel. He founded 360 Degree Secure to close the gap between how people think about safety and how threats actually unfold.</p>
          <p className="text-white/60 leading-relaxed mb-8">His approach strips away ego and theatrics, focusing on what genuinely works under stress — and on building the mindset that makes those skills usable when it counts.</p>

          <div className="grid sm:grid-cols-3 gap-4">
            {CREDS.map((c, i) => (
              <div key={c.t} className="bg-[#151515] border border-white/10 p-5 crosshair">
                <c.icon className="w-6 h-6 text-[#FFC107] mb-3" strokeWidth={1.8} />
                <h3 className="font-display text-xl leading-none mb-2">{c.t}</h3>
                <p className="text-white/50 text-sm">{c.d}</p>
              </div>
            ))}
          </div>

          <Link to="/krav-maga" className="btn-amber mt-10 crosshair">Train With Anjan <ArrowRight className="w-4 h-4" /></Link>
        </Reveal>
      </section>
    </div>
  );
}
