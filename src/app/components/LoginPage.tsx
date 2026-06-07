import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, ArrowLeft, Stethoscope, Shield, Receipt, FlaskConical,
  Pill, UtensilsCrossed, User, Lock, Eye, EyeOff, Smartphone,
  ChevronRight, Building2,
} from "lucide-react";

const departments = [
  {
    id: "doctor",
    label: "Doctor",
    icon: <Stethoscope size={26} />,
    color: "#2A9D8F",
    bg: "#F0F9F7",
    desc: "Patient queue, E-prescriptions, Telemedicine",
    badge: "Clinical",
  },
  {
    id: "admin",
    label: "Admin",
    icon: <Shield size={26} />,
    color: "#1B2B3A",
    bg: "#F0F2F5",
    desc: "Hospital overview, Beds, Staff & operations",
    badge: "Management",
  },
  {
    id: "accounts",
    label: "Accounts",
    icon: <Receipt size={26} />,
    color: "#4A9EDA",
    bg: "#EFF6FD",
    desc: "Billing, Insurance claims, Revenue reports",
    badge: "Finance",
  },
  {
    id: "lab",
    label: "Laboratory",
    icon: <FlaskConical size={26} />,
    color: "#F4A261",
    bg: "#FEF6EE",
    desc: "Sample tracking, Reports, Critical alerts",
    badge: "Diagnostics",
  },
  {
    id: "pharmacy",
    label: "Medical Store",
    icon: <Pill size={26} />,
    color: "#7C3AED",
    bg: "#F3EFFE",
    desc: "Stock management, Dispensing, Expiry alerts",
    badge: "Pharmacy",
  },
  {
    id: "canteen",
    label: "Canteen",
    icon: <UtensilsCrossed size={26} />,
    color: "#059669",
    bg: "#EDFAF4",
    desc: "Meal orders, Diet charts, Room billing",
    badge: "Services",
  },
];

interface LoginPageProps {
  onBack: () => void;
  onLogin: (dept: string, isPatient: boolean) => void;
}

export function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [tab, setTab] = useState<"staff" | "patient">("staff");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [empId, setEmpId] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStaffLogin = () => {
    if (!selectedDept || !empId || !password) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedDept, false); }, 1200);
  };

  const handleSendOtp = () => {
    if (mobile.length !== 10) return;
    setOtpSent(true);
  };

  const handlePatientLogin = () => {
    if (!otp) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin("patient", true); }, 1200);
  };

  const currentDept = departments.find((d) => d.id === selectedDept);

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F6F9" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex flex-col justify-between w-[420px] flex-shrink-0 p-10"
        style={{ background: "linear-gradient(160deg, #1B2B3A 0%, #0F1E2B 100%)" }}
      >
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#2A9D8F" }}>
              <Heart size={20} fill="white" color="white" />
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "white" }}>
                MedFlow
              </div>
              <div style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>
                HOSPITAL MANAGEMENT
              </div>
            </div>
          </div>

          <h2 style={{ color: "white", marginBottom: "1rem", lineHeight: 1.2 }}>
            Secure Access to Your Hospital System
          </h2>
          <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontSize: "0.9rem" }}>
            Role-based access ensures every staff member sees exactly what they need — nothing more, nothing less.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: dept.bg, color: dept.color }}
                >
                  <span style={{ transform: "scale(0.65)" }}>{dept.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "white" }}>{dept.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>{dept.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>
          © 2026 MedFlow • HIPAA Compliant • Encrypted
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        {/* Back button */}
        <div className="p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 transition-colors hover:text-primary"
            style={{ fontSize: "0.88rem", color: "#6B7280", fontWeight: 500 }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 pb-10">
          <div className="w-full max-w-2xl">
            {/* Tab switcher */}
            <div className="flex gap-2 mb-8 bg-white rounded-xl p-1 border border-border w-fit">
              {(["staff", "patient"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setSelectedDept(null); }}
                  className="px-5 py-2 rounded-lg transition-all"
                  style={{
                    background: tab === t ? "#2A9D8F" : "transparent",
                    color: tab === t ? "white" : "#6B7280",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                  }}
                >
                  {t === "staff" ? (
                    <span className="flex items-center gap-2"><Building2 size={14} /> Hospital Staff</span>
                  ) : (
                    <span className="flex items-center gap-2"><User size={14} /> Patient</span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === "staff" ? (
                <motion.div
                  key="staff"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <h2 style={{ color: "#1B2B3A", marginBottom: "0.4rem" }}>
                    {selectedDept ? `${currentDept?.label} Login` : "Select Your Department"}
                  </h2>
                  <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                    {selectedDept
                      ? `Enter your credentials to access the ${currentDept?.label} module.`
                      : "Choose the department you belong to for role-based access."}
                  </p>

                  {!selectedDept ? (
                    /* Department grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {departments.map((dept) => (
                        <motion.button
                          key={dept.id}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedDept(dept.id)}
                          className="flex flex-col items-start gap-3 p-5 rounded-2xl border bg-white text-left transition-all hover:shadow-lg group"
                          style={{ borderColor: "rgba(0,0,0,0.08)" }}
                        >
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: dept.bg, color: dept.color }}
                          >
                            {dept.icon}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#1B2B3A", fontSize: "1rem" }}>{dept.label}</div>
                            <div
                              className="inline-block px-2 py-0.5 rounded-full mt-1 mb-1"
                              style={{ background: dept.bg, color: dept.color, fontSize: "0.68rem", fontWeight: 700 }}
                            >
                              {dept.badge}
                            </div>
                            <div style={{ fontSize: "0.76rem", color: "#9CA3AF", lineHeight: 1.5 }}>{dept.desc}</div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity self-end"
                            style={{ color: dept.color }}
                          />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    /* Login form */
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="max-w-md"
                    >
                      {/* Department badge */}
                      <div
                        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: currentDept?.bg, color: currentDept?.color }}
                        onClick={() => setSelectedDept(null)}
                      >
                        <span>{currentDept?.icon}</span>
                        <span style={{ fontWeight: 700 }}>{currentDept?.label}</span>
                        <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>— click to change</span>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                            EMPLOYEE ID
                          </label>
                          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-3 bg-white focus-within:border-primary transition-colors">
                            <User size={15} style={{ color: "#6B7280" }} />
                            <input
                              type="text"
                              placeholder="e.g. MF-DOC-00142"
                              value={empId}
                              onChange={(e) => setEmpId(e.target.value)}
                              className="flex-1 bg-transparent outline-none"
                              style={{ fontSize: "0.9rem", color: "#1B2B3A" }}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                            PASSWORD
                          </label>
                          <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-3 bg-white focus-within:border-primary transition-colors">
                            <Lock size={15} style={{ color: "#6B7280" }} />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleStaffLogin()}
                              className="flex-1 bg-transparent outline-none"
                              style={{ fontSize: "0.9rem", color: "#1B2B3A" }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              style={{ color: "#9CA3AF" }}
                            >
                              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer" style={{ fontSize: "0.85rem" }}>
                            <input type="checkbox" className="rounded" /> Remember me
                          </label>
                          <button style={{ fontSize: "0.85rem", color: "#2A9D8F", fontWeight: 500 }}>
                            Forgot password?
                          </button>
                        </div>

                        <button
                          onClick={handleStaffLogin}
                          disabled={loading || !empId || !password}
                          className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ background: currentDept?.color || "#2A9D8F", fontWeight: 700 }}
                        >
                          {loading ? (
                            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          ) : (
                            <>Sign In to {currentDept?.label} Portal</>
                          )}
                        </button>

                        <div className="text-center" style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                          Demo: any Employee ID + any Password
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* Patient login */
                <motion.div
                  key="patient"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="max-w-md"
                >
                  <h2 style={{ color: "#1B2B3A", marginBottom: "0.4rem" }}>Patient Portal Login</h2>
                  <p style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1.75rem" }}>
                    Login with your registered mobile number to access appointments, reports, and bills.
                  </p>

                  <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                          REGISTERED MOBILE NUMBER
                        </label>
                        <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-3 bg-muted focus-within:border-primary transition-colors">
                          <span style={{ fontSize: "0.9rem", color: "#6B7280", fontWeight: 500 }}>+91</span>
                          <input
                            type="tel"
                            placeholder="9876543210"
                            maxLength={10}
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
                            className="flex-1 bg-transparent outline-none"
                            style={{ fontSize: "0.9rem", color: "#1B2B3A" }}
                          />
                          {!otpSent && (
                            <button
                              onClick={handleSendOtp}
                              disabled={mobile.length !== 10}
                              className="px-3 py-1 rounded-lg text-white disabled:opacity-40 transition-all"
                              style={{ background: "#2A9D8F", fontSize: "0.78rem", fontWeight: 700 }}
                            >
                              Send OTP
                            </button>
                          )}
                        </div>
                      </div>

                      <AnimatePresence>
                        {otpSent && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                          >
                            <div
                              className="text-center py-2 px-3 rounded-lg mb-3"
                              style={{ background: "rgba(42,157,143,0.08)", color: "#2A9D8F", fontSize: "0.82rem" }}
                            >
                              <Smartphone size={13} className="inline mr-1" />
                              OTP sent to +91 {mobile}
                            </div>
                            <label className="block mb-1.5" style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>
                              ENTER OTP
                            </label>
                            <input
                              type="text"
                              placeholder="6-digit OTP"
                              maxLength={6}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
                              className="w-full border border-border rounded-xl px-3 py-3 bg-muted outline-none focus:border-primary text-center transition-colors"
                              style={{ fontSize: "1.2rem", letterSpacing: "0.3em", fontWeight: 700, color: "#1B2B3A" }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button
                        onClick={otpSent ? handlePatientLogin : handleSendOtp}
                        disabled={loading || (!otpSent && mobile.length !== 10) || (otpSent && otp.length < 4)}
                        className="w-full py-3.5 rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                        style={{ background: "#2A9D8F", fontWeight: 700 }}
                      >
                        {loading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : otpSent ? "Verify & Login" : "Send OTP"}
                      </button>

                      <div className="text-center" style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                        Demo: enter any 10-digit mobile → any OTP
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
                    <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>New patient?</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.08)" }} />
                  </div>
                  <button
                    className="w-full mt-3 py-3 rounded-xl border-2 transition-all hover:bg-primary hover:text-white hover:border-primary"
                    style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontWeight: 600 }}
                    onClick={() => onLogin("patient", true)}
                  >
                    Register as New Patient
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
