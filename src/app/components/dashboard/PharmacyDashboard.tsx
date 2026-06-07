import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pill, LayoutDashboard, AlertTriangle, PackageCheck,
  ShoppingCart, BarChart3, RefreshCw, CheckCircle2, Search,
  Plus, Trash2, Receipt, User, Printer,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { inventory } from "../../data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview" },
  { icon: <ShoppingCart size={16} />, label: "Dispense Queue", badge: 9 },
  { icon: <Plus size={16} />, label: "Walk-in Sale" },
  { icon: <AlertTriangle size={16} />, label: "Stock Alerts", badge: 6 },
  { icon: <PackageCheck size={16} />, label: "Inventory" },
  { icon: <BarChart3 size={16} />, label: "Consumption Report" },
];

interface SaleItem { medId: string; name: string; qty: number; rate: number; unit: string; }

let saleCounter = 1001;

const dispenseQueue = [
  { rxId: "RX-5521", patient: "Ramesh Gupta", doctor: "Dr. Sharma", medicines: ["Tab Metoprolol 50mg ×30", "Tab Aspirin 75mg ×30", "Syr Lactulose 200ml"], status: "Ready", urgency: "IPD" },
  { rxId: "RX-5522", patient: "Sunita Devi", doctor: "Dr. Mehta", medicines: ["Cap Levothyroxine 50mcg ×30", "Tab Calcium 500mg ×60"], status: "Pending", urgency: "OPD" },
  { rxId: "RX-5523", patient: "Arjun Mehta", doctor: "Dr. Sharma", medicines: ["Inj Enoxaparin 40mg", "Tab Atorvastatin 40mg ×30"], status: "Ready", urgency: "IPD" },
  { rxId: "RX-5524", patient: "Kavya Sharma", doctor: "Dr. Sharma", medicines: ["Tab Metoprolol 50mg ×30", "Tab Pantoprazole 40mg ×14"], status: "Pending", urgency: "OPD" },
  { rxId: "RX-5525", patient: "Mohan Lal", doctor: "Dr. Sharma", medicines: ["Tab Metformin 500mg ×30", "Tab Glimepiride 1mg ×30", "Tab Furosemide 40mg ×7"], status: "Ready", urgency: "IPD" },
];

const stockAlerts = inventory.filter((med) => med.qty < med.min || med.expiry === "Jul 2026" || med.expiry === "Aug 2026");

const consumptionData = [
  { category: "Cardiac", units: 180 },
  { category: "Antibiotic", units: 140 },
  { category: "Diabetes", units: 95 },
  { category: "GI", units: 78 },
  { category: "Analgesic", units: 65 },
  { category: "Other", units: 42 },
];

interface Props { onLogout: () => void; }

export function PharmacyDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [dispensed, setDispensed] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  // Walk-in sale state
  const [salePatient, setSalePatient] = useState({ name: "", age: "", mobile: "" });
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [saleSearch, setSaleSearch] = useState("");
  const [saleSearchFocus, setSaleSearchFocus] = useState(false);
  const [completedBills, setCompletedBills] = useState<{ billNo: string; patient: string; total: number; items: SaleItem[] }[]>([]);
  const [billPreview, setBillPreview] = useState<typeof completedBills[0] | null>(null);

  const saleMedResults = saleSearch.length > 1
    ? inventory.filter(m => m.name.toLowerCase().includes(saleSearch.toLowerCase())).slice(0, 8)
    : [];

  const addSaleItem = (med: typeof inventory[0]) => {
    setSaleItems(prev => {
      const existing = prev.find(i => i.medId === med.id);
      if (existing) return prev.map(i => i.medId === med.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { medId: med.id, name: med.name, qty: 1, rate: med.rate, unit: med.unit }];
    });
    setSaleSearch("");
    setSaleSearchFocus(false);
  };

  const removeSaleItem = (medId: string) => setSaleItems(prev => prev.filter(i => i.medId !== medId));
  const updateSaleQty = (medId: string, qty: number) => setSaleItems(prev => prev.map(i => i.medId === medId ? { ...i, qty: Math.max(1, qty) } : i));
  const saleTotal = saleItems.reduce((acc, i) => acc + i.qty * i.rate, 0);

  const generateSaleBill = () => {
    if (!salePatient.name.trim() || saleItems.length === 0) {
      showToast("Please fill patient name and add at least one medicine.");
      return;
    }
    const billNo = `PHBILL-${saleCounter++}`;
    const bill = { billNo, patient: salePatient.name, total: saleTotal, items: [...saleItems] };
    setCompletedBills(prev => [bill, ...prev]);
    setBillPreview(bill);
    setSalePatient({ name: "", age: "", mobile: "" });
    setSaleItems([]);
    showToast(`Bill ${billNo} generated for ₹${saleTotal.toFixed(2)}`);
  };

  const printSaleBill = (bill: typeof completedBills[0]) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const html = `<!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#1B2B3A;max-width:400px}
      h2{color:#7C3AED;margin:0}
      .sub{font-size:12px;color:#6B7280}
      .divider{border:none;border-top:1px dashed #E5E7EB;margin:12px 0}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th{text-align:left;padding:4px 0;color:#9CA3AF;font-size:11px}
      td{padding:4px 0;border-bottom:1px solid #F4F6F9}
      .total{font-size:16px;font-weight:800;color:#7C3AED;text-align:right;margin-top:8px}
      @media print{button{display:none}}
    </style></head><body>
    <h2>MedFlow Medical Store</h2>
    <div class="sub">12 Healthcare Avenue, New Delhi | Ph: +91 11 4567 8900</div>
    <hr class="divider"/>
    <div><b>Bill No:</b> ${bill.billNo}</div>
    <div><b>Patient:</b> ${bill.patient}</div>
    <div><b>Date:</b> ${new Date().toLocaleDateString("en-IN")}</div>
    <hr class="divider"/>
    <table><thead><tr><th>Medicine</th><th>Qty</th><th>Rate</th><th>Amt</th></tr></thead>
    <tbody>${bill.items.map(i=>`<tr><td>${i.name}</td><td>${i.qty} ${i.unit}s</td><td>₹${i.rate}</td><td>₹${(i.qty*i.rate).toFixed(2)}</td></tr>`).join("")}</tbody>
    </table>
    <hr class="divider"/>
    <div class="total">Total: ₹${bill.total.toFixed(2)}</div>
    <div style="font-size:11px;color:#9CA3AF;margin-top:12px;text-align:center">Thank you for visiting MedFlow Hospital</div>
    <script>window.onload=()=>{window.print()}</script>
    </body></html>`;
    win.document.write(html); win.document.close();
  };

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const filteredInventory = inventory.filter(
    (med) =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout
      dept="Medical Store"
      deptColor="#7C3AED"
      deptIcon={<Pill size={16} />}
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onLogout={onLogout}
      userName="Santosh Yadav"
    >
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#7C3AED", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Prescriptions Today", value: "82", sub: "9 pending dispense", color: "#7C3AED", bg: "#F3EFFE" },
              { label: "Low Stock Items", value: "6", sub: "Needs indent today", color: "#E63946", bg: "#FDF2F3" },
              { label: "Near Expiry", value: "11", sub: "Within 90 days", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Today's Sales", value: "₹42,800", sub: "+12% vs yesterday", color: "#2A9D8F", bg: "#F0F9F7" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-border"
              >
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
                  <Pill size={16} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: "1.6rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-5 gap-5">
            <div className="lg:col-span-3 bg-white rounded-2xl border border-border p-5">
              <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1.25rem" }}>Dispense Queue</h3>
              <div className="flex flex-col gap-4">
                {dispenseQueue.slice(0, 3).map((rx) => (
                  <div key={rx.rxId} className="p-4 rounded-xl border border-border" style={{ opacity: dispensed.includes(rx.rxId) ? 0.5 : 1 }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{rx.patient}</span>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: rx.urgency === "IPD" ? "rgba(74,158,218,0.1)" : "#F4F6F9", color: rx.urgency === "IPD" ? "#4A9EDA" : "#9CA3AF" }}>
                            {rx.urgency}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{rx.rxId} · {rx.doctor}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: rx.status === "Ready" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)", color: rx.status === "Ready" ? "#2A9D8F" : "#F4A261" }}>
                        {rx.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {rx.medicines.map((m) => (
                        <span key={m} className="px-2 py-0.5 rounded-lg text-xs" style={{ background: "#F4F6F9", color: "#374151" }}>{m}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => { setDispensed((prev) => [...prev, rx.rxId]); showToast(`${rx.rxId} dispensed to ${rx.patient}.`); }}
                      disabled={dispensed.includes(rx.rxId)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "#7C3AED", fontSize: "0.82rem", fontWeight: 600 }}
                    >
                      {dispensed.includes(rx.rxId) ? <><CheckCircle2 size={13} /> Dispensed</> : <><PackageCheck size={13} /> Mark Dispensed</>}
                    </button>
                  </div>
                ))}
                <button onClick={() => setActiveNav("Dispense Queue")} style={{ color: "#7C3AED", fontSize: "0.82rem", fontWeight: 600, textAlign: "left" }}>
                  View all 9 →
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={16} style={{ color: "#F4A261" }} />
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Stock Alerts</h3>
              </div>
              <div className="flex flex-col gap-2">
                {stockAlerts.slice(0, 5).map((alert) => {
                  const isLow = alert.qty < alert.min;
                  return (
                    <div key={alert.id} className="p-3 rounded-xl border-l-2" style={{ background: isLow ? "rgba(230,57,70,0.04)" : "rgba(244,162,97,0.04)", borderLeftColor: isLow ? "#E63946" : "#F4A261" }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1B2B3A" }}>{alert.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
                          Stock: <strong style={{ color: isLow ? "#E63946" : "#1B2B3A" }}>{alert.qty}</strong> (min: {alert.min})
                        </span>
                        {!isLow && <span style={{ fontSize: "0.7rem", color: "#F4A261" }}>Exp: {alert.expiry}</span>}
                      </div>
                      <span className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: isLow ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)", color: isLow ? "#E63946" : "#F4A261" }}>
                        {isLow ? "Low Stock" : "Near Expiry"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => { showToast("Purchase indent generated and sent to store manager."); }}
                className="mt-4 w-full py-2.5 rounded-xl border transition-all hover:bg-primary hover:text-white hover:border-primary"
                style={{ borderColor: "#7C3AED", color: "#7C3AED", fontWeight: 600, fontSize: "0.85rem" }}
              >
                <RefreshCw size={13} className="inline mr-1.5" /> Generate Purchase Indent
              </button>
            </div>
          </div>
        </div>
      )}

      {activeNav === "Dispense Queue" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Dispense Queue</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>
              {dispenseQueue.filter((rx) => !dispensed.includes(rx.rxId)).length} Pending
            </span>
          </div>
          {dispenseQueue.map((rx) => (
            <div key={rx.rxId} className="bg-white rounded-2xl border border-border p-5" style={{ opacity: dispensed.includes(rx.rxId) ? 0.6 : 1 }}>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(124,58,237,0.1)", color: "#7C3AED" }}>
                  <Pill size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{rx.patient}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: rx.urgency === "IPD" ? "rgba(74,158,218,0.1)" : "#F4F6F9", color: rx.urgency === "IPD" ? "#4A9EDA" : "#9CA3AF" }}>
                      {rx.urgency}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{rx.rxId} · {rx.doctor}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {rx.medicines.map((m) => (
                      <span key={m} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "#F4F6F9", color: "#374151" }}>{m}</span>
                    ))}
                  </div>
                  <button
                    onClick={() => { setDispensed((prev) => [...prev, rx.rxId]); showToast(`${rx.rxId} dispensed to ${rx.patient}.`); }}
                    disabled={dispensed.includes(rx.rxId)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "#7C3AED", fontSize: "0.85rem", fontWeight: 600 }}
                  >
                    {dispensed.includes(rx.rxId) ? <><CheckCircle2 size={14} /> Dispensed</> : <><PackageCheck size={14} /> Mark Dispensed</>}
                  </button>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: rx.status === "Ready" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)", color: rx.status === "Ready" ? "#2A9D8F" : "#F4A261" }}>
                  {dispensed.includes(rx.rxId) ? "Dispensed" : rx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeNav === "Walk-in Sale" && (
        <div className="flex flex-col gap-5">
          {/* Bill preview modal */}
          <AnimatePresence>
            {billPreview && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setBillPreview(null)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                  onClick={e => e.stopPropagation()}>
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)" }}>
                      <CheckCircle2 size={24} style={{ color: "#7C3AED" }} />
                    </div>
                    <h3 style={{ margin: 0, color: "#1B2B3A" }}>Bill Generated!</h3>
                    <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>{billPreview.billNo}</div>
                  </div>
                  <div className="p-4 rounded-xl mb-4" style={{ background: "#F4F6F9" }}>
                    <div className="flex justify-between mb-2"><span style={{ color: "#6B7280" }}>Patient</span><span style={{ fontWeight: 700 }}>{billPreview.patient}</span></div>
                    <div className="flex justify-between mb-2"><span style={{ color: "#6B7280" }}>Items</span><span style={{ fontWeight: 700 }}>{billPreview.items.length} medicines</span></div>
                    <div className="flex justify-between"><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontWeight: 800, color: "#7C3AED", fontSize: "1.1rem" }}>₹{billPreview.total.toFixed(2)}</span></div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setBillPreview(null)} className="flex-1 py-2.5 rounded-xl border hover:bg-muted" style={{ fontWeight: 600 }}>Close</button>
                    <button onClick={() => printSaleBill(billPreview)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white hover:opacity-90" style={{ background: "#7C3AED", fontWeight: 600 }}>
                      <Printer size={14} /> Print Bill
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left: patient + medicine entry */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1rem" }}>
                  <User size={16} className="inline mr-2" style={{ color: "#7C3AED" }} />Patient Details
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[["Name *", "name", "text", "Patient name"], ["Age", "age", "number", "Age"], ["Mobile", "mobile", "tel", "Mobile number"]].map(([label, key, type, ph]) => (
                    <div key={key as string}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", display: "block", marginBottom: "4px" }}>{label}</label>
                      <input
                        type={type as string}
                        placeholder={ph as string}
                        value={(salePatient as any)[key as string]}
                        onChange={e => setSalePatient(p => ({ ...p, [key as string]: e.target.value }))}
                        className="w-full border border-border rounded-xl px-3 py-2 outline-none focus:border-primary"
                        style={{ fontSize: "0.85rem" }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border p-5">
                <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1rem" }}>
                  <Search size={16} className="inline mr-2" style={{ color: "#7C3AED" }} />Search & Add Medicines
                </h3>
                <div className="relative mb-4">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
                  <input
                    type="text"
                    placeholder="Type medicine name to search inventory..."
                    value={saleSearch}
                    onChange={e => setSaleSearch(e.target.value)}
                    onFocus={() => setSaleSearchFocus(true)}
                    onBlur={() => setTimeout(() => setSaleSearchFocus(false), 200)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary"
                    style={{ fontSize: "0.88rem" }}
                  />
                  {saleSearchFocus && saleMedResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-20 bg-white border border-border rounded-xl shadow-xl mt-1 max-h-52 overflow-y-auto">
                      {saleMedResults.map(med => {
                        const isLow = med.qty < med.min;
                        return (
                          <button key={med.id} onClick={() => addSaleItem(med)}
                            className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-muted text-left transition-colors"
                            disabled={isLow}
                          >
                            <div>
                              <div style={{ fontWeight: 600, color: isLow ? "#9CA3AF" : "#1B2B3A", fontSize: "0.88rem" }}>{med.name}</div>
                              <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{med.category} · ₹{med.rate}/{med.unit}</div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <span style={{ fontWeight: 700, color: isLow ? "#E63946" : "#2A9D8F", fontSize: "0.85rem" }}>{med.qty} left</span>
                              {isLow && <div style={{ fontSize: "0.7rem", color: "#E63946" }}>Low stock</div>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Sale items */}
                {saleItems.length === 0 ? (
                  <div className="py-8 text-center rounded-xl" style={{ background: "#F4F6F9", color: "#9CA3AF", fontSize: "0.88rem" }}>
                    Search and add medicines above
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {saleItems.map(item => (
                      <div key={item.medId} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                        <div className="flex-1">
                          <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.88rem" }}>{item.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>₹{item.rate} per {item.unit}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateSaleQty(item.medId, item.qty - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted border border-border" style={{ fontSize: "1rem", lineHeight: 1 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: "2rem", textAlign: "center" }}>{item.qty}</span>
                          <button onClick={() => updateSaleQty(item.medId, item.qty + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted border border-border" style={{ fontSize: "1rem", lineHeight: 1 }}>+</button>
                        </div>
                        <span style={{ fontWeight: 700, color: "#7C3AED", minWidth: "60px", textAlign: "right" }}>₹{(item.qty * item.rate).toFixed(2)}</span>
                        <button onClick={() => removeSaleItem(item.medId)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#E63946" }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: bill summary */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-border p-5 sticky top-4">
                <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1rem" }}>
                  <Receipt size={16} className="inline mr-2" style={{ color: "#7C3AED" }} />Bill Summary
                </h3>
                {saleItems.length === 0 ? (
                  <div className="py-6 text-center" style={{ color: "#D1D5DB", fontSize: "0.85rem" }}>No items added</div>
                ) : (
                  <div className="flex flex-col gap-2 mb-4">
                    {saleItems.map(item => (
                      <div key={item.medId} className="flex justify-between items-center py-1.5" style={{ borderBottom: "1px dashed rgba(0,0,0,0.06)", fontSize: "0.83rem" }}>
                        <span style={{ color: "#374151" }}>{item.name.split(" ").slice(-2).join(" ")} ×{item.qty}</span>
                        <span style={{ fontWeight: 600, color: "#1B2B3A" }}>₹{(item.qty * item.rate).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center p-3 rounded-xl mb-4" style={{ background: "rgba(124,58,237,0.08)" }}>
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Total Amount</span>
                  <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "#7C3AED" }}>₹{saleTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={generateSaleBill}
                  disabled={saleItems.length === 0 || !salePatient.name.trim()}
                  className="w-full py-3 rounded-xl text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: "#7C3AED", fontWeight: 700, fontSize: "0.95rem" }}
                >
                  <Receipt size={15} className="inline mr-2" /> Generate Bill
                </button>
              </div>

              {/* Recent bills */}
              {completedBills.length > 0 && (
                <div className="bg-white rounded-2xl border border-border p-4">
                  <h4 style={{ color: "#1B2B3A", marginBottom: "0.75rem", margin: 0, marginBottom: "0.75rem" }}>Recent Bills</h4>
                  <div className="flex flex-col gap-2">
                    {completedBills.slice(0, 5).map(bill => (
                      <div key={bill.billNo} className="flex items-center justify-between p-2.5 rounded-lg" style={{ background: "#F4F6F9" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#1B2B3A" }}>{bill.patient}</div>
                          <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{bill.billNo}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 700, color: "#7C3AED", fontSize: "0.88rem" }}>₹{bill.total.toFixed(2)}</span>
                          <button onClick={() => printSaleBill(bill)} className="p-1.5 rounded-lg hover:bg-muted" title="Print">
                            <Printer size={12} style={{ color: "#6B7280" }} />
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
      )}

      {activeNav === "Stock Alerts" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Stock Alerts</h3>
            <button
              onClick={() => showToast("Purchase indent for all low-stock items generated.")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:bg-primary hover:text-white hover:border-primary"
              style={{ borderColor: "#7C3AED", color: "#7C3AED", fontWeight: 600, fontSize: "0.85rem" }}
            >
              <RefreshCw size={13} /> Generate Indent
            </button>
          </div>
          {stockAlerts.map((alert) => {
            const isLow = alert.qty < alert.min;
            return (
              <div key={alert.id} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isLow ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)", color: isLow ? "#E63946" : "#F4A261" }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{alert.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>{alert.id} · {alert.category} · Batch: {alert.batch}</div>
                    <div className="flex gap-4 mt-1">
                      <span style={{ fontSize: "0.82rem" }}>
                        Current: <strong style={{ color: isLow ? "#E63946" : "#1B2B3A" }}>{alert.qty} {alert.unit}s</strong>
                      </span>
                      <span style={{ fontSize: "0.82rem", color: "#9CA3AF" }}>Min: {alert.min}</span>
                      <span style={{ fontSize: "0.82rem", color: "#F4A261" }}>Exp: {alert.expiry}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: isLow ? "rgba(230,57,70,0.1)" : "rgba(244,162,97,0.1)", color: isLow ? "#E63946" : "#F4A261" }}>
                      {isLow ? "Low Stock" : "Near Expiry"}
                    </span>
                    <button
                      onClick={() => showToast(`Indent raised for ${alert.name}.`)}
                      className="px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: "#7C3AED" }}
                    >
                      Raise Indent
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeNav === "Inventory" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Inventory ({inventory.length} items)</h3>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
              <input
                type="text"
                placeholder="Search medicine or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-border outline-none focus:ring-2"
                style={{ fontSize: "0.85rem", width: "240px" }}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontSize: "0.83rem", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid rgba(0,0,0,0.06)" }}>
                  {["Medicine", "Category", "In Stock", "Min Stock", "Status", "Batch", "Expiry", "Rate"].map((h) => (
                    <th key={h} className="text-left py-3 px-3" style={{ color: "#9CA3AF", fontWeight: 600, fontSize: "0.78rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((med, i) => {
                  const isLow = med.qty < med.min;
                  return (
                    <tr key={med.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", background: i % 2 === 0 ? "transparent" : "#FAFBFC" }}>
                      <td className="py-3 px-3" style={{ fontWeight: 600, color: "#1B2B3A" }}>{med.name}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "#F4F6F9", color: "#6B7280" }}>{med.category}</span>
                      </td>
                      <td className="py-3 px-3" style={{ fontWeight: 700, color: isLow ? "#E63946" : "#1B2B3A" }}>{med.qty}</td>
                      <td className="py-3 px-3" style={{ color: "#9CA3AF" }}>{med.min}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: isLow ? "rgba(230,57,70,0.1)" : "rgba(42,157,143,0.1)", color: isLow ? "#E63946" : "#2A9D8F" }}>
                          {isLow ? "Low" : "OK"}
                        </span>
                      </td>
                      <td className="py-3 px-3" style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{med.batch}</td>
                      <td className="py-3 px-3" style={{ color: "#9CA3AF", fontSize: "0.78rem" }}>{med.expiry}</td>
                      <td className="py-3 px-3" style={{ fontWeight: 600, color: "#1B2B3A" }}>₹{med.rate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredInventory.length === 0 && (
              <div className="text-center py-8" style={{ color: "#9CA3AF" }}>No medicines found for "{searchQuery}"</div>
            )}
          </div>
        </div>
      )}

      {activeNav === "Consumption Report" && (
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h3 style={{ color: "#1B2B3A", margin: 0, marginBottom: "1.5rem" }}>Category-wise Consumption (This Month)</h3>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consumptionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis type="number" style={{ fontSize: "0.78rem" }} />
                  <YAxis type="category" dataKey="category" style={{ fontSize: "0.78rem" }} width={80} />
                  <Tooltip />
                  <Bar dataKey="units" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {consumptionData.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl border border-border p-4">
                <div style={{ fontSize: "1.4rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{cat.units}</div>
                <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1B2B3A" }}>{cat.category}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>units dispensed</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
