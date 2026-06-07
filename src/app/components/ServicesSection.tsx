import { motion } from "motion/react";
import {
  Stethoscope, BedDouble, Zap, FlaskConical, Pill, Scan,
  Video, HeartPulse, ChevronRight,
} from "lucide-react";

const services = [
  {
    icon: <Stethoscope size={26} />,
    title: "OPD",
    full: "Outpatient Department",
    desc: "Token-based queue management, walk-in & advance booking, multi-doctor allocation.",
    color: "#2A9D8F",
    bg: "#F0F9F7",
  },
  {
    icon: <BedDouble size={26} />,
    title: "IPD",
    full: "Inpatient Department",
    desc: "Smart bed allocation, ward management, nursing notes, vitals tracking & discharge planning.",
    color: "#4A9EDA",
    bg: "#EFF6FD",
  },
  {
    icon: <Zap size={26} />,
    title: "Emergency",
    full: "24/7 Emergency Care",
    desc: "Instant registration in 30 seconds, ambulance tracking, critical patient dashboard.",
    color: "#E63946",
    bg: "#FDF2F3",
  },
  {
    icon: <FlaskConical size={26} />,
    title: "Laboratory",
    full: "Diagnostic Lab",
    desc: "Blood, urine & radiology tests — reports auto-upload to patient portal with WhatsApp delivery.",
    color: "#F4A261",
    bg: "#FEF6EE",
  },
  {
    icon: <Pill size={26} />,
    title: "Pharmacy",
    full: "Pharmacy Management",
    desc: "Stock & expiry alerts, prescription-mapped one-click dispensing, batch tracking.",
    color: "#7C3AED",
    bg: "#F3EFFE",
  },
  {
    icon: <Scan size={26} />,
    title: "Radiology",
    full: "Imaging & Radiology",
    desc: "X-ray, MRI, CT — DICOM integration, digital reports linked directly to patient records.",
    color: "#0EA5E9",
    bg: "#EDF8FE",
  },
  {
    icon: <Video size={26} />,
    title: "Telemedicine",
    full: "Video Consultation",
    desc: "HD video calls, live chat with doctors, e-prescriptions issued instantly post-call.",
    color: "#059669",
    bg: "#EDFAF4",
  },
  {
    icon: <HeartPulse size={26} />,
    title: "Health Packages",
    full: "Preventive Health Checks",
    desc: "Silver, Gold & Platinum membership plans with bundled tests, priority OPD & discounts.",
    color: "#DB2777",
    bg: "#FDF2F9",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            COMPREHENSIVE CARE
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>Everything Under One Roof</h2>
          <p style={{ color: "#6B7280", maxWidth: "540px", margin: "1rem auto 0", lineHeight: 1.75 }}>
            From routine checkups to complex surgeries — MedFlow manages every healthcare service
            seamlessly across all departments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-white rounded-2xl p-5 border border-border hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* Hover accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: svc.color }}
              />

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: svc.bg, color: svc.color }}
              >
                {svc.icon}
              </div>

              <h4 style={{ color: "#1B2B3A", marginBottom: "0.2rem" }}>{svc.title}</h4>
              <p style={{ fontSize: "0.75rem", color: svc.color, fontWeight: 600, marginBottom: "0.6rem" }}>
                {svc.full}
              </p>
              <p style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.65 }}>{svc.desc}</p>

              <div
                className="mt-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontSize: "0.82rem", color: svc.color, fontWeight: 600 }}
              >
                Learn more <ChevronRight size={13} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
