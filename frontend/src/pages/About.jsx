import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageHero, CTABand } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import { IMAGES } from "../lib/data";

const PILLARS = [
  { t: "Protection from Violence", d: "Physical aggression, assault and armed threats — met with decisive, trained response." },
  { t: "Protection from Crime", d: "Theft, abduction, and opportunistic attacks — countered through awareness and preparation." },
  { t: "Protection from Aggression", d: "De-escalation, boundary-setting and control before a situation ever turns physical." },
];

export default function About() {
  return (
    <div data-testid="about-page">
      <PageHero overline="Who We Are" title="Safety Is Not a Product. It's a Discipline." subtitle="360 Degree Secure exists to make real-world safety accessible to everyone — from students to soldiers." image={IMAGES.martialDark} />

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <div className="overline mb-3">Our Mission</div>
          <h2 className="font-display text-4xl lg:text-5xl leading-[0.95] mb-6">Turning willing minds into capable protectors.</h2>
          <p className="text-white/60 leading-relaxed mb-4">We train individuals, corporates, and forces to protect themselves and others through practical, tested, no-nonsense methods. Our philosophy is simple: readiness is a choice, and it can be taught.</p>
          <p className="text-white/60 leading-relaxed">Every program is built on real scenarios, delivered with discipline, and scaled to the person in front of us — whether that's a first-time student or a frontline officer.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <img src={IMAGES.grappling} alt="Training" className="w-full h-full object-cover img-grade border border-white/10 min-h-[360px]" />
        </Reveal>
      </section>

      <section className="py-20 md:py-24 bg-[#101010] border-y border-white/10" data-testid="safety-definition">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="overline mb-4">What "Safety" Actually Means</div>
          <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] max-w-4xl mb-14">Safety is protection from violence, crime and aggression — nothing less.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.1}>
                <div className="bg-[#0A0A0A] border border-white/10 p-8 h-full crosshair">
                  <span className="font-display text-4xl text-[#FFC107]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="font-display text-3xl leading-none mt-4 mb-3">{p.t}</h3>
                  <p className="text-white/55">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 text-center">
        <Reveal>
          <div className="overline mb-4 flex justify-center">Training Philosophy</div>
          <p className="font-display text-3xl md:text-5xl leading-tight max-w-4xl mx-auto">"We do not rise to the level of our expectations. We fall to the level of our training."</p>
          <Link to="/founder" className="inline-flex btn-ghost mt-10">Meet Founder Anjan Gogoi <ArrowRight className="w-4 h-4" /></Link>
        </Reveal>
      </section>

      <CTABand />
    </div>
  );
}
