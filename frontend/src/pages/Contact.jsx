import { Phone, Mail, MapPin, Instagram, Facebook, Clock } from "lucide-react";
import { PageHero } from "../components/Shared";
import { Reveal } from "../components/Reveal";
import EnquiryForm from "../components/EnquiryForm";
import { IMAGES } from "../lib/data";

const DETAILS = [
  { icon: Phone, label: "Call", value: "+91 98640 00000" },
  { icon: Mail, label: "Email", value: "train@360degreesecure.com" },
  { icon: MapPin, label: "Location", value: "Guwahati, Assam, India" },
  { icon: Clock, label: "Hours", value: "Mon–Sat · 06:00 AM – 08:00 PM" },
];

export default function Contact() {
  return (
    <div data-testid="contact-page">
      <PageHero overline="Get in Touch" title="Contact Us" subtitle="Questions, enquiries, or ready to train? We're here." image={IMAGES.g6} height="h-[55vh]" />

      <section className="py-20 md:py-28 max-w-[1400px] mx-auto px-5 md:px-8 grid lg:grid-cols-5 gap-12">
        <Reveal className="lg:col-span-2">
          <div className="overline mb-3">Reach Us</div>
          <h2 className="font-display text-4xl lg:text-5xl leading-[0.95] mb-8">Let's talk safety.</h2>
          <div className="space-y-5">
            {DETAILS.map((d) => (
              <div key={d.label} className="flex items-start gap-4 border-b border-white/10 pb-5" data-testid={`contact-${d.label.toLowerCase()}`}>
                <div className="w-11 h-11 border border-white/15 flex items-center justify-center shrink-0"><d.icon className="w-5 h-5 text-[#FFC107]" /></div>
                <div>
                  <div className="overline mb-1">{d.label}</div>
                  <div className="text-white/80">{d.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-8">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-11 h-11 border border-white/15 flex items-center justify-center hover:border-[#FFC107] hover:text-[#FFC107] transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-11 h-11 border border-white/15 flex items-center justify-center hover:border-[#FFC107] hover:text-[#FFC107] transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-3">
          <EnquiryForm type="general" heading="Send Us a Message" subheading="We usually respond within one business day." testid="contact-enquiry" sourcePage="contact" />
        </Reveal>
      </section>
    </div>
  );
}
