import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  UtensilsCrossed, LayoutDashboard, ClipboardList, Users,
  Receipt, CheckCircle2, Clock, Link, ShoppingCart, Plus, Minus, Printer, Trash2,
} from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import { patientDiets, canteenBilling } from "../../data/mockData";

const navItems = [
  { icon: <LayoutDashboard size={16} />, label: "Overview" },
  { icon: <ClipboardList size={16} />, label: "Active Orders", badge: 11 },
  { icon: <ShoppingCart size={16} />, label: "Counter Order" },
  { icon: <Users size={16} />, label: "Diet Charts" },
  { icon: <Receipt size={16} />, label: "Billing" },
];

const menuItems = [
  { id: "TEA", name: "Tea", category: "Beverages", price: 15, emoji: "☕" },
  { id: "COFFEE", name: "Coffee", category: "Beverages", price: 20, emoji: "☕" },
  { id: "MILK", name: "Milk (250ml)", category: "Beverages", price: 25, emoji: "🥛" },
  { id: "JUICE", name: "Fresh Juice", category: "Beverages", price: 40, emoji: "🧃" },
  { id: "IDLI", name: "Idli (2 pcs)", category: "Breakfast", price: 30, emoji: "🍚" },
  { id: "POHA", name: "Poha", category: "Breakfast", price: 25, emoji: "🍛" },
  { id: "PARATHA", name: "Aloo Paratha", category: "Breakfast", price: 40, emoji: "🫓" },
  { id: "UPMA", name: "Upma", category: "Breakfast", price: 25, emoji: "🍲" },
  { id: "THALI", name: "Full Thali", category: "Meals", price: 80, emoji: "🍽️" },
  { id: "RICE_DAL", name: "Rice + Dal", category: "Meals", price: 50, emoji: "🍛" },
  { id: "ROTI_SABZI", name: "Roti + Sabzi (3 pcs)", category: "Meals", price: 45, emoji: "🫓" },
  { id: "KHICHDI", name: "Khichdi (diet)", category: "Meals", price: 40, emoji: "🍲" },
  { id: "SOUP", name: "Vegetable Soup", category: "Snacks", price: 30, emoji: "🥣" },
  { id: "SANDWICH", name: "Veg Sandwich", category: "Snacks", price: 35, emoji: "🥪" },
  { id: "BISCUIT", name: "Biscuit Pack", category: "Snacks", price: 20, emoji: "🍪" },
  { id: "FRUIT", name: "Fruit Plate", category: "Snacks", price: 60, emoji: "🍎" },
];

const menuCategories = ["Beverages", "Breakfast", "Meals", "Snacks"];

let counterBillNo = 5001;

interface CounterBill {
  billNo: string;
  customer: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total: number;
  time: string;
  paymentMode: string;
}

const activeOrders = [
  { room: "Ward A - Bed 3", patient: "Ramesh Gupta", diet: "Low Sodium, Diabetic", meal: "Lunch", items: ["Brown Rice 1 cup", "Dal Palak 1 bowl", "Curd 100g", "Cucumber salad"], status: "Preparing", time: "12:30 PM" },
  { room: "Ward A - Bed 7", patient: "Sunita Devi", diet: "Normal", meal: "Lunch", items: ["Roti 3 pcs", "Sabzi", "Dal", "Rice 1 cup", "Salad"], status: "Ready", time: "12:30 PM" },
  { room: "Ward B - Bed 2", patient: "Arjun Mehta", diet: "Post-cardiac, Low Fat", meal: "Lunch", items: ["Khichdi 1 bowl", "Boiled Vegetables", "Buttermilk 200ml"], status: "Delivered", time: "12:15 PM" },
  { room: "ICU - Bed 4", patient: "Kavya Sharma", diet: "Liquid Diet", meal: "Lunch", items: ["Fruit Juice 200ml", "Vegetable Soup 150ml", "Glucose Water"], status: "Preparing", time: "12:30 PM" },
  { room: "Maternity - Bed 6", patient: "Neha Kapoor", diet: "High Protein, Post-delivery", meal: "Lunch", items: ["Dalia 1 bowl", "Paneer sabzi", "Milk 250ml", "Banana 1 pc"], status: "Ready", time: "12:30 PM" },
];

const dietCategories = [
  { category: "Normal Diet", count: 45, color: "#2A9D8F" },
  { category: "Diabetic Diet", count: 18, color: "#4A9EDA" },
  { category: "Low Sodium", count: 12, color: "#F4A261" },
  { category: "Liquid Diet", count: 8, color: "#7C3AED" },
  { category: "Post-Op Diet", count: 11, color: "#059669" },
  { category: "High Protein", count: 14, color: "#DB2777" },
];

interface Props { onLogout: () => void; }

export function CanteenDashboard({ onLogout }: Props) {
  const [activeNav, setActiveNav] = useState("Overview");
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});
  const [billingStatuses, setBillingStatuses] = useState<Record<string, string>>({});
  const [alertMsg, setAlertMsg] = useState("");

  // Counter Order state
  const [menuCategory, setMenuCategory] = useState("All");
  const [counterItems, setCounterItems] = useState<Record<string, number>>({});
  const [counterCustomer, setCounterCustomer] = useState("");
  const [counterPayment, setCounterPayment] = useState("Cash");
  const [counterBills, setCounterBills] = useState<CounterBill[]>([]);
  const [counterBillPreview, setCounterBillPreview] = useState<CounterBill | null>(null);

  const showToast = (msg: string) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const getStatus = (order: typeof activeOrders[0]) => orderStatuses[order.room] || order.status;

  const advanceStatus = (room: string, current: string) => {
    const next = current === "Preparing" ? "Ready" : current === "Ready" ? "Delivered" : "Delivered";
    setOrderStatuses((prev) => ({ ...prev, [room]: next }));
    showToast(`${room} — order status updated to ${next}.`);
  };

  const linkToBill = (room: string, patient: string) => {
    showToast(`Diet charges for ${patient} (${room}) linked to main hospital bill.`);
  };

  const filteredMenu = menuCategory === "All" ? menuItems : menuItems.filter(m => m.category === menuCategory);
  const counterTotal = Object.entries(counterItems).reduce((acc, [id, qty]) => {
    const item = menuItems.find(m => m.id === id);
    return acc + (item ? item.price * qty : 0);
  }, 0);
  const counterSelectedCount = Object.values(counterItems).reduce((a, b) => a + b, 0);

  const addToCounter = (id: string) => setCounterItems(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCounter = (id: string) => {
    setCounterItems(prev => {
      const next = { ...prev };
      if ((next[id] || 0) <= 1) delete next[id];
      else next[id]--;
      return next;
    });
  };
  const clearCounter = () => setCounterItems({});

  const generateCounterBill = () => {
    if (counterSelectedCount === 0) { showToast("Please add items to the order."); return; }
    const items = Object.entries(counterItems)
      .map(([id, qty]) => {
        const m = menuItems.find(i => i.id === id)!;
        return { id, name: m.name, qty, price: m.price };
      })
      .filter(Boolean);
    const bill: CounterBill = {
      billNo: `CNT-${counterBillNo++}`,
      customer: counterCustomer || "Walk-in",
      items,
      total: counterTotal,
      time: new Date().toLocaleTimeString(),
      paymentMode: counterPayment,
    };
    setCounterBills(prev => [bill, ...prev]);
    setCounterBillPreview(bill);
    clearCounter();
    setCounterCustomer("");
  };

  const printCounterBill = (bill: CounterBill) => {
    const win = window.open("", "_blank", "width=340,height=540");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Canteen Bill</title><style>
      body{font-family:monospace;margin:0;padding:14px;font-size:12px;}
      h2,h3{text-align:center;margin:4px 0;}
      .divider{border-top:1px dashed #999;margin:8px 0;}
      table{width:100%;border-collapse:collapse;}
      td{padding:2px 0;}
      .right{text-align:right;}
      .total{font-weight:bold;font-size:14px;}
    </style></head><body>
      <h2>MedFlow Canteen</h2>
      <h3>Counter Bill</h3>
      <div class="divider"></div>
      <table>
        <tr><td>Bill No:</td><td class="right">${bill.billNo}</td></tr>
        <tr><td>Time:</td><td class="right">${bill.time}</td></tr>
        <tr><td>Customer:</td><td class="right">${bill.customer}</td></tr>
      </table>
      <div class="divider"></div>
      <table>
        <tr><td><b>Item</b></td><td class="right"><b>Qty</b></td><td class="right"><b>Amt</b></td></tr>
        ${bill.items.map(i => `<tr><td>${i.name}</td><td class="right">${i.qty}</td><td class="right">₹${i.qty * i.price}</td></tr>`).join("")}
      </table>
      <div class="divider"></div>
      <table>
        <tr class="total"><td>TOTAL</td><td></td><td class="right">₹${bill.total}</td></tr>
        <tr><td>Payment:</td><td></td><td class="right">${bill.paymentMode}</td></tr>
      </table>
      <div class="divider"></div>
      <p style="text-align:center;font-size:11px;">Thank you! Get well soon.</p>
    </body></html>`);
    win.document.close();
    win.print();
  };

  const markBilled = (room: string) => {
    setBillingStatuses((prev) => ({ ...prev, [room]: "Billed" }));
    showToast(`Diet billing for ${room} marked as billed.`);
  };

  return (
    <DashboardLayout
      dept="Canteen"
      deptColor="#059669"
      deptIcon={<UtensilsCrossed size={16} />}
      navItems={navItems}
      activeNav={activeNav}
      onNavChange={setActiveNav}
      onLogout={onLogout}
      userName="Rajkumar Singh"
    >
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl text-white shadow-lg"
            style={{ background: "#059669", fontSize: "0.88rem", fontWeight: 600 }}
          >
            {alertMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {activeNav === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Meals Today", value: "108", sub: "Breakfast + Lunch", color: "#059669", bg: "#EDFAF4" },
              { label: "Active Orders", value: "11", sub: "Pending delivery", color: "#F4A261", bg: "#FEF6EE" },
              { label: "Special Diets", value: "53", sub: "Prescribed diets", color: "#4A9EDA", bg: "#EFF6FD" },
              { label: "Today's Billing", value: "₹8,450", sub: "Room-linked", color: "#7C3AED", bg: "#F3EFFE" },
            ].map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-border"
              >
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: s.bg }}>
                  <UtensilsCrossed size={16} style={{ color: s.color }} />
                </div>
                <div style={{ fontSize: "1.75rem", fontFamily: "'Outfit', sans-serif", fontWeight: 800, color: "#1B2B3A" }}>{s.value}</div>
                <div style={{ fontWeight: 600, color: "#1B2B3A", fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 style={{ margin: 0, color: "#1B2B3A", marginBottom: "1.25rem" }}>Diet Distribution</h3>
              <div className="flex flex-col gap-3">
                {dietCategories.map((d) => (
                  <div key={d.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: "0.83rem", color: "#1B2B3A" }}>{d.category}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 700, color: d.color }}>{d.count} patients</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(d.count / 108) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ background: d.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Active Meal Orders — Lunch</h3>
                <div className="flex items-center gap-2">
                  <Clock size={13} style={{ color: "#9CA3AF" }} />
                  <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>12:30 PM delivery</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {activeOrders.map((order) => {
                  const status = getStatus(order);
                  return (
                    <div key={order.room} className="p-3 rounded-xl border border-border">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.88rem" }}>{order.room}</span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>{order.diet}</span>
                          </div>
                          <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{order.patient}</div>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {order.items.slice(0, 3).map((item) => (
                              <span key={item} className="px-2 py-0.5 rounded text-xs" style={{ background: "#F4F6F9", color: "#6B7280" }}>{item}</span>
                            ))}
                            {order.items.length > 3 && <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#F4F6F9", color: "#9CA3AF" }}>+{order.items.length - 3} more</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: status === "Delivered" ? "rgba(5,150,105,0.1)" : status === "Ready" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)", color: status === "Delivered" ? "#059669" : status === "Ready" ? "#2A9D8F" : "#F4A261" }}>
                            {status}
                          </span>
                          {status !== "Delivered" && (
                            <button onClick={() => advanceStatus(order.room, status)} className="px-3 py-1 rounded-lg text-white transition-all hover:opacity-90" style={{ background: "#059669", fontSize: "0.75rem", fontWeight: 600 }}>
                              {status === "Preparing" ? "Mark Ready" : "Mark Delivered"}
                            </button>
                          )}
                          {status === "Delivered" && <CheckCircle2 size={16} style={{ color: "#059669" }} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeNav === "Active Orders" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Active Meal Orders</h3>
            <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
              {activeOrders.filter((o) => getStatus(o) !== "Delivered").length} Pending
            </span>
          </div>
          {activeOrders.map((order) => {
            const status = getStatus(order);
            return (
              <div key={order.room} className="bg-white rounded-2xl border border-border p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                    <UtensilsCrossed size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "1rem" }}>{order.room}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>{order.diet}</span>
                      <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{order.time}</span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#6B7280", marginBottom: "0.75rem" }}>{order.patient} · {order.meal}</div>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {order.items.map((item) => (
                        <span key={item} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: "#F4F6F9", color: "#374151" }}>{item}</span>
                      ))}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: status === "Delivered" ? "rgba(5,150,105,0.1)" : status === "Ready" ? "rgba(42,157,143,0.1)" : "rgba(244,162,97,0.1)", color: status === "Delivered" ? "#059669" : status === "Ready" ? "#2A9D8F" : "#F4A261" }}>
                        {status}
                      </span>
                      {status !== "Delivered" && (
                        <button
                          onClick={() => advanceStatus(order.room, status)}
                          className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                          style={{ background: "#059669" }}
                        >
                          {status === "Preparing" ? "Mark Ready" : "Mark Delivered"}
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

      {activeNav === "Diet Charts" && (
        <div className="flex flex-col gap-4">
          <h3 style={{ color: "#1B2B3A", margin: 0 }}>Patient Diet Charts</h3>
          {patientDiets.map((diet) => (
            <div key={diet.room} className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                  <ClipboardList size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{diet.patient}</span>
                    <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>{diet.room}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>{diet.diet}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "#9CA3AF", marginBottom: "0.75rem" }}>Prescribed by: {diet.prescribed}</div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "🌅 Breakfast", food: diet.breakfast },
                      { label: "☀️ Lunch", food: diet.lunch },
                      { label: "🌙 Dinner", food: diet.dinner },
                    ].map((meal) => (
                      <div key={meal.label} className="p-3 rounded-xl" style={{ background: "#F4F6F9" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1B2B3A", marginBottom: "0.25rem" }}>{meal.label}</div>
                        <div style={{ fontSize: "0.78rem", color: "#6B7280", lineHeight: 1.5 }}>{meal.food}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeNav === "Billing" && (
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 style={{ color: "#1B2B3A", margin: 0 }}>Diet Billing</h3>
            <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
              Total: <strong style={{ color: "#1B2B3A" }}>₹{canteenBilling.reduce((acc, b) => acc + b.total, 0).toLocaleString()}</strong>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {canteenBilling.map((bill) => {
              const status = billingStatuses[bill.room] || bill.status;
              return (
                <div key={bill.room} className="flex items-center gap-4 p-4 rounded-xl border border-border" style={{ opacity: status === "Billed" ? 0.7 : 1 }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                    <Receipt size={16} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{bill.patient}</div>
                    <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>{bill.room} · {bill.days} days × ₹{bill.ratePerDay}/day</div>
                  </div>
                  <div className="text-right mr-4">
                    <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1B2B3A" }}>₹{bill.total}</div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: status === "Billed" ? "rgba(5,150,105,0.1)" : "rgba(244,162,97,0.1)", color: status === "Billed" ? "#059669" : "#F4A261" }}
                    >
                      {status}
                    </span>
                  </div>
                  {status !== "Billed" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => linkToBill(bill.room, bill.patient)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all"
                        style={{ background: "rgba(74,158,218,0.1)", color: "#4A9EDA" }}
                      >
                        <Link size={12} /> Link to Bill
                      </button>
                      <button
                        onClick={() => markBilled(bill.room)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: "#059669" }}
                      >
                        <CheckCircle2 size={12} /> Mark Billed
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeNav === "Counter Order" && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left — menu */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}>
                  <ShoppingCart size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: "#1B2B3A" }}>Counter Order</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#9CA3AF" }}>Direct walk-in food orders</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["All", ...menuCategories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMenuCategory(cat)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                    style={{
                      background: menuCategory === cat ? "#059669" : "rgba(5,150,105,0.08)",
                      color: menuCategory === cat ? "#fff" : "#059669",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMenu.map(item => {
                const qty = counterItems[item.id] || 0;
                return (
                  <motion.div
                    key={item.id}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white rounded-2xl border border-border p-4 cursor-pointer transition-all"
                    style={{ borderColor: qty > 0 ? "#059669" : undefined, boxShadow: qty > 0 ? "0 0 0 2px rgba(5,150,105,0.15)" : undefined }}
                    onClick={() => addToCounter(item.id)}
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.88rem", lineHeight: 1.3 }}>{item.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginBottom: "0.5rem" }}>{item.category}</div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontWeight: 800, color: "#059669" }}>₹{item.price}</span>
                      {qty > 0 && (
                        <div
                          className="flex items-center gap-1.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => removeFromCounter(item.id)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                            style={{ background: "#059669" }}
                          >
                            <Minus size={10} />
                          </button>
                          <span style={{ fontWeight: 700, color: "#1B2B3A", minWidth: "1.2rem", textAlign: "center" }}>{qty}</span>
                          <button
                            onClick={() => addToCounter(item.id)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                            style={{ background: "#059669" }}
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-border p-5 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Receipt size={15} style={{ color: "#059669" }} />
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Order ({counterSelectedCount} items)</span>
                </div>
                {counterSelectedCount > 0 && (
                  <button onClick={clearCounter} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: "#E63946" }}>
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="mb-3">
                <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Customer / Token</label>
                <input
                  value={counterCustomer}
                  onChange={e => setCounterCustomer(e.target.value)}
                  placeholder="Name or token (optional)"
                  className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                  style={{ fontSize: "0.85rem" }}
                />
              </div>

              {counterSelectedCount === 0 ? (
                <div className="py-8 text-center" style={{ color: "#9CA3AF", fontSize: "0.85rem" }}>No items added yet.<br/>Tap a menu item to add.</div>
              ) : (
                <div className="flex flex-col gap-1.5 mb-4">
                  {Object.entries(counterItems).map(([id, qty]) => {
                    const item = menuItems.find(m => m.id === id)!;
                    return (
                      <div key={id} className="flex items-center gap-2">
                        <span style={{ fontSize: "0.88rem" }}>{item.emoji}</span>
                        <span style={{ flex: 1, fontSize: "0.83rem", color: "#374151" }}>{item.name}</span>
                        <span style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>×{qty}</span>
                        <span style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.85rem" }}>₹{item.price * qty}</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-border pt-2 mt-1">
                    <div className="flex justify-between">
                      <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#059669" }}>₹{counterTotal}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <label style={{ fontSize: "0.78rem", color: "#9CA3AF", display: "block", marginBottom: "0.3rem" }}>Payment Mode</label>
                <select
                  value={counterPayment}
                  onChange={e => setCounterPayment(e.target.value)}
                  className="w-full border border-border rounded-xl px-3 py-2 outline-none"
                  style={{ fontSize: "0.85rem" }}
                >
                  <option>Cash</option><option>Card</option><option>UPI</option>
                </select>
              </div>

              <button
                onClick={generateCounterBill}
                disabled={counterSelectedCount === 0}
                className="w-full py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 disabled:opacity-40"
                style={{ background: "#059669" }}
              >
                Place Order & Print Bill
              </button>

              {/* Recent orders */}
              {counterBills.length > 0 && (
                <div className="mt-5">
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.5rem" }}>RECENT ORDERS</div>
                  <div className="flex flex-col gap-2">
                    {counterBills.slice(0, 4).map(b => (
                      <div key={b.billNo} className="flex items-center justify-between p-2.5 rounded-xl border border-border">
                        <div>
                          <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "0.82rem" }}>{b.customer}</div>
                          <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{b.billNo} · {b.items.length} item{b.items.length > 1 ? "s" : ""}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontWeight: 700, color: "#059669", fontSize: "0.88rem" }}>₹{b.total}</span>
                          <button onClick={() => printCounterBill(b)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: "#6B7280" }}>
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
      )}

      {/* Counter Bill Preview Modal */}
      <AnimatePresence>
        {counterBillPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setCounterBillPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center mb-4">
                <div className="text-3xl mb-1">✅</div>
                <h3 style={{ margin: 0, color: "#1B2B3A" }}>Order Placed!</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "#9CA3AF" }}>{counterBillPreview.billNo} · {counterBillPreview.time}</p>
              </div>
              <div className="p-4 rounded-xl mb-4" style={{ background: "#F4F6F9" }}>
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>Customer</span>
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>{counterBillPreview.customer}</span>
                </div>
                {counterBillPreview.items.map(i => (
                  <div key={i.id} className="flex justify-between py-1 border-t border-border">
                    <span style={{ fontSize: "0.83rem", color: "#374151" }}>{i.name} ×{i.qty}</span>
                    <span style={{ fontWeight: 600, color: "#1B2B3A" }}>₹{i.qty * i.price}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-border mt-1">
                  <span style={{ fontWeight: 700, color: "#1B2B3A" }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.15rem", color: "#059669" }}>₹{counterBillPreview.total}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => printCounterBill(counterBillPreview)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all hover:opacity-90"
                  style={{ background: "rgba(5,150,105,0.1)", color: "#059669" }}
                >
                  <Printer size={15} /> Print Bill
                </button>
                <button
                  onClick={() => setCounterBillPreview(null)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: "#059669" }}
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
