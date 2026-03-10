import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Heart,
  LogOut,
  Pill,
  Shield,
  Stethoscope,
} from "lucide-react";
import type { CurrentUser } from "../App";
import { HospitalRole } from "../backend.d";

const ROLE_INFO: Record<
  HospitalRole,
  { label: string; icon: React.ReactNode; desc: string; color: string }
> = {
  [HospitalRole.admin]: {
    label: "Administrator",
    icon: <Shield size={32} />,
    desc: "Full system access — manage all hospital operations, staff, and reports.",
    color: "oklch(0.55 0.18 280)",
  },
  [HospitalRole.doctor]: {
    label: "Doctor",
    icon: <Stethoscope size={32} />,
    desc: "Manage appointments, write prescriptions, and view patient records.",
    color: "oklch(0.58 0.14 200)",
  },
  [HospitalRole.nurse]: {
    label: "Nurse",
    icon: <Heart size={32} />,
    desc: "Monitor patients and assist with appointment scheduling.",
    color: "oklch(0.62 0.18 350)",
  },
  [HospitalRole.receptionist]: {
    label: "Receptionist",
    icon: <ClipboardList size={32} />,
    desc: "Handle patient registration, appointments, and billing.",
    color: "oklch(0.65 0.18 65)",
  },
  [HospitalRole.pharmacist]: {
    label: "Pharmacist",
    icon: <Pill size={32} />,
    desc: "Manage pharmacy inventory and dispense prescriptions.",
    color: "oklch(0.6 0.18 145)",
  },
};

interface Props {
  user: CurrentUser;
  onLogout: () => void;
}

export default function Profile({ user, onLogout }: Props) {
  const info = ROLE_INFO[user.role];

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm">
          Your account information
        </p>
      </div>

      <Card className="border-border shadow-xs">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${info.color}22` }}
            >
              <span style={{ color: info.color }}>{info.icon}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p
                className="text-sm font-medium mt-0.5"
                style={{ color: info.color }}
              >
                {info.label}
              </p>
              <p className="text-sm text-muted-foreground mt-2">{info.desc}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Demo Mode</p>
        <p>
          This is a demo session. No real authentication is required. Your role
          and name are stored locally.
        </p>
      </div>

      <Button
        data-ocid="profile.primary_button"
        variant="destructive"
        className="flex items-center gap-2"
        onClick={onLogout}
      >
        <LogOut size={16} /> Sign Out
      </Button>
    </div>
  );
}
