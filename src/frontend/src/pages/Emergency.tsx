import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, AlertTriangle, Ambulance, Phone, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const INITIAL_ALERTS = [
  {
    id: "EMG001",
    patient: "Unknown Male, ~50y",
    complaint: "Cardiac Arrest — CPR in progress",
    severity: "critical",
    bay: "Resus 1",
    doctor: "Dr. Sharma",
    time: "09:22",
    status: "active",
  },
  {
    id: "EMG002",
    patient: "Suresh Rajan, 34y",
    complaint: "Road accident — multiple fractures",
    severity: "high",
    bay: "Trauma 1",
    doctor: "Dr. Mehta",
    time: "09:45",
    status: "active",
  },
  {
    id: "EMG003",
    patient: "Kamla Devi, 68y",
    complaint: "Stroke — left hemiplegia",
    severity: "critical",
    bay: "Neuro Bay",
    doctor: "Dr. Singh",
    time: "10:05",
    status: "active",
  },
  {
    id: "EMG004",
    patient: "Child, 8y",
    complaint: "High fever — convulsions",
    severity: "high",
    bay: "Paed Bay",
    doctor: "Dr. Patel",
    time: "10:20",
    status: "stabilized",
  },
  {
    id: "EMG005",
    patient: "Ravi K, 45y",
    complaint: "Chest pain — possible STEMI",
    severity: "critical",
    bay: "Cardiac Bay",
    doctor: "Dr. Sharma",
    time: "10:35",
    status: "active",
  },
];

const AMBULANCES = [
  {
    id: "AMB-01",
    driver: "Vinod Kumar",
    status: "en-route",
    location: "NH-48, 3km away",
    patient: "Trauma case",
    eta: "8 min",
  },
  {
    id: "AMB-02",
    driver: "Suresh Pillai",
    status: "available",
    location: "Hospital base",
    patient: "",
    eta: "",
  },
  {
    id: "AMB-03",
    driver: "Ramesh T",
    status: "at-scene",
    location: "MG Road accident",
    patient: "RTA case",
    eta: "12 min",
  },
  {
    id: "AMB-04",
    driver: "Deepak Nair",
    status: "returning",
    location: "Apollo Hospital",
    patient: "",
    eta: "15 min",
  },
];

const EMERGENCY_DOCTORS = [
  { name: "Dr. Sharma", specialty: "Cardiology", status: "on-duty", cases: 2 },
  { name: "Dr. Mehta", specialty: "Orthopaedics", status: "on-duty", cases: 1 },
  { name: "Dr. Singh", specialty: "Neurology", status: "on-duty", cases: 1 },
  { name: "Dr. Patel", specialty: "Paediatrics", status: "on-call", cases: 1 },
  {
    name: "Dr. Gupta",
    specialty: "General Surgery",
    status: "available",
    cases: 0,
  },
];

type Alert = (typeof INITIAL_ALERTS)[0];

function severityBadge(s: string) {
  if (s === "critical")
    return (
      <Badge className="bg-red-100 text-red-800 border-red-300">CRITICAL</Badge>
    );
  if (s === "high")
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        HIGH
      </Badge>
    );
  return <Badge className="bg-yellow-100 text-yellow-800">MEDIUM</Badge>;
}

export default function Emergency() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [open, setOpen] = useState(false);
  const [_tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const criticalCount = alerts.filter(
    (a) => a.severity === "critical" && a.status === "active",
  ).length;

  const addAlert = (data: {
    patient: string;
    complaint: string;
    severity: string;
  }) => {
    const newAlert: Alert = {
      id: `EMG${String(alerts.length + 1).padStart(3, "0")}`,
      patient: data.patient,
      complaint: data.complaint,
      severity: data.severity,
      bay: "Triage",
      doctor: "Unassigned",
      time: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "active",
    };
    setAlerts([newAlert, ...alerts]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Emergency & Ambulance
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time emergency monitoring and ambulance dispatch
            </p>
          </div>
          {criticalCount > 0 && (
            <Badge className="bg-red-100 text-red-800 border-red-300 animate-pulse">
              {criticalCount} CRITICAL
            </Badge>
          )}
        </div>
        <Button
          data-ocid="emergency.open_modal_button"
          onClick={() => setOpen(true)}
          className="gap-2 bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus size={16} />
          New Emergency
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Active Cases",
            value: activeAlerts.length,
            color: "oklch(0.55 0.25 25)",
          },
          {
            label: "Critical",
            value: criticalCount,
            color: "oklch(0.52 0.28 20)",
          },
          {
            label: "Ambulances Out",
            value: AMBULANCES.filter((a) => a.status !== "available").length,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "ER Doctors",
            value: EMERGENCY_DOCTORS.filter((d) => d.status !== "available")
              .length,
            color: "oklch(0.6 0.18 160)",
          },
        ].map((s) => (
          <Card
            key={s.label}
            className={
              s.color === "oklch(0.52 0.28 20)" && criticalCount > 0
                ? "border-red-300"
                : ""
            }
          >
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Emergency Alerts */}
      <Card className="border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-red-700">
            <AlertTriangle size={16} /> Active Emergency Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table data-ocid="emergency.table">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Bay</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((a, i) => (
                <TableRow
                  key={a.id}
                  data-ocid={`emergency.row.${i + 1}`}
                  className={
                    a.severity === "critical" && a.status === "active"
                      ? "bg-red-50"
                      : ""
                  }
                >
                  <TableCell className="font-mono text-xs">{a.id}</TableCell>
                  <TableCell className="font-medium text-sm">
                    {a.patient}
                  </TableCell>
                  <TableCell className="text-sm max-w-48 truncate">
                    {a.complaint}
                  </TableCell>
                  <TableCell>{severityBadge(a.severity)}</TableCell>
                  <TableCell className="text-sm">{a.bay}</TableCell>
                  <TableCell className="text-sm">{a.doctor}</TableCell>
                  <TableCell className="text-sm flex items-center gap-1">
                    <Activity size={12} />
                    {a.time}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        a.status === "active"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ambulances */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Ambulance size={16} /> Ambulance Fleet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AMBULANCES.map((amb, i) => (
              <div
                key={amb.id}
                data-ocid={`emergency.ambulance.item.${i + 1}`}
                className={`p-3 rounded-xl border ${
                  amb.status === "en-route"
                    ? "bg-blue-50 border-blue-200"
                    : amb.status === "at-scene"
                      ? "bg-orange-50 border-orange-200"
                      : amb.status === "returning"
                        ? "bg-purple-50 border-purple-200"
                        : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{amb.id}</span>
                    <Badge
                      className={`text-xs ${
                        amb.status === "available"
                          ? "bg-green-100 text-green-800"
                          : amb.status === "en-route"
                            ? "bg-blue-100 text-blue-800"
                            : amb.status === "at-scene"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {amb.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone size={10} /> {amb.driver}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {amb.location}
                </p>
                {amb.patient && (
                  <p className="text-xs font-medium mt-0.5">
                    {amb.patient} • ETA: {amb.eta}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Emergency Doctors */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Emergency Doctor Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {EMERGENCY_DOCTORS.map((d, i) => (
              <div
                key={d.name}
                data-ocid={`emergency.doctor.item.${i + 1}`}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "oklch(0.58 0.14 200)" }}
                >
                  {d.name.split(" ")[1]?.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {d.specialty} • {d.cases} active case
                    {d.cases !== 1 ? "s" : ""}
                  </p>
                </div>
                <Badge
                  className={
                    d.status === "available"
                      ? "bg-green-100 text-green-800"
                      : d.status === "on-duty"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {d.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* New Emergency Modal */}
      <EmergencyForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={addAlert}
      />
    </div>
  );
}

function EmergencyForm({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: {
    patient: string;
    complaint: string;
    severity: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    patient: "",
    complaint: "",
    severity: "high",
  });
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent data-ocid="emergency.dialog">
        <DialogHeader>
          <DialogTitle>Register Emergency Case</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Patient Name / Description</Label>
            <Input
              data-ocid="emergency.patient.input"
              className="mt-1"
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
              placeholder="Patient name or description"
            />
          </div>
          <div>
            <Label>Chief Complaint</Label>
            <Input
              data-ocid="emergency.complaint.input"
              className="mt-1"
              value={form.complaint}
              onChange={(e) => setForm({ ...form, complaint: e.target.value })}
              placeholder="Chief complaint"
            />
          </div>
          <div>
            <Label>Severity</Label>
            <Select
              value={form.severity}
              onValueChange={(v) => setForm({ ...form, severity: v })}
            >
              <SelectTrigger
                data-ocid="emergency.severity.select"
                className="mt-1"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            data-ocid="emergency.cancel_button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            data-ocid="emergency.submit_button"
            onClick={() => onSubmit(form)}
          >
            Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
