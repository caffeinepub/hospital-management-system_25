import {
  Activity,
  AlertTriangle,
  BarChart3,
  BedDouble,
  Calendar,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Package,
  Receipt,
  Shield,
  ShieldCheck,
  Stethoscope,
  User,
  UserSquare2,
  Users,
} from "lucide-react";
import type { CurrentUser } from "../App";
import { HospitalRole } from "../backend.d";
import type { Page } from "./Layout";

interface NavSection {
  title: string;
  items: NavItem[];
}
interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const ALL_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
      },
    ],
  },
  {
    title: "Clinical",
    items: [
      { id: "patients", label: "Patients / EMR", icon: <Users size={16} /> },
      {
        id: "appointments",
        label: "Appointments",
        icon: <Calendar size={16} />,
      },
      { id: "opdipd", label: "OPD / IPD", icon: <HeartPulse size={16} /> },
      { id: "doctors", label: "Doctors", icon: <Stethoscope size={16} /> },
    ],
  },
  {
    title: "Medical",
    items: [
      {
        id: "prescriptions",
        label: "Prescriptions",
        icon: <FileText size={16} />,
      },
      {
        id: "laboratory",
        label: "Laboratory",
        icon: <FlaskConical size={16} />,
      },
    ],
  },
  {
    title: "Operations",
    items: [
      { id: "pharmacy", label: "Pharmacy", icon: <Package size={16} /> },
      { id: "billing", label: "Billing", icon: <Receipt size={16} /> },
      { id: "insurance", label: "Insurance", icon: <Shield size={16} /> },
    ],
  },
  {
    title: "Management",
    items: [
      { id: "staff", label: "Staff", icon: <UserSquare2 size={16} /> },
      {
        id: "emergency",
        label: "Emergency",
        icon: <AlertTriangle size={16} />,
      },
      {
        id: "beds-wards",
        label: "Beds & Wards",
        icon: <BedDouble size={16} />,
      },
    ],
  },
  {
    title: "Analytics",
    items: [{ id: "reports", label: "Reports", icon: <BarChart3 size={16} /> }],
  },
  {
    title: "Admin",
    items: [
      {
        id: "activity-logs",
        label: "Activity Logs",
        icon: <Activity size={16} />,
      },
      { id: "profile", label: "Settings", icon: <ShieldCheck size={16} /> },
    ],
  },
];

const ROLE_PAGES: Record<HospitalRole, Page[]> = {
  [HospitalRole.admin]: [
    "dashboard",
    "patients",
    "appointments",
    "opdipd",
    "doctors",
    "prescriptions",
    "laboratory",
    "pharmacy",
    "billing",
    "insurance",
    "staff",
    "emergency",
    "beds-wards",
    "reports",
    "activity-logs",
    "profile",
  ],
  [HospitalRole.doctor]: [
    "dashboard",
    "patients",
    "appointments",
    "opdipd",
    "prescriptions",
    "laboratory",
    "profile",
  ],
  [HospitalRole.nurse]: [
    "dashboard",
    "patients",
    "appointments",
    "opdipd",
    "beds-wards",
    "emergency",
    "profile",
  ],
  [HospitalRole.receptionist]: [
    "dashboard",
    "patients",
    "appointments",
    "billing",
    "insurance",
    "profile",
  ],
  [HospitalRole.pharmacist]: [
    "dashboard",
    "pharmacy",
    "prescriptions",
    "billing",
    "profile",
  ],
};

interface Props {
  user: CurrentUser;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ user, currentPage, onNavigate }: Props) {
  const allowedPages = new Set(ROLE_PAGES[user.role]);

  return (
    <nav
      className="h-full flex flex-col"
      style={{ background: "oklch(0.18 0.04 230)" }}
    >
      <div
        className="px-4 py-4 border-b"
        style={{ borderColor: "oklch(0.28 0.04 225)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.58 0.14 200)" }}
          >
            <Stethoscope size={18} className="text-white" />
          </div>
          <div>
            <div
              className="text-sm font-bold"
              style={{ color: "oklch(0.95 0.01 220)" }}
            >
              MediCore
            </div>
            <div className="text-xs" style={{ color: "oklch(0.55 0.02 225)" }}>
              Enterprise HMS
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {ALL_SECTIONS.map((section) => {
          const visibleItems = section.items.filter((i) =>
            allowedPages.has(i.id),
          );
          if (!visibleItems.length) return null;
          return (
            <div key={section.title}>
              <p
                className="text-xs font-semibold uppercase tracking-widest px-3 mb-1.5"
                style={{ color: "oklch(0.45 0.02 225)" }}
              >
                {section.title}
              </p>
              {visibleItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-ocid={`nav.${item.id}.link`}
                    onClick={() => onNavigate(item.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5"
                    style={{
                      background: isActive
                        ? "oklch(0.58 0.14 200)"
                        : "transparent",
                      color: isActive ? "white" : "oklch(0.68 0.02 225)",
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div
        className="px-4 py-3 border-t"
        style={{ borderColor: "oklch(0.28 0.04 225)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "oklch(0.58 0.14 200)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-xs font-semibold truncate"
              style={{ color: "oklch(0.9 0.01 220)" }}
            >
              {user.name}
            </div>
            <div
              className="text-xs capitalize"
              style={{ color: "oklch(0.5 0.02 225)" }}
            >
              {user.role}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
