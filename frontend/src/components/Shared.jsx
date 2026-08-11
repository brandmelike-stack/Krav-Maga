import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export function PageHero({ overline, title, subtitle, image, height = "h-[70vh]" }) {
  return (
    <section className={`relative ${height} min-h-[420px] flex items-end overflow-hidden`} data-testid="page-hero">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover img-grade" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/30" />
      <div className="absolute inset-0 tac-grid opacity-[0.15]" />
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 pb-14 w-full">
        {overline && <div className="overline mb-4">{overline}</div>}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl leading-[0.95] max-w-4xl">{title}</h1>
        {subtitle && <p className="text-white/60 max-w-2xl mt-5 text-base md:text-lg">{subtitle}</p>}
      </div>
    </section>
  );
}

export function SectionHeading({ overline, title, className = "" }) {
  return (
    <Reveal className={className}>
      {overline && <div className="overline mb-3">{overline}</div>}
      <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">{title}</h2>
    </Reveal>
  );
}

export function CTABand() {
  return (
    <section className="relative py-20 md:py-28 bg-[#FFC107] text-black overflow-hidden" data-testid="cta-band">
      <div className="absolute inset-0 opacity-[0.08] tac-grid" style={{ filter: "invert(1)" }} />
      <div className="relative max-w-[1400px] mx-auto px-5 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.28em] mb-3">Ready When You Are</div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-2xl">Train like your life depends on it. Because one day it might.</h2>
        </div>
        <Link to="/krav-maga" className="bg-black text-white font-bold uppercase tracking-widest px-8 py-4 hover:bg-[#151515] transition-colors whitespace-nowrap" data-testid="cta-band-button">
          Claim Your Free Trial
        </Link>
      </div>
    </section>
  );
}
