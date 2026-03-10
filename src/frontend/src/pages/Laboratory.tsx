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
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FlaskConical,
  Plus,
  Search,
} from "lucide-react";
import { useState } from "react";

const TEST_TYPES = [
  "Blood CBC",
  "Blood Sugar",
  "Urine Routine",
  "Liver Function",
  "Kidney Function",
  "Thyroid Profile",
  "Lipid Profile",
  "CT Scan",
  "MRI Brain",
  "Chest X-Ray",
  "ECG",
  "Pathology Biopsy",
];

const initialTests = [
  {
    id: "LAB001",
    patient: "Arun Kumar",
    patientId: "P001",
    test: "Blood CBC",
    category: "Blood",
    technician: "Ravi Verma",
    status: "completed",
    ordered: "2026-03-09",
    result: "Normal — WBC 7.2K, RBC 4.8M, HGB 14.2",
    priority: "routine",
  },
  {
    id: "LAB002",
    patient: "Sunita Devi",
    patientId: "P002",
    test: "MRI Brain",
    category: "Radiology",
    technician: "Priya Sharma",
    status: "pending",
    ordered: "2026-03-10",
    result: "",
    priority: "urgent",
  },
  {
    id: "LAB003",
    patient: "Mohan Lal",
    patientId: "P003",
    test: "CT Scan",
    category: "Radiology",
    technician: "Ajay Kumar",
    status: "in-progress",
    ordered: "2026-03-10",
    result: "",
    priority: "stat",
  },
  {
    id: "LAB004",
    patient: "Priya Mehta",
    patientId: "P004",
    test: "Liver Function",
    category: "Blood",
    technician: "Neha Singh",
    status: "completed",
    ordered: "2026-03-08",
    result: "SGPT: 32 U/L (Normal), SGOT: 28 U/L (Normal)",
    priority: "routine",
  },
  {
    id: "LAB005",
    patient: "Rajesh Singh",
    patientId: "P005",
    test: "Urine Routine",
    category: "Urine",
    technician: "Ravi Verma",
    status: "pending",
    ordered: "2026-03-10",
    result: "",
    priority: "routine",
  },
  {
    id: "LAB006",
    patient: "Kavita Rao",
    patientId: "P006",
    test: "Thyroid Profile",
    category: "Blood",
    technician: "Priya Sharma",
    status: "completed",
    ordered: "2026-03-07",
    result: "TSH: 2.4 mIU/L (Normal), T3: 120 ng/dL",
    priority: "routine",
  },
];

const EQUIPMENT = [
  {
    name: "Hematology Analyzer",
    model: "Sysmex XN-1000",
    status: "operational",
    last_service: "2026-01-15",
  },
  {
    name: "Biochemistry Analyzer",
    model: "Cobas 6000",
    status: "operational",
    last_service: "2026-02-10",
  },
  {
    name: "MRI Scanner 3T",
    model: "Siemens Magnetom",
    status: "operational",
    last_service: "2025-12-20",
  },
  {
    name: "CT Scanner 128-Slice",
    model: "GE Revolution",
    status: "maintenance",
    last_service: "2026-03-08",
  },
  {
    name: "Digital X-Ray",
    model: "Philips DigitalDiagnost",
    status: "operational",
    last_service: "2026-01-30",
  },
];

type TestRecord = (typeof initialTests)[0];

function statusBadge(s: string) {
  if (s === "completed")
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        {s}
      </Badge>
    );
  if (s === "in-progress")
    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">{s}</Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
      {s}
    </Badge>
  );
}

function priorityBadge(p: string) {
  if (p === "stat")
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">STAT</Badge>
    );
  if (p === "urgent")
    return (
      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
        Urgent
      </Badge>
    );
  return <Badge variant="outline">Routine</Badge>;
}

export default function Laboratory() {
  const [tests, setTests] = useState<TestRecord[]>(initialTests);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);
  const [form, setForm] = useState({
    patient: "",
    test: "",
    priority: "routine",
    technician: "",
  });

  const filtered = tests.filter(
    (t) =>
      t.patient.toLowerCase().includes(search.toLowerCase()) ||
      t.test.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: tests.length,
    completed: tests.filter((t) => t.status === "completed").length,
    pending: tests.filter((t) => t.status === "pending").length,
    inProgress: tests.filter((t) => t.status === "in-progress").length,
  };

  const addTest = () => {
    if (!form.patient || !form.test) return;
    const newTest: TestRecord = {
      id: `LAB${String(tests.length + 1).padStart(3, "0")}`,
      patient: form.patient,
      patientId: `P${tests.length + 10}`,
      test: form.test,
      category: "Blood",
      technician: form.technician || "Unassigned",
      status: "pending",
      ordered: new Date().toISOString().split("T")[0],
      result: "",
      priority: form.priority,
    };
    setTests([...tests, newTest]);
    setForm({ patient: "", test: "", priority: "routine", technician: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Laboratory Information System
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage lab tests, results, and equipment
          </p>
        </div>
        <Button
          data-ocid="lab.open_modal_button"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Plus size={16} /> Book Test
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Tests",
            value: stats.total,
            icon: <FlaskConical size={18} />,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "Completed",
            value: stats.completed,
            icon: <CheckCircle size={18} />,
            color: "oklch(0.6 0.18 160)",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: <Clock size={18} />,
            color: "oklch(0.7 0.18 65)",
          },
          {
            label: "In Progress",
            value: stats.inProgress,
            icon: <AlertCircle size={18} />,
            color: "oklch(0.65 0.18 250)",
          },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {c.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-0.5">
                    {c.value}
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

      <Tabs defaultValue="tests">
        <TabsList>
          <TabsTrigger value="tests" data-ocid="lab.tests.tab">
            Test Orders
          </TabsTrigger>
          <TabsTrigger value="equipment" data-ocid="lab.equipment.tab">
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    data-ocid="lab.search_input"
                    className="pl-8 h-9"
                    placeholder="Search patient or test..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="lab.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Lab ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t, i) => (
                    <TableRow key={t.id} data-ocid={`lab.row.${i + 1}`}>
                      <TableCell className="font-mono text-xs">
                        {t.id}
                      </TableCell>
                      <TableCell className="font-medium">{t.patient}</TableCell>
                      <TableCell>{t.test}</TableCell>
                      <TableCell>{priorityBadge(t.priority)}</TableCell>
                      <TableCell className="text-sm">{t.technician}</TableCell>
                      <TableCell className="text-sm">{t.ordered}</TableCell>
                      <TableCell>{statusBadge(t.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`lab.edit_button.${i + 1}`}
                          onClick={() => setSelectedTest(t)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment" className="mt-4">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Service</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EQUIPMENT.map((e, i) => (
                    <TableRow
                      key={e.name}
                      data-ocid={`lab.equipment.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-sm">{e.model}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            e.status === "operational"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {e.last_service}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Book Test Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="lab.dialog">
          <DialogHeader>
            <DialogTitle>Book Lab Test</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Patient Name</Label>
              <Input
                data-ocid="lab.patient.input"
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
                placeholder="Patient name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Test Type</Label>
              <Select
                value={form.test}
                onValueChange={(v) => setForm({ ...form, test: v })}
              >
                <SelectTrigger data-ocid="lab.test.select" className="mt-1">
                  <SelectValue placeholder="Select test" />
                </SelectTrigger>
                <SelectContent>
                  {TEST_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => setForm({ ...form, priority: v })}
              >
                <SelectTrigger data-ocid="lab.priority.select" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assigned Technician</Label>
              <Input
                data-ocid="lab.technician.input"
                value={form.technician}
                onChange={(e) =>
                  setForm({ ...form, technician: e.target.value })
                }
                placeholder="Technician name"
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="lab.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button data-ocid="lab.submit_button" onClick={addTest}>
              Book Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Result Modal */}
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent data-ocid="lab.result.dialog">
          <DialogHeader>
            <DialogTitle>Test Details — {selectedTest?.id}</DialogTitle>
          </DialogHeader>
          {selectedTest && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Patient", selectedTest.patient],
                  ["Test", selectedTest.test],
                  ["Category", selectedTest.category],
                  ["Priority", selectedTest.priority],
                  ["Technician", selectedTest.technician],
                  ["Ordered", selectedTest.ordered],
                  ["Status", selectedTest.status],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-xs text-muted-foreground">{k}</p>
                    <p className="font-medium">{v}</p>
                  </div>
                ))}
              </div>
              {selectedTest.result && (
                <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-xs font-semibold text-green-700 mb-1">
                    Results
                  </p>
                  <p className="text-green-800">{selectedTest.result}</p>
                </div>
              )}
              {!selectedTest.result && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-700">Results pending...</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              data-ocid="lab.result.close_button"
              onClick={() => setSelectedTest(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
