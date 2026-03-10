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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BedDouble, Clock, HeartPulse, Plus, User } from "lucide-react";
import { useState } from "react";

const OPD_QUEUE = [
  {
    token: 1,
    name: "Arun Kumar",
    age: 45,
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "09:15",
    status: "consulting",
    complaint: "Chest pain",
  },
  {
    token: 2,
    name: "Priya Mehta",
    age: 32,
    doctor: "Dr. Patel",
    dept: "Gynaecology",
    time: "09:30",
    status: "waiting",
    complaint: "Routine checkup",
  },
  {
    token: 3,
    name: "Mohan Lal",
    age: 67,
    doctor: "Dr. Mehta",
    dept: "Orthopaedics",
    time: "09:45",
    status: "waiting",
    complaint: "Knee pain",
  },
  {
    token: 4,
    name: "Sunita Devi",
    age: 28,
    doctor: "Dr. Singh",
    dept: "ENT",
    time: "10:00",
    status: "waiting",
    complaint: "Throat infection",
  },
  {
    token: 5,
    name: "Raj Sharma",
    age: 55,
    doctor: "Dr. Sharma",
    dept: "Cardiology",
    time: "10:15",
    status: "waiting",
    complaint: "BP monitoring",
  },
];

const IPD_BEDS = [
  {
    bed: "A-101",
    ward: "General",
    patient: "Vikram Nair",
    doctor: "Dr. Mehta",
    nurse: "Asha Singh",
    admitted: "2026-03-05",
    diagnosis: "Pneumonia",
    status: "occupied",
  },
  {
    bed: "B-201",
    ward: "Private",
    patient: "Lata Sharma",
    doctor: "Dr. Patel",
    nurse: "Priya Rao",
    admitted: "2026-03-07",
    diagnosis: "Post-op recovery",
    status: "occupied",
  },
  {
    bed: "C-301",
    ward: "ICU",
    patient: "Ramesh Gupta",
    doctor: "Dr. Sharma",
    nurse: "Meena K",
    admitted: "2026-03-09",
    diagnosis: "MI — Monitored",
    status: "critical",
  },
  {
    bed: "A-102",
    ward: "General",
    patient: "",
    doctor: "",
    nurse: "",
    admitted: "",
    diagnosis: "",
    status: "available",
  },
  {
    bed: "B-202",
    ward: "Private",
    patient: "Kavitha R",
    doctor: "Dr. Singh",
    nurse: "Asha Singh",
    admitted: "2026-03-08",
    diagnosis: "Appendectomy recovery",
    status: "occupied",
  },
  {
    bed: "C-302",
    ward: "ICU",
    patient: "",
    doctor: "",
    nurse: "",
    admitted: "",
    diagnosis: "",
    status: "available",
  },
  {
    bed: "D-401",
    ward: "General",
    patient: "",
    doctor: "",
    nurse: "",
    admitted: "",
    diagnosis: "",
    status: "cleaning",
  },
];

const NURSE_SCHEDULE = [
  {
    nurse: "Asha Singh",
    shift: "Morning (6AM-2PM)",
    ward: "General A",
    patients: 8,
  },
  {
    nurse: "Priya Rao",
    shift: "Morning (6AM-2PM)",
    ward: "Private B",
    patients: 5,
  },
  { nurse: "Meena K", shift: "Morning (6AM-2PM)", ward: "ICU", patients: 3 },
  {
    nurse: "Sita Devi",
    shift: "Evening (2PM-10PM)",
    ward: "General A",
    patients: 8,
  },
  {
    nurse: "Rupa Sharma",
    shift: "Night (10PM-6AM)",
    ward: "General A",
    patients: 8,
  },
];

type BedRecord = (typeof IPD_BEDS)[0];

export default function OPDIPD() {
  const [opdQueue] = useState(OPD_QUEUE);
  const [beds] = useState<BedRecord[]>(IPD_BEDS);
  const [admitOpen, setAdmitOpen] = useState(false);
  const [dischargeOpen, setDischargeOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<BedRecord | null>(null);

  const bedStats = {
    total: beds.length,
    occupied: beds.filter(
      (b) => b.status === "occupied" || b.status === "critical",
    ).length,
    available: beds.filter((b) => b.status === "available").length,
    critical: beds.filter((b) => b.status === "critical").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">
          OPD / IPD Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Outpatient queue, inpatient beds, ICU monitoring
        </p>
      </div>

      <Tabs defaultValue="opd">
        <TabsList>
          <TabsTrigger value="opd" data-ocid="opdipd.opd.tab">
            OPD Queue
          </TabsTrigger>
          <TabsTrigger value="ipd" data-ocid="opdipd.ipd.tab">
            IPD Beds
          </TabsTrigger>
          <TabsTrigger value="icu" data-ocid="opdipd.icu.tab">
            ICU Monitoring
          </TabsTrigger>
          <TabsTrigger value="nurses" data-ocid="opdipd.nurses.tab">
            Nurse Schedule
          </TabsTrigger>
        </TabsList>

        {/* OPD */}
        <TabsContent value="opd" className="mt-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              {
                label: "Total Today",
                value: opdQueue.length,
                color: "oklch(0.58 0.14 200)",
              },
              {
                label: "Consulting",
                value: opdQueue.filter((q) => q.status === "consulting").length,
                color: "oklch(0.6 0.18 160)",
              },
              {
                label: "Waiting",
                value: opdQueue.filter((q) => q.status === "waiting").length,
                color: "oklch(0.7 0.18 65)",
              },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4 text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <HeartPulse size={16} /> Today's OPD Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="opdipd.opd.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {opdQueue.map((q, i) => (
                    <TableRow
                      key={q.token}
                      data-ocid={`opdipd.opd.row.${i + 1}`}
                    >
                      <TableCell>
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: "oklch(0.58 0.14 200)" }}
                        >
                          {q.token}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {q.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({q.age}y)
                        </span>
                      </TableCell>
                      <TableCell>{q.doctor}</TableCell>
                      <TableCell>{q.dept}</TableCell>
                      <TableCell className="flex items-center gap-1 text-sm">
                        <Clock size={12} />
                        {q.time}
                      </TableCell>
                      <TableCell className="text-sm">{q.complaint}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            q.status === "consulting"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {q.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IPD */}
        <TabsContent value="ipd" className="mt-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              {
                label: "Total Beds",
                value: bedStats.total,
                color: "oklch(0.58 0.14 200)",
              },
              {
                label: "Occupied",
                value: bedStats.occupied,
                color: "oklch(0.62 0.22 25)",
              },
              {
                label: "Available",
                value: bedStats.available,
                color: "oklch(0.6 0.18 160)",
              },
              {
                label: "Critical",
                value: bedStats.critical,
                color: "oklch(0.55 0.25 20)",
              },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4 text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: s.color }}
                  >
                    {s.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold">Bed Allocation</h3>
            <Button
              size="sm"
              data-ocid="opdipd.admit.open_modal_button"
              onClick={() => setAdmitOpen(true)}
              className="gap-1"
            >
              <Plus size={14} />
              Admit Patient
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {beds.map((b, i) => (
              <Card
                key={b.bed}
                data-ocid={`opdipd.bed.item.${i + 1}`}
                className={`border-2 ${
                  b.status === "critical"
                    ? "border-red-300 bg-red-50"
                    : b.status === "available"
                      ? "border-green-300 bg-green-50"
                      : b.status === "cleaning"
                        ? "border-yellow-300 bg-yellow-50"
                        : "border-blue-200 bg-blue-50"
                }`}
              >
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <BedDouble
                        size={16}
                        style={{
                          color:
                            b.status === "critical"
                              ? "oklch(0.55 0.25 20)"
                              : b.status === "available"
                                ? "oklch(0.6 0.18 160)"
                                : "oklch(0.58 0.14 200)",
                        }}
                      />
                      <span className="font-bold text-sm">{b.bed}</span>
                    </div>
                    <Badge
                      className={`text-xs ${
                        b.status === "critical"
                          ? "bg-red-100 text-red-800"
                          : b.status === "available"
                            ? "bg-green-100 text-green-800"
                            : b.status === "cleaning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  {b.patient ? (
                    <div className="text-xs space-y-0.5">
                      <p className="font-semibold">{b.patient}</p>
                      <p className="text-muted-foreground">
                        {b.doctor} • {b.ward}
                      </p>
                      <p className="text-muted-foreground">{b.diagnosis}</p>
                      <p className="text-muted-foreground">
                        Admitted: {b.admitted}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 h-6 text-xs"
                        data-ocid={`opdipd.discharge_button.${i + 1}`}
                        onClick={() => {
                          setSelectedBed(b);
                          setDischargeOpen(true);
                        }}
                      >
                        Discharge
                      </Button>
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      <p>{b.ward} Ward</p>
                      {b.status === "available" && (
                        <p className="text-green-700 font-medium mt-1">
                          Ready for admission
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ICU */}
        <TabsContent value="icu" className="mt-4">
          <div className="space-y-4">
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-red-700 flex items-center gap-2">
                  <HeartPulse size={16} />
                  ICU Patient Vitals — Live Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                {[
                  {
                    name: "Ramesh Gupta",
                    bed: "C-301",
                    hr: "88",
                    bp: "142/92",
                    spo2: "94%",
                    temp: "37.8°C",
                    status: "critical",
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="p-4 rounded-xl border-2 border-red-200 bg-red-50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <User size={20} className="text-red-600" />
                      <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Bed {p.bed}
                        </p>
                      </div>
                      <Badge className="ml-auto bg-red-100 text-red-800">
                        CRITICAL
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        {
                          label: "Heart Rate",
                          value: `${p.hr} bpm`,
                          color: "red",
                        },
                        {
                          label: "Blood Pressure",
                          value: p.bp,
                          color: "orange",
                        },
                        { label: "SpO2", value: p.spo2, color: "blue" },
                        {
                          label: "Temperature",
                          value: p.temp,
                          color: "yellow",
                        },
                      ].map((v) => (
                        <div
                          key={v.label}
                          className={`p-2.5 rounded-lg bg-${v.color}-100 border border-${v.color}-200`}
                        >
                          <p className={`text-xs text-${v.color}-600`}>
                            {v.label}
                          </p>
                          <p
                            className={`text-lg font-bold text-${v.color}-800`}
                          >
                            {v.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Nurses */}
        <TabsContent value="nurses" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Nurse Duty Schedule — Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nurse</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Ward</TableHead>
                    <TableHead>Patients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {NURSE_SCHEDULE.map((n, i) => (
                    <TableRow
                      key={n.nurse}
                      data-ocid={`opdipd.nurse.row.${i + 1}`}
                    >
                      <TableCell className="font-medium">{n.nurse}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{n.shift}</Badge>
                      </TableCell>
                      <TableCell>{n.ward}</TableCell>
                      <TableCell>{n.patients}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Admit Modal */}
      <Dialog open={admitOpen} onOpenChange={setAdmitOpen}>
        <DialogContent data-ocid="opdipd.admit.dialog">
          <DialogHeader>
            <DialogTitle>Admit New Patient</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Patient Name</Label>
              <Input className="mt-1" placeholder="Full name" />
            </div>
            <div>
              <Label>Ward</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned Doctor</Label>
              <Input className="mt-1" placeholder="Doctor name" />
            </div>
            <div>
              <Label>Diagnosis</Label>
              <Input className="mt-1" placeholder="Primary diagnosis" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="opdipd.admit.cancel_button"
              onClick={() => setAdmitOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="opdipd.admit.submit_button"
              onClick={() => setAdmitOpen(false)}
            >
              Admit Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discharge Modal */}
      <Dialog open={dischargeOpen} onOpenChange={setDischargeOpen}>
        <DialogContent data-ocid="opdipd.discharge.dialog">
          <DialogHeader>
            <DialogTitle>
              Discharge Patient — {selectedBed?.patient}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Discharge Summary</Label>
              <Input className="mt-1" placeholder="Summary notes" />
            </div>
            <div>
              <Label>Discharge Date</Label>
              <Input
                type="date"
                className="mt-1"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label>Follow-up Date</Label>
              <Input type="date" className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="opdipd.discharge.cancel_button"
              onClick={() => setDischargeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="opdipd.discharge.confirm_button"
              onClick={() => setDischargeOpen(false)}
            >
              Confirm Discharge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
