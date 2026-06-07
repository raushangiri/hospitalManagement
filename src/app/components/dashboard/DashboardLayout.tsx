import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart, LogOut, Bell, Menu, X, ChevronRight,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

interface DashboardLayoutProps {
  dept: string;
  deptColor: string;
  deptIcon: React.ReactNode;
  navItems: NavItem[];
  activeNav: string;
  onNavChange: (item: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
  userName?: string;
}

export function DashboardLayout({
  dept,
  deptColor,
  deptIcon,
  navItems,
  activeNav,
  onNavChange,
  onLogout,
  children,
  userName = "Dr. Rajesh Sharma",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 flex items-center gap-3 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#2A9D8F" }}>
          <Heart size={15} fill="white" color="white" />
        </div>
        {sidebarOpen && (
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem", color: "white" }}>MedFlow</div>
            <div
              className="px-2 py-0.5 rounded-full inline-block"
              style={{ background: deptColor, fontSize: "0.62rem", fontWeight: 700, color: "white" }}
            >
              {dept}
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => { onNavChange(item.label); setMobileSidebarOpen(false); }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-left w-full group"
              style={{
                background: active ? deptColor : "transparent",
                color: active ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span style={{ fontSize: "0.88rem", fontWeight: active ? 600 : 400 }}>{item.label}</span>
              )}
              {sidebarOpen && item.badge !== undefined && item.badge > 0 && (
                <span
                  className="ml-auto px-2 py-0.5 rounded-full"
                  style={{ background: active ? "rgba(255,255,255,0.25)" : deptColor, fontSize: "0.7rem", fontWeight: 700, color: "white" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        {sidebarOpen && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
              style={{ background: deptColor }}
            >
              {userName[0]}
            </div>
            <div className="min-w-0">
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "white", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {userName}
              </div>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>{dept}</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all hover:bg-red-500/10"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <LogOut size={16} />
          {sidebarOpen && <span style={{ fontSize: "0.85rem" }}>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F4F6F9" }}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.25 }}
        className="hidden lg:flex flex-col flex-shrink-0 overflow-hidden"
        style={{ background: "#1B2B3A" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-60 lg:hidden"
              style={{ background: "#1B2B3A" }}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center gap-4 px-4 sm:px-6 py-3 border-b flex-shrink-0"
          style={{ background: "white", borderColor: "rgba(0,0,0,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1.5 rounded-lg hover:bg-muted"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <button
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={18} style={{ color: "#6B7280" }} />
            </button>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#1B2B3A" }}>{activeNav}</div>
              <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted transition-colors">
              <Bell size={18} style={{ color: "#6B7280" }} />
              <span
                className="absolute top-1 right-1 w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ background: "#E63946", fontSize: "0.6rem", fontWeight: 700 }}
              >
                3
              </span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "#F4F6F9" }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: deptColor }}
              >
                {userName[0]}
              </div>
              <div className="hidden sm:block">
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1B2B3A" }}>{userName}</div>
                <div style={{ fontSize: "0.68rem", color: "#9CA3AF" }}>{dept}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
