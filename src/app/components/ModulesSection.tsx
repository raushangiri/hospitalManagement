import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, UserCog, ClipboardList, BedDouble, Zap, FlaskConical,
  Pill, Receipt, Shield, UtensilsCrossed, Ambulance, MessageSquare,
  CheckCircle2,
} from "lucide-react";

const modules = [
  {
    id: "patient",
    icon: <User size={18} />,
    label: "Patient Management",
    features: [
      "UHID generation with QR Code & digital card",
      "Mobile OTP login — no password needed",
      "Aadhaar-based registration with insurance capture",
      "Emergency contact & family health wallet",
      "Upcoming appointments & prescription history",
      "Download lab reports as PDF anytime",
      "One-click reappointment booking",
      "Teleconsultation with assigned doctor",
    ],
    highlight: "Auto-generates UHID, QR Code & Digital Patient Card on registration",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "doctor",
    icon: <UserCog size={18} />,
    label: "Doctor Dashboard",
    features: [
      "Today's patient queue with live token display",
      "E-prescription with drug interaction alerts",
      "Voice-to-prescription (AI transcription)",
      "Follow-up scheduling with automated reminders",
      "Access to complete patient medical history",
      "Video consultation from the same dashboard",
      "Performance metrics and patient feedback",
      "Integration with lab results in real time",
    ],
    highlight: "Voice Prescription — Doctor speaks, AI converts to structured prescription",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "opd",
    icon: <ClipboardList size={18} />,
    label: "OPD Management",
    features: [
      "Smart token management with real-time display",
      "Walk-in + advance online booking",
      "Multi-doctor parallel queue handling",
      "Follow-up tracking with auto WhatsApp alerts",
      "Digital waiting room screen integration",
      "Doctor availability & slot configuration",
      "Consultation fee collection at counter",
      "OPD billing auto-linked to pharmacy",
    ],
    highlight: "Digital Queue Display boards for waiting rooms — patients know exactly when their turn arrives",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "ipd",
    icon: <BedDouble size={18} />,
    label: "IPD Management",
    features: [
      "Bed & ward allocation with occupancy map",
      "Nursing notes with shift handover",
      "Medicine schedule with administration tracking",
      "Procedure logs — surgery, dressings, IV",
      "Vitals charting with trend visualization",
      "Diet & canteen meal ordering by room",
      "Attendant pass management",
      "Discharge summary generation in one click",
    ],
    highlight: "AI Bed Occupancy Forecast — predict next 30 days occupancy for proactive planning",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "emergency",
    icon: <Zap size={18} />,
    label: "Emergency",
    features: [
      "Fast registration in under 30 seconds",
      "Live ambulance GPS tracking",
      "Critical patient triage dashboard",
      "Incoming case severity color coding",
      "Direct bed request from triage screen",
      "Automatic ICU bed assignment",
      "Real-time alert to on-call specialist",
      "Emergency billing auto-initiation",
    ],
    highlight: "Register an emergency patient in under 30 seconds — no forms, no delays",
    image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "lab",
    icon: <FlaskConical size={18} />,
    label: "Laboratory",
    features: [
      "Test booking: blood, urine, radiology",
      "Barcode-based sample tracking",
      "Auto-upload reports to patient portal",
      "WhatsApp delivery of report links",
      "Critical value alerts to treating doctor",
      "Reference range comparison in reports",
      "Home sample collection scheduling",
      "Integration with radiology DICOM viewer",
    ],
    highlight: "Reports auto-upload to patient portal AND sent via WhatsApp instantly",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "pharmacy",
    icon: <Pill size={18} />,
    label: "Pharmacy",
    features: [
      "Prescription-mapped one-click dispensing",
      "Real-time stock and batch management",
      "Expiry date alerts with auto-indent",
      "Low stock threshold notifications",
      "Generic drug substitution suggestions",
      "Insurance & cash billing in one screen",
      "Return and replacement tracking",
      "Controlled substance dispensing logs",
    ],
    highlight: "Prescription-mapped dispensing — scan prescription, all medicines auto-populate",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop&auto=format",
  },
  {
    id: "billing",
    icon: <Receipt size={18} />,
    label: "Billing & Insurance",
    features: [
      "Unified bill: OPD + IPD + Pharmacy + Lab",
      "UPI, card, cash & insurance in one screen",
      "Cashless insurance approval workflow",
      "TPA integration for pre-authorisation",
      "WhatsApp bill sharing with QR payment",
      "GST-compliant tax invoice generation",
      "Advance deposit & refund management",
      "Corporate billing with monthly statements",
    ],
    highlight: "WhatsApp Automation for insurance — auto-submit claims, track status day-by-day",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&auto=format",
  },
];

export function ModulesSection() {
  const [active, setActive] = useState("patient");
  const current = modules.find((m) => m.id === active)!;

  return (
    <section id="modules" className="py-20" style={{ background: "#F4F6F9" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            12 INTEGRATED MODULES
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>Complete Hospital Management Suite</h2>
          <p style={{ color: "#6B7280", maxWidth: "520px", margin: "1rem auto 0", lineHeight: 1.75 }}>
            Every module is deeply integrated — data flows between departments automatically,
            eliminating duplication and manual errors.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all"
              style={{
                background: active === m.id ? "#2A9D8F" : "white",
                color: active === m.id ? "white" : "#1B2B3A",
                borderColor: active === m.id ? "#2A9D8F" : "rgba(0,0,0,0.08)",
                fontWeight: 500,
                fontSize: "0.85rem",
              }}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="grid lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8 border border-border"
          >
            {/* Features list */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(42,157,143,0.12)", color: "#2A9D8F" }}>
                  {current.icon}
                </div>
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>{current.label}</h3>
              </div>

              <div className="grid grid-cols-1 gap-2.5 mb-6">
                {current.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} style={{ color: "#2A9D8F", marginTop: "0.15rem", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.88rem", color: "#374151", lineHeight: 1.55 }}>{f}</span>
                  </div>
                ))}
              </div>

              {/* Highlight callout */}
              <div className="rounded-xl p-4" style={{ background: "rgba(42,157,143,0.08)", borderLeft: "3px solid #2A9D8F" }}>
                <div className="flex items-start gap-2">
                  <Shield size={14} style={{ color: "#2A9D8F", marginTop: "0.15rem", flexShrink: 0 }} />
                  <p style={{ fontSize: "0.84rem", color: "#1B2B3A", margin: 0, lineHeight: 1.6 }}>
                    <strong>Key differentiator:</strong> {current.highlight}
                  </p>
                </div>
              </div>
            </div>

            {/* Screenshot / image */}
            <div className="relative rounded-xl overflow-hidden" style={{ minHeight: "300px" }}>
              <img
                src={current.image}
                alt={current.label}
                className="w-full h-full object-cover"
                style={{ minHeight: "300px" }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className="inline-block px-3 py-1 rounded-full text-white"
                  style={{ background: "#2A9D8F", fontSize: "0.78rem", fontWeight: 600 }}
                >
                  {current.label}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
