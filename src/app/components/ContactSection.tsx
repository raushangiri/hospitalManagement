import { useState } from "react";
import { motion } from "motion/react";
import { Phone, Mail, MapPin, Clock, Zap, Send, CheckCircle2 } from "lucide-react";

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", mobile: "", subject: "", message: "" });

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            GET IN TOUCH
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>Contact MedFlow Hospital</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col gap-5"
          >
            {/* Emergency banner */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #E63946 0%, #C62828 100%)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Zap size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "white", fontSize: "1rem" }}>24/7 Emergency Helpline</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "white", fontFamily: "'Outfit', sans-serif" }}>
                  +91 98765 43210
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.8)" }}>Ambulance available in 8 minutes</div>
              </div>
            </div>

            {[
              { icon: <Phone size={18} />, title: "General Enquiry", detail: "+91 11 4567 8900", sub: "Mon–Sat, 8AM–8PM", color: "#2A9D8F" },
              { icon: <Mail size={18} />, title: "Email Us", detail: "care@medflow.in", sub: "Response within 2 hours", color: "#4A9EDA" },
              { icon: <MapPin size={18} />, title: "Hospital Address", detail: "12 Healthcare Avenue, Sector 18", sub: "New Delhi – 110 001", color: "#F4A261" },
              { icon: <Clock size={18} />, title: "OPD Hours", detail: "Mon–Sat: 8AM – 8PM", sub: "Sunday: 9AM – 2PM (Emergency 24/7)", color: "#7C3AED" },
            ].map(({ icon, title, detail, sub, color }) => (
              <div key={title} className="flex items-start gap-4 bg-white rounded-xl p-4 border border-border">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}15`, color }}
                >
                  {icon}
                </div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.04em" }}>{title}</div>
                  <div style={{ fontWeight: 600, color: "#1B2B3A" }}>{detail}</div>
                  <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{sub}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-7 border border-border shadow-lg"
          >
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                <CheckCircle2 size={48} style={{ color: "#2A9D8F", marginBottom: "1rem" }} />
                <h3 style={{ color: "#1B2B3A" }}>Message Sent!</h3>
                <p style={{ color: "#6B7280" }}>We'll get back to you within 2 hours via WhatsApp or email.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h3 style={{ color: "#1B2B3A", marginBottom: "1.5rem" }}>Send us a message</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                        FULL NAME
                      </label>
                      <input
                        type="text"
                        placeholder="Arjun Mehta"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-border rounded-xl px-3 py-2.5 bg-muted outline-none focus:border-primary transition-colors"
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                        MOBILE NUMBER
                      </label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        className="w-full border border-border rounded-xl px-3 py-2.5 bg-muted outline-none focus:border-primary transition-colors"
                        style={{ fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                      SUBJECT
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 bg-muted outline-none focus:border-primary transition-colors"
                      style={{ fontSize: "0.9rem", color: form.subject ? "#1B2B3A" : "#9CA3AF" }}
                    >
                      <option value="">Select subject</option>
                      <option>Appointment Query</option>
                      <option>Billing & Insurance</option>
                      <option>Medical Records Request</option>
                      <option>Feedback / Complaint</option>
                      <option>Hospital Tie-up / B2B</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                      MESSAGE
                    </label>
                    <textarea
                      placeholder="How can we help you?"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full border border-border rounded-xl px-3 py-2.5 bg-muted outline-none focus:border-primary transition-colors resize-none"
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>

                  <button
                    onClick={() => setSent(true)}
                    className="w-full py-3.5 rounded-xl text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-lg"
                    style={{ background: "#2A9D8F", fontWeight: 600 }}
                  >
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
