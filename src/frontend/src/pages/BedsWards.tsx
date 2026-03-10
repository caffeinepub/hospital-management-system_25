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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BedDouble, Plus } from "lucide-react";
import { useState } from "react";

type BedStatus = "available" | "occupied" | "cleaning" | "maintenance";

interface Bed {
  id: string;
  ward: string;
  type: string;
  patient?: string;
  doctor?: string;
  status: BedStatus;
}

const generateBeds = (): Bed[] => {
  const beds: Bed[] = [];
  const generalPatients = [
    "Vikram Nair",
    "Lata Sharma",
    "",
    "Kavitha R",
    "",
    "Suresh K",
    "Anita D",
    "",
    "",
    "Hari R",
  ];
  for (let i = 1; i <= 10; i++) {
    const patient = generalPatients[i - 1];
    beds.push({
      id: `G-${String(i).padStart(3, "0")}`,
      ward: "General",
      type: "general",
      patient,
      doctor: patient ? "Dr. Sharma" : undefined,
      status: patient ? "occupied" : i === 7 ? "cleaning" : "available",
    });
  }
  const privatePatients = [
    "Ramesh Gupta",
    "",
    "Kavitha Nair",
    "",
    "Sunil Mehta",
  ];
  for (let i = 1; i <= 5; i++) {
    const patient = privatePatients[i - 1];
    beds.push({
      id: `P-${String(i).padStart(3, "0")}`,
      ward: "Private",
      type: "private",
      patient,
      doctor: patient ? "Dr. Patel" : undefined,
      status: patient ? "occupied" : "available",
    });
  }
  const icuPatients = [
    "Critical M, 62y",
    "Stroke F, 74y",
    "",
    "Post-op M, 45y",
  ];
  for (let i = 1; i <= 4; i++) {
    const patient = icuPatients[i - 1];
    beds.push({
      id: `ICU-${String(i).padStart(2, "0")}`,
      ward: "ICU",
      type: "icu",
      patient,
      doctor: patient ? "Dr. Singh" : undefined,
      status: patient ? "occupied" : "available",
    });
  }
  return beds;
};

const COLOR_MAP: Record<
  BedStatus,
  { bg: string; border: string; text: string }
> = {
  available: {
    bg: "bg-green-50",
    border: "border-green-300",
    text: "text-green-700",
  },
  occupied: {
    bg: "bg-blue-50",
    border: "border-blue-300",
    text: "text-blue-700",
  },
  cleaning: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-700",
  },
  maintenance: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-600",
  },
};

export default function BedsWards() {
  const [beds, setBeds] = useState<Bed[]>(generateBeds());
  const [selected, setSelected] = useState<Bed | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [filterWard, setFilterWard] = useState("all");
  const [assignForm, setAssignForm] = useState({ patient: "", doctor: "" });

  const filteredBeds =
    filterWard === "all" ? beds : beds.filter((b) => b.ward === filterWard);

  const stats = {
    total: beds.length,
    occupied: beds.filter((b) => b.status === "occupied").length,
    available: beds.filter((b) => b.status === "available").length,
    cleaning: beds.filter((b) => b.status === "cleaning").length,
  };

  const assignBed = () => {
    if (!selected || !assignForm.patient) return;
    setBeds(
      beds.map((b) =>
        b.id === selected.id
          ? {
              ...b,
              patient: assignForm.patient,
              doctor: assignForm.doctor,
              status: "occupied",
            }
          : b,
      ),
    );
    setAssignForm({ patient: "", doctor: "" });
    setAssignOpen(false);
    setSelected(null);
  };

  const releaseBed = (bedId: string) => {
    setBeds(
      beds.map((b) =>
        b.id === bedId
          ? { ...b, patient: undefined, doctor: undefined, status: "cleaning" }
          : b,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Beds & Wards Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time bed occupancy across all wards
          </p>
        </div>
        <div className="flex items-center gap-2">
          {["all", "General", "Private", "ICU"].map((w) => (
            <Button
              key={w}
              size="sm"
              variant={filterWard === w ? "default" : "outline"}
              data-ocid={`beds.filter.${w.toLowerCase()}.tab`}
              onClick={() => setFilterWard(w)}
            >
              {w}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: "Total Beds",
            value: stats.total,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "Occupied",
            value: stats.occupied,
            color: "oklch(0.62 0.22 25)",
          },
          {
            label: "Available",
            value: stats.available,
            color: "oklch(0.6 0.18 160)",
          },
          {
            label: "Cleaning",
            value: stats.cleaning,
            color: "oklch(0.7 0.18 65)",
          },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Occupancy bars */}
      <div className="grid grid-cols-3 gap-4">
        {["General", "Private", "ICU"].map((ward) => {
          const wardBeds = beds.filter((b) => b.ward === ward);
          const occ = wardBeds.filter((b) => b.status === "occupied").length;
          const pct = Math.round((occ / wardBeds.length) * 100);
          return (
            <Card key={ward}>
              <CardContent className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold">{ward} Ward</span>
                  <span className="text-muted-foreground">
                    {occ}/{wardBeds.length}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background:
                        pct > 85
                          ? "oklch(0.62 0.22 25)"
                          : pct > 60
                            ? "oklch(0.7 0.18 65)"
                            : "oklch(0.6 0.18 160)",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {pct}% occupied
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bed Grid */}
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid" data-ocid="beds.grid.tab">
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" data-ocid="beds.list.tab">
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {filteredBeds.map((bed, i) => {
              const colors = COLOR_MAP[bed.status];
              return (
                <button
                  type="button"
                  key={bed.id}
                  data-ocid={`beds.item.${i + 1}`}
                  className={`p-3 rounded-xl border-2 cursor-pointer hover:shadow-md transition-all ${colors.bg} ${colors.border}`}
                  onClick={() => {
                    setSelected(bed);
                    if (bed.status === "available") setAssignOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelected(bed);
                      if (bed.status === "available") setAssignOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <BedDouble size={12} className={colors.text} />
                    <span className="text-xs font-bold">{bed.id}</span>
                  </div>
                  <Badge
                    className={`text-xs px-1 py-0 ${colors.bg} ${colors.text} border-0`}
                  >
                    {bed.status}
                  </Badge>
                  {bed.patient && (
                    <p className="text-xs mt-1 truncate font-medium">
                      {bed.patient.split(" ")[0]}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4">
            {Object.entries(COLOR_MAP).map(([status, colors]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div
                  className={`w-3 h-3 rounded ${colors.bg} border ${colors.border}`}
                />
                <span className="text-xs text-muted-foreground capitalize">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <div className="space-y-2">
            {filteredBeds.map((bed, i) => (
              <div
                key={bed.id}
                data-ocid={`beds.list.item.${i + 1}`}
                className="flex items-center gap-4 p-3 rounded-xl border bg-card"
              >
                <BedDouble size={18} className="text-muted-foreground" />
                <div className="w-20 font-bold text-sm">{bed.id}</div>
                <Badge variant="outline" className="text-xs">
                  {bed.ward}
                </Badge>
                <div className="flex-1 text-sm">
                  {bed.patient || (
                    <span className="text-muted-foreground">Empty</span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {bed.doctor || ""}
                </div>
                <Badge
                  className={`${COLOR_MAP[bed.status].bg} ${COLOR_MAP[bed.status].text} border-0`}
                >
                  {bed.status}
                </Badge>
                {bed.status === "occupied" && (
                  <Button
                    variant="outline"
                    size="sm"
                    data-ocid={`beds.release_button.${i + 1}`}
                    onClick={() => releaseBed(bed.id)}
                  >
                    Release
                  </Button>
                )}
                {bed.status === "available" && (
                  <Button
                    size="sm"
                    data-ocid={`beds.assign_button.${i + 1}`}
                    onClick={() => {
                      setSelected(bed);
                      setAssignOpen(true);
                    }}
                  >
                    <Plus size={12} className="mr-1" />
                    Assign
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Assign Modal */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent data-ocid="beds.assign.dialog">
          <DialogHeader>
            <DialogTitle>Assign Bed — {selected?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Patient Name</Label>
              <Input
                data-ocid="beds.patient.input"
                className="mt-1"
                value={assignForm.patient}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, patient: e.target.value })
                }
                placeholder="Patient full name"
              />
            </div>
            <div>
              <Label>Assigned Doctor</Label>
              <Input
                data-ocid="beds.doctor.input"
                className="mt-1"
                value={assignForm.doctor}
                onChange={(e) =>
                  setAssignForm({ ...assignForm, doctor: e.target.value })
                }
                placeholder="Doctor name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              data-ocid="beds.cancel_button"
              onClick={() => setAssignOpen(false)}
            >
              Cancel
            </Button>
            <Button data-ocid="beds.confirm_button" onClick={assignBed}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
