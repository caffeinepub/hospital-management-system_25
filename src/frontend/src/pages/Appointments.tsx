import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Appointment, Doctor, Patient } from "../backend.d";
import { AppointmentStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  [AppointmentStatus.scheduled]: "bg-blue-100 text-blue-800",
  [AppointmentStatus.completed]: "bg-green-100 text-green-800",
  [AppointmentStatus.cancelled]: "bg-red-100 text-red-800",
};

const EMPTY = {
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  reason: "",
  notes: "",
  status: AppointmentStatus.scheduled,
};

export default function Appointments() {
  const { actor } = useActor();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    Promise.all([
      actor.getAllAppointments(),
      actor.getAllPatients(),
      actor.getAllDoctors(),
    ])
      .then(([appts, pts, docs]) => {
        setAppointments(appts);
        setPatients(pts);
        setDoctors(docs);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is stable ref
  useEffect(() => {
    load();
  }, [actor]);

  const openAdd = () => {
    setEditAppt(null);
    setForm({ ...EMPTY });
    setOpen(true);
  };
  const openEdit = (a: Appointment) => {
    setEditAppt(a);
    setForm({
      patientId: a.patientId,
      doctorId: a.doctorId,
      date: a.date,
      time: a.time,
      reason: a.reason,
      notes: a.notes,
      status: a.status,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const payload: Appointment = {
        id: editAppt?.id ?? crypto.randomUUID(),
        patientId: form.patientId,
        doctorId: form.doctorId,
        date: form.date,
        time: form.time,
        reason: form.reason,
        notes: form.notes,
        status: form.status,
        createdBy: Principal.fromText("aaaaa-aa"),
      };
      if (editAppt) {
        await actor.updateAppointment(editAppt.id, payload);
        toast.success("Appointment updated");
      } else {
        await actor.createAppointment(payload);
        toast.success("Appointment created");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Failed to save appointment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deleteAppointment(id);
      toast.success("Appointment deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown";
  const doctorName = (id: string) =>
    doctors.find((d) => d.id === id)?.name ?? "Unknown";
  const filtered = appointments.filter(
    (a) => tab === "all" || a.status === tab,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground text-sm">
            {appointments.length} total appointments
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="appointments.open_modal_button"
              onClick={openAdd}
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="appointments.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editAppt ? "Edit Appointment" : "New Appointment"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Patient</Label>
                <Select
                  value={form.patientId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, patientId: v }))
                  }
                >
                  <SelectTrigger data-ocid="appointments.patient.select">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Doctor</Label>
                <Select
                  value={form.doctorId}
                  onValueChange={(v) => setForm((f) => ({ ...f, doctorId: v }))}
                >
                  <SelectTrigger data-ocid="appointments.doctor.select">
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        Dr. {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    data-ocid="appointments.date.input"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    data-ocid="appointments.time.input"
                    value={form.time}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, time: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <Input
                  data-ocid="appointments.reason.input"
                  value={form.reason}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reason: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  data-ocid="appointments.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, status: v as AppointmentStatus }))
                  }
                >
                  <SelectTrigger data-ocid="appointments.status.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AppointmentStatus.scheduled}>
                      Scheduled
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.completed}>
                      Completed
                    </SelectItem>
                    <SelectItem value={AppointmentStatus.cancelled}>
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="appointments.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="appointments.submit_button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editAppt ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger data-ocid="appointments.all.tab" value="all">
            All
          </TabsTrigger>
          <TabsTrigger
            data-ocid="appointments.scheduled.tab"
            value={AppointmentStatus.scheduled}
          >
            Scheduled
          </TabsTrigger>
          <TabsTrigger
            data-ocid="appointments.completed.tab"
            value={AppointmentStatus.completed}
          >
            Completed
          </TabsTrigger>
          <TabsTrigger
            data-ocid="appointments.cancelled.tab"
            value={AppointmentStatus.cancelled}
          >
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="appointments.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="appointments.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No appointments found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a, idx) => (
                <TableRow key={a.id} data-ocid={`appointments.item.${idx + 1}`}>
                  <TableCell className="font-medium">
                    {patientName(a.patientId)}
                  </TableCell>
                  <TableCell>Dr. {doctorName(a.doctorId)}</TableCell>
                  <TableCell>{a.date}</TableCell>
                  <TableCell>{a.time}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${STATUS_COLORS[a.status]} hover:${STATUS_COLORS[a.status]}`}
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-ocid={`appointments.edit_button.${idx + 1}`}
                        onClick={() => openEdit(a)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`appointments.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="appointments.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Appointment
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete this appointment? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="appointments.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="appointments.confirm_button"
                              onClick={() => handleDelete(a.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
