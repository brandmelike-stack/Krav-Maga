import { ShieldCheck, Crosshair, Users, Award } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import EnquiryForm from "../components/EnquiryForm";
import { IMAGES } from "../lib/data";

const CAPABILITIES = [
  { icon: Crosshair, t: "Unarmed Combat (UAC)", d: "Close-quarters control, restraint and neutralisation techniques for operational personnel." },
  { icon: ShieldCheck, t: "Threat Response", d: "Rapid decision-making and response drills for high-pressure, real-world encounters." },
  { icon: Users, t: "Squad-Level Training", d: "Coordinated team tactics for police, military and private security units." },
  { icon: Award, t: "Certified Programs", d: "Structured curricula and assessments aligned to force readiness standards." },
];

export default function LawEnforcement() {
  return (
    <div data-testid="law-enforcement-page">
      <PageHero overline="For the Forces" title="Law Enforcement & UAC Training" subtitle="Specialised tactical and unarmed-combat training for police, military, defence and security agencies." image={IMAGES.train5} />

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8">
        <Reveal>
          <div className="overline mb-3">Built for Operational Readiness</div>
          <h2 className="font-display text-4xl lg:text-6xl leading-[0.95] max-w-4xl mb-6">When the stakes are absolute, training cannot be theoretical.</h2>
          <p className="text-white/60 max-w-3xl">Our law-enforcement programs are designed with a single objective: measurable capability under real operational stress. We work alongside agencies to build curricula that fit their mission, personnel and constraints.</p>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-4 mt-14">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div className="bg-[#151515] border border-white/10 p-6 h-full crosshair">
                <c.icon className="w-7 h-7 text-[#FFC107] mb-4" strokeWidth={1.7} />
                <h3 className="font-display text-2xl leading-none mb-2">{c.t}</h3>
                <p className="text-white/55 text-sm">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative py-20 overflow-hidden border-y border-white/10">
        <img src={IMAGES.train1} alt="Tactical firearm disarm training" className="absolute inset-0 w-full h-full object-cover img-grade opacity-40" />
        <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 grid md:grid-cols-4 gap-8 text-center">
          {[["100%", "Field-Focused"], ["Custom", "Curricula"], ["All", "Force Levels"], ["On-Site", "Delivery"]].map(([n, l]) => (
            <Reveal key={l}>
              <div className="font-display text-5xl md:text-6xl text-[#FFC107]">{n}</div>
              <div className="overline mt-2 text-white/70">{l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-start">
        <Reveal>
          <div className="overline mb-3">Institutional Enquiry</div>
          <h2 className="font-display text-5xl lg:text-6xl leading-[0.92]">Enquire About Institutional Training</h2>
          <p className="text-white/60 mt-5">Share your agency's requirements and we'll respond with a tailored proposal and scheduling options.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <EnquiryForm type="institutional" lockType heading="Institutional Enquiry" subheading="Police · Military · Security agencies" testid="law-enquiry" sourcePage="law-enforcement" />
        </Reveal>
      </section>
    </div>
  );
}
