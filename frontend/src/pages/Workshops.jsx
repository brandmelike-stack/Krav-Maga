import { useState } from "react";
import { Briefcase, Plane, ShieldAlert, Swords, Users, Zap } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import EnquiryForm from "../components/EnquiryForm";
import { IMAGES } from "../lib/data";

const CORPORATE = [
  { icon: Briefcase, t: "Workplace Safety", d: "Threat awareness, incident response and de-escalation training for your teams and premises." },
  { icon: Plane, t: "Travel Safety", d: "Protection protocols for employees travelling to unfamiliar or high-risk destinations." },
  { icon: ShieldAlert, t: "Everyday Safety", d: "Practical personal-safety habits every professional should carry into daily life." },
];

const COMBAT = [
  { icon: Swords, t: "Self-Defence Fundamentals", d: "Strikes, escapes and counters anyone can learn and rely on under pressure." },
  { icon: Users, t: "Women's Safety Intensive", d: "Focused, empowering training addressing the most common real-world threats." },
  { icon: Zap, t: "Stress & Scenario Drills", d: "Adrenaline-based training so your response holds up when it matters most." },
];

function CardGrid({ items, testid }) {
  return (
    <div className="grid md:grid-cols-3 gap-4" data-testid={testid}>
      {items.map((c, i) => (
        <Reveal key={c.t} delay={i * 0.1}>
          <div className="bg-[#151515] border border-white/10 p-8 h-full crosshair hover:border-[#FFC107]/40 transition-colors">
            <c.icon className="w-8 h-8 text-[#FFC107] mb-4" strokeWidth={1.7} />
            <h3 className="font-display text-3xl leading-none mb-3">{c.t}</h3>
            <p className="text-white/55">{c.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export default function Workshops() {
  const [tab, setTab] = useState("corporate");
  return (
    <div data-testid="workshops-page">
      <PageHero overline="Programs" title="Workshops" subtitle="Focused, high-impact training for organisations and individuals — delivered on-site or at our dojo." image={IMAGES.law2} />

      <section className="py-16 md:py-24 max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="flex gap-0 border-b border-white/10 mb-12">
          {[{ k: "corporate", l: "Corporate Workshops" }, { k: "combat", l: "Combat & Self-Defence" }].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              data-testid={`tab-${t.k}`}
              className={`font-display text-2xl md:text-3xl px-6 py-4 -mb-px border-b-2 transition-colors ${tab === t.k ? "border-[#FFC107] text-white" : "border-transparent text-white/40 hover:text-white/70"}`}
            >
              {t.l}
            </button>
          ))}
        </div>

        {tab === "corporate" ? (
          <div>
            <p className="text-white/60 max-w-2xl mb-10">Equip your workforce with the awareness and skills to stay safe at work, on the road, and everywhere in between.</p>
            <CardGrid items={CORPORATE} testid="corporate-cards" />
          </div>
        ) : (
          <div>
            <p className="text-white/60 max-w-2xl mb-10">Practical, pressure-tested self-defence for individuals and groups — built around the threats people actually face.</p>
            <CardGrid items={COMBAT} testid="combat-cards" />
          </div>
        )}
      </section>

      <section className="py-16 md:py-24 bg-[#101010] border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <div className="overline mb-3">Request a Program</div>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.92]">Bring 360° Secure to Your Team</h2>
            <p className="text-white/60 mt-5">Tell us about your organisation and goals. We'll design a workshop tailored to your people and risk profile.</p>
            <img src={IMAGES.martialDark} alt="Workshop" className="w-full h-64 object-cover img-grade border border-white/10 mt-8" />
          </Reveal>
          <Reveal delay={0.12}>
            <EnquiryForm type="corporate" lockType heading="Request Workshop" subheading="Corporate & group workshop enquiry" testid="workshop-enquiry" sourcePage="workshops" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
