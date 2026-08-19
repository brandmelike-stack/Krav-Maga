import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { NAV } from "../lib/data";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-8" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <img src="/logo-dark.png" alt="360 Degree Secure" className="h-12 w-auto object-contain mb-4" />
            <p className="text-white/50 text-sm leading-relaxed">
              Real-world safety, self-defense & tactical training. Founded by Anjan Gogoi.
            </p>
            <img src="/kma-logo-dark.png" alt="Krav Maga Assam" className="h-9 w-auto object-contain mt-5 opacity-90" data-testid="footer-kma-logo" />
          </div>

          <div>
            <div className="overline mb-4">Navigate</div>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="text-white/60 hover:text-[#FFC107] text-sm transition-colors">{n.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="overline mb-4">Contact</div>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#FFC107]" /> +91 98640 00000</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#FFC107]" /> train@360degreesecure.com</li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 text-[#FFC107] mt-0.5" /> Guwahati, Assam, India</li>
            </ul>
          </div>

          <div>
            <div className="overline mb-4">Follow</div>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-[#FFC107] hover:text-[#FFC107] transition-colors" data-testid="social-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-[#FFC107] hover:text-[#FFC107] transition-colors" data-testid="social-facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <Link to="/contact" className="btn-amber mt-6 text-[13px] py-2.5 px-5">Enquire Now</Link>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 text-xs text-white/40 uppercase tracking-wider">
          <span>© {new Date().getFullYear()} 360 Degree Secure. All rights reserved.</span>
          <Link to="/admin/login" className="hover:text-[#FFC107]" data-testid="admin-footer-link">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
