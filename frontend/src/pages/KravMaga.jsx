import { Check, Clock, Users } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import EnquiryForm from "../components/EnquiryForm";
import { IMAGES } from "../lib/data";

const LEARN = [
  "Instinctive strikes, blocks and counters",
  "Escapes from grabs, chokes and holds",
  "Defence against armed & multiple attackers",
  "Situational awareness & threat recognition",
  "Ground defence and getting back to your feet",
  "Controlled aggression under stress",
];

const BATCHES = [
  { name: "Morning Batch", time: "06:30 – 08:00 AM", days: "Mon · Wed · Fri" },
  { name: "Evening Batch", time: "06:00 – 07:30 PM", days: "Tue · Thu · Sat" },
  { name: "Weekend Intensive", time: "09:00 – 11:00 AM", days: "Sat · Sun" },
];

export default function KravMaga() {
  return (
    <div data-testid="krav-maga-page">
      <PageHero overline="The Dojo" title="Krav Maga" subtitle="The world's most practical combat system — developed for real violence, taught for real people." image={IMAGES.grappling} />

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-16">
        <Reveal>
          <div className="overline mb-3">What It Is</div>
          <h2 className="font-display text-4xl lg:text-5xl leading-[0.95] mb-5">No rules. No rituals. Just what works.</h2>
          <p className="text-white/60 leading-relaxed mb-4">Krav Maga is a combat system built on instinct, aggression and efficiency. There are no belts to chase and no forms to memorize — only techniques designed to neutralize threats and get you home safe.</p>
          <p className="text-white/60 leading-relaxed">At our dojo you'll train under pressure, in realistic scenarios, at a pace that meets you where you are.</p>

          <div className="mt-10">
            <div className="overline mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Who Can Join</div>
            <p className="text-white/60">Men, women, teens and students — no prior experience required. Every session is scaled to your fitness and comfort level.</p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="bg-[#151515] border border-white/10 p-8">
            <div className="overline mb-6">What You'll Learn</div>
            <ul className="space-y-4">
              {LEARN.map((l) => (
                <li key={l} className="flex items-start gap-3 text-white/75">
                  <Check className="w-5 h-5 text-[#FFC107] mt-0.5 shrink-0" /> {l}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="py-16 bg-[#101010] border-y border-white/10" data-testid="batch-timings">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="overline mb-3 flex items-center gap-2"><Clock className="w-4 h-4" /> Batch Timings</div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {BATCHES.map((b, i) => (
              <Reveal key={b.name} delay={i * 0.1}>
                <div className="bg-[#0A0A0A] border border-white/10 p-6 crosshair">
                  <h3 className="font-display text-3xl leading-none mb-2">{b.name}</h3>
                  <p className="text-[#FFC107] font-semibold">{b.time}</p>
                  <p className="text-white/50 text-sm uppercase tracking-wider mt-1">{b.days}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 items-start">
        <Reveal>
          <div className="overline mb-3">Your First Class Is On Us</div>
          <h2 className="font-display text-5xl lg:text-6xl leading-[0.92]">Claim Your Free Trial Class</h2>
          <p className="text-white/60 mt-5">Book a no-obligation trial session. Come as you are, leave more capable than you arrived.</p>
          <img src={IMAGES.heroKrav} alt="Krav Maga" className="w-full h-64 object-cover img-grade border border-white/10 mt-8" />
        </Reveal>
        <Reveal delay={0.12}>
          <EnquiryForm type="free_trial" lockType heading="Book Free Trial" subheading="Krav Maga trial class enquiry" testid="krav-enquiry" sourcePage="krav-maga" />
        </Reveal>
      </section>
    </div>
  );
}
