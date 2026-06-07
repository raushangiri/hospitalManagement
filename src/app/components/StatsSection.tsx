import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Users, UserCheck, BedDouble, TrendingUp } from "lucide-react";

const stats = [
  { icon: <Users size={28} />, value: 50000, suffix: "+", label: "Patients Served", sub: "Across 12 cities" },
  { icon: <UserCheck size={28} />, value: 200, suffix: "+", label: "Specialist Doctors", sub: "In 28 departments" },
  { icon: <BedDouble size={28} />, value: 500, suffix: "+", label: "Beds Available", sub: "ICU, NICU & General" },
  { icon: <TrendingUp size={28} />, value: 98, suffix: "%", label: "Success Rate", sub: "Patient satisfaction" },
];

function useCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return count;
}

function StatCard({ icon, value, suffix, label, sub, inView }: typeof stats[0] & { inView: boolean }) {
  const count = useCounter(value, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1" style={{ background: "rgba(255,255,255,0.15)" }}>
        <span style={{ color: "white" }}>{icon}</span>
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "2.75rem", fontWeight: 800, color: "white", lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.05rem", fontWeight: 600, color: "white" }}>{label}</div>
      <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>{sub}</div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #2A9D8F 0%, #21867A 50%, #1A6B60 100%)" }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full opacity-10" style={{ background: "white" }} />
      <div className="absolute -bottom-16 -right-8 w-64 h-64 rounded-full opacity-10" style={{ background: "white" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.12em" }}>
            TRUSTED BY THOUSANDS
          </p>
          <h2 style={{ color: "white", marginTop: "0.5rem" }}>Numbers That Speak</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
