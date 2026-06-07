import { motion } from "motion/react";
import { Smartphone, CheckCircle2 } from "lucide-react";

const patientFeatures = [
  "Book & manage appointments",
  "View prescriptions & lab reports",
  "Pay bills online (UPI/Card)",
  "Video consultation from home",
  "Family health wallet",
  "WhatsApp-style chat with doctor",
];

const doctorFeatures = [
  "Manage OPD queue on the go",
  "Issue e-prescriptions instantly",
  "Telemedicine video calls",
  "Access patient records anywhere",
  "Track follow-up schedule",
  "Receive critical case alerts",
];

export function MobileSection() {
  return (
    <section className="py-20 overflow-hidden" style={{ background: "linear-gradient(135deg, #1B2B3A 0%, #0F1E2B 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(42,157,143,0.2)", border: "1px solid rgba(42,157,143,0.4)" }}
            >
              <Smartphone size={13} style={{ color: "#4DD4C8" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4DD4C8", letterSpacing: "0.06em" }}>
                MOBILE APPS — PATIENT & DOCTOR
              </span>
            </div>

            <h2 style={{ color: "white", marginBottom: "1rem" }}>
              Healthcare in Your Pocket
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: "2rem" }}>
              Separate apps for patients and doctors — each purpose-built for their workflow.
              Available on iOS and Android with offline capability.
            </p>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div>
                <h4 style={{ color: "#4DD4C8", marginBottom: "1rem" }}>Patient App</h4>
                <div className="flex flex-col gap-2">
                  {patientFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} style={{ color: "#4DD4C8", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color: "#4A9EDA", marginBottom: "1rem" }}>Doctor App</h4>
                <div className="flex flex-col gap-2">
                  {doctorFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 size={13} style={{ color: "#4A9EDA", flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.75)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* App store badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { store: "App Store", sub: "Download on the", icon: "🍎" },
                { store: "Google Play", sub: "Get it on", icon: "▶" },
              ].map(({ store, sub, icon }) => (
                <button
                  key={store}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:border-primary"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}
                >
                  <span style={{ fontSize: "1.4rem" }}>{icon}</span>
                  <div className="text-left">
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>{sub}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "white" }}>{store}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right: phone mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="relative">
              {/* Phone frame */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{ width: "260px", border: "8px solid rgba(255,255,255,0.15)" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=520&h=900&fit=crop&auto=format"
                  alt="MedFlow mobile app"
                  className="w-full"
                />
                {/* Status bar overlay */}
                <div
                  className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2"
                  style={{ background: "rgba(42,157,143,0.9)" }}
                >
                  <span style={{ fontSize: "0.7rem", color: "white", fontWeight: 600 }}>9:41</span>
                  <span style={{ fontSize: "0.7rem", color: "white", fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>MedFlow</span>
                  <span style={{ fontSize: "0.7rem", color: "white" }}>●●●</span>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute -right-4 top-16 bg-white rounded-xl shadow-xl p-3 w-48"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: "#25D366" }}>
                    💬
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1B2B3A" }}>MedFlow</span>
                  <span style={{ fontSize: "0.65rem", color: "#9CA3AF", marginLeft: "auto" }}>now</span>
                </div>
                <p style={{ fontSize: "0.72rem", color: "#374151", margin: 0, lineHeight: 1.4 }}>
                  Hi Arjun! How are you feeling today? Tap to respond. 😊
                </p>
              </motion.div>

              {/* Floating stat */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute -left-8 bottom-20 bg-white rounded-xl shadow-xl p-3"
              >
                <div style={{ fontSize: "0.7rem", color: "#6B7280" }}>Next appointment</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2A9D8F" }}>Dr. Mehta</div>
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Tomorrow, 10 AM</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
