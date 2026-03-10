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
  CheckCircle,
  Clock,
  Plus,
  Search,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const PROVIDERS = [
  {
    id: "INS001",
    name: "Star Health Insurance",
    type: "Private",
    contact: "+91 98765 43210",
    network: "Cashless",
    tpa: "Medi Assist",
  },
  {
    id: "INS002",
    name: "HDFC ERGO Health",
    type: "Private",
    contact: "+91 98765 43211",
    network: "Cashless",
    tpa: "Health India",
  },
  {
    id: "INS003",
    name: "PMJAY Ayushman",
    type: "Government",
    contact: "14555",
    network: "Cashless",
    tpa: "NHA",
  },
  {
    id: "INS004",
    name: "United India Insurance",
    type: "PSU",
    contact: "+91 98765 43212",
    network: "Reimbursement",
    tpa: "Vipul Med Corp",
  },
  {
    id: "INS005",
    name: "New India Assurance",
    type: "PSU",
    contact: "+91 98765 43213",
    network: "Both",
    tpa: "Heritage Health",
  },
];

const initialClaims = [
  {
    id: "CLM001",
    patient: "Arun Kumar",
    provider: "Star Health",
    amount: 85000,
    approved: 72000,
    type: "Hospitalization",
    status: "approved",
    submitted: "2026-02-15",
    updated: "2026-02-22",
  },
  {
    id: "CLM002",
    patient: "Priya Mehta",
    provider: "HDFC ERGO",
    amount: 42000,
    approved: 0,
    type: "Surgery",
    status: "under-review",
    submitted: "2026-03-01",
    updated: "2026-03-05",
  },
  {
    id: "CLM003",
    patient: "Mohan Lal",
    provider: "PMJAY",
    amount: 120000,
    approved: 0,
    type: "ICU Care",
    status: "submitted",
    submitted: "2026-03-08",
    updated: "2026-03-08",
  },
  {
    id: "CLM004",
    patient: "Kavita Rao",
    provider: "United India",
    amount: 28000,
    approved: 0,
    type: "Day Care",
    status: "rejected",
    submitted: "2026-02-20",
    updated: "2026-02-28",
  },
  {
    id: "CLM005",
    patient: "Sunita Devi",
    provider: "New India",
    amount: 65000,
    approved: 55000,
    type: "Hospitalization",
    status: "approved",
    submitted: "2026-01-10",
    updated: "2026-01-18",
  },
];

const PRE_AUTH = [
  {
    id: "PA001",
    patient: "Rajesh Singh",
    provider: "Star Health",
    procedure: "Knee Replacement",
    requested: 180000,
    status: "approved",
    date: "2026-03-05",
  },
  {
    id: "PA002",
    patient: "Anita Rao",
    provider: "HDFC ERGO",
    procedure: "Cardiac Bypass",
    requested: 350000,
    status: "pending",
    date: "2026-03-09",
  },
  {
    id: "PA003",
    patient: "Deepak Mehta",
    provider: "PMJAY",
    procedure: "Dialysis",
    requested: 24000,
    status: "approved",
    date: "2026-03-07",
  },
];

type Claim = (typeof initialClaims)[0];

function statusBadge(s: string) {
  const map: Record<string, string> = {
    approved: "bg-green-100 text-green-800",
    submitted: "bg-blue-100 text-blue-800",
    "under-review": "bg-yellow-100 text-yellow-800",
    rejected: "bg-red-100 text-red-800",
  };
  return <Badge className={map[s] || ""}>{s}</Badge>;
}

export default function Insurance() {
  const [claims] = useState<Claim[]>(initialClaims);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Claim | null>(null);

  const filtered = claims.filter(
    (c) =>
      c.patient.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: claims.length,
    approved: claims.filter((c) => c.status === "approved").length,
    pending: claims.filter(
      (c) => c.status !== "approved" && c.status !== "rejected",
    ).length,
    rejected: claims.filter((c) => c.status === "rejected").length,
    totalAmount: claims.reduce((s, c) => s + c.amount, 0),
    approvedAmount: claims.reduce((s, c) => s + c.approved, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Insurance Claim Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Claims, pre-authorization, and provider database
          </p>
        </div>
        <Button
          data-ocid="insurance.open_modal_button"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Plus size={16} />
          New Claim
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Claims",
            value: stats.total,
            icon: <Shield size={18} />,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "Approved",
            value: stats.approved,
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
            label: "Rejected",
            value: stats.rejected,
            icon: <XCircle size={18} />,
            color: "oklch(0.62 0.22 25)",
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

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">
              Total Claimed Amount
            </p>
            <p className="text-2xl font-bold text-foreground">
              ₹{stats.totalAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground">
              Total Approved Amount
            </p>
            <p className="text-2xl font-bold text-green-600">
              ₹{stats.approvedAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims">
        <TabsList>
          <TabsTrigger value="claims" data-ocid="insurance.claims.tab">
            Claims
          </TabsTrigger>
          <TabsTrigger value="preauth" data-ocid="insurance.preauth.tab">
            Pre-Authorization
          </TabsTrigger>
          <TabsTrigger value="providers" data-ocid="insurance.providers.tab">
            Providers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="relative max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  data-ocid="insurance.search_input"
                  className="pl-8 h-9"
                  placeholder="Search claims..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table data-ocid="insurance.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Claimed</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c, i) => (
                    <TableRow key={c.id} data-ocid={`insurance.row.${i + 1}`}>
                      <TableCell className="font-mono text-xs">
                        {c.id}
                      </TableCell>
                      <TableCell className="font-medium">{c.patient}</TableCell>
                      <TableCell className="text-sm">{c.provider}</TableCell>
                      <TableCell className="text-sm">{c.type}</TableCell>
                      <TableCell className="font-medium">
                        ₹{c.amount.toLocaleString()}
                      </TableCell>
                      <TableCell
                        className={
                          c.approved
                            ? "text-green-600 font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {c.approved ? `₹${c.approved.toLocaleString()}` : "—"}
                      </TableCell>
                      <TableCell>{statusBadge(c.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-ocid={`insurance.edit_button.${i + 1}`}
                          onClick={() => setSelected(c)}
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

        <TabsContent value="preauth" className="mt-4">
          <Card>
            <CardContent className="p-0 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auth ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Procedure</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRE_AUTH.map((p, i) => (
                    <TableRow
                      key={p.id}
                      data-ocid={`insurance.preauth.row.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {p.id}
                      </TableCell>
                      <TableCell className="font-medium">{p.patient}</TableCell>
                      <TableCell className="text-sm">{p.provider}</TableCell>
                      <TableCell className="text-sm">{p.procedure}</TableCell>
                      <TableCell className="font-medium">
                        ₹{p.requested.toLocaleString()}
                      </TableCell>
                      <TableCell>{statusBadge(p.status)}</TableCell>
                      <TableCell className="text-sm">{p.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROVIDERS.map((p, i) => (
              <Card key={p.id} data-ocid={`insurance.provider.item.${i + 1}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.id} • TPA: {p.tpa}
                      </p>
                    </div>
                    <Badge variant="outline">{p.type}</Badge>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                      {p.network}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {p.contact}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Claim Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-ocid="insurance.dialog">
          <DialogHeader>
            <DialogTitle>New Insurance Claim</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Patient Name</Label>
              <Input className="mt-1" placeholder="Patient name" />
            </div>
            <div>
              <Label>Insurance Provider</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Claim Type</Label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Hospitalization",
                    "Surgery",
                    "Day Care",
                    "ICU Care",
                    "OPD",
                  ].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Claim Amount (₹)</Label>
              <Input type="number" className="mt-1" placeholder="Amount" />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="insurance.cancel_button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="insurance.submit_button"
              onClick={() => setOpen(false)}
            >
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Claim Detail */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent data-ocid="insurance.detail.dialog">
          <DialogHeader>
            <DialogTitle>Claim Details — {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Patient", selected.patient],
                ["Provider", selected.provider],
                ["Type", selected.type],
                ["Submitted", selected.submitted],
                ["Last Updated", selected.updated],
                ["Claimed", `₹${selected.amount.toLocaleString()}`],
                [
                  "Approved",
                  selected.approved
                    ? `₹${selected.approved.toLocaleString()}`
                    : "—",
                ],
                ["Status", selected.status],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="font-medium">{v}</p>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button
              data-ocid="insurance.detail.close_button"
              onClick={() => setSelected(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
