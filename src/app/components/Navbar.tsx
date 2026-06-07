import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown, Heart, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  {
    label: "Modules",
    href: "#modules",
    sub: ["Patient Portal", "Doctor Dashboard", "OPD", "IPD", "Laboratory", "Pharmacy", "Billing"],
  },
  { label: "Doctors", href: "#doctors" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onPatientLogin: () => void;
  onHospitalLogin: () => void;
}

export function Navbar({ onPatientLogin, onHospitalLogin }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-3" : "bg-transparent py-4"
      }`}
    >
      {/* Top emergency bar */}
      <div
        className="text-center py-1.5 flex items-center justify-center gap-2"
        style={{ background: "#2A9D8F", fontSize: "0.8rem", color: "white" }}
      >
        <Phone size={13} />
        <span>24/7 Emergency: <strong>+91 98765 43210</strong></span>
        <span className="mx-3 opacity-40">|</span>
        <span>Ambulance: <strong>108</strong></span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between mt-2">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#2A9D8F" }}>
            <Heart size={18} fill="white" color="white" />
          </div>
          <div>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.35rem", fontWeight: 700, color: "#2A9D8F" }}>
              MedFlow
            </span>
            <div style={{ fontSize: "0.62rem", color: "#6B7280", lineHeight: 1, letterSpacing: "0.08em" }}>
              HOSPITAL MANAGEMENT
            </div>
          </div>
        </a>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href={link.href}
                className="flex items-center gap-1 transition-colors hover:text-primary"
                style={{ fontSize: "0.92rem", color: "#1B2B3A", fontWeight: 500 }}
              >
                {link.label}
                {link.sub && <ChevronDown size={13} />}
              </a>
              {link.sub && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 pt-2 z-50"
                >
                  <div className="bg-white rounded-xl shadow-xl border border-border py-2 min-w-44">
                    {link.sub.map((item) => (
                      <a
                        key={item}
                        href="#modules"
                        className="block px-4 py-2 hover:bg-muted hover:text-primary transition-colors"
                        style={{ fontSize: "0.88rem" }}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={onHospitalLogin}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border transition-all hover:bg-muted"
            style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1B2B3A", fontSize: "0.88rem", fontWeight: 500 }}
          >
            <Building2 size={14} /> Hospital Login
          </button>
          <button
            onClick={onPatientLogin}
            className="px-4 py-2 rounded-lg border transition-all hover:bg-primary hover:text-white hover:border-primary"
            style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontSize: "0.88rem", fontWeight: 500 }}
          >
            Patient Login
          </button>
          <button
            onClick={onPatientLogin}
            className="px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
            style={{ background: "#2A9D8F", fontSize: "0.88rem", fontWeight: 500 }}
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border shadow-lg overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-2 border-b border-border hover:text-primary transition-colors"
                  style={{ fontWeight: 500 }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onHospitalLogin(); }}
                className="py-3 rounded-xl border text-center transition-all hover:bg-muted"
                style={{ borderColor: "rgba(0,0,0,0.12)", fontWeight: 600 }}
              >
                Hospital Login
              </button>
              <button
                onClick={() => { setMobileOpen(false); onPatientLogin(); }}
                className="py-3 rounded-xl text-center text-white"
                style={{ background: "#2A9D8F", fontWeight: 600 }}
              >
                Patient Login / Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
