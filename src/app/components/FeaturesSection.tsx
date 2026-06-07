import { motion } from "motion/react";
import { Bot, FileText, Brain, BarChart3, MessageSquare, CheckCircle2, ArrowRight } from "lucide-react";

const aiFeatures = [
  {
    icon: <Bot size={24} />,
    title: "AI Health Assistant",
    desc: "Patients ask: 'Can I take this medicine after food?' — AI answers using the doctor's actual prescription. Context-aware, safe, and always available.",
    badge: "Patient Facing",
    color: "#4A9EDA",
  },
  {
    icon: <FileText size={24} />,
    title: "AI Prescription Reader",
    desc: "Upload any handwritten prescription image. AI extracts all medicines, dosage, frequency — structured and ready for pharmacy in seconds.",
    badge: "Pharmacy Module",
    color: "#7C3AED",
  },
  {
    icon: <Brain size={24} />,
    title: "AI Follow-up Predictor",
    desc: "Predicts which patients are likely to miss their follow-up appointment — enabling proactive reminders before the patient drops off care.",
    badge: "Predictive AI",
    color: "#F4A261",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "AI Revenue Dashboard",
    desc: "Forecast next 30-day revenue, OPD volume, and medicine consumption based on historical patterns. Plan staff and inventory proactively.",
    badge: "Hospital Admin",
    color: "#059669",
  },
];

const whatsappJourney = [
  { day: "Day 0", event: "Appointment confirmed", detail: "Date, time, doctor & location sent via WhatsApp", icon: "✅" },
  { day: "Day 1", event: "Prescription reminder", detail: "Medicine name, dose & time sent with instructions", icon: "💊" },
  { day: "Day 3", event: "Medicine check-in", detail: "Automated question: 'How are you feeling with the medicine?'", icon: "🔔" },
  { day: "Day 5", event: "Recovery survey", detail: "WhatsApp survey: Better / Same / Worse. If Worse → auto follow-up ticket", icon: "📊" },
  { day: "Auto", event: "Follow-up triggered", detail: "Hospital staff alerted, follow-up appointment pre-booked via bot", icon: "🏥" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* AI Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            ARTIFICIAL INTELLIGENCE
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>AI Features That Actually Work</h2>
          <p style={{ color: "#6B7280", maxWidth: "500px", margin: "1rem auto 0", lineHeight: 1.75 }}>
            Not just buzzwords — MedFlow's AI is embedded in clinical workflows,
            helping doctors, staff, and patients make better decisions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {aiFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-border hover:shadow-lg transition-all group"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}18`, color: f.color }}
              >
                {f.icon}
              </div>
              <span
                className="inline-block px-2.5 py-0.5 rounded-full mb-3"
                style={{ background: `${f.color}15`, color: f.color, fontSize: "0.7rem", fontWeight: 600 }}
              >
                {f.badge}
              </span>
              <h4 style={{ color: "#1B2B3A", marginBottom: "0.5rem" }}>{f.title}</h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Automation — the differentiator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1B2B3A 0%, #0F1E2B 100%)" }}
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left */}
            <div className="p-8 lg:p-12">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)" }}
              >
                <MessageSquare size={13} style={{ color: "#25D366" }} />
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#25D366", letterSpacing: "0.06em" }}>
                  WHATSAPP AUTOMATION — OUR BIGGEST DIFFERENTIATOR
                </span>
              </div>

              <h2 style={{ color: "white", marginBottom: "1rem" }}>
                Your Hospital Follows Up Automatically
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                Most HMS systems stop at appointment booking. MedFlow continues the care journey
                for 5+ days after every visit — automatically, via WhatsApp. No manual effort from staff.
              </p>

              <div className="flex flex-col gap-2 mb-6">
                {[
                  "Appointment confirmations sent instantly",
                  "Post-visit medicine reminders on Day 1 & 3",
                  "Recovery survey on Day 5",
                  "Auto follow-up ticket if patient gets worse",
                  "Hospital staff alerted for critical cases",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={14} style={{ color: "#25D366", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.8)" }}>{item}</span>
                  </div>
                ))}
              </div>

              <button
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white transition-all hover:opacity-90"
                style={{ background: "#25D366", fontSize: "0.9rem", fontWeight: 600 }}
              >
                <MessageSquare size={16} /> See WhatsApp Demo <ArrowRight size={15} />
              </button>
            </div>

            {/* Right: Journey timeline */}
            <div className="p-8 lg:p-12 border-t lg:border-t-0 lg:border-l border-white/10">
              <h4 style={{ color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", letterSpacing: "0.08em" }}>
                AUTOMATED PATIENT JOURNEY
              </h4>
              <div className="flex flex-col gap-0">
                {whatsappJourney.map((step, i) => (
                  <div key={step.day} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: "rgba(37,211,102,0.15)", border: "1px solid rgba(37,211,102,0.3)" }}
                      >
                        {step.icon}
                      </div>
                      {i < whatsappJourney.length - 1 && (
                        <div className="w-px flex-1 my-1" style={{ background: "rgba(255,255,255,0.1)" }} />
                      )}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="px-2 py-0.5 rounded text-xs font-semibold"
                          style={{ background: "rgba(42,157,143,0.25)", color: "#4DD4C8" }}
                        >
                          {step.day}
                        </span>
                        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "white" }}>{step.event}</span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
