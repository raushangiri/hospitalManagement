import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Arjun Mehta",
    location: "Bangalore",
    condition: "Post cardiac surgery follow-up",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "The WhatsApp reminders after my surgery were a lifesaver — literally. MedFlow messaged me on Day 3 to check on my medicine. When I said I wasn't improving, they immediately booked a follow-up. That kind of proactive care is rare.",
  },
  {
    name: "Priya Nair",
    location: "Chennai",
    condition: "Maternity care",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "The online appointment system and digital reports made my entire pregnancy journey stress-free. I could see all my reports on the app, video-consult my gynaecologist at midnight, and never had to stand in any queue.",
  },
  {
    name: "Ramesh Gupta",
    location: "Delhi",
    condition: "Diabetic management",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "Managing my father's diabetes used to be chaotic — multiple doctors, hand-written prescriptions, forgotten medicines. With MedFlow's Family Wallet, I manage his entire care from my phone. All records in one place.",
  },
  {
    name: "Dr. Sunita Sharma",
    location: "Mumbai",
    condition: "General Physician (Hospital Staff)",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=100&h=100&fit=crop&auto=format",
    rating: 5,
    text: "As a doctor, the voice prescription feature saves me at least 30 minutes every OPD day. I speak, it transcribes and formats. The AI even flags if I've prescribed a drug the patient is allergic to. Exceptional system.",
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setIndex((i) => (i + d + testimonials.length) % testimonials.length);
  };

  const t = testimonials[index];

  return (
    <section className="py-20" style={{ background: "linear-gradient(135deg, #F0F9F7 0%, #EFF6FD 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#2A9D8F", letterSpacing: "0.12em" }}>
            PATIENT STORIES
          </p>
          <h2 style={{ color: "#1B2B3A", marginTop: "0.5rem" }}>What Patients & Doctors Say</h2>
        </motion.div>

        {/* Big quote card */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-border relative"
            >
              <Quote size={40} style={{ color: "rgba(42,157,143,0.12)", position: "absolute", top: "1.5rem", right: "2rem" }} />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#F4A261" color="#F4A261" />
                ))}
              </div>

              <blockquote
                style={{ fontSize: "1.1rem", color: "#1B2B3A", lineHeight: 1.8, fontStyle: "italic", marginBottom: "2rem" }}
              >
                "{t.text}"
              </blockquote>

              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2"
                  style={{ borderColor: "#2A9D8F" }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{t.name}</div>
                  <div style={{ fontSize: "0.82rem", color: "#6B7280" }}>{t.location}</div>
                  <div
                    className="mt-1 inline-block px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F", fontSize: "0.72rem", fontWeight: 600 }}
                  >
                    {t.condition}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === index ? "2rem" : "0.5rem",
                    height: "0.5rem",
                    background: i === index ? "#2A9D8F" : "rgba(42,157,143,0.3)",
                  }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => go(-1)}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1B2B3A" }}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                onClick={() => go(1)}
                className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all"
                style={{ borderColor: "rgba(0,0,0,0.12)", color: "#1B2B3A" }}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
