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
import {
  CheckCircle,
  MinusCircle,
  Plus,
  PlusCircle,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Appointment, Bill, BillItem, Patient } from "../backend.d";
import { PaymentStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";

const STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.pending]: "bg-amber-100 text-amber-800",
  [PaymentStatus.paid]: "bg-green-100 text-green-800",
  [PaymentStatus.cancelled]: "bg-red-100 text-red-800",
};

export default function Billing() {
  const { actor } = useActor();
  const [bills, setBills] = useState<Bill[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    appointmentId: "",
    gstPercent: "18",
    items: [{ description: "", amount: "" }],
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    Promise.all([
      actor.getAllBills(),
      actor.getAllPatients(),
      actor.getAllAppointments(),
    ])
      .then(([b, p, a]) => {
        setBills(b);
        setPatients(p);
        setAppointments(a);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is stable ref
  useEffect(() => {
    load();
  }, [actor]);

  const addItem = () =>
    setForm((f) => ({
      ...f,
      items: [...f.items, { description: "", amount: "" }],
    }));
  const removeItem = (i: number) =>
    setForm((f) => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (
    i: number,
    field: "description" | "amount",
    val: string,
  ) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((it, idx) =>
        idx === i ? { ...it, [field]: val } : it,
      ),
    }));

  const subtotal = form.items.reduce(
    (sum, it) => sum + (Number.parseFloat(it.amount) || 0),
    0,
  );
  const gst = (subtotal * (Number.parseFloat(form.gstPercent) || 0)) / 100;
  const total = subtotal + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const billItems: BillItem[] = form.items
        .filter((it) => it.description.trim())
        .map((it) => ({
          description: it.description,
          amount: Number.parseFloat(it.amount) || 0,
        }));
      const payload: Bill = {
        id: crypto.randomUUID(),
        patientId: form.patientId,
        appointmentId: form.appointmentId,
        items: billItems,
        gstPercent: Number.parseFloat(form.gstPercent) || 0,
        gstAmount: gst,
        subtotal,
        totalAmount: total,
        paymentStatus: PaymentStatus.pending,
        createdAt: BigInt(Date.now()),
      };
      await actor.createBill(payload);
      toast.success("Bill created");
      setOpen(false);
      setForm({
        patientId: "",
        appointmentId: "",
        gstPercent: "18",
        items: [{ description: "", amount: "" }],
      });
      load();
    } catch {
      toast.error("Failed to create bill");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (bill: Bill, status: PaymentStatus) => {
    if (!actor) return;
    try {
      await actor.updateBill(bill.id, { ...bill, paymentStatus: status });
      toast.success(`Bill marked as ${status}`);
      load();
    } catch {
      toast.error("Failed to update bill");
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deleteBill(id);
      toast.success("Bill deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const patientName = (id: string) =>
    patients.find((p) => p.id === id)?.name ?? "Unknown";
  const filtered = bills.filter(
    (b) => tab === "all" || b.paymentStatus === tab,
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground text-sm">{bills.length} bills</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="billing.open_modal_button"
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> Create Bill
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="billing.dialog"
            className="max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <DialogHeader>
              <DialogTitle>Create Bill</DialogTitle>
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
                    <SelectTrigger data-ocid="billing.patient.select">
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
                  <Label>Appointment</Label>
                  <Select
                    value={form.appointmentId}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, appointmentId: v }))
                    }
                  >
                    <SelectTrigger data-ocid="billing.appointment.select">
                      <SelectValue placeholder="Select appt." />
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
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Line Items</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={addItem}
                    data-ocid="billing.secondary_button"
                  >
                    <PlusCircle size={14} className="mr-1" /> Add Item
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.items.map((it, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: bill line items have no stable ID
                    <div key={i} className="flex gap-2 items-center">
                      <Input
                        placeholder="Description"
                        className="flex-1"
                        value={it.description}
                        onChange={(e) =>
                          updateItem(i, "description", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="w-28"
                        value={it.amount}
                        onChange={(e) =>
                          updateItem(i, "amount", e.target.value)
                        }
                      />
                      {form.items.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeItem(i)}
                          className="text-destructive shrink-0"
                        >
                          <MinusCircle size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Label>GST %</Label>
                <Input
                  type="number"
                  data-ocid="billing.gst.input"
                  className="w-24"
                  value={form.gstPercent}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, gstPercent: e.target.value }))
                  }
                  min="0"
                  max="100"
                />
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    GST ({form.gstPercent}%)
                  </span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t border-border pt-1 mt-1">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="billing.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="billing.submit_button"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Bill"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger data-ocid="billing.all.tab" value="all">
            All
          </TabsTrigger>
          <TabsTrigger
            data-ocid="billing.pending.tab"
            value={PaymentStatus.pending}
          >
            Pending
          </TabsTrigger>
          <TabsTrigger data-ocid="billing.paid.tab" value={PaymentStatus.paid}>
            Paid
          </TabsTrigger>
          <TabsTrigger
            data-ocid="billing.cancelled.tab"
            value={PaymentStatus.cancelled}
          >
            Cancelled
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="billing.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="billing.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No bills found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bill, idx) => (
                <TableRow key={bill.id} data-ocid={`billing.item.${idx + 1}`}>
                  <TableCell className="font-medium">
                    {patientName(bill.patientId)}
                  </TableCell>
                  <TableCell>₹{bill.subtotal.toFixed(2)}</TableCell>
                  <TableCell>₹{bill.gstAmount.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{bill.totalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${STATUS_COLORS[bill.paymentStatus]} hover:${STATUS_COLORS[bill.paymentStatus]}`}
                    >
                      {bill.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(bill.createdAt)).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {bill.paymentStatus === PaymentStatus.pending && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Mark Paid"
                            data-ocid={`billing.edit_button.${idx + 1}`}
                            onClick={() =>
                              updateStatus(bill, PaymentStatus.paid)
                            }
                            className="text-green-600"
                          >
                            <CheckCircle size={14} />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            title="Cancel"
                            onClick={() =>
                              updateStatus(bill, PaymentStatus.cancelled)
                            }
                            className="text-amber-600"
                          >
                            <XCircle size={14} />
                          </Button>
                        </>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`billing.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="billing.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete this bill? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="billing.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="billing.confirm_button"
                              onClick={() => handleDelete(bill.id)}
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
