import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { ServicesSection } from "./components/ServicesSection";
import { ModulesSection } from "./components/ModulesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { DoctorsSection } from "./components/DoctorsSection";
import { MobileSection } from "./components/MobileSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { LoginPage } from "./components/LoginPage";

import { DoctorDashboard } from "./components/dashboard/DoctorDashboard";
import { AdminDashboard } from "./components/dashboard/AdminDashboard";
import { AccountsDashboard } from "./components/dashboard/AccountsDashboard";
import { LabDashboard } from "./components/dashboard/LabDashboard";
import { PharmacyDashboard } from "./components/dashboard/PharmacyDashboard";
import { CanteenDashboard } from "./components/dashboard/CanteenDashboard";
import { PatientDashboard } from "./components/dashboard/PatientDashboard";

type Page = "landing" | "login" | "dashboard";

export default function App() {
  const [page, setPage] = useState<Page>("landing");
  const [dept, setDept] = useState<string>("doctor");

  const goToLogin = () => {
    setPage("login");
    window.scrollTo(0, 0);
  };

  const handleLogin = (selectedDept: string, _isPatient: boolean) => {
    setDept(selectedDept);
    setPage("dashboard");
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setPage("landing");
    window.scrollTo(0, 0);
  };

  const renderDashboard = () => {
    switch (dept) {
      case "doctor": return <DoctorDashboard onLogout={handleLogout} />;
      case "admin": return <AdminDashboard onLogout={handleLogout} />;
      case "accounts": return <AccountsDashboard onLogout={handleLogout} />;
      case "lab": return <LabDashboard onLogout={handleLogout} />;
      case "pharmacy": return <PharmacyDashboard onLogout={handleLogout} />;
      case "canteen": return <CanteenDashboard onLogout={handleLogout} />;
      case "patient": return <PatientDashboard onLogout={handleLogout} />;
      default: return <DoctorDashboard onLogout={handleLogout} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {page === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-screen"
        >
          <Navbar onPatientLogin={goToLogin} onHospitalLogin={goToLogin} />
          <HeroSection />
          <StatsSection />
          <ServicesSection />
          <ModulesSection />
          <FeaturesSection />
          <TestimonialsSection />
          <DoctorsSection />
          <MobileSection />
          <ContactSection />
          <Footer />
        </motion.div>
      )}

      {page === "login" && (
        <motion.div
          key="login"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <LoginPage onBack={() => setPage("landing")} onLogin={handleLogin} />
        </motion.div>
      )}

      {page === "dashboard" && (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-screen"
        >
          {renderDashboard()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
