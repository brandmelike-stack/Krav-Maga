import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV } from "../lib/data";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${scrolled ? "bg-[#0A0A0A]/95 backdrop-blur border-white/10" : "bg-transparent border-transparent"}`}
      data-testid="navbar"
    >
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center group" data-testid="logo-link">
          <img src="/logo-dark.png" alt="360 Degree Secure" className="h-9 md:h-11 w-auto object-contain" />
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={({ isActive }) =>
                `text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${isActive ? "text-[#FFC107]" : "text-white/70 hover:text-white"}`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/krav-maga" className="btn-amber text-[13px] py-2.5 px-5 crosshair" data-testid="nav-cta">
            Free Trial
          </Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen((v) => !v)} data-testid="mobile-menu-toggle" aria-label="Menu">
          {open ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#0A0A0A] border-t border-white/10 px-5 py-6" data-testid="mobile-menu">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `py-3 text-lg font-display tracking-wide border-b border-white/5 ${isActive ? "text-[#FFC107]" : "text-white/80"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <Link to="/krav-maga" className="btn-amber justify-center mt-4">Claim Your Free Trial</Link>
          </div>
        </div>
      )}
    </header>
  );
}
