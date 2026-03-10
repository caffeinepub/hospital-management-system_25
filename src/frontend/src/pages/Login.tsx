import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardList, Heart, Pill, Stethoscope, UserCog } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { CurrentUser } from "../App";
import { HospitalRole } from "../backend.d";

interface Props {
  onLogin: (user: CurrentUser) => void;
}

const ROLES: {
  role: HospitalRole;
  label: string;
  icon: React.ReactNode;
  desc: string;
}[] = [
  {
    role: HospitalRole.admin,
    label: "Admin",
    icon: <UserCog size={22} />,
    desc: "Full system access",
  },
  {
    role: HospitalRole.doctor,
    label: "Doctor",
    icon: <Stethoscope size={22} />,
    desc: "Patient care & prescriptions",
  },
  {
    role: HospitalRole.nurse,
    label: "Nurse",
    icon: <Heart size={22} />,
    desc: "Patient monitoring",
  },
  {
    role: HospitalRole.receptionist,
    label: "Receptionist",
    icon: <ClipboardList size={22} />,
    desc: "Appointments & billing",
  },
  {
    role: HospitalRole.pharmacist,
    label: "Pharmacist",
    icon: <Pill size={22} />,
    desc: "Inventory & dispensing",
  },
];

export default function LoginPage({ onLogin }: Props) {
  const [selectedRole, setSelectedRole] = useState<HospitalRole | null>(null);
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !name.trim()) return;
    onLogin({ name: name.trim(), role: selectedRole });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "oklch(0.58 0.14 200)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-8"
          style={{ background: "oklch(0.65 0.16 160)" }}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "oklch(0.58 0.14 200)" }}
          >
            <Stethoscope size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            MediCore HMS
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Hospital Management System
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-foreground mb-3 block">
                Select Your Role
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map(({ role, label, icon, desc }) => (
                  <button
                    key={role}
                    type="button"
                    data-ocid={`login.${role}.toggle`}
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selectedRole === role
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    }`}
                  >
                    <span
                      className={
                        selectedRole === role
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    >
                      {icon}
                    </span>
                    <div>
                      <div className="font-semibold text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        {desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="name"
                className="text-sm font-semibold mb-2 block"
              >
                Your Name
              </Label>
              <Input
                id="name"
                data-ocid="login.input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            <Button
              type="submit"
              data-ocid="login.primary_button"
              disabled={!selectedRole || !name.trim()}
              className="w-full h-11 text-sm font-semibold"
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              Sign In to MediCore
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
