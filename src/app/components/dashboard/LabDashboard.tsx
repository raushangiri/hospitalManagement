import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical, LayoutDashboard, Microscope, AlertTriangle,
  FileText, Download, CheckCircle2, Clock, Zap, Share2,
  Plus, Trash2, Receipt, User, Printer, Search,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { labTestQueue, reportsReady, criticalValues as initialCriticalValues } from "../../data/mockData";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview" },
  { icon: <Microscope size={16} />, label: "Sample Tracking", badge: 14 },
  { icon: <Plus size={16} />, label: "Walk-in Tests" },
  { icon: <AlertTriangle size={16} />, label: "Critical Values", badge: 3 },
  { icon: <FileText size={16} />, label: "Reports Ready", badge: 7 },
];

const testCatalog = [
  { id: "CBC", name: "Complete Blood Count (CBC)", price: 350, dept: "Hematology", time: "2 hrs" },
  { id: "LFT", name: "Liver Function Test (LFT)", price: 650, dept: "Biochemistry", time: "4 hrs" },
  { id: "KFT", name: "Kidney Function Test (KFT)", price: 550, dept: "Biochemistry", time: "4 hrs" },
  { id: "THYROID", name: "Thyroid Profile (T3/T4/TSH)", price: 800, dept: "Immunology", time: "6 hrs" },
  { id: "LIPID", name: "Lipid Profile", price: 600, dept: "Biochemistry", time: "4 hrs" },
  { id: "HBA1C", name: "HbA1c (Glycated Hemoglobin)", price: 550, dept: "Biochemistry", time: "4 hrs" },
  { id: "URINE", name: "Urine Routine & Microscopy", price: 200, dept: "Microbiology", time: "2 hrs" },
  { id: "CULTURE", name: "Blood Culture & Sensitivity", price: 900, dept: "Microbiology", time: "48 hrs" },
  { id: "XRAY", name: "X-Ray (Chest PA)", price: 300, dept: "Radiology", time: "30 mins" },
  { id: "ECG", name: "ECG (12-Lead)", price: 250, dept: "Cardiology", time: "Immediate" },
  { id: "BSF", name: "Blood Sugar Fasting", price: 120, dept: "Biochemistry", time: "2 hrs" },
  { id: "BSR", name: "Blood Sugar Random", price: 100, dept: "Biochemistry", time: "2 hrs" },
  { id: "DENGUE", name: "Dengue NS1 Antigen", price: 700, dept: "Serology", time: "4 hrs" },
  { id: "MALARIA", name: "Malaria Parasite (MP)", price: 250, dept: "Hematology", time: "2 hrs" },
  { id: "WIDAL", name: "Widal Test (Typhoid)", price: 200, dept: "Serology", time: "4 hrs" },
];

let walkInCounter = 3001;

interface WalkInBill {
  billNo: string;
  patient: { name: string; age: string; mobile: string; gender: string };
  tests: typeof testCatalog;
  total: number;
  time: string;
  paymentMode: string;
}

interface Props { onLogout: () => void; }

export function LabDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [criticals, setCriticals] = useState(initialCriticalValues.map((cv) => ({ ...cv })));
  const [alertedIds, setAlertedIds] = useState<number[]>([]);
  const [sampleStatuses, setSampleStatuses] = useState<Record<string, string>>({});
  const [releasedReports, setReleasedReports] = useState<string[]>([]);
  const [alertMsg, setAlertMsg] = useState("");

  // Walk-in Tests state
  const [wiPatient, setWiPatient] = useState({ name: "", age: "", mobile: "", gender: "Male" });
  const [wiSelected, setWiSelected] = useState<typeof testCatalog>([]);
  const [wiSearch, setWiSearch] = useState("");
  const [wiPayment, setWiPayment] = useState("Cash");
  const [wiCompletedBills, setWiCompletedBills] = useState<WalkInBill[]>([]);
  const [wiBillPreview, setWiBillPreview] = useState<WalkInBill | null>(null);

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const alertDoctor = (index: number, patient: string, test: string) => {
    setAlertedIds((prev) => [...prev, index]);
    setCriticals((prev) => prev.map((cv, i) => i === index ? { ...cv, alerted: true } : cv));
    showToast(`Doctor alerted for ${patient} — ${test} critical value!`);
  };

  const advanceSampleStatus = (sampleId: string, current: string) => {
    const pipeline = ["Received", "Processing", "Completed"];
    const next = pipeline[pipeline.indexOf(current) + 1] || "Completed";
    setSampleStatuses((prev) => ({ ...prev, [sampleId]: next }));
    showToast(`Sample ${sampleId} status updated to ${next}.`);
  };

  const releaseReport = (reportId: string, patient: string) => {
    setReleasedReports((prev) => [...prev, reportId]);
    showToast(`Report ${reportId} for ${patient} released to patient portal.`);
  };

  const wiSearchResults = wiSearch.length > 1
    ? testCatalog.filter(t => !wiSelected.find(s => s.id === t.id) && t.name.toLowerCase().includes(wiSearch.toLowerCase())).slice(0, 8)
    : [];
  const wiTotal = wiSelected.reduce((acc, t) => acc + t.price, 0);

  const addWiTest = (test: typeof testCatalog[0]) => {
    setWiSelected(prev => [...prev, test]);
    setWiSearch("");
  };

  const removeWiTest = (id: string) => setWiSelected(prev => prev.filter(t => t.id !== id));

  const generateWiBill = () => {
    if (!wiPatient.name || wiSelected.length === 0) { showToast("Please fill patient details and select at least one test."); return; }
    const bill: WalkInBill = {
      billNo: `LAB-WI-${walkInCounter++}`,
      patient: { ...wiPatient },
      tests: [...wiSelected],
      total: wiTotal,
      time: new Date().toLocaleTimeString(),
      paymentMode: wiPayment,
    };
    setWiCompletedBills(prev => [bill, ...prev]);
    setWiBillPreview(bill);
    setWiPatient({ name: "", age: "", mobile: "", gender: "Male" });
    setWiSelected([]);
    setWiSearch("");
  };

  const printWiBill = (bill: WalkInBill) => {
    const win = window.open("", "_blank", "width=380,height=600");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Lab Bill</title><style>
      body{font-family:monospace;margin:0;padding:16px;font-size:12px;}
      h2,h3{text-align:center;margin:4px 0;}
      .divider{border-top:1px dashed #999;margin:8px 0;}
      table{width:100%;border-collapse:collapse;}
      td{padding:3px 0;}
      .right{text-align:right;}
      .total{font-weight:bold;font-size:14px;}
    </style></head><body>
      <h2>MedFlow Hospital</h2>
      <h3>Laboratory Report — Walk-in</h3>
      <div class="divider"></div>
      <table>
        <tr><td>Bill No:</td><td class="right">${bill.billNo}</td></tr>
        <tr><td>Date/Time:</td><td class="right">${new Date().toLocaleDateString()} ${bill.time}</td></tr>
        <tr><td>Patient:</td><td class="right">${bill.patient.name}</td></tr>
        <tr><td>Age / Gender:</td><td class="right">${bill.patient.age} / ${bill.patient.gender}</td></tr>
        <tr><td>Mobile:</td><td class="right">${bill.patient.mobile}</td></tr>
      </table>
      <div class="divider"></div>
      <table>
        <tr><td><b>Test</b></td><td class="right"><b>Rate (₹)</b></td></tr>
        ${bill.tests.map(t => `<tr><td>${t.name}</td><td class="right">${t.price}</td></tr>`).join("")}
      </table>
      <div class="divider"></div>
      <table>
        <tr class="total"><td>TOTAL</td><td class="right">₹${bill.total}</td></tr>
        <tr><td>Payment Mode:</td><td class="right">${bill.paymentMode}</td></tr>
      </table>
      <div class="divider"></div>
      <p style="text-align:center;font-size:11px;">Reports will be ready as per turnaround time.<br/>Thank you for choosing MedFlow!</p>
    </body></html>`);
    win.document.close();
    win.print();
  };

  const sendWhatsApp = (patient: string) => {
    showToast(`Report link sent to ${patient} via WhatsApp.`);
  };

  return (
    <DashboardLayout
      dept="Laboratory"
      deptColor="#F4A261"
      deptIcon={<FlaskConical size={16} />}
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onLogout={onLogout}
      userName="Dr. Sneha Iyer"
    >
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#F4A261", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Samples Today", value: "68", sub: "12 STAT pending", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Tests Pending", value: "14", sub: "3 urgent", color: "#E63946", bg: "#FDF2F3" },
              { label: "Reports Ready", value: "7", sub: "Awaiting release", color: "#2A9D8F", bg: "#F0F9F7" },
              { label: "Critical Values", value: "3", sub: "Alerts sent", color: "#7C3AED", bg: "#F3EFFE" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-border"
              >
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
                  <FlaskConical size={16} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Pending Tests</h3>
                <button onClick={() => setActiveNav("Sample Tracking")} style={{ fontSize: "0.82rem", color: "#4A9EDA", fontWeight: 600 }}>
                  View all →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {labTestQueue.filter((t) => t.status !== "Completed").slice(0, 5).map((t) => {
                  const status = sampleStatuses[t.sampleId] || t.status;
                  return (
                    <div key={t.sampleId} className="flex items-start gap-3 p-3 rounded-xl border border-border">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: t.priority === "STAT" ? "rgba(230,57,70,0.1)" : t.priority === "Urgent" ? "rgba(244,162,97,0.1)" : "#F4F6F9", color: t.priority === "STAT" ? "#E63946" : t.priority === "Urgent" ? "#F4A261" : "#6B7280" }}
                      >
                        <Microscope size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.88rem" }}>{t.patient}</span>
                          <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{t.sampleId}</span>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: t.priority === "STAT" ? "rgba(230,57,70,0.1)" : t.priority === "Urgent" ? "rgba(244,162,97,0.1)" : "#F4F6F9", color: t.priority === "STAT" ? "#E63946" : t.priority === "Urgent" ? "#F4A261" : "#9CA3AF" }}
                          >
                            {t.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {t.tests.map((test) => (
                            <span key={test} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F4F6F9", color: "#6B7280" }}>{test}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: status === "Processing" ? "rgba(42,157,143,0.1)" : "#F4F6F9", color: status === "Processing" ? "#2A9D8F" : "#6B7280" }}>
                          {status}
                        </span>
                        <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "0.25rem" }}>{t.collected} AM</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={16} style={{ color: "#E63946" }} />
                <h3 style={{ margin: 0, color: "#E63946" }}>Critical Values</h3>
                <span className="w-2 h-2 rounded-full animate-pulse ml-1" style={{ background: "#E63946" }} />
              </div>
              <div className="flex flex-col gap-3">
                {criticals.map((cv, i) => (
                  <div key={i} className="p-3 rounded-xl border-l-2" style={{ background: "rgba(230,57,70,0.04)", borderLeftColor: "#E63946" }}>
                    <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.88rem" }}>{cv.patient}</div>
                    <div style={{ fontSize: "0.82rem", color: "#E63946", fontWeight: 600 }}>{cv.test}: <strong>{cv.value}</strong></div>
                    <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Normal: {cv.normal} · {cv.ward}</div>
                    <div className="mt-2 flex gap-2 flex-wrap">
                      <button
                        onClick={() => alertDoctor(i, cv.patient, cv.test)}
                        disabled={alertedIds.includes(i)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-60"
                        style={{ background: alertedIds.includes(i) ? "#059669" : "#E63946" }}
                      >
                        {alertedIds.includes(i) ? "✓ Alerted" : "Alert Doctor"}
                      </button>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>
                        {cv.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeNav === "Sample Tracking" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <h3 style={{ color: "#1B2B3A", margin: 0, marginBottom: "1.5rem" }}>Sample Tracking — Today</h3>
          <div className="flex flex-col gap-3">
            {labTestQueue.map((t) => {
              const status = sampleStatuses[t.sampleId] || t.status;
              const pipeline = ["Received", "Processing", "Completed"];
              return (
                <div key={t.sampleId} className="p-4 rounded-xl border border-border">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: t.priority === "STAT" ? "rgba(230,57,70,0.1)" : t.priority === "Urgent" ? "rgba(244,162,97,0.1)" : "#F4F6F9", color: t.priority === "STAT" ? "#E63946" : t.priority === "Urgent" ? "#F4A261" : "#6B7280" }}
                    >
                      <FlaskConical size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{t.patient}</span>
                        <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{t.sampleId} · {t.ward}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: t.priority === "STAT" ? "rgba(230,57,70,0.1)" : t.priority === "Urgent" ? "rgba(244,162,97,0.1)" : "#F4F6F9", color: t.priority === "STAT" ? "#E63946" : t.priority === "Urgent" ? "#F4A261" : "#9CA3AF" }}>
                          {t.priority}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {t.tests.map((test) => (
                          <span key={test} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F4F6F9", color: "#6B7280" }}>{test}</span>
                        ))}
                      </div>
                      {/* Pipeline progress */}
                      <div className="flex items-center gap-2">
                        {pipeline.map((step, i) => (
                          <div key={step} className="flex items-center gap-2">
                            <div
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: pipeline.indexOf(status) >= i ? "rgba(42,157,143,0.1)" : "#F4F6F9",
                                color: pipeline.indexOf(status) >= i ? "#2A9D8F" : "#9CA3AF",
                              }}
                            >
                              {pipeline.indexOf(status) > i && <CheckCircle2 size={10} />}
                              {step}
                            </div>
                            {i < pipeline.length - 1 && (
                              <div className="w-6 h-0.5 rounded" style={{ background: pipeline.indexOf(status) > i ? "#2A9D8F" : "#E5E7EB" }} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {status !== "Completed" ? (
                        <button
                          onClick={() => advanceSampleStatus(t.sampleId, status)}
                          className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "#F4A261" }}
                        >
                          {status === "Received" ? "Start Processing" : "Mark Complete"}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#2A9D8F" }}>
                          <CheckCircle2 size={14} /> Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeNav === "Critical Values" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Zap size={20} style={{ color: "#E63946" }} />
            <h3 style={{ color: "#E63946", margin: 0 }}>Critical Values — Immediate Action Required</h3>
          </div>
          {criticals.map((cv, i) => (
            <div key={i} className="bg-white rounded-2xl border-l-4 border-border p-5" style={{ borderLeftColor: "#E63946" }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>
                  <AlertTriangle size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <span style={{ fontWeight: 700, fontSize: "1rem", color: "#1B2B3A" }}>{cv.patient}</span>
                    <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{cv.ward}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>{cv.severity}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 p-3 rounded-xl mb-3" style={{ background: "#FDF2F3" }}>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Test</div>
                      <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{cv.test}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Value</div>
                      <div style={{ fontWeight: 700, color: "#E63946", fontSize: "1.1rem" }}>{cv.value}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>Normal Range</div>
                      <div style={{ fontWeight: 600, color: "#6B7280" }}>{cv.normal}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => alertDoctor(i, cv.patient, cv.test)}
                      disabled={alertedIds.includes(i)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                      style={{ background: alertedIds.includes(i) ? "#059669" : "#E63946" }}
                    >
                      {alertedIds.includes(i) ? <><CheckCircle2 size={14} /> Doctor Alerted</> : "Alert Doctor Now"}
                    </button>
                    <button
                      onClick={() => showToast(`Critical value SMS sent to doctor for ${cv.patient}.`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}
                    >
                      Send SMS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeNav === "Reports Ready" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Reports Ready for Release</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(42,157,143,0.1)", color: "#2A9D8F" }}>
              {reportsReady.filter((r) => !releasedReports.includes(r.reportId)).length} Pending
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {reportsReady.map((report) => {
              const released = releasedReports.includes(report.reportId);
              return (
                <div key={report.reportId} className="flex items-center gap-4 p-4 rounded-xl border border-border" style={{ opacity: released ? 0.6 : 1 }}>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: report.critical ? "rgba(230,57,70,0.1)" : "#F4F6F9", color: report.critical ? "#E63946" : "#6B7280" }}
                  >
                    <FileText size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{report.patient}</span>
                      {report.critical && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(230,57,70,0.1)", color: "#E63946" }}>CRITICAL</span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>{report.reportId} · {report.test} · {report.date} · {report.doctor}</div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {released ? (
                      <span className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#2A9D8F" }}>
                        <CheckCircle2 size={14} /> Released
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => sendWhatsApp(report.patient)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                          style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
                        >
                          <Share2 size={13} /> WhatsApp
                        </button>
                        <button
                          onClick={() => releaseReport(report.reportId, report.patient)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "#F4A261" }}
                        >
                          <CheckCircle2 size={13} /> Release
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeNav === "Walk-in Tests" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}>
              <Plus size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#1B2B3A" }}>Walk-in Test Booking</h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#9CA3AF" }}>Register a patient directly for lab tests without a doctor referral</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left — patient form + test selection */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Patient details */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={15} style={{ color: "#F4A261" }} />
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Patient Details</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Full Name *</label>
                    <input
                      value={wiPatient.name}
                      onChange={e => setWiPatient(p => ({ ...p, name: e.target.value }))}
                      placeholder="Patient's full name"
                      className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                      style={{ fontSize: "0.88rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Age</label>
                    <input
                      value={wiPatient.age}
                      onChange={e => setWiPatient(p => ({ ...p, age: e.target.value }))}
                      placeholder="e.g. 35"
                      className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                      style={{ fontSize: "0.88rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Mobile Number</label>
                    <input
                      value={wiPatient.mobile}
                      onChange={e => setWiPatient(p => ({ ...p, mobile: e.target.value }))}
                      placeholder="10-digit mobile"
                      className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                      style={{ fontSize: "0.88rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Gender</label>
                    <select
                      value={wiPatient.gender}
                      onChange={e => setWiPatient(p => ({ ...p, gender: e.target.value }))}
                      className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                      style={{ fontSize: "0.88rem" }}
                    >
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Test search */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Search size={15} style={{ color: "#F4A261" }} />
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Search & Add Tests</span>
                </div>
                <div className="relative">
                  <input
                    value={wiSearch}
                    onChange={e => setWiSearch(e.target.value)}
                    placeholder="Search by test name (e.g. CBC, Thyroid, LFT...)"
                    className="w-full border border-border rounded-xl px-3 py-2.5 outline-none"
                    style={{ fontSize: "0.88rem" }}
                  />
                  <AnimatePresence>
                    {wiSearchResults.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl border border-border z-10 overflow-hidden"
                        style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                      >
                        {wiSearchResults.map(test => (
                          <button
                            key={test.id}
                            onClick={() => addWiTest(test)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                          >
                            <div>
                              <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.88rem" }}>{test.name}</div>
                              <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{test.dept} · TAT: {test.time}</div>
                            </div>
                            <span style={{ fontWeight: 700, color: "#F4A261", fontSize: "0.9rem" }}>₹{test.price}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick select buttons */}
                <div className="mt-3">
                  <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: "0.5rem" }}>Quick Add:</div>
                  <div className="flex flex-wrap gap-2">
                    {testCatalog.filter(t => !wiSelected.find(s => s.id === t.id)).slice(0, 6).map(test => (
                      <button
                        key={test.id}
                        onClick={() => addWiTest(test)}
                        className="px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                        style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}
                      >
                        + {test.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected tests */}
                {wiSelected.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1B2B3A", marginBottom: "0.25rem" }}>Selected Tests ({wiSelected.length})</div>
                    {wiSelected.map(test => (
                      <div key={test.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}>
                          <FlaskConical size={13} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{test.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{test.dept} · {test.time}</div>
                        </div>
                        <span style={{ fontWeight: 700, color: "#F4A261", fontSize: "0.9rem", flexShrink: 0 }}>₹{test.price}</span>
                        <button onClick={() => removeWiTest(test.id)} className="ml-1 p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#E63946" }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right — bill summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-border p-5 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={15} style={{ color: "#F4A261" }} />
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Bill Summary</span>
                </div>
                {wiSelected.length === 0 ? (
                  <div className="py-8 text-center" style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>No tests selected yet</div>
                ) : (
                  <div className="flex flex-col gap-2 mb-4">
                    {wiSelected.map(t => (
                      <div key={t.id} className="flex justify-between">
                        <span style={{ fontSize: "0.83rem", color: "#6B7280" }}>{t.id}</span>
                        <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "#1B2B3A" }}>₹{t.price}</span>
                      </div>
                    ))}
                    <div className="border-t border-border pt-2 mt-1">
                      <div className="flex justify-between">
                        <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Total</span>
                        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#F4A261" }}>₹{wiTotal}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Payment Mode</label>
                  <select
                    value={wiPayment}
                    onChange={e => setWiPayment(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option>
                  </select>
                </div>

                <button
                  onClick={generateWiBill}
                  disabled={!wiPatient.name || wiSelected.length === 0}
                  className="w-full py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: "#F4A261" }}
                >
                  Generate Lab Bill
                </button>

                {/* Recent bills */}
                {wiCompletedBills.length > 0 && (
                  <div className="mt-5">
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.75rem" }}>RECENT BILLS</div>
                    <div className="flex flex-col gap-2">
                      {wiCompletedBills.slice(0, 4).map(b => (
                        <div key={b.billNo} className="flex items-center justify-between p-2.5 rounded-xl border border-border">
                          <div>
                            <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.83rem" }}>{b.patient.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{b.billNo} · {b.tests.length} test{b.tests.length > 1 ? "s" : ""}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 700, color: "#F4A261", fontSize: "0.88rem" }}>₹{b.total}</span>
                            <button onClick={() => printWiBill(b)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: "#6B7280" }}>
                              <Printer size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Walk-in Bill Preview Modal */}
      <AnimatePresence>
        {wiBillPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setWiBillPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}>
                  <Receipt size={22} />
                </div>
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Lab Bill Generated</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>{wiBillPreview.billNo} · {wiBillPreview.time}</p>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ background: "#F4F6F9" }}>
                <div className="flex justify-between mb-1">
                  <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Patient</span>
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{wiBillPreview.patient.name}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Payment</span>
                  <span style={{ fontWeight: 600, color: "#1B2B3A" }}>{wiBillPreview.paymentMode}</span>
                </div>
                {wiBillPreview.tests.map(t => (
                  <div key={t.id} className="flex justify-between py-1 border-t border-border">
                    <span style={{ fontSize: "0.83rem", color: "#374151" }}>{t.name}</span>
                    <span style={{ fontWeight: 600, color: "#1B2B3A" }}>₹{t.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border mt-1">
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#F4A261" }}>₹{wiBillPreview.total}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => printWiBill(wiBillPreview)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                  style={{ background: "rgba(244,162,97,0.1)", color: "#F4A261" }}
                >
                  <Printer size={15} /> Print Receipt
                </button>
                <button
                  onClick={() => setWiBillPreview(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#F4A261" }}
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
