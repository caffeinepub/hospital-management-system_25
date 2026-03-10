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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Doctor } from "../backend.d";
import { useActor } from "../hooks/useActor";

const EMPTY = {
  name: "",
  specialization: "",
  phone: "",
  email: "",
  available: true,
};

export default function Doctors() {
  const { actor } = useActor();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editDoc, setEditDoc] = useState<Doctor | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    actor
      .getAllDoctors()
      .then(setDoctors)
      .catch(() => toast.error("Failed to load doctors"))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is stable ref
  useEffect(() => {
    load();
  }, [actor]);

  const openAdd = () => {
    setEditDoc(null);
    setForm({ ...EMPTY });
    setOpen(true);
  };
  const openEdit = (d: Doctor) => {
    setEditDoc(d);
    setForm({
      name: d.name,
      specialization: d.specialization,
      phone: d.phone,
      email: d.email,
      available: d.available,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const payload: Doctor = {
        id: editDoc?.id ?? crypto.randomUUID(),
        name: form.name,
        specialization: form.specialization,
        phone: form.phone,
        email: form.email,
        available: form.available,
        registeredAt: BigInt(Date.now()),
      };
      if (editDoc) {
        await actor.updateDoctor(editDoc.id, payload);
        toast.success("Doctor updated");
      } else {
        await actor.createDoctor(payload);
        toast.success("Doctor added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Failed to save doctor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deleteDoctor(id);
      toast.success("Doctor deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-muted-foreground text-sm">
            {doctors.length} registered doctors
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="doctors.open_modal_button"
              onClick={openAdd}
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="doctors.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editDoc ? "Edit Doctor" : "Add Doctor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input
                  data-ocid="doctors.input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label>Specialization</Label>
                <Input
                  data-ocid="doctors.specialization.input"
                  value={form.specialization}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, specialization: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Phone</Label>
                  <Input
                    data-ocid="doctors.phone.input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    data-ocid="doctors.email.input"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  data-ocid="doctors.switch"
                  checked={form.available}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, available: v }))
                  }
                />
                <Label>Available for appointments</Label>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="doctors.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="doctors.submit_button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editDoc ? "Update" : "Add Doctor"}
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
          data-ocid="doctors.search_input"
          className="pl-9"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="doctors.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="doctors.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No doctors found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, idx) => (
                <TableRow key={d.id} data-ocid={`doctors.item.${idx + 1}`}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell>{d.specialization}</TableCell>
                  <TableCell>{d.phone}</TableCell>
                  <TableCell>{d.email}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        d.available
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                      }
                    >
                      {d.available ? "Available" : "Unavailable"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-ocid={`doctors.edit_button.${idx + 1}`}
                        onClick={() => openEdit(d)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`doctors.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="doctors.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete Dr. {d.name}? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="doctors.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="doctors.confirm_button"
                              onClick={() => handleDelete(d.id)}
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
