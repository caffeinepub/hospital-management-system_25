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
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { Eye, MinusCircle, Plus, PlusCircle, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Appointment,
  Doctor,
  Medicine,
  Patient,
  Prescription,
} from "../backend.d";
import { useActor } from "../hooks/useActor";

const EMPTY_MED = (): Medicine & { _key: string } => ({
  name: "",
  dosage: "",
  duration: "",
  _key: crypto.randomUUID(),
});

type MedRow = Medicine & { _key: string };

export default function Prescriptions() {
  const { actor } = useActor();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [viewPx, setViewPx] = useState<Prescription | null>(null);
  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: "",
    notes: "",
    medicines: [EMPTY_MED()] as MedRow[],
  });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!actor) return;
    Promise.all([
      actor.getAllPrescriptions(),
      actor.getAllPatients(),
      actor.getAllDoctors(),
      actor.getAllAppointments(),
    ])
      .then(([pxs, pts, docs, appts]) => {
        setPrescriptions(pxs);
        setPatients(pts);
        setDoctors(docs);
        setAppointments(appts);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const addMed = () =>
    setForm((f) => ({ ...f, medicines: [...f.medicines, EMPTY_MED()] }));
  const removeMed = (key: string) =>
    setForm((f) => ({
      ...f,
      medicines: f.medicines.filter((m) => m._key !== key),
    }));
  const updateMed = (key: string, field: keyof Medicine, val: string) =>
    setForm((f) => ({
      ...f,
      medicines: f.medicines.map((m) =>
        m._key === key ? { ...m, [field]: val } : m,
      ),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const payload: Prescription = {
        id: crypto.randomUUID(),
        patientId: form.patientId,
        doctorId: form.doctorId,
        appointmentId: form.appointmentId,
        notes: form.notes,
        medicines: form.medicines
          .filter((m) => m.name.trim())
          .map(({ name, dosage, duration }) => ({ name, dosage, duration })),
        createdBy: Principal.fromText("aaaaa-aa"),
        createdAt: BigInt(Date.now()),
      };
      await actor.createPrescription(payload);
      toast.success("Prescription created");
      setOpen(false);
      setForm({
        patientId: "",
        doctorId: "",
        appointmentId: "",
        notes: "",
        medicines: [EMPTY_MED()],
      });
      load();
    } catch {
      toast.error("Failed to create prescription");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deletePrescription(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown";
  const doctorName = (id: string) =>
    doctors.find((d) => d.id === id)?.name ?? "Unknown";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground text-sm">
            {prescriptions.length} prescriptions
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="prescriptions.open_modal_button"
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="prescriptions.dialog"
            className="max-w-xl max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>New Prescription</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Patient</Label>
                  <Select
                    value={form.patientId}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, patientId: v }))
                    }
                  >
                    <SelectTrigger data-ocid="prescriptions.patient.select">
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
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, doctorId: v }))
                    }
                  >
                    <SelectTrigger data-ocid="prescriptions.doctor.select">
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
              </div>
              <div>
                <Label>Appointment (Optional)</Label>
                <Select
                  value={form.appointmentId}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, appointmentId: v }))
                  }
                >
                  <SelectTrigger data-ocid="prescriptions.appointment.select">
                    <SelectValue placeholder="Select appointment" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointments.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {patientName(a.patientId)} — {a.date}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Notes</Label>
                <Textarea
                  data-ocid="prescriptions.textarea"
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  rows={2}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Medicines</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addMed}
                    data-ocid="prescriptions.secondary_button"
                  >
                    <PlusCircle size={14} className="mr-1" /> Add Medicine
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.medicines.map((med) => (
                    <div
                      key={med._key}
                      className="grid grid-cols-3 gap-2 items-center p-3 border border-border rounded-lg bg-muted/30"
                    >
                      <Input
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) =>
                          updateMed(med._key, "name", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) =>
                          updateMed(med._key, "dosage", e.target.value)
                        }
                      />
                      <div className="flex gap-1">
                        <Input
                          placeholder="Duration"
                          value={med.duration}
                          onChange={(e) =>
                            updateMed(med._key, "duration", e.target.value)
                          }
                        />
                        {form.medicines.length > 1 && (
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => removeMed(med._key)}
                            className="text-destructive shrink-0"
                          >
                            <MinusCircle size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="prescriptions.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="prescriptions.submit_button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog
        open={!!viewPx}
        onOpenChange={(v) => {
          if (!v) setViewPx(null);
        }}
      >
        <DialogContent data-ocid="prescriptions.modal" className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {viewPx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Patient:</span>{" "}
                  <span className="font-medium">
                    {patientName(viewPx.patientId)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Doctor:</span>{" "}
                  <span className="font-medium">
                    Dr. {doctorName(viewPx.doctorId)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span>
                    {new Date(Number(viewPx.createdAt)).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {viewPx.notes && (
                <p className="text-sm text-muted-foreground">{viewPx.notes}</p>
              )}
              <div>
                <p className="text-sm font-semibold mb-2">
                  Medicines ({viewPx.medicines.length})
                </p>
                <div className="space-y-2">
                  {viewPx.medicines.map((m, i) => (
                    <div
                      key={`${m.name}-${i}`}
                      className="flex items-center justify-between p-2 bg-muted/40 rounded-lg text-sm"
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-muted-foreground">
                        {m.dosage} · {m.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              data-ocid="prescriptions.close_button"
              onClick={() => setViewPx(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div
            data-ocid="prescriptions.loading_state"
            className="p-6 space-y-3"
          >
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div
            data-ocid="prescriptions.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No prescriptions found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((px, idx) => (
                <TableRow
                  key={px.id}
                  data-ocid={`prescriptions.item.${idx + 1}`}
                >
                  <TableCell className="font-medium">
                    {patientName(px.patientId)}
                  </TableCell>
                  <TableCell>Dr. {doctorName(px.doctorId)}</TableCell>
                  <TableCell>
                    {px.medicines.length} medicine
                    {px.medicines.length !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(Number(px.createdAt)).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-ocid={`prescriptions.edit_button.${idx + 1}`}
                        onClick={() => setViewPx(px)}
                      >
                        <Eye size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`prescriptions.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="prescriptions.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Prescription
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete this prescription? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="prescriptions.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="prescriptions.confirm_button"
                              onClick={() => handleDelete(px.id)}
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
