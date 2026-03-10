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
import { CheckCircle, Clock, Plus, Search, UserSquare2 } from "lucide-react";
import { useState } from "react";

const STAFF_TYPES = [
  "Nurse",
  "Receptionist",
  "Lab Technician",
  "Pharmacist",
  "Admin Staff",
  "Ward Boy",
  "Security",
];

const initialStaff = [
  {
    id: "S001",
    name: "Asha Singh",
    type: "Nurse",
    dept: "General Ward",
    shift: "Morning",
    phone: "9876543210",
    email: "asha@medicore.in",
    status: "active",
    joined: "2021-04-01",
    attendance: 97,
  },
  {
    id: "S002",
    name: "Ravi Verma",
    type: "Lab Technician",
    dept: "Laboratory",
    shift: "Morning",
    phone: "9876543211",
    email: "ravi@medicore.in",
    status: "active",
    joined: "2020-08-15",
    attendance: 95,
  },
  {
    id: "S003",
    name: "Priya Sharma",
    type: "Nurse",
    dept: "ICU",
    shift: "Evening",
    phone: "9876543212",
    email: "priya.s@medicore.in",
    status: "active",
    joined: "2022-01-10",
    attendance: 99,
  },
  {
    id: "S004",
    name: "Neha Singh",
    type: "Lab Technician",
    dept: "Laboratory",
    shift: "Evening",
    phone: "9876543213",
    email: "neha@medicore.in",
    status: "active",
    joined: "2022-06-01",
    attendance: 93,
  },
  {
    id: "S005",
    name: "Meena K",
    type: "Nurse",
    dept: "ICU",
    shift: "Night",
    phone: "9876543214",
    email: "meena@medicore.in",
    status: "active",
    joined: "2019-11-20",
    attendance: 96,
  },
  {
    id: "S006",
    name: "Ajay Kumar",
    type: "Lab Technician",
    dept: "Radiology",
    shift: "Morning",
    phone: "9876543215",
    email: "ajay@medicore.in",
    status: "on-leave",
    joined: "2023-02-14",
    attendance: 88,
  },
  {
    id: "S007",
    name: "Sunita Rao",
    type: "Receptionist",
    dept: "OPD Front Desk",
    shift: "Morning",
    phone: "9876543216",
    email: "sunita@medicore.in",
    status: "active",
    joined: "2021-09-01",
    attendance: 98,
  },
  {
    id: "S008",
    name: "Kavitha Nair",
    type: "Pharmacist",
    dept: "Pharmacy",
    shift: "Evening",
    phone: "9876543217",
    email: "kavitha@medicore.in",
    status: "active",
    joined: "2020-03-15",
    attendance: 94,
  },
];

const SHIFTS = [
  {
    ward: "General A",
    morning: "Asha Singh",
    evening: "Sita Devi",
    night: "Rupa Sharma",
  },
  {
    ward: "General B",
    morning: "Anita Rao",
    evening: "Deepa K",
    night: "Renu Singh",
  },
  {
    ward: "ICU",
    morning: "Meena K",
    evening: "Priya Sharma",
    night: "Lakshmi R",
  },
  {
    ward: "Private",
    morning: "Uma Patel",
    evening: "Nisha Gupta",
    night: "Rekha Verma",
  },
];

type StaffMember = (typeof initialStaff)[0];

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "",
    dept: "",
    shift: "Morning",
    phone: "",
    email: "",
  });

  const filtered = staff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "all" || s.type === filterType;
    return matchSearch && matchType;
  });

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.status === "active").length,
    onLeave: staff.filter((s) => s.status === "on-leave").length,
  };

  const addStaff = () => {
    if (!form.name || !form.type) return;
    const newStaff: StaffMember = {
      id: `S${String(staff.length + 1).padStart(3, "0")}`,
      name: form.name,
      type: form.type,
      dept: form.dept,
      shift: form.shift,
      phone: form.phone,
      email: form.email,
      status: "active",
      joined: new Date().toISOString().split("T")[0],
      attendance: 100,
    };
    setStaff([...staff, newStaff]);
    setForm({
      name: "",
      type: "",
      dept: "",
      shift: "Morning",
      phone: "",
      email: "",
    });
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Attendance, shifts, performance, and task management
          </p>
        </div>
        <Button
          data-ocid="staff.open_modal_button"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Plus size={16} />
          Add Staff
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Staff",
            value: stats.total,
            icon: <UserSquare2 size={18} />,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "Active",
            value: stats.active,
            icon: <CheckCircle size={18} />,
            color: "oklch(0.6 0.18 160)",
          },
          {
            label: "On Leave",
            value: stats.onLeave,
            icon: <Clock size={18} />,
            color: "oklch(0.7 0.18 65)",
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

      <Tabs defaultValue="directory">
        <TabsList>
          <TabsTrigger value="directory" data-ocid="staff.directory.tab">
            Staff Directory
          </TabsTrigger>
          <TabsTrigger value="shifts" data-ocid="staff.shifts.tab">
            Shift Schedule
          </TabsTrigger>
          <TabsTrigger value="attendance" data-ocid="staff.attendance.tab">
            Attendance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    data-ocid="staff.search_input"
                    className="pl-8 h-9"
                    placeholder="Search staff..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger
                    data-ocid="staff.type.select"
                    className="h-9 w-44"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {STAFF_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="staff.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s, i) => (
                    <TableRow key={s.id} data-ocid={`staff.row.${i + 1}`}>
                      <TableCell className="font-mono text-xs">
                        {s.id}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {s.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{s.dept}</TableCell>
                      <TableCell className="text-sm">{s.shift}</TableCell>
                      <TableCell className="text-sm">{s.phone}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            s.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {s.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Ward Shift Assignments — Today
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ward</TableHead>
                    <TableHead>Morning (6AM-2PM)</TableHead>
                    <TableHead>Evening (2PM-10PM)</TableHead>
                    <TableHead>Night (10PM-6AM)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SHIFTS.map((s, i) => (
                    <TableRow
                      key={s.ward}
                      data-ocid={`staff.shift.row.${i + 1}`}
                    >
                      <TableCell className="font-semibold">{s.ward}</TableCell>
                      <TableCell>{s.morning}</TableCell>
                      <TableCell>{s.evening}</TableCell>
                      <TableCell>{s.night}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Monthly Attendance — March 2026
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s, i) => (
                    <TableRow
                      key={s.id}
                      data-ocid={`staff.attendance.row.${i + 1}`}
                    >
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-sm">{s.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-muted max-w-24">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${s.attendance}%`,
                                background:
                                  s.attendance >= 95
                                    ? "oklch(0.6 0.18 160)"
                                    : s.attendance >= 90
                                      ? "oklch(0.7 0.18 65)"
                                      : "oklch(0.62 0.22 25)",
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium">
                            {s.attendance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            s.attendance >= 95
                              ? "bg-green-100 text-green-800"
                              : s.attendance >= 90
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {s.attendance >= 95
                            ? "Excellent"
                            : s.attendance >= 90
                              ? "Good"
                              : "Needs Improvement"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="staff.dialog">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Full Name</Label>
              <Input
                data-ocid="staff.name.input"
                className="mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v })}
              >
                <SelectTrigger
                  data-ocid="staff.type_select.select"
                  className="mt-1"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Input
                className="mt-1"
                value={form.dept}
                onChange={(e) => setForm({ ...form, dept: e.target.value })}
                placeholder="Department"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                className="mt-1"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-1"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="staff.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button data-ocid="staff.submit_button" onClick={addStaff}>
              Add Staff
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
