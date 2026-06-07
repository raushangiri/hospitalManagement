import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const links = {
  "Quick Links": ["Home", "About Us", "Services", "Doctors", "Appointments", "Patient Portal", "Careers"],
  "Services": ["OPD", "IPD", "Emergency", "Laboratory", "Pharmacy", "Radiology", "Telemedicine"],
  "Modules": ["Patient Management", "Billing System", "Insurance Claims", "Pharmacy Management", "Lab Reports", "Doctor Dashboard"],
};

export function Footer() {
  return (
    <footer style={{ background: "#0F1E2B", color: "rgba(255,255,255,0.7)" }}>
      {/* Top CTA strip */}
      <div style={{ background: "#2A9D8F" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "white" }}>
              Ready to transform your hospital operations?
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.8)" }}>
              Get a free demo. No credit card required.
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 rounded-xl bg-white transition-all hover:bg-gray-100"
              style={{ color: "#2A9D8F", fontWeight: 700, fontSize: "0.9rem" }}
            >
              Request Demo
            </button>
            <button
              className="px-5 py-2.5 rounded-xl border border-white/40 text-white transition-all hover:bg-white/10"
              style={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              <Phone size={14} className="inline mr-1" /> Call Us
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#2A9D8F" }}>
                <Heart size={18} fill="white" color="white" />
              </div>
              <div>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "white" }}>MedFlow</span>
                <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>HOSPITAL MANAGEMENT</div>
              </div>
            </div>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.75, marginBottom: "1.25rem", maxWidth: "300px" }}>
              India's most complete Hospital Management System — from patient registration to discharge, powered by AI and WhatsApp automation.
            </p>

            <div className="flex flex-col gap-2 mb-5">
              {[
                { icon: <Phone size={13} />, text: "+91 98765 43210" },
                { icon: <Mail size={13} />, text: "care@medflow.in" },
                { icon: <MapPin size={13} />, text: "12 Healthcare Avenue, New Delhi" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2" style={{ fontSize: "0.82rem" }}>
                  <span style={{ color: "#2A9D8F" }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex gap-2">
              {[
                { icon: <Facebook size={15} />, label: "Facebook" },
                { icon: <Twitter size={15} />, label: "Twitter" },
                { icon: <Instagram size={15} />, label: "Instagram" },
                { icon: <Linkedin size={15} />, label: "LinkedIn" },
                { icon: <Youtube size={15} />, label: "YouTube" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-primary"
                  style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h4 style={{ color: "white", marginBottom: "1.25rem", fontSize: "0.9rem", letterSpacing: "0.04em" }}>{heading}</h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="transition-colors hover:text-primary"
                      style={{ fontSize: "0.83rem" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div style={{ fontSize: "0.78rem" }}>
            © 2026 MedFlow Hospital Management Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex gap-4" style={{ fontSize: "0.78rem" }}>
            {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"].map((item) => (
              <a key={item} href="#" className="hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
