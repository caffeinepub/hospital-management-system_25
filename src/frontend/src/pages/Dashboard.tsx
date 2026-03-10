import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  BedDouble,
  Calendar,
  CheckCircle,
  DollarSign,
  HeartPulse,
  IndianRupee,
  Package,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { DashboardStats } from "../backend.d";
import { useActor } from "../hooks/useActor";

const EMERGENCY_ALERTS = [
  {
    id: 1,
    msg: "Patient in Bay 3 — Critical BP",
    severity: "critical",
    time: "2 min ago",
  },
  {
    id: 2,
    msg: "Ambulance arriving — Trauma case",
    severity: "high",
    time: "8 min ago",
  },
  {
    id: 3,
    msg: "ICU bed requested — Ward B",
    severity: "medium",
    time: "15 min ago",
  },
];

const BED_STATS = [
  { ward: "ICU", total: 20, occupied: 14, color: "oklch(0.62 0.22 25)" },
  { ward: "General", total: 100, occupied: 73, color: "oklch(0.58 0.14 200)" },
  { ward: "Private", total: 40, occupied: 28, color: "oklch(0.6 0.18 160)" },
  { ward: "Emergency", total: 15, occupied: 9, color: "oklch(0.65 0.18 290)" },
];

const MONTHLY_REVENUE = [
  { month: "Sep", rev: 480000 },
  { month: "Oct", rev: 520000 },
  { month: "Nov", rev: 495000 },
  { month: "Dec", rev: 610000 },
  { month: "Jan", rev: 575000 },
  { month: "Feb", rev: 640000 },
];

const DOCTOR_PERF = [
  { name: "Dr. Sharma", patients: 48, satisfaction: 96 },
  { name: "Dr. Patel", patients: 42, satisfaction: 94 },
  { name: "Dr. Mehta", patients: 39, satisfaction: 91 },
  { name: "Dr. Singh", patients: 35, satisfaction: 89 },
];

export default function Dashboard() {
  const { actor } = useActor();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [actor]);

  const maxRev = Math.max(...MONTHLY_REVENUE.map((r) => r.rev));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Enterprise Dashboard
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            MediCore Hospital Network — Real-time overview
          </p>
        </div>
        <Badge
          variant="outline"
          className="text-green-600 border-green-300 bg-green-50"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 inline-block" />
          System Online
        </Badge>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div
          data-ocid="dashboard.loading_state"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {["k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8"].map((k) => (
            <Card key={k}>
              <CardContent className="pt-5">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Patients",
              value: stats ? Number(stats.totalPatients).toLocaleString() : "0",
              icon: <Users size={18} />,
              color: "oklch(0.58 0.14 200)",
              sub: "+12 today",
            },
            {
              label: "Active Doctors",
              value: stats ? Number(stats.totalDoctors).toLocaleString() : "0",
              icon: <Stethoscope size={18} />,
              color: "oklch(0.6 0.18 160)",
              sub: "All available",
            },
            {
              label: "Today Appointments",
              value: stats
                ? Number(stats.scheduledAppointments).toLocaleString()
                : "0",
              icon: <Calendar size={18} />,
              color: "oklch(0.65 0.18 250)",
              sub: "Scheduled",
            },
            {
              label: "Completed Today",
              value: stats
                ? Number(stats.completedAppointments).toLocaleString()
                : "0",
              icon: <CheckCircle size={18} />,
              color: "oklch(0.6 0.18 145)",
              sub: "Consultations",
            },
            {
              label: "Pending Revenue",
              value: stats
                ? `₹${(stats.pendingBillsTotal / 1000).toFixed(1)}K`
                : "₹0",
              icon: <IndianRupee size={18} />,
              color: "oklch(0.7 0.18 65)",
              sub: "Unpaid bills",
            },
            {
              label: "Low Stock Alerts",
              value: stats
                ? Number(stats.lowStockItemsCount).toLocaleString()
                : "0",
              icon: <Package size={18} />,
              color: "oklch(0.62 0.22 25)",
              sub: "Medicines",
            },
            {
              label: "Bed Occupancy",
              value: "73%",
              icon: <BedDouble size={18} />,
              color: "oklch(0.65 0.18 290)",
              sub: "175/240 beds",
            },
            {
              label: "OPD Today",
              value: "84",
              icon: <HeartPulse size={18} />,
              color: "oklch(0.62 0.16 340)",
              sub: "Outpatient",
            },
          ].map((c) => (
            <Card
              key={c.label}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                      {c.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-0.5">
                      {c.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {c.sub}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${c.color}22` }}
                  >
                    <span style={{ color: c.color }}>{c.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-500" /> Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {MONTHLY_REVENUE.map((r) => (
                <div
                  key={r.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-xs text-muted-foreground">
                    ₹{(r.rev / 1000).toFixed(0)}K
                  </span>
                  <div
                    className="w-full rounded-t-sm"
                    style={{
                      height: `${(r.rev / maxRev) * 96}px`,
                      background: "oklch(0.58 0.14 200)",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {r.month}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" /> Emergency
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {EMERGENCY_ALERTS.map((alert) => (
              <div
                key={alert.id}
                className={`p-2.5 rounded-lg border text-xs ${
                  alert.severity === "critical"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : alert.severity === "high"
                      ? "bg-orange-50 border-orange-200 text-orange-800"
                      : "bg-yellow-50 border-yellow-200 text-yellow-800"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{alert.msg}</p>
                    <p className="opacity-70 mt-0.5">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bed Occupancy */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BedDouble size={16} className="text-indigo-500" /> Bed Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {BED_STATS.map((b) => (
              <div key={b.ward}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{b.ward}</span>
                  <span className="text-muted-foreground">
                    {b.occupied}/{b.total} beds
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(b.occupied / b.total) * 100}%`,
                      background: b.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Doctor Performance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity size={16} className="text-green-500" /> Doctor
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DOCTOR_PERF.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">
                    {i + 1}
                  </span>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "oklch(0.58 0.14 200)" }}
                  >
                    {d.name.split(" ")[1]?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {d.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.patients} patients this week
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {d.satisfaction}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OPD / IPD Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "OPD Patients",
            value: "84",
            sub: "Today",
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "IPD Admissions",
            value: "12",
            sub: "Today",
            color: "oklch(0.6 0.18 160)",
          },
          {
            label: "Surgeries",
            value: "5",
            sub: "Scheduled",
            color: "oklch(0.65 0.18 250)",
          },
          {
            label: "Discharges",
            value: "8",
            sub: "Today",
            color: "oklch(0.6 0.18 145)",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <DollarSign size={0} className="hidden" />
              <div className="text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">
                {s.label}
              </div>
              <div className="text-xs text-muted-foreground">{s.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
