import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield, LayoutDashboard, BedDouble, Users, AlertTriangle,
  TrendingUp, Activity, Settings, BarChart3, Ambulance,
  CheckCircle2, Phone, XCircle, PhoneCall,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { staffOnDuty, emergencyCases, revenueMonthly } from "../../data/mockData";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview" },
  { icon: <BedDouble size={16} />, label: "Bed Management" },
  { icon: <Users size={16} />, label: "Staff on Duty" },
  { icon: <AlertTriangle size={16} />, label: "Alerts", badge: 4 },
  { icon: <BarChart3 size={16} />, label: "Analytics" },
  { icon: <Ambulance size={16} />, label: "Emergency" },
  { icon: <Settings size={16} />, label: "Settings" },
];

const bedData = [
  { ward: "General Ward A", total: 40, occupied: 32, available: 8 },
  { ward: "General Ward B", total: 40, occupied: 29, available: 11 },
  { ward: "ICU", total: 20, occupied: 18, available: 2 },
  { ward: "NICU", total: 10, occupied: 7, available: 3 },
  { ward: "Surgical Ward", total: 30, occupied: 22, available: 8 },
  { ward: "Maternity Ward", total: 20, occupied: 14, available: 6 },
];

const initialAlerts = [
  { id: 1, type: "critical", msg: "ICU Bed 14 — Patient critical, O₂ saturation 82%", time: "2 min ago", dept: "ICU" },
  { id: 2, type: "warning", msg: "Lab: 3 critical reports pending release for 1+ hour", time: "15 min ago", dept: "Lab" },
  { id: 3, type: "warning", msg: "Pharmacy stock alert: Amoxicillin below minimum threshold", time: "32 min ago", dept: "Pharmacy" },
  { id: 4, type: "info", msg: "Dr. Priya Mehta OPD ends 30 min early — 5 patients redirected", time: "1 hr ago", dept: "OPD" },
];

interface Props { onLogout: () => void; }

export function AdminDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [alerts, setAlerts] = useState(initialAlerts);
  const [resolvedAlerts, setResolvedAlerts] = useState<number[]>([]);
  const [alertMsg, setAlertMsg] = useState("");
  const [emergencyStatuses, setEmergencyStatuses] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const resolveAlert = (id: number) => {
    setResolvedAlerts((prev) => [...prev, id]);
    showToast("Alert resolved and logged.");
  };

  const escalateAlert = (id: number, dept: string) => {
    showToast(`Alert escalated to ${dept} department head.`);
  };

  const advanceEmergency = (id: string, current: string) => {
    const next = current === "In Treatment" ? "Stabilising" : current === "Stabilising" ? "Under Obs" : current === "Under Obs" ? "Treated" : "Treated";
    setEmergencyStatuses((prev) => ({ ...prev, [id]: next }));
    showToast(`Emergency ${id} status updated.`);
  };

  const revenueChartData = revenueMonthly.map((r) => ({
    month: r.month,
    OPD: Math.round(r.opd / 1000),
    IPD: Math.round(r.ipd / 1000),
    Pharmacy: Math.round(r.pharmacy / 1000),
    Lab: Math.round(r.lab / 1000),
  }));

  return (
    <DashboardLayout
      dept="Admin"
      deptColor="#1B2B3A"
      deptIcon={<Shield size={16} />}
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onLogout={onLogout}
      userName="Vikram Sinha"
    >
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#1B2B3A", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Beds Occupied", value: "122/160", sub: "76% occupancy", color: "#2A9D8F", bg: "#F0F9F7" },
              { label: "OPD Today", value: "187", sub: "+14% vs yesterday", color: "#4A9EDA", bg: "#EFF6FD" },
              { label: "Revenue Today", value: "₹4.2L", sub: "Target: ₹5L", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Active Emergencies", value: "3", sub: "2 critical", color: "#E63946", bg: "#FDF2F3" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-border"
              >
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
                  <TrendingUp size={16} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: "1.6rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1.25rem" }}>Ward-wise Bed Occupancy</h3>
              <div className="flex flex-col gap-3">
                {bedData.map((ward) => {
                  const pct = Math.round((ward.occupied / ward.total) * 100);
                  const color = pct > 90 ? "#E63946" : pct > 75 ? "#F4A261" : "#2A9D8F";
                  return (
                    <div key={ward.ward}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#1B2B3A" }}>{ward.ward}</span>
                        <div className="flex items-center gap-3">
                          <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{ward.occupied}/{ward.total}</span>
                          <span style={{ fontSize: "0.78rem", fontWeight: 700, color }}>{ward.available} free</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Live Alerts</h3>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E63946" }} />
              </div>
              <div className="flex flex-col gap-3">
                {alerts.filter((a) => !resolvedAlerts.includes(a.id)).slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3 rounded-xl border-l-2"
                    style={{
                      background: alert.type === "critical" ? "rgba(230,57,70,0.05)" : alert.type === "warning" ? "rgba(244,162,97,0.05)" : "rgba(74,158,218,0.05)",
                      borderLeftColor: alert.type === "critical" ? "#E63946" : alert.type === "warning" ? "#F4A261" : "#4A9EDA",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", color: "#1B2B3A", lineHeight: 1.5 }}>{alert.msg}</div>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", marginTop: "0.25rem" }}>{alert.time}</div>
                  </div>
                ))}
                {resolvedAlerts.length === alerts.length && (
                  <div className="text-center py-4" style={{ color: "#2A9D8F", fontSize: "0.85rem" }}>
                    <CheckCircle2 size={20} className="inline mr-1" /> All alerts resolved
                  </div>
                )}
              </div>
              <button
                onClick={() => setActiveNav("Alerts")}
                className="mt-3 w-full py-2 rounded-xl transition-all hover:bg-muted"
                style={{ fontSize: "0.82rem", color: "#4A9EDA", fontWeight: 600 }}
              >
                View all alerts →
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1.25rem" }}>Department Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { dept: "OPD", doctors: 8, nurses: 12 },
                { dept: "IPD", doctors: 6, nurses: 24 },
                { dept: "ICU", doctors: 3, nurses: 8 },
                { dept: "Emergency", doctors: 4, nurses: 6 },
                { dept: "Surgery", doctors: 5, nurses: 10 },
                { dept: "Lab", doctors: 2, nurses: 4 },
              ].map((d) => (
                <div key={d.dept} className="p-3 rounded-xl text-center" style={{ background: "#F4F6F9" }}>
                  <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.85rem" }}>{d.dept}</div>
                  <div style={{ fontSize: "0.75rem", color: "#2A9D8F", marginTop: "0.25rem" }}>{d.doctors} Doctors</div>
                  <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>{d.nurses} Nurses</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeNav === "Bed Management" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 style={{ color: "#1B2B3A", marginBottom: "1.5rem" }}>Real-time Bed Map</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {bedData.map((ward) => {
              const pct = Math.round((ward.occupied / ward.total) * 100);
              const color = pct > 90 ? "#E63946" : pct > 75 ? "#F4A261" : "#2A9D8F";
              return (
                <div key={ward.ward} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 style={{ margin: 0, color: "#1B2B3A" }}>{ward.ward}</h4>
                    <span className="px-2 py-0.5 rounded-full text-sm font-bold" style={{ background: `${color}15`, color }}>
                      {pct}%
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: ward.total }).map((_, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-md flex items-center justify-center"
                        title={i < ward.occupied ? "Occupied" : "Available"}
                        style={{ background: i < ward.occupied ? color : "#F4F6F9" }}
                      >
                        <BedDouble size={12} style={{ color: i < ward.occupied ? "white" : "#D1D5DB" }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-3" style={{ fontSize: "0.75rem" }}>
                    <span style={{ color: "#2A9D8F" }}>● {ward.available} Available</span>
                    <span style={{ color: "#E63946" }}>● {ward.occupied} Occupied</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeNav === "Staff on Duty" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Staff on Duty — Today</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>
              {staffOnDuty.filter((s) => s.status === "On Duty").length} On Duty
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.85rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.06)" }}>
                  {["Emp ID", "Name", "Department", "Role", "Shift", "Status", "Contact"].map((h) => (
                    <th key={h} className="text-left py-3 px-3" style={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.78rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staffOnDuty.map((staff, i) => (
                  <tr
                    key={staff.id}
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "transparent" : "#FAFBFC" }}
                  >
                    <td className="py-3 px-3" style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{staff.id}</td>
                    <td className="py-3 px-3">
                      <div style={{ fontWeight: 600, color: "#1B2B3A" }}>{staff.name}</div>
                    </td>
                    <td className="py-3 px-3" style={{ color: "#6B7280" }}>{staff.dept}</td>
                    <td className="py-3 px-3" style={{ color: "#6B7280", fontSize: "0.8rem" }}>{staff.role}</td>
                    <td className="py-3 px-3" style={{ color: "#6B7280", fontSize: "0.78rem" }}>{staff.shift}</td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{
                          background: staff.status === "On Duty" ? "rgba(42,157,143,0.1)" : "rgba(107,114,128,0.1)",
                          color: staff.status === "On Duty" ? "#2A9D8F" : "#6B7280",
                        }}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => showToast(`Calling ${staff.name} at ${staff.mobile}`)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:bg-primary hover:text-white"
                        style={{ border: "1px solid #2A9D8F", color: "#2A9D8F", fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        <Phone size={11} /> Call
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeNav === "Alerts" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>System Alerts</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>
              {alerts.filter((a) => !resolvedAlerts.includes(a.id)).length} Active
            </span>
          </div>
          {alerts.map((alert) => {
            const resolved = resolvedAlerts.includes(alert.id);
            return (
              <div
                key={alert.id}
                className="bg-white rounded-2xl border border-border p-5"
                style={{ opacity: resolved ? 0.5 : 1 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: alert.type === "critical" ? "rgba(230,57,70,0.1)" : alert.type === "warning" ? "rgba(244,162,97,0.1)" : "rgba(74,158,218,0.1)",
                      color: alert.type === "critical" ? "#E63946" : alert.type === "warning" ? "#F4A261" : "#4A9EDA",
                    }}
                  >
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
                        style={{
                          background: alert.type === "critical" ? "rgba(230,57,70,0.1)" : alert.type === "warning" ? "rgba(244,162,97,0.1)" : "rgba(74,158,218,0.1)",
                          color: alert.type === "critical" ? "#E63946" : alert.type === "warning" ? "#F4A261" : "#4A9EDA",
                        }}
                      >
                        {alert.type}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{alert.dept} · {alert.time}</span>
                    </div>
                    <div style={{ color: "#1B2B3A", fontWeight: 500 }}>{alert.msg}</div>
                  </div>
                  {!resolved ? (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => escalateAlert(alert.id, alert.dept)}
                        className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                        style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}
                      >
                        Escalate
                      </button>
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "#2A9D8F" }}
                      >
                        <CheckCircle2 size={13} /> Resolve
                      </button>
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-sm font-semibold flex-shrink-0" style={{ color: "#2A9D8F" }}>
                      <CheckCircle2 size={14} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeNav === "Analytics" && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 style={{ color: "#1B2B3A", marginBottom: "1.5rem", margin: 0 }}>Monthly Revenue by Department (₹ Thousands)</h3>
            <div style={{ height: 300, marginTop: "1.5rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" style={{ fontSize: "0.78rem" }} />
                  <YAxis style={{ fontSize: "0.78rem" }} />
                  <Tooltip formatter={(value: number) => [`₹${value}K`, ""]} />
                  <Legend />
                  <Bar dataKey="OPD" fill="#2A9D8F" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="IPD" fill="#4A9EDA" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pharmacy" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lab" fill="#F4A261" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 style={{ color: "#1B2B3A", marginBottom: "1.5rem", margin: 0 }}>Revenue Trend — OPD + IPD</h3>
            <div style={{ height: 260, marginTop: "1.5rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" style={{ fontSize: "0.78rem" }} />
                  <YAxis style={{ fontSize: "0.78rem" }} />
                  <Tooltip formatter={(value: number) => [`₹${value}K`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="OPD" stroke="#2A9D8F" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="IPD" stroke="#4A9EDA" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue (6 Mo)", value: "₹1.23Cr", sub: "All departments" },
              { label: "Best Month", value: "May", sub: "₹15.6L total" },
              { label: "Avg Daily OPD", value: "₹14,267", sub: "Per day avg" },
              { label: "IPD Share", value: "48%", sub: "Of total revenue" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
                <div style={{ fontSize: "1.4rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNav === "Emergency" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Active Emergency Cases</h3>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: "#E63946" }} />
              <span style={{ fontSize: "0.85rem", color: "#E63946", fontWeight: 600 }}>LIVE</span>
            </div>
          </div>
          {emergencyCases.map((em) => {
            const status = emergencyStatuses[em.id] || em.status;
            const triageColor = em.triage === "Red" ? "#E63946" : em.triage === "Orange" ? "#F4A261" : "#F59E0B";
            return (
              <div key={em.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white"
                    style={{ background: triageColor, fontSize: "0.8rem" }}
                  >
                    {em.triage}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "1rem" }}>{em.name}</span>
                      <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Age: {em.age} · {em.id}</span>
                      <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>Arrived: {em.arrivalTime}</span>
                    </div>
                    <div style={{ fontSize: "0.88rem", color: "#374151", marginBottom: "0.5rem" }}>{em.complaint}</div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span style={{ fontSize: "0.78rem", color: "#6B7280" }}>🛏 {em.bedAssigned}</span>
                      <span style={{ fontSize: "0.78rem", color: "#6B7280" }}>👨‍⚕️ {em.doctor}</span>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: status === "Treated" ? "rgba(5,150,105,0.1)" : status === "In Treatment" ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)",
                          color: status === "Treated" ? "#059669" : status === "In Treatment" ? "#E63946" : "#F4A261",
                        }}
                      >
                        {status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => showToast(`Calling ${em.doctor} for ${em.name}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}
                    >
                      <PhoneCall size={13} /> Call Doctor
                    </button>
                    {status !== "Treated" && (
                      <button
                        onClick={() => advanceEmergency(em.id, status)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "#2A9D8F" }}
                      >
                        Update Status
                      </button>
                    )}
                    {status === "Treated" && (
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#059669" }}>
                        <CheckCircle2 size={14} /> Treated
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeNav === "Settings" && (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(27,43,58,0.08)", color: "#1B2B3A" }}>
            <Settings size={28} />
          </div>
          <h3 style={{ color: "#1B2B3A" }}>Settings</h3>
          <p style={{ color: "#6B7280" }}>Hospital configuration, user management, and system settings available in production.</p>
        </div>
      )}
    </DashboardLayout>
  );
}
