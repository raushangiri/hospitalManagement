import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Receipt, LayoutDashboard, TrendingUp, Shield, FileText,
  Download, CheckCircle2, Clock, AlertCircle, CreditCard, Eye, X,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { billingQueue, insuranceClaims, revenueMonthly } from "../../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line,
} from "recharts";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview" },
  { icon: <Receipt size={16} />, label: "Billing Queue", badge: 8 },
  { icon: <Shield size={16} />, label: "Insurance Claims" },
  { icon: <TrendingUp size={16} />, label: "Revenue Reports" },
  { icon: <FileText size={16} />, label: "Invoices" },
];

interface Props { onLogout: () => void; }

export function AccountsDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [billedIds, setBilledIds] = useState<string[]>([]);
  const [selectedBill, setSelectedBill] = useState<typeof billingQueue[0] | null>(null);
  const [alertMsg, setAlertMsg] = useState("");

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const generateBill = (bill: typeof billingQueue[0]) => {
    setBilledIds((prev) => [...prev, bill.id]);
    setSelectedBill(null);
    showToast(`Invoice ${bill.id} generated and sent to patient.`);
  };

  const revenueChartData = revenueMonthly.map((r) => ({
    month: r.month,
    OPD: Math.round(r.opd / 1000),
    IPD: Math.round(r.ipd / 1000),
    Pharmacy: Math.round(r.pharmacy / 1000),
    Lab: Math.round(r.lab / 1000),
    Total: Math.round((r.opd + r.ipd + r.pharmacy + r.lab) / 1000),
  }));

  return (
    <DashboardLayout
      dept="Accounts"
      deptColor="#4A9EDA"
      deptIcon={<Receipt size={16} />}
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onLogout={onLogout}
      userName="Neha Agarwal"
    >
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#4A9EDA", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bill detail modal */}
      <AnimatePresence>
        {selectedBill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setSelectedBill(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 style={{ margin: 0, color: "#1B2B3A" }}>Invoice {selectedBill.id}</h3>
                  <div style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>{selectedBill.patient} · UHID: {selectedBill.uhid}</div>
                </div>
                <button onClick={() => setSelectedBill(null)} className="p-2 rounded-xl hover:bg-muted">
                  <X size={18} />
                </button>
              </div>

              <div className="rounded-xl border border-border overflow-hidden mb-4">
                <table className="w-full" style={{ fontSize: "0.85rem" }}>
                  <thead style={{ background: "#F4F6F9" }}>
                    <tr>
                      <th className="text-left py-2.5 px-4" style={{ color: "#6B7280", fontWeight: 600 }}>Description</th>
                      <th className="text-center py-2.5 px-3" style={{ color: "#6B7280", fontWeight: 600 }}>Qty</th>
                      <th className="text-right py-2.5 px-4" style={{ color: "#6B7280", fontWeight: 600 }}>Rate</th>
                      <th className="text-right py-2.5 px-4" style={{ color: "#6B7280", fontWeight: 600 }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedBill.items.map((item, i) => (
                      <tr key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <td className="py-2.5 px-4" style={{ color: "#1B2B3A" }}>{item.desc}</td>
                        <td className="py-2.5 px-3 text-center" style={{ color: "#6B7280" }}>{item.qty}</td>
                        <td className="py-2.5 px-4 text-right" style={{ color: "#6B7280" }}>₹{item.rate.toLocaleString()}</td>
                        <td className="py-2.5 px-4 text-right" style={{ fontWeight: 600, color: "#1B2B3A" }}>₹{(item.qty * item.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot style={{ background: "#F4F6F9", borderTop: "2px solid rgba(0,0,0,0.08)" }}>
                    <tr>
                      <td colSpan={3} className="py-3 px-4" style={{ fontWeight: 700, color: "#1B2B3A" }}>Total Amount</td>
                      <td className="py-3 px-4 text-right" style={{ fontWeight: 800, color: "#2A9D8F", fontSize: "1rem" }}>₹{selectedBill.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: "#F4F6F9" }}>
                <span style={{ fontSize: "0.82rem", color: "#6B7280" }}>Payment mode:</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1B2B3A" }}>{selectedBill.type}</span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedBill(null)}
                  className="flex-1 py-2.5 rounded-xl border transition-all hover:bg-muted"
                  style={{ borderColor: "rgba(0,0,0,0.1)", color: "#6B7280", fontWeight: 600 }}
                >
                  Close
                </button>
                {!billedIds.includes(selectedBill.id) && selectedBill.status !== "Paid" && (
                  <button
                    onClick={() => generateBill(selectedBill)}
                    className="flex-1 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ background: "#4A9EDA", fontWeight: 600 }}
                  >
                    Generate & Send Invoice
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Today's Revenue", value: "₹4.28L", sub: "+8% vs yesterday", color: "#2A9D8F", bg: "#F0F9F7" },
              { label: "Pending Bills", value: "23", sub: "₹8.4L outstanding", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Insurance Claims", value: "11", sub: "₹14.2L in pipeline", color: "#4A9EDA", bg: "#EFF6FD" },
              { label: "Month Revenue", value: "₹1.2Cr", sub: "87% of target", color: "#7C3AED", bg: "#F3EFFE" },
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
                <div style={{ fontSize: "1.5rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1.25rem" }}>Payment Mode Split</h3>
              <div className="flex flex-col gap-3">
                {[
                  { mode: "UPI", value: 38, amount: "₹1.62L", color: "#7C3AED" },
                  { mode: "Cash", value: 28, amount: "₹1.20L", color: "#2A9D8F" },
                  { mode: "Insurance", value: 22, amount: "₹94K", color: "#4A9EDA" },
                  { mode: "Card", value: 12, amount: "₹51K", color: "#F4A261" },
                ].map((p) => (
                  <div key={p.mode}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "0.85rem", color: "#1B2B3A", fontWeight: 500 }}>{p.mode}</span>
                      <span style={{ fontSize: "0.82rem", color: "#6B7280" }}>{p.amount} ({p.value}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Pending Bills</h3>
                <button
                  onClick={() => setActiveNav("Billing Queue")}
                  className="text-primary hover:underline transition-all"
                  style={{ fontSize: "0.82rem" }}
                >
                  View all
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {billingQueue.slice(0, 4).map((bill) => (
                  <div key={bill.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors cursor-pointer" onClick={() => setSelectedBill(bill)}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FD", color: "#4A9EDA" }}>
                      <CreditCard size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1B2B3A" }}>{bill.patient}</div>
                      <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{bill.dept} · {bill.age}</div>
                    </div>
                    <div className="text-right">
                      <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.9rem" }}>₹{bill.amount.toLocaleString()}</div>
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: bill.status === "Paid" ? "rgba(5,150,105,0.1)" : bill.status === "Ready to Bill" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)",
                          color: bill.status === "Paid" ? "#059669" : bill.status === "Ready to Bill" ? "#2A9D8F" : "#F4A261",
                        }}
                      >
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeNav === "Billing Queue" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Billing Queue</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}>
              {billingQueue.filter((b) => b.status !== "Paid").length} Pending
            </span>
          </div>
          {billingQueue.map((bill) => {
            const isBilled = billedIds.includes(bill.id) || bill.status === "Paid";
            return (
              <div key={bill.id} className="bg-white rounded-2xl border border-border p-5" style={{ opacity: isBilled ? 0.7 : 1 }}>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FD", color: "#4A9EDA" }}>
                    <Receipt size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{bill.patient}</span>
                      <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>UHID: {bill.uhid}</span>
                      <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{bill.id}</span>
                    </div>
                    <div style={{ fontSize: "0.83rem", color: "#6B7280", marginBottom: "0.5rem" }}>{bill.dept} · {bill.type} · {bill.age}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {bill.items.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F4F6F9", color: "#6B7280" }}>{item.desc}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1B2B3A" }}>₹{bill.amount.toLocaleString()}</div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: isBilled ? "rgba(5,150,105,0.1)" : bill.status === "Ready to Bill" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)",
                        color: isBilled ? "#059669" : bill.status === "Ready to Bill" ? "#2A9D8F" : "#F4A261",
                      }}
                    >
                      {isBilled ? "Billed" : bill.status}
                    </span>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                        style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}
                      >
                        <Eye size={13} /> View
                      </button>
                      {!isBilled && (
                        <button
                          onClick={() => generateBill(bill)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "#4A9EDA" }}
                        >
                          <CheckCircle2 size={13} /> Generate Bill
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeNav === "Insurance Claims" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Insurance Claims Tracker</h3>
            <button
              onClick={() => showToast("Claims report exported as CSV.")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
              style={{ background: "#4A9EDA", fontSize: "0.85rem", fontWeight: 600 }}
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {insuranceClaims.map((claim) => (
              <div key={claim.id} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#EFF6FD", color: "#4A9EDA" }}>
                  <Shield size={16} />
                </div>
                <div className="flex-1">
                  <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{claim.patient}</div>
                  <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{claim.id} · {claim.tpa} · Submitted: {claim.submitted} · Day {claim.daysOpen}</div>
                </div>
                <div className="text-right">
                  <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1B2B3A" }}>₹{claim.amount.toLocaleString()}</div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: claim.status === "Settled" ? "rgba(5,150,105,0.1)" : claim.status === "Pre-auth Approved" ? "rgba(42,157,143,0.1)" : claim.status === "Query Raised" ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)",
                      color: claim.status === "Settled" ? "#059669" : claim.status === "Pre-auth Approved" ? "#2A9D8F" : claim.status === "Query Raised" ? "#E63946" : "#F4A261",
                    }}
                  >
                    {claim.status}
                  </span>
                </div>
                <button
                  onClick={() => showToast(`Following up with ${claim.tpa} for ${claim.patient}`)}
                  className="px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 ml-2"
                  style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}
                >
                  Follow Up
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNav === "Revenue Reports" && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 style={{ color: "#1B2B3A", margin: 0, marginBottom: "1.5rem" }}>Monthly Revenue Breakdown (₹ Thousands)</h3>
            <div style={{ height: 300 }}>
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
            <h3 style={{ color: "#1B2B3A", margin: 0, marginBottom: "1.5rem" }}>Total Revenue Trend</h3>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="month" style={{ fontSize: "0.78rem" }} />
                  <YAxis style={{ fontSize: "0.78rem" }} />
                  <Tooltip formatter={(value: number) => [`₹${value}K`, ""]} />
                  <Line type="monotone" dataKey="Total" stroke="#4A9EDA" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeNav === "Invoices" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Invoice History</h3>
            <button
              onClick={() => showToast("Invoices exported as PDF.")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
              style={{ background: "#4A9EDA", fontSize: "0.85rem", fontWeight: 600 }}
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.85rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.06)" }}>
                  {["Invoice No", "Patient", "Department", "Amount", "Type", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left py-3 px-3" style={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.78rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {billingQueue.map((bill, i) => (
                  <tr key={bill.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "transparent" : "#FAFBFC" }}>
                    <td className="py-3 px-3" style={{ color: "#4A9EDA", fontWeight: 600 }}>{bill.id}</td>
                    <td className="py-3 px-3" style={{ fontWeight: 600, color: "#1B2B3A" }}>{bill.patient}</td>
                    <td className="py-3 px-3" style={{ color: "#6B7280", fontSize: "0.8rem" }}>{bill.dept}</td>
                    <td className="py-3 px-3" style={{ fontWeight: 700, color: "#1B2B3A" }}>₹{bill.amount.toLocaleString()}</td>
                    <td className="py-3 px-3" style={{ color: "#6B7280" }}>{bill.type}</td>
                    <td className="py-3 px-3">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: bill.status === "Paid" ? "rgba(5,150,105,0.1)" : bill.status === "Ready to Bill" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)",
                          color: bill.status === "Paid" ? "#059669" : bill.status === "Ready to Bill" ? "#2A9D8F" : "#F4A261",
                        }}
                      >
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => setSelectedBill(bill)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:bg-muted"
                        style={{ border: "1px solid #4A9EDA", color: "#4A9EDA", fontSize: "0.75rem", fontWeight: 600 }}
                      >
                        <Eye size={11} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
