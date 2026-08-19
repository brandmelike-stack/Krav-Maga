import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Marquee from "react-fast-marquee";
import { ArrowRight, Shield, Swords, Building2, Target, ChevronRight, Quote } from "lucide-react";
import { MaskLine, Reveal } from "../components/Reveal";
import { CTABand } from "../components/Shared";
import { IMAGES, CATEGORY_LABELS } from "../lib/data";
import api from "../lib/api";

const SPECIALIZATIONS = [
  { icon: Swords, title: "Krav Maga", desc: "The world's most practical combat system. Instinctive, brutal, effective.", to: "/krav-maga", img: IMAGES.grappling, span: "md:col-span-2 md:row-span-2" },
  { icon: Building2, title: "Corporate Safety", desc: "Workplace, travel & executive protection training for teams.", to: "/workshops", img: IMAGES.martialDark, span: "" },
  { icon: Shield, title: "Self-Defence", desc: "Real-world defence for men, women, teens & students.", to: "/workshops", img: IMAGES.g2, span: "" },
  { icon: Target, title: "Law Enforcement", desc: "Tactical & UAC training for police, military & security forces.", to: "/law-enforcement", img: IMAGES.law1, span: "md:col-span-2" },
];

const WHY = [
  { n: "01", t: "Field-Tested Methods", d: "No choreography. Every technique is pressure-tested against real aggression and stress." },
  { n: "02", t: "Founder-Led Training", d: "Learn directly under Anjan Gogoi — certified, experienced, uncompromising." },
  { n: "03", t: "For Every Body", d: "Programs scaled for civilians, corporates, students and elite forces alike." },
  { n: "04", t: "Mindset First", d: "We build willing minds. Awareness and decisiveness beat raw strength every time." },
];

export default function Home() {
  const [workshops, setWorkshops] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.12]);

  useEffect(() => {
    api.get("/workshops").then((r) => setWorkshops(r.data.slice(0, 3))).catch(() => {});
    api.get("/testimonials").then((r) => setTestimonials(r.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="home-page">
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center overflow-hidden">
        <motion.img
          style={{ y: heroY, scale: heroScale }}
          src={IMAGES.founderDemo}
          alt="360 Degree Secure live training demonstration"
          className="absolute inset-0 w-full h-full object-cover object-center img-grade"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/30 to-[#0A0A0A]/50" />
        <div className="absolute inset-0 tac-grid opacity-[0.12]" />

        <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="overline mb-6">
            Safety · Self-Defense · Krav Maga · Tactical
          </motion.div>
          <h1 className="font-display text-[15vw] sm:text-8xl lg:text-[9rem] leading-[0.86] max-w-5xl">
            <MaskLine delay={0.1}>Nothing is</MaskLine>
            <MaskLine delay={0.25}>Impossible to a</MaskLine>
            <MaskLine delay={0.4} className="text-[#FFC107]">Willing Mind</MaskLine>
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }} className="text-white/70 max-w-xl mt-8 text-base md:text-lg">
            Elite, real-world safety training for individuals, corporates and forces. Built for readiness. Forged for the moment it matters.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7 }} className="flex flex-wrap gap-4 mt-10">
            <Link to="/krav-maga" className="btn-amber crosshair" data-testid="hero-primary-cta">Claim Your Free Trial <ArrowRight className="w-4 h-4" /></Link>
            <Link to="/workshops" className="btn-ghost" data-testid="hero-secondary-cta">Explore Workshops</Link>
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="border-y border-white/10 bg-[#0A0A0A] py-5" data-testid="marquee">
        <Marquee speed={45} gradient={false}>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-display text-3xl md:text-4xl tracking-wide mx-8 text-white/80 flex items-center gap-8">
              360° SECURE <span className="text-[#FFC107]">✦</span> READINESS IS A CHOICE <span className="text-[#FFC107]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      {/* SPECIALIZATIONS */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8" data-testid="specializations">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="overline mb-3">What We Train</div>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] max-w-xl">Four Disciplines. One Standard: Ready.</h2>
          </div>
          <Link to="/about" className="text-[#FFC107] font-semibold uppercase tracking-wider text-sm flex items-center gap-2 hover:gap-3 transition-all">Our Philosophy <ArrowRight className="w-4 h-4" /></Link>
        </div>

        <div className="grid md:grid-cols-4 gap-4 auto-rows-[220px]">
          {SPECIALIZATIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className={s.span}>
              <Link to={s.to} className="group relative block w-full h-full overflow-hidden border border-white/10 crosshair" data-testid={`spec-${s.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover img-grade group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
                <div className="relative h-full p-6 flex flex-col justify-end">
                  <s.icon className="w-7 h-7 text-[#FFC107] mb-3" strokeWidth={1.8} />
                  <h3 className="font-display text-3xl leading-none">{s.title}</h3>
                  <p className="text-white/60 text-sm mt-2 max-w-xs">{s.desc}</p>
                  <span className="text-[#FFC107] text-sm font-semibold uppercase tracking-wider mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Learn more <ChevronRight className="w-4 h-4" /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* WORKSHOPS */}
      <section className="py-20 md:py-28 bg-[#101010] border-y border-white/10" data-testid="home-workshops">
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="overline mb-3">On the Calendar</div>
              <h2 className="font-display text-5xl lg:text-6xl leading-[0.95]">Upcoming Workshops</h2>
            </div>
            <Link to="/workshops" className="hidden sm:flex text-[#FFC107] font-semibold uppercase tracking-wider text-sm items-center gap-2 hover:gap-3 transition-all">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {workshops.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.1}>
                <div className="group bg-[#0A0A0A] border border-white/10 p-6 h-full flex flex-col hover:border-[#FFC107]/40 transition-colors crosshair" data-testid="workshop-card">
                  <div className="flex justify-between items-start mb-4">
                    <span className="overline">{CATEGORY_LABELS[w.category] || w.category}</span>
                    <span className="text-[#FFC107] font-display text-2xl">{new Date(w.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</span>
                  </div>
                  <h3 className="font-display text-3xl leading-none mb-3">{w.title}</h3>
                  <p className="text-white/55 text-sm flex-1">{w.description}</p>
                  <div className="text-white/40 text-xs uppercase tracking-wider mt-5">{w.location}</div>
                  <Link to="/contact" className="text-[#FFC107] text-sm font-semibold uppercase tracking-wider mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">Enquire <ArrowRight className="w-4 h-4" /></Link>
                </div>
              </Reveal>
            ))}
            {workshops.length === 0 && <p className="text-white/40">No workshops scheduled yet — check back soon.</p>}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - manifesto */}
      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8" data-testid="why-choose-us">
        <div className="overline mb-3">Why Choose 360° Secure</div>
        <h2 className="font-display text-5xl lg:text-7xl leading-[0.92] max-w-3xl mb-14">We don't teach moves. We build readiness.</h2>
        <div className="grid md:grid-cols-2 gap-x-12">
          {WHY.map((w, i) => (
            <Reveal key={w.n} delay={i * 0.08}>
              <div className="flex gap-6 py-8 border-t border-white/10">
                <span className="font-display text-5xl text-[#FFC107] leading-none">{w.n}</span>
                <div>
                  <h3 className="font-display text-3xl leading-none mb-2">{w.t}</h3>
                  <p className="text-white/55">{w.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="py-20 md:py-28 bg-[#101010] border-y border-white/10" data-testid="testimonials">
          <div className="max-w-[1400px] mx-auto px-5 md:px-8">
            <div className="overline mb-3">What They Say</div>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] max-w-2xl mb-14">Trusted by students, corporates & forces.</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {testimonials.slice(0, 6).map((t, i) => (
                <Reveal key={t.id} delay={i * 0.08}>
                  <div className="bg-[#0A0A0A] border border-white/10 p-7 h-full flex flex-col crosshair" data-testid="testimonial-card">
                    <Quote className="w-8 h-8 text-[#FFC107] mb-4" strokeWidth={1.6} />
                    <p className="text-white/75 leading-relaxed flex-1">“{t.quote}”</p>
                    <div className="mt-6 pt-5 border-t border-white/10">
                      <div className="font-display text-2xl leading-none">{t.name}</div>
                      {t.role && <div className="overline mt-1">{t.role}</div>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABand />
    </div>
  );
}
