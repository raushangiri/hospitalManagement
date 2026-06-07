import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Clock, User, ChevronRight, Shield, Award, Phone, Star } from "lucide-react";

const specialties = [
  "Cardiology", "Neurology", "Orthopedics", "Gynecology",
  "Pediatrics", "Oncology", "Dermatology", "Ophthalmology",
];

const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export function HeroSection() {
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "100px" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(135deg, #F0F9F7 0%, #E8F4FD 50%, #F4F6F9 100%)",
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-10"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=900&h=900&fit=crop&auto=format)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Decorative blobs */}
      <div
        className="absolute top-20 left-10 w-72 h-72 rounded-full -z-10 opacity-20 blur-3xl"
        style={{ background: "#2A9D8F" }}
      />
      <div
        className="absolute bottom-20 right-20 w-96 h-96 rounded-full -z-10 opacity-15 blur-3xl"
        style={{ background: "#4A9EDA" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start"
            style={{ background: "rgba(42,157,143,0.12)", color: "#2A9D8F" }}
          >
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2A9D8F" }} />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.05em" }}>
              INDIA'S MOST COMPLETE HOSPITAL PLATFORM
            </span>
          </div>

          <h1 style={{ color: "#1B2B3A", lineHeight: 1.1 }}>
            One Platform to Manage the{" "}
            <span style={{ color: "#2A9D8F" }}>Entire Patient Journey</span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "#6B7280", lineHeight: 1.75, maxWidth: "520px" }}>
            From registration to discharge — MedFlow connects patients, doctors, nurses, and administrators
            in one intelligent system. AI-powered, WhatsApp-integrated, built for Indian hospitals.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#appointment"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.95rem" }}
            >
              <Calendar size={17} /> Book Appointment
            </a>
            <a
              href="#services"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 transition-all hover:bg-primary hover:text-white hover:border-primary"
              style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontWeight: 600, fontSize: "0.95rem" }}
            >
              Explore Features <ChevronRight size={17} />
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { icon: <Shield size={14} />, text: "HIPAA Compliant" },
              { icon: <Award size={14} />, text: "NABH Certified" },
              { icon: <Phone size={14} />, text: "24/7 Support" },
              { icon: <Star size={14} />, text: "4.9 Rating" },
            ].map(({ icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-border"
                style={{ fontSize: "0.8rem", fontWeight: 500, color: "#1B2B3A" }}
              >
                <span style={{ color: "#2A9D8F" }}>{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Appointment booking card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2A9D8F" }}>
                <Calendar size={15} color="white" />
              </div>
              <div>
                <h3 style={{ color: "#1B2B3A", margin: 0 }}>Book an Appointment</h3>
                <p style={{ fontSize: "0.8rem", color: "#6B7280", margin: 0 }}>Free consultation for new patients</p>
              </div>
            </div>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(42,157,143,0.12)" }}>
                  <Award size={28} style={{ color: "#2A9D8F" }} />
                </div>
                <h3 style={{ color: "#2A9D8F" }}>Appointment Requested!</h3>
                <p style={{ color: "#6B7280", fontSize: "0.9rem" }}>
                  You'll receive a WhatsApp confirmation within minutes.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-5 py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-all"
                  style={{ fontSize: "0.88rem" }}
                >
                  Book Another
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1.5" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                    PATIENT NAME
                  </label>
                  <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 bg-muted">
                    <User size={15} style={{ color: "#6B7280" }} />
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="flex-1 bg-transparent outline-none"
                      style={{ fontSize: "0.9rem", color: "#1B2B3A" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                    SPECIALTY
                  </label>
                  <div className="border border-border rounded-xl px-3 py-2.5 bg-muted">
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full bg-transparent outline-none"
                      style={{ fontSize: "0.9rem", color: selectedSpecialty ? "#1B2B3A" : "#9CA3AF" }}
                    >
                      <option value="">Select specialty</option>
                      {specialties.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                      DATE
                    </label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 bg-muted">
                      <Calendar size={14} style={{ color: "#6B7280" }} />
                      <input
                        type="date"
                        min={today}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: "0.88rem", color: "#1B2B3A" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-1.5" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                      MOBILE
                    </label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 bg-muted">
                      <span style={{ fontSize: "0.88rem", color: "#6B7280" }}>+91</span>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        maxLength={10}
                        className="flex-1 bg-transparent outline-none"
                        style={{ fontSize: "0.9rem", color: "#1B2B3A" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <label className="block mb-2" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                    PREFERRED TIME
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className="py-1.5 rounded-lg border transition-all"
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 500,
                          background: selectedTime === slot ? "#2A9D8F" : "transparent",
                          color: selectedTime === slot ? "white" : "#1B2B3A",
                          borderColor: selectedTime === slot ? "#2A9D8F" : "rgba(0,0,0,0.1)",
                        }}
                      >
                        <Clock size={11} className="inline mr-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 hover:shadow-lg mt-1"
                  style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.95rem" }}
                >
                  Confirm Appointment
                </button>

                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", textAlign: "center" }}>
                  Confirmation via WhatsApp & SMS • No advance payment required
                </p>
              </div>
            )}
          </div>

          {/* Floating stat card */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="mt-4 bg-white rounded-xl shadow-lg p-3 border border-border flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop&auto=format"
                alt="Doctor"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1B2B3A", margin: 0 }}>
                Dr. Rajesh Sharma just accepted
              </p>
              <p style={{ fontSize: "0.72rem", color: "#6B7280", margin: 0 }}>Cardiologist • Available Today</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full animate-pulse" style={{ background: "#22C55E" }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
