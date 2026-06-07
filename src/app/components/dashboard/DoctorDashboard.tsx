import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Stethoscope, Users, Clock, CheckCircle2, Video, FileText,
  Mic, Calendar, Activity, MessageSquare, Phone, AlertTriangle,
  ChevronRight, Star, RefreshCw,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { PrescriptionModal } from "./PrescriptionModal";
import { opdQueue, telemedPatients, weekSchedule, followUps } from "../../data/mockData";

const navItems = [
  { icon: <Activity size={16} />, label: "Overview" },
  { icon: <Users size={16} />, label: "Patient Queue", badge: 8 },
  { icon: <FileText size={16} />, label: "E-Prescription" },
  { icon: <Video size={16} />, label: "Telemedicine", badge: 2 },
  { icon: <Calendar size={16} />, label: "Schedule" },
  { icon: <Clock size={16} />, label: "Follow-ups", badge: 5 },
];

const slotColors: Record<string, string> = { OPD: "#2A9D8F", "Ward Round": "#4A9EDA", Telemedicine: "#7C3AED", Procedure: "#F4A261", Surgery: "#E63946" };

interface Props { onLogout: () => void; }

export function DoctorDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [queueData, setQueueData] = useState(opdQueue);
  const [rxOpen, setRxOpen] = useState(false);
  const [rxPatient, setRxPatient] = useState<{ name: string; age: number; uhid: string } | null>(null);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [teleStatus, setTeleStatus] = useState<Record<string, string>>({});
  const [followUpStatus, setFollowUpStatus] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const startConsult = (token: string) => {
    setQueueData(q => q.map(p => p.token === token ? { ...p, status: "In Consultation" } : p));
  };

  const endConsult = (p: typeof opdQueue[0]) => {
    setQueueData(q => q.map(x => x.token === p.token ? { ...x, status: "Completed" } : x));
    setRxPatient({ name: p.name, age: p.age, uhid: `MF-28480${p.token.slice(-1)}` });
    setRxOpen(true);
  };

  const openRxFor = (p: typeof opdQueue[0]) => {
    setRxPatient({ name: p.name, age: p.age, uhid: `MF-28480${p.token.slice(-1)}` });
    setRxOpen(true);
  };

  const showAlert = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(null), 3000);
  };

  const waitingCount = queueData.filter(p => p.status === "Waiting").length;
  const doneCount = queueData.filter(p => p.status === "Completed").length;

  return (
    <DashboardLayout dept="Doctor" deptColor="#2A9D8F" deptIcon={<Stethoscope size={16} />}
      navItems={[...navItems.slice(0, 2), { ...navItems[1], badge: waitingCount }, ...navItems.slice(2)].filter((_,i) => i < 1 || i !== 1)}
      activeNav={activeNav} onNavChange={setActiveNav} onLogout={onLogout} userName="Dr. Rajesh Sharma"
    >
      {/* Toast */}
      <AnimatePresence>
        {alertMsg && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-white shadow-xl"
            style={{ background: "#2A9D8F" }}>
            ✓ {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <PrescriptionModal
        open={rxOpen}
        patientName={rxPatient?.name} patientAge={rxPatient?.age} patientUhid={rxPatient?.uhid}
        onClose={() => setRxOpen(false)}
      />

      {/* ── OVERVIEW ── */}
      {activeNav === "Overview" && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "In Queue", value: waitingCount.toString(), sub: "Avg wait 18 min", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Consultations Done", value: doneCount.toString(), sub: "Today", color: "#2A9D8F", bg: "#F0F9F7" },
              { label: "Video Calls", value: "2", sub: "Pending today", color: "#7C3AED", bg: "#F3EFFE" },
              { label: "Follow-ups Due", value: "5", sub: "2 overdue", color: "#E63946", bg: "#FDF2F3" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-border">
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg, color: s.color }}><Activity size={16} /></div>
                <div style={{ fontSize: "1.75rem", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Queue preview */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Today's Queue</h3>
                <button onClick={() => setActiveNav("Patient Queue")} className="text-primary flex items-center gap-1 hover:underline" style={{ fontSize: "0.82rem" }}>
                  Full view <ChevronRight size={13} />
                </button>
              </div>
              {queueData.slice(0, 5).map(p => (
                <div key={p.token} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all mb-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                    style={{ background: p.status === "In Consultation" ? "#2A9D8F" : p.status === "Completed" ? "#F4F6F9" : p.urgent ? "rgba(230,57,70,0.1)" : "#F4F6F9",
                      color: p.status === "In Consultation" ? "white" : p.urgent ? "#E63946" : "#6B7280" }}>
                    {p.token}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1B2B3A" }}>{p.name} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>{p.age}y</span></div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{p.issue}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: p.status === "Completed" ? "rgba(5,150,105,0.1)" : p.status === "In Consultation" ? "rgba(42,157,143,0.12)" : "#F4F6F9",
                      color: p.status === "Completed" ? "#059669" : p.status === "In Consultation" ? "#2A9D8F" : "#6B7280" }}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Prescription */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h4 style={{ color: "#1B2B3A", marginBottom: "1rem" }}>Quick Prescription</h4>
              <div className="flex gap-2 mb-3">
                <button onClick={() => { setVoiceActive(v => !v); if (!voiceActive) setVoiceText("Tab Metoprolol 50mg — twice daily after food\nTab Aspirin 75mg — once daily morning\nTab Atorvastatin 40mg — at bedtime"); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
                  style={{ background: voiceActive ? "rgba(230,57,70,0.1)" : "rgba(42,157,143,0.1)", color: voiceActive ? "#E63946" : "#2A9D8F", border: `1px solid ${voiceActive ? "rgba(230,57,70,0.3)" : "rgba(42,157,143,0.3)"}` }}>
                  <Mic size={14} className={voiceActive ? "animate-pulse" : ""} />
                  {voiceActive ? "Stop" : "Voice Input"}
                </button>
              </div>
              {voiceActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 rounded-lg mb-2 text-xs" style={{ background: "rgba(230,57,70,0.06)", color: "#E63946" }}>
                  🎙 Listening… "Tab Metoprolol 50mg…"
                </motion.div>
              )}
              <textarea className="w-full border border-border rounded-xl px-3 py-2.5 bg-muted outline-none resize-none" rows={4}
                value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder="Type or use voice..." style={{ fontSize: "0.85rem" }} />
              <button onClick={() => { setRxPatient({ name: "Current Patient", age: 0, uhid: "" }); setRxOpen(true); }}
                className="mt-3 w-full py-2.5 rounded-xl text-white hover:opacity-90 transition-all"
                style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.88rem" }}>
                <FileText size={14} className="inline mr-1.5" /> Generate E-Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PATIENT QUEUE ── */}
      {activeNav === "Patient Queue" && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ margin: 0, color: "#1B2B3A" }}>OPD Queue — Dr. Rajesh Sharma</h3>
            <div className="flex items-center gap-4 text-sm">
              <span style={{ color: "#F4A261" }}>⏳ {waitingCount} Waiting</span>
              <span style={{ color: "#2A9D8F" }}>▶ {queueData.filter(p => p.status === "In Consultation").length} In Consult</span>
              <span style={{ color: "#059669" }}>✓ {doneCount} Done</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {queueData.map((p, i) => (
              <motion.div key={p.token} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all"
                style={{ borderColor: p.status === "In Consultation" ? "#2A9D8F" : "rgba(0,0,0,0.08)", background: p.status === "In Consultation" ? "rgba(42,157,143,0.04)" : "white" }}>
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background: p.status === "In Consultation" ? "#2A9D8F" : p.status === "Completed" ? "#F4F6F9" : p.urgent ? "rgba(230,57,70,0.1)" : "#F4F6F9",
                    color: p.status === "In Consultation" ? "white" : p.urgent ? "#E63946" : "#6B7280" }}>
                  <span>{p.token}</span>
                  {p.status === "In Consultation" && <span style={{ fontSize: "0.55rem" }}>NOW</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{p.name}</span>
                    <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{p.age} yrs</span>
                    {p.urgent && <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>URGENT</span>}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "#6B7280" }}>{p.issue}</div>
                </div>
                <div className="flex items-center gap-2">
                  {p.status === "Waiting" && (
                    <button onClick={() => startConsult(p.token)}
                      className="px-4 py-2 rounded-xl text-white hover:opacity-90 transition-all"
                      style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.82rem" }}>
                      Start Consult
                    </button>
                  )}
                  {p.status === "In Consultation" && (
                    <>
                      <button onClick={() => openRxFor(p)}
                        className="px-3 py-2 rounded-xl border hover:bg-muted transition-all"
                        style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontWeight: 600, fontSize: "0.82rem" }}>
                        <FileText size={13} className="inline mr-1" /> Prescribe
                      </button>
                      <button onClick={() => endConsult(p)}
                        className="px-4 py-2 rounded-xl text-white hover:opacity-90 transition-all"
                        style={{ background: "#E63946", fontWeight: 600, fontSize: "0.82rem" }}>
                        End Consult
                      </button>
                    </>
                  )}
                  {p.status === "Completed" && (
                    <span className="px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                      ✓ Completed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── E-PRESCRIPTION ── */}
      {activeNav === "E-Prescription" && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 style={{ color: "#1B2B3A", marginBottom: "0.5rem" }}>Issue New Prescription</h3>
            <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Select a patient from today's queue to generate a digital prescription, or create a manual one.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              {queueData.filter(p => p.status !== "Waiting" || true).slice(0, 4).map(p => (
                <button key={p.token} onClick={() => openRxFor(p)}
                  className="flex flex-col items-start p-4 rounded-xl border hover:border-primary hover:shadow-md transition-all text-left group"
                  style={{ borderColor: "rgba(0,0,0,0.08)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold mb-2"
                    style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>{p.token}</div>
                  <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.88rem" }}>{p.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{p.age}y · {p.issue.slice(0, 28)}…</div>
                  <div className="mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                    Create Prescription →
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => { setRxPatient({ name: "", age: 0, uhid: "" }); setRxOpen(true); }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 hover:bg-primary hover:text-white hover:border-primary transition-all"
              style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontWeight: 600 }}>
              <FileText size={16} /> Create Manual Prescription
            </button>
          </div>
          {/* Recent prescriptions */}
          <div className="bg-white rounded-2xl border border-border p-5">
            <h4 style={{ color: "#1B2B3A", marginBottom: "1rem" }}>Today's Issued Prescriptions</h4>
            {[{ patient: "Ramesh Gupta", time: "09:15", meds: 4, status: "Dispensed" }, { patient: "Ravi Kumar", time: "08:45", meds: 3, status: "Pending" }, { patient: "Anita Singh", time: "08:20", meds: 2, status: "Dispensed" }].map(rx => (
              <div key={rx.patient} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors mb-1">
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center font-bold text-sm">{rx.patient[0]}</div>
                <div className="flex-1"><div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.88rem" }}>{rx.patient}</div>
                  <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Today {rx.time} · {rx.meds} medicines</div></div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: rx.status === "Dispensed" ? "rgba(5,150,105,0.1)" : "rgba(244,162,97,0.1)", color: rx.status === "Dispensed" ? "#059669" : "#F4A261" }}>
                  {rx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TELEMEDICINE ── */}
      {activeNav === "Telemedicine" && (
        <div className="flex flex-col gap-5">
          <div className="grid sm:grid-cols-3 gap-4">
            {[{ label: "Scheduled Today", value: "4", color: "#7C3AED", bg: "#F3EFFE" }, { label: "Completed", value: "2", color: "#059669", bg: "#EDFAF4" }, { label: "Waiting", value: "2", color: "#F4A261", bg: "#FEF6EE" }].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-border">
                <div style={{ fontSize: "1.75rem", fontFamily: "'Outfit',sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 style={{ color: "#1B2B3A", marginBottom: "1.25rem" }}>Today's Video Consultations</h3>
            <div className="flex flex-col gap-4">
              {telemedPatients.map(t => {
                const status = teleStatus[t.id] || t.status;
                return (
                  <div key={t.id} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "#7C3AED" }}>{t.name[0]}</div>
                    <div className="flex-1">
                      <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{t.name} <span style={{ color: "#9CA3AF", fontWeight: 400, fontSize: "0.82rem" }}>{t.age}y</span></div>
                      <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{t.reason} · {t.scheduled}</div>
                    </div>
                    {status === "Waiting" && (
                      <button onClick={() => { setTeleStatus(s => ({ ...s, [t.id]: "In Call" })); showAlert(`Video call started with ${t.name}`); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:opacity-90 transition-all"
                        style={{ background: "#7C3AED", fontWeight: 600, fontSize: "0.85rem" }}>
                        <Video size={14} /> Join Call
                      </button>
                    )}
                    {status === "In Call" && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold animate-pulse" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>● LIVE</span>
                        <button onClick={() => { setTeleStatus(s => ({ ...s, [t.id]: "Completed" })); openRxFor({ ...opdQueue[0], name: t.name, age: t.age }); }}
                          className="px-3 py-2 rounded-xl text-white hover:opacity-90" style={{ background: "#E63946", fontWeight: 600, fontSize: "0.82rem" }}>
                          End & Prescribe
                        </button>
                      </div>
                    )}
                    {status === "Completed" && <span className="px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>✓ Done</span>}
                    {status === "Upcoming" && <span className="px-3 py-2 rounded-xl text-sm font-semibold" style={{ background: "#F4F6F9", color: "#9CA3AF" }}>Upcoming</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {activeNav === "Schedule" && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 style={{ color: "#1B2B3A", marginBottom: "1.25rem" }}>Weekly Schedule — Dr. Rajesh Sharma</h3>
          <div className="grid grid-cols-7 gap-2">
            {weekSchedule.map(day => (
              <div key={day.day} className="min-h-40">
                <div className="text-center py-2 rounded-lg mb-2 font-bold text-sm"
                  style={{ background: day.day === "Sun" ? "#F4F6F9" : "rgba(42,157,143,0.1)", color: day.day === "Sun" ? "#9CA3AF" : "#2A9D8F" }}>
                  {day.day}
                </div>
                <div className="flex flex-col gap-1.5">
                  {day.slots.length === 0 ? (
                    <div className="text-center py-3 text-xs rounded-lg" style={{ background: "#F4F6F9", color: "#D1D5DB" }}>Off</div>
                  ) : day.slots.map((slot, i) => (
                    <div key={i} className="p-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-all"
                      style={{ background: `${slotColors[slot.type] || "#6B7280"}18`, borderLeft: `3px solid ${slotColors[slot.type] || "#6B7280"}` }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: slotColors[slot.type] || "#6B7280" }}>{slot.type}</div>
                      <div style={{ fontSize: "0.6rem", color: "#6B7280" }}>{slot.time}</div>
                      <div style={{ fontSize: "0.6rem", color: "#9CA3AF" }}>{slot.patients} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4 flex-wrap">
            {Object.entries(slotColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs" style={{ color: "#6B7280" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: color }} />
                {type}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FOLLOW-UPS ── */}
      {activeNav === "Follow-ups" && (
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ margin: 0, color: "#1B2B3A" }}>Follow-up Patients</h3>
            <div className="flex gap-3 text-sm">
              <span style={{ color: "#E63946" }}>● {followUps.filter(f => f.status === "Overdue").length} Overdue</span>
              <span style={{ color: "#F4A261" }}>● {followUps.filter(f => f.status === "Due Today").length} Due Today</span>
              <span style={{ color: "#059669" }}>● {followUps.filter(f => f.status === "Upcoming").length} Upcoming</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {followUps.map(f => {
              const status = followUpStatus[f.id] || f.status;
              return (
                <div key={f.id} className="flex items-center gap-4 p-4 rounded-xl border border-border hover:shadow-sm transition-all">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ background: f.risk === "High" ? "#E63946" : f.risk === "Medium" ? "#F4A261" : "#2A9D8F" }}>
                    {f.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{f.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{f.age}y</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{ background: f.risk === "High" ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)", color: f.risk === "High" ? "#E63946" : "#F4A261" }}>
                        {f.risk} Risk
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>{f.reason} · Due: {f.dueDate}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: status === "Overdue" ? "rgba(230,57,70,0.1)" : status === "Due Today" ? "rgba(244,162,97,0.1)" : "rgba(42,157,143,0.1)", color: status === "Overdue" ? "#E63946" : status === "Due Today" ? "#F4A261" : "#2A9D8F" }}>
                    {status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => { showAlert(`WhatsApp reminder sent to ${f.name}`); setFollowUpStatus(s => ({ ...s, [f.id]: "Reminded" })); }}
                      className="p-2 rounded-lg hover:bg-muted transition-all" title="Send WhatsApp reminder">
                      <MessageSquare size={15} style={{ color: "#25D366" }} />
                    </button>
                    <button onClick={() => { showAlert(`${f.name} rescheduled`); setFollowUpStatus(s => ({ ...s, [f.id]: "Rescheduled" })); }}
                      className="p-2 rounded-lg hover:bg-muted transition-all" title="Reschedule">
                      <RefreshCw size={15} style={{ color: "#4A9EDA" }} />
                    </button>
                    <button onClick={() => { showAlert(`${f.name} marked as attended`); setFollowUpStatus(s => ({ ...s, [f.id]: "Completed" })); }}
                      className="p-2 rounded-lg hover:bg-muted transition-all" title="Mark done">
                      <CheckCircle2 size={15} style={{ color: "#059669" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
