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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { InventoryItem } from "../backend.d";
import { useActor } from "../hooks/useActor";

const EMPTY = {
  name: "",
  category: "",
  quantity: "",
  unit: "",
  reorderLevel: "",
  price: "",
  expiryDate: "",
};

export default function Pharmacy() {
  const { actor } = useActor();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!actor) return;
    actor
      .getAllInventoryItems()
      .then(setItems)
      .catch(() => toast.error("Failed to load inventory"))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: actor is stable ref
  useEffect(() => {
    load();
  }, [actor]);

  const openAdd = () => {
    setEditItem(null);
    setForm({ ...EMPTY });
    setOpen(true);
  };
  const openEdit = (it: InventoryItem) => {
    setEditItem(it);
    setForm({
      name: it.name,
      category: it.category,
      quantity: it.quantity.toString(),
      unit: it.unit,
      reorderLevel: it.reorderLevel.toString(),
      price: it.price.toString(),
      expiryDate: it.expiryDate,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSaving(true);
    try {
      const payload: InventoryItem = {
        id: editItem?.id ?? crypto.randomUUID(),
        name: form.name,
        category: form.category,
        quantity: BigInt(form.quantity || 0),
        unit: form.unit,
        reorderLevel: BigInt(form.reorderLevel || 0),
        price: Number.parseFloat(form.price || "0"),
        expiryDate: form.expiryDate,
      };
      if (editItem) {
        await actor.updateInventoryItem(editItem.id, payload);
        toast.success("Item updated");
      } else {
        await actor.createInventoryItem(payload);
        toast.success("Item added");
      }
      setOpen(false);
      load();
    } catch {
      toast.error("Failed to save item");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!actor) return;
    try {
      await actor.deleteInventoryItem(id);
      toast.success("Item deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isLowStock = (item: InventoryItem) =>
    item.quantity <= item.reorderLevel;

  const filtered = items
    .filter((it) => tab === "all" || isLowStock(it))
    .filter(
      (it) =>
        it.name.toLowerCase().includes(search.toLowerCase()) ||
        it.category.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pharmacy Inventory</h1>
          <p className="text-muted-foreground text-sm">
            {items.length} items · {items.filter(isLowStock).length} low stock
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="pharmacy.open_modal_button"
              onClick={openAdd}
              style={{ background: "oklch(0.58 0.14 200)", color: "white" }}
            >
              <Plus size={16} className="mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent data-ocid="pharmacy.dialog" className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editItem ? "Edit Item" : "Add Inventory Item"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <Label>Item Name</Label>
                  <Input
                    data-ocid="pharmacy.input"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    data-ocid="pharmacy.category.input"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Input
                    data-ocid="pharmacy.unit.input"
                    value={form.unit}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, unit: e.target.value }))
                    }
                    placeholder="tablets, ml, mg"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    data-ocid="pharmacy.qty.input"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label>Reorder Level</Label>
                  <Input
                    type="number"
                    data-ocid="pharmacy.reorder.input"
                    value={form.reorderLevel}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, reorderLevel: e.target.value }))
                    }
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    data-ocid="pharmacy.price.input"
                    value={form.price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, price: e.target.value }))
                    }
                    required
                    min="0"
                  />
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <Input
                    type="date"
                    data-ocid="pharmacy.expiry.input"
                    value={form.expiryDate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, expiryDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="pharmacy.cancel_button"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="pharmacy.submit_button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editItem ? "Update" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 items-center">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger data-ocid="pharmacy.all.tab" value="all">
              All Items
            </TabsTrigger>
            <TabsTrigger data-ocid="pharmacy.lowstock.tab" value="low">
              Low Stock
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="pharmacy.search_input"
            className="pl-9"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="pharmacy.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-ocid="pharmacy.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No items found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((it, idx) => (
                <TableRow
                  key={it.id}
                  data-ocid={`pharmacy.item.${idx + 1}`}
                  className={isLowStock(it) ? "bg-red-50/50" : ""}
                >
                  <TableCell className="font-medium">{it.name}</TableCell>
                  <TableCell>{it.category}</TableCell>
                  <TableCell>
                    {it.quantity.toString()} {it.unit}
                  </TableCell>
                  <TableCell>{it.reorderLevel.toString()}</TableCell>
                  <TableCell>₹{it.price.toFixed(2)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {it.expiryDate}
                  </TableCell>
                  <TableCell>
                    {isLowStock(it) ? (
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        OK
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        data-ocid={`pharmacy.edit_button.${idx + 1}`}
                        onClick={() => openEdit(it)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-ocid={`pharmacy.delete_button.${idx + 1}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="pharmacy.modal">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete {it.name}? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="pharmacy.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              data-ocid="pharmacy.confirm_button"
                              onClick={() => handleDelete(it.id)}
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
