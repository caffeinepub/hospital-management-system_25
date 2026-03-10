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
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Patient } from "../backend.d";
import { useActor } from "../hooks/useActor";

const EMPTY_FORM = {
  name: "",
  age: "",
  gender: "Male",
  phone: "",
  email: "",
  address: "",
  bloodGroup: "A+",
  medicalHistory: "",
};

export default function Patients() {
  const { actor } = useActor();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    actor
      .getAllPatients()
      .then(setPatients)
      .catch(() => toast.error("Failed to load patients"))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is stable ref
  useEffect(() => {
    load();
  }, [actor]);

  const openAdd = () => {
    setEditPatient(null);
    setForm({ ...EMPTY_FORM });
    setOpen(true);
  };
  const openEdit = (p: Patient) => {
    setEditPatient(p);
    setForm({
      name: p.name,
      age: p.age.toString(),
      gender: p.gender,
      phone: p.phone,
      email: p.email,
      address: p.address,
      bloodGroup: p.bloodGroup,
      medicalHistory: p.medicalHistory,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const payload: Patient = {
        id: editPatient?.id ?? crypto.randomUUID(),
        name: form.name,
        age: BigInt(form.age || 0),
        gender: form.gender,
        phone: form.phone,
        email: form.email,
        address: form.address,
        bloodGroup: form.bloodGroup,
        medicalHistory: form.medicalHistory,
        createdBy: Principal.fromText("aaaaa-aa"),
        registeredAt: BigInt(Date.now()),
      };
      if (editPatient) {
        await actor.updatePatient(editPatient.id, payload);
        toast.success("Patient updated");
      } else {
        await actor.createPatient(payload);
        toast.success("Patient added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Failed to save patient");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deletePatient(id);
      toast.success("Patient deleted");
      load();
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground text-sm">
            {patients.length} registered patients
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="patients.open_modal_button"
              onClick={openAdd}
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="patients.dialog"
            className="max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>
                {editPatient ? "Edit Patient" : "Add Patient"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Full Name</Label>
                  <Input
                    data-ocid="patients.input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input
                    type="number"
                    data-ocid="patients.age.input"
                    value={form.age}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, age: e.target.value }))
                    }
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => setForm((f) => ({ ...f, gender: v }))}
                  >
                    <SelectTrigger data-ocid="patients.gender.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    data-ocid="patients.phone.input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Blood Group</Label>
                  <Select
                    value={form.bloodGroup}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, bloodGroup: v }))
                    }
                  >
                    <SelectTrigger data-ocid="patients.blood.select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    data-ocid="patients.email.input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Address</Label>
                  <Input
                    data-ocid="patients.address.input"
                    value={form.address}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, address: e.target.value }))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Label>Medical History</Label>
                  <Textarea
                    data-ocid="patients.textarea"
                    value={form.medicalHistory}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, medicalHistory: e.target.value }))
                    }
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="patients.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="patients.submit_button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editPatient
                      ? "Update"
                      : "Add Patient"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          data-ocid="patients.search_input"
          className="pl-9"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="patients.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="patients.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No patients found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p, idx) => (
                <TableRow key={p.id} data-ocid={`patients.item.${idx + 1}`}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.age.toString()}</TableCell>
                  <TableCell>{p.gender}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{p.bloodGroup}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(Number(p.registeredAt)).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-ocid={`patients.edit_button.${idx + 1}`}
                        onClick={() => openEdit(p)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`patients.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="patients.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Patient</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete {p.name}? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="patients.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="patients.confirm_button"
                              onClick={() => handleDelete(p.id)}
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
