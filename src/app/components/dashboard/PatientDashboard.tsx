import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Heart, Calendar, FileText, Receipt, Video,
  MessageSquare, Download, Clock, CheckCircle2,
  ArrowLeft, LogOut, Bell, Pill, ChevronDown, ChevronUp,
  X, Phone, Mic, MicOff, VideoOff, PhoneOff,
} from "lucide-react";
import { myAppointments, myLabReports, myPrescriptions, myPayments } from "../../data/mockData";

interface Props { onLogout: () => void; }

const navItems = [
  { icon: <Heart size={16} />, label: "Dashboard" },
  { icon: <Calendar size={16} />, label: "Appointments" },
  { icon: <FileText size={16} />, label: "Lab Reports" },
  { icon: <Pill size={16} />, label: "Prescriptions" },
  { icon: <Receipt size={16} />, label: "Payments" },
  { icon: <Video size={16} />, label: "Teleconsult" },
];

export function PatientDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [cancelledApts, setCancelledApts] = useState<string[]>([]);
  const [inCall, setInCall] = useState(false);
  const [callDoctor, setCallDoctor] = useState("");
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const startCall = (doctor: string) => {
    setCallDoctor(doctor);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setCallDoctor("");
    showToast("Consultation ended. Prescription will be sent to your portal.");
  };

  const cancelAppointment = (id: string) => {
    setCancelledApts((prev) => [...prev, id]);
    showToast("Appointment cancelled. Refund will be processed in 3–5 days.");
  };

  const downloadReport = (test: string) => {
    showToast(`${test} — downloading PDF report...`);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F4F6F9" }}>
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#2A9D8F", fontSize: "0.88rem", fontWeight: 600, zIndex: 999 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video call overlay */}
      <AnimatePresence>
        {inCall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "#0D1B2A" }}
          >
            <div className="flex-1 flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white" style={{ background: "#2A9D8F" }}>
                  {callDoctor.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div style={{ color: "white", fontSize: "1.5rem", fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>{callDoctor}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>Video consultation in progress</div>
                <div className="flex items-center justify-center gap-1 mt-3">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#2A9D8F" }} />
                  <span style={{ color: "#2A9D8F", fontSize: "0.85rem" }}>LIVE</span>
                </div>
              </div>
              {/* Patient's own small video */}
              <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl flex items-center justify-center" style={{ background: "#1B2B3A" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>You</span>
              </div>
            </div>
            {/* Call controls */}
            <div className="flex items-center justify-center gap-4 p-6">
              <button
                onClick={() => setMuted(!muted)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                style={{ background: muted ? "#E63946" : "rgba(255,255,255,0.15)" }}
              >
                {muted ? <MicOff size={22} color="white" /> : <Mic size={22} color="white" />}
              </button>
              <button
                onClick={() => setVideoOff(!videoOff)}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
                style={{ background: videoOff ? "#E63946" : "rgba(255,255,255,0.15)" }}
              >
                {videoOff ? <VideoOff size={22} color="white" /> : <Video size={22} color="white" />}
              </button>
              <button
                onClick={endCall}
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "#E63946" }}
              >
                <PhoneOff size={24} color="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 flex-shrink-0" style={{ background: "#1B2B3A" }}>
        <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#2A9D8F" }}>
            <Heart size={15} fill="white" color="white" />
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white" }}>MedFlow</div>
            <div className="px-2 py-0.5 rounded-full inline-block" style={{ background: "#2A9D8F", fontSize: "0.6rem", fontWeight: 700, color: "white" }}>Patient Portal</div>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-left"
              style={{ background: activeNav === item.label ? "#2A9D8F" : "transparent", color: activeNav === item.label ? "white" : "rgba(255,255,255,0.6)" }}
            >
              {item.icon}
              <span style={{ fontSize: "0.88rem", fontWeight: activeNav === item.label ? 600 : 400 }}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white" style={{ background: "#2A9D8F" }}>A</div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "white" }}>Arjun Mehta</div>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>UHID: MF-284819</div>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 w-full" style={{ color: "rgba(255,255,255,0.5)" }}>
            <LogOut size={15} /><span style={{ fontSize: "0.85rem" }}>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b flex-shrink-0" style={{ background: "white", borderColor: "rgba(0,0,0,0.06)" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1B2B3A" }}>Welcome back, Arjun</div>
            <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Patient Portal · UHID: MF-284819</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted" onClick={() => showToast("2 notifications: Lab report ready, Appointment reminder")}>
              <Bell size={17} style={{ color: "#6B7280" }} />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full text-white flex items-center justify-center" style={{ background: "#E63946", fontSize: "0.55rem", fontWeight: 700 }}>2</span>
            </button>
            <button onClick={() => setActiveNav("Teleconsult")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white hover:opacity-90" style={{ background: "#2A9D8F", fontSize: "0.82rem", fontWeight: 600 }}>
              <Video size={13} /> Video Consult
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {activeNav === "Dashboard" && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Next Appointment", value: "12 Jun", sub: "Dr. Sharma, 10AM", color: "#2A9D8F", bg: "#F0F9F7", onClick: () => setActiveNav("Appointments") },
                  { label: "Reports Ready", value: "3", sub: "Click to download", color: "#4A9EDA", bg: "#EFF6FD", onClick: () => setActiveNav("Lab Reports") },
                  { label: "Active Medicines", value: "2", sub: "Prescription active", color: "#7C3AED", bg: "#F3EFFE", onClick: () => setActiveNav("Prescriptions") },
                  { label: "Pending Bills", value: "₹0", sub: "All paid ✓", color: "#059669", bg: "#EDFAF4", onClick: () => setActiveNav("Payments") },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl p-4 border border-border cursor-pointer hover:shadow-md transition-all" onClick={s.onClick}>
                    <div className="w-8 h-8 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
                      <Heart size={14} style={{ color: s.color }} />
                    </div>
                    <div style={{ fontSize: "1.4rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                    <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "#1B2B3A" }}>{s.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-border p-5">
                  <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1rem" }}>Upcoming Appointments</h3>
                  {myAppointments.filter((a) => a.status !== "Completed").map((apt) => (
                    <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>
                        {apt.type === "Video" ? <Video size={16} /> : <User size={16} />}
                      </div>
                      <div className="flex-1">
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1B2B3A" }}>{apt.doctor}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{apt.dept} · {apt.date} · {apt.time}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="mt-2 w-full py-2.5 rounded-xl transition-all hover:opacity-90 text-white"
                    style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.85rem" }}
                  >
                    <Calendar size={13} className="inline mr-1.5" /> Book New Appointment
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-border p-5">
                  <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1rem" }}>Recent Lab Reports</h3>
                  {myLabReports.slice(0, 3).map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FD", color: "#4A9EDA" }}>
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#1B2B3A" }}>{r.test}</div>
                        <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{r.date} · {r.doctor}</div>
                      </div>
                      <button
                        onClick={() => downloadReport(r.test)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:bg-primary hover:text-white"
                        style={{ border: "1px solid #4A9EDA", color: "#4A9EDA", fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        <Download size={11} /> PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === "Appointments" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 style={{ color: "#1B2B3A", margin: 0 }}>My Appointments</h3>
                <button
                  onClick={() => setBookingOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:opacity-90"
                  style={{ background: "#2A9D8F", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  <Calendar size={14} /> Book New
                </button>
              </div>
              {myAppointments.map((apt) => {
                const cancelled = cancelledApts.includes(apt.id);
                return (
                  <div key={apt.id} className="bg-white rounded-2xl border border-border p-5" style={{ opacity: cancelled ? 0.6 : 1 }}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>
                        {apt.type === "Video" ? <Video size={20} /> : <User size={20} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "1rem" }}>{apt.doctor}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}>{apt.type}</span>
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "0.5rem" }}>{apt.dept} · Token: {apt.token}</div>
                        <div className="flex gap-4 flex-wrap">
                          <span className="flex items-center gap-1" style={{ fontSize: "0.83rem", color: "#1B2B3A" }}>
                            <Calendar size={13} style={{ color: "#9CA3AF" }} /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1" style={{ fontSize: "0.83rem", color: "#1B2B3A" }}>
                            <Clock size={13} style={{ color: "#9CA3AF" }} /> {apt.time}
                          </span>
                          <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#2A9D8F" }}>₹{apt.fees}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: cancelled ? "rgba(230,57,70,0.1)" : apt.status === "Completed" ? "rgba(5,150,105,0.1)" : "rgba(42,157,143,0.1)",
                            color: cancelled ? "#E63946" : apt.status === "Completed" ? "#059669" : "#2A9D8F",
                          }}
                        >
                          {cancelled ? "Cancelled" : apt.status}
                        </span>
                        {apt.status === "Confirmed" && !cancelled && (
                          <div className="flex gap-2">
                            {apt.type === "Video" && (
                              <button
                                onClick={() => startCall(apt.doctor)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
                                style={{ background: "#2A9D8F" }}
                              >
                                <Video size={13} /> Join Call
                              </button>
                            )}
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                              style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Booking modal */}
              <AnimatePresence>
                {bookingOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.5)" }}
                    onClick={() => setBookingOpen(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95 }}
                      className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-5">
                        <h3 style={{ margin: 0, color: "#1B2B3A" }}>Book Appointment</h3>
                        <button onClick={() => setBookingOpen(false)} className="p-1 rounded-lg hover:bg-muted"><X size={18} /></button>
                      </div>
                      <div className="flex flex-col gap-3">
                        {[
                          { label: "Specialty", placeholder: "Select specialty", type: "select", options: ["Cardiology", "Neurology", "Orthopedics", "General Medicine"] },
                          { label: "Preferred Date", placeholder: "", type: "date" },
                          { label: "Time Slot", placeholder: "Select time", type: "select", options: ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"] },
                          { label: "Consultation Type", placeholder: "Select type", type: "select", options: ["OPD (In-person)", "Video Consultation"] },
                        ].map((field) => (
                          <div key={field.label}>
                            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#374151", display: "block", marginBottom: "0.25rem" }}>{field.label}</label>
                            {field.type === "select" ? (
                              <select className="w-full px-3 py-2.5 rounded-xl border border-border outline-none" style={{ fontSize: "0.85rem", color: "#1B2B3A" }}>
                                <option value="">{field.placeholder}</option>
                                {(field.options || []).map((opt) => <option key={opt}>{opt}</option>)}
                              </select>
                            ) : (
                              <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-border outline-none" style={{ fontSize: "0.85rem" }} />
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => { setBookingOpen(false); showToast("Appointment booked! Confirmation sent to your WhatsApp."); }}
                          className="w-full py-3 rounded-xl text-white hover:opacity-90 transition-all mt-2"
                          style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.9rem" }}
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeNav === "Lab Reports" && (
            <div className="flex flex-col gap-4">
              <h3 style={{ color: "#1B2B3A", margin: 0 }}>My Lab Reports</h3>
              {myLabReports.map((report) => (
                <div key={report.id} className="bg-white rounded-2xl border border-border overflow-hidden">
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FD", color: "#4A9EDA" }}>
                      <FileText size={16} />
                    </div>
                    <div className="flex-1">
                      <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{report.test}</div>
                      <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{report.date} · {report.doctor}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>{report.status}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadReport(report.test); }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:bg-primary hover:text-white"
                        style={{ border: "1px solid #4A9EDA", color: "#4A9EDA", fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        <Download size={11} /> PDF
                      </button>
                      {expandedReport === report.id ? <ChevronUp size={16} style={{ color: "#9CA3AF" }} /> : <ChevronDown size={16} style={{ color: "#9CA3AF" }} />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedReport === report.id && report.values.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                          <table className="w-full mt-3" style={{ fontSize: "0.83rem", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                                {["Parameter", "Value", "Normal Range", "Flag"].map((h) => (
                                  <th key={h} className="text-left py-2 px-3" style={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.75rem" }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {report.values.map((val, i) => (
                                <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                                  <td className="py-2 px-3" style={{ color: "#1B2B3A", fontWeight: 500 }}>{val.name}</td>
                                  <td className="py-2 px-3" style={{ fontWeight: 700, color: val.flag === "Normal" ? "#1B2B3A" : "#E63946" }}>{val.value}</td>
                                  <td className="py-2 px-3" style={{ color: "#9CA3AF" }}>{val.normal}</td>
                                  <td className="py-2 px-3">
                                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: val.flag === "Normal" ? "rgba(42,157,143,0.1)" : "rgba(230,57,70,0.1)", color: val.flag === "Normal" ? "#2A9D8F" : "#E63946" }}>
                                      {val.flag}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </motion.div>
                    )}
                    {expandedReport === report.id && report.values.length === 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                        <div className="px-4 pb-4 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", color: "#9CA3AF", fontSize: "0.85rem" }}>
                          Detailed report available as PDF. Click Download to view.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {activeNav === "Prescriptions" && (
            <div className="flex flex-col gap-4">
              <h3 style={{ color: "#1B2B3A", margin: 0 }}>My Prescriptions</h3>
              {myPrescriptions.map((rx) => (
                <div key={rx.id} className="bg-white rounded-2xl border border-border p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>
                      <Pill size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{rx.doctor}</span>
                        <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{rx.dept} · {rx.date}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: rx.status === "Active" ? "rgba(42,157,143,0.1)" : "#F4F6F9", color: rx.status === "Active" ? "#2A9D8F" : "#9CA3AF" }}>
                          {rx.status}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>{rx.diagnosis}</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    {rx.medicines.map((med, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F4F6F9" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.88rem" }}>{med.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{med.freq} · {med.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => showToast(`${rx.id} downloaded as PDF.`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white hover:opacity-90"
                      style={{ background: "#7C3AED", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      <Download size={14} /> Download PDF
                    </button>
                    <button
                      onClick={() => showToast("Prescription sent to your WhatsApp.")}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl hover:opacity-90 transition-all"
                      style={{ background: "rgba(5,150,105,0.1)", color: "#059669", fontSize: "0.85rem", fontWeight: 600 }}
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeNav === "Payments" && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 style={{ color: "#1B2B3A", margin: 0 }}>Payment History</h3>
                <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                  Total paid: <strong style={{ color: "#1B2B3A" }}>₹{myPayments.filter((p) => p.status === "Paid").reduce((a, b) => a + b.amount, 0).toLocaleString()}</strong>
                </div>
              </div>
              {myPayments.map((pay) => (
                <div key={pay.id} className="bg-white rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: pay.status === "Paid" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)", color: pay.status === "Paid" ? "#2A9D8F" : "#F4A261" }}
                    >
                      <Receipt size={16} />
                    </div>
                    <div className="flex-1">
                      <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.9rem" }}>{pay.desc}</div>
                      <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{pay.date} · {pay.method !== "-" ? pay.method : "Pending"} · {pay.invoice !== "-" ? pay.invoice : "—"}</div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1B2B3A" }}>₹{pay.amount}</div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: pay.status === "Paid" ? "rgba(5,150,105,0.1)" : "rgba(244,162,97,0.1)", color: pay.status === "Paid" ? "#059669" : "#F4A261" }}>
                        {pay.status}
                      </span>
                    </div>
                    {pay.status === "Paid" && (
                      <button
                        onClick={() => showToast(`Invoice ${pay.invoice} downloaded.`)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg ml-2 transition-all hover:bg-primary hover:text-white"
                        style={{ border: "1px solid #4A9EDA", color: "#4A9EDA", fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        <Download size={11} /> Receipt
                      </button>
                    )}
                    {pay.status === "Pending" && (
                      <button
                        onClick={() => showToast("Redirecting to payment gateway...")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg ml-2 text-white hover:opacity-90 transition-all"
                        style={{ background: "#2A9D8F", fontSize: "0.78rem", fontWeight: 600 }}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeNav === "Teleconsult" && (
            <div className="flex flex-col gap-5">
              <h3 style={{ color: "#1B2B3A", margin: 0 }}>Video Consultation</h3>
              <div className="grid lg:grid-cols-2 gap-4">
                {[
                  { doctor: "Dr. Rajesh Sharma", dept: "Cardiology", available: true, slot: "Available now", fee: 600, rating: "4.9" },
                  { doctor: "Dr. Priya Mehta", dept: "Neurology", available: true, slot: "Next: 12:30 PM", fee: 600, rating: "4.8" },
                  { doctor: "Dr. Sunita Patel", dept: "Gynaecology", available: false, slot: "Available at 2:00 PM", fee: 500, rating: "4.7" },
                  { doctor: "Dr. Arun Kumar", dept: "Orthopedics", available: false, slot: "Available at 3:30 PM", fee: 700, rating: "4.6" },
                ].map((doc) => (
                  <div key={doc.doctor} className="bg-white rounded-2xl border border-border p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold text-white" style={{ background: "#2A9D8F" }}>
                        {doc.doctor.split(" ").slice(1).map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "1rem" }}>{doc.doctor}</div>
                        <div style={{ fontSize: "0.83rem", color: "#6B7280" }}>{doc.dept}</div>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <span style={{ fontSize: "0.8rem", color: doc.available ? "#059669" : "#9CA3AF" }}>● {doc.slot}</span>
                          <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>⭐ {doc.rating}</span>
                          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2A9D8F" }}>₹{doc.fee}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => doc.available ? startCall(doc.doctor) : showToast(`Appointment booked with ${doc.doctor} for ${doc.slot}`)}
                      className="mt-4 w-full py-2.5 rounded-xl text-white hover:opacity-90 transition-all"
                      style={{ background: doc.available ? "#2A9D8F" : "#6B7280", fontWeight: 600, fontSize: "0.85rem" }}
                    >
                      <Video size={14} className="inline mr-2" />
                      {doc.available ? "Start Video Call" : "Book Slot"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
