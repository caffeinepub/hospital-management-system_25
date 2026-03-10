import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { CurrentUser } from "../App";
import { HospitalRole } from "../backend.d";
import ActivityLogs from "../pages/ActivityLogs";
import Appointments from "../pages/Appointments";
import BedsWards from "../pages/BedsWards";
import Billing from "../pages/Billing";
import Dashboard from "../pages/Dashboard";
import Doctors from "../pages/Doctors";
import Emergency from "../pages/Emergency";
import Insurance from "../pages/Insurance";
import Laboratory from "../pages/Laboratory";
import OPDIPD from "../pages/OPDIPD";
import Patients from "../pages/Patients";
import Pharmacy from "../pages/Pharmacy";
import Prescriptions from "../pages/Prescriptions";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import Staff from "../pages/Staff";
import Sidebar from "./Sidebar";

export type Page =
  | "dashboard"
  | "patients"
  | "doctors"
  | "appointments"
  | "opdipd"
  | "prescriptions"
  | "laboratory"
  | "pharmacy"
  | "billing"
  | "insurance"
  | "staff"
  | "emergency"
  | "beds-wards"
  | "reports"
  | "activity-logs"
  | "profile";

const ROLE_LABELS: Record<HospitalRole, string> = {
  [HospitalRole.admin]: "Super Admin",
  [HospitalRole.doctor]: "Doctor",
  [HospitalRole.nurse]: "Nurse",
  [HospitalRole.receptionist]: "Receptionist",
  [HospitalRole.pharmacist]: "Pharmacist",
};

const PAGE_TITLES: Record<Page, string> = {
  dashboard: "Dashboard",
  patients: "Patients / EMR",
  doctors: "Doctor Management",
  appointments: "Appointments",
  opdipd: "OPD / IPD Management",
  prescriptions: "Prescriptions",
  laboratory: "Laboratory (LIS)",
  pharmacy: "Pharmacy",
  billing: "Billing & Finance",
  insurance: "Insurance Claims",
  staff: "Staff Management",
  emergency: "Emergency & Ambulance",
  "beds-wards": "Beds & Wards",
  reports: "Analytics & Reports",
  "activity-logs": "Activity Logs",
  profile: "Profile",
};

const ROLE_BADGE: Record<HospitalRole, string> = {
  [HospitalRole.admin]: "bg-purple-100 text-purple-800",
  [HospitalRole.doctor]: "bg-blue-100 text-blue-800",
  [HospitalRole.nurse]: "bg-pink-100 text-pink-800",
  [HospitalRole.receptionist]: "bg-amber-100 text-amber-800",
  [HospitalRole.pharmacist]: "bg-green-100 text-green-800",
};

interface Props {
  user: CurrentUser;
  onLogout: () => void;
}

export default function Layout({ user, onLogout }: Props) {
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <Patients />;
      case "doctors":
        return <Doctors />;
      case "appointments":
        return <Appointments />;
      case "opdipd":
        return <OPDIPD />;
      case "prescriptions":
        return <Prescriptions />;
      case "laboratory":
        return <Laboratory />;
      case "pharmacy":
        return <Pharmacy />;
      case "billing":
        return <Billing />;
      case "insurance":
        return <Insurance />;
      case "staff":
        return <Staff />;
      case "emergency":
        return <Emergency />;
      case "beds-wards":
        return <BedsWards />;
      case "reports":
        return <Reports />;
      case "activity-logs":
        return <ActivityLogs />;
      case "profile":
        return <Profile user={user} onLogout={onLogout} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black/50 z-20 lg:hidden w-full cursor-default"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar
          user={user}
          currentPage={page}
          onNavigate={(p) => {
            setPage(p);
            setSidebarOpen(false);
          }}
        />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
            <h2 className="text-sm font-semibold text-foreground">
              {PAGE_TITLES[page]}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {user.name}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_BADGE[user.role]}`}
            >
              {ROLE_LABELS[user.role]}
            </span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
