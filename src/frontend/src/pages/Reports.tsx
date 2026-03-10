import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { BarChart3, Download, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

const MONTHLY_DATA = [
  {
    month: "Oct",
    revenue: 520000,
    patients: 1240,
    opd: 890,
    ipd: 68,
    bedOcc: 71,
  },
  {
    month: "Nov",
    revenue: 495000,
    patients: 1180,
    opd: 840,
    ipd: 62,
    bedOcc: 68,
  },
  {
    month: "Dec",
    revenue: 610000,
    patients: 1420,
    opd: 1020,
    ipd: 82,
    bedOcc: 79,
  },
  {
    month: "Jan",
    revenue: 575000,
    patients: 1350,
    opd: 970,
    ipd: 76,
    bedOcc: 75,
  },
  {
    month: "Feb",
    revenue: 640000,
    patients: 1510,
    opd: 1080,
    ipd: 88,
    bedOcc: 82,
  },
  {
    month: "Mar",
    revenue: 680000,
    patients: 1620,
    opd: 1150,
    ipd: 95,
    bedOcc: 85,
  },
];

const DEPT_PERFORMANCE = [
  {
    dept: "Cardiology",
    patients: 320,
    revenue: 180000,
    satisfaction: 96,
    growth: 12,
  },
  {
    dept: "Orthopaedics",
    patients: 280,
    revenue: 150000,
    satisfaction: 93,
    growth: 8,
  },
  {
    dept: "Gynaecology",
    patients: 250,
    revenue: 120000,
    satisfaction: 94,
    growth: 15,
  },
  { dept: "ENT", patients: 190, revenue: 85000, satisfaction: 91, growth: 5 },
  {
    dept: "Neurology",
    patients: 160,
    revenue: 210000,
    satisfaction: 95,
    growth: 18,
  },
  {
    dept: "Paediatrics",
    patients: 310,
    revenue: 95000,
    satisfaction: 97,
    growth: 10,
  },
  {
    dept: "General Surgery",
    patients: 140,
    revenue: 160000,
    satisfaction: 92,
    growth: 7,
  },
];

const DOCTOR_PRODUCTIVITY = [
  {
    name: "Dr. Sharma",
    dept: "Cardiology",
    consultations: 48,
    surgeries: 6,
    revenue: 95000,
    rating: 4.8,
  },
  {
    name: "Dr. Patel",
    dept: "Gynaecology",
    consultations: 42,
    surgeries: 8,
    revenue: 80000,
    rating: 4.7,
  },
  {
    name: "Dr. Mehta",
    dept: "Orthopaedics",
    consultations: 39,
    surgeries: 5,
    revenue: 72000,
    rating: 4.6,
  },
  {
    name: "Dr. Singh",
    dept: "Neurology",
    consultations: 35,
    surgeries: 3,
    revenue: 85000,
    rating: 4.9,
  },
  {
    name: "Dr. Gupta",
    dept: "General Surgery",
    consultations: 44,
    surgeries: 7,
    revenue: 68000,
    rating: 4.5,
  },
];

const MEDICINE_SALES = [
  { category: "Antibiotics", units: 1240, revenue: 48000 },
  { category: "Cardiovascular", units: 890, revenue: 62000 },
  { category: "Analgesics", units: 2100, revenue: 28000 },
  { category: "Antidiabetic", units: 760, revenue: 38000 },
  { category: "Vitamins & Supplements", units: 1580, revenue: 22000 },
  { category: "Oncology", units: 120, revenue: 95000 },
];

export default function Reports() {
  const [period, setPeriod] = useState("month");
  const maxRev = Math.max(...MONTHLY_DATA.map((d) => d.revenue));
  const maxPat = Math.max(...MONTHLY_DATA.map((d) => d.patients));

  const currentMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1];
  const prevMonth = MONTHLY_DATA[MONTHLY_DATA.length - 2];
  const revGrowth = (
    ((currentMonth.revenue - prevMonth.revenue) / prevMonth.revenue) *
    100
  ).toFixed(1);
  const patGrowth = (
    ((currentMonth.patients - prevMonth.patients) / prevMonth.patients) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Analytics & Reports
          </h1>
          <p className="text-sm text-muted-foreground">
            Business intelligence and performance dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger
              className="h-9 w-32"
              data-ocid="reports.period.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            data-ocid="reports.export.button"
            className="gap-2"
          >
            <Download size={14} />
            Export
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Monthly Revenue",
            value: `₹${(currentMonth.revenue / 1000).toFixed(0)}K`,
            sub: `${Number(revGrowth) >= 0 ? "+" : ""}${revGrowth}% vs last month`,
            up: Number(revGrowth) >= 0,
            color: "oklch(0.58 0.14 200)",
          },
          {
            label: "Total Patients",
            value: currentMonth.patients.toLocaleString(),
            sub: `${Number(patGrowth) >= 0 ? "+" : ""}${patGrowth}% vs last month`,
            up: Number(patGrowth) >= 0,
            color: "oklch(0.6 0.18 160)",
          },
          {
            label: "Bed Occupancy",
            value: `${currentMonth.bedOcc}%`,
            sub: "Average this month",
            up: true,
            color: "oklch(0.65 0.18 250)",
          },
          {
            label: "IPD Admissions",
            value: currentMonth.ipd.toString(),
            sub: "This month",
            up: true,
            color: "oklch(0.62 0.22 25)",
          },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                {c.label}
              </p>
              <p className="text-2xl font-bold text-foreground mt-0.5">
                {c.value}
              </p>
              <div
                className={`flex items-center gap-1 mt-1 text-xs ${c.up ? "text-green-600" : "text-red-600"}`}
              >
                {c.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {c.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue" data-ocid="reports.revenue.tab">
            Revenue
          </TabsTrigger>
          <TabsTrigger value="patients" data-ocid="reports.patients.tab">
            Patient Flow
          </TabsTrigger>
          <TabsTrigger value="departments" data-ocid="reports.departments.tab">
            Departments
          </TabsTrigger>
          <TabsTrigger value="doctors" data-ocid="reports.doctors.tab">
            Doctors
          </TabsTrigger>
          <TabsTrigger value="pharmacy" data-ocid="reports.pharmacy.tab">
            Pharmacy Sales
          </TabsTrigger>
        </TabsList>

        {/* Revenue */}
        <TabsContent value="revenue" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" /> Monthly
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40 mb-2">
                {MONTHLY_DATA.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-muted-foreground">
                      ₹{(d.revenue / 1000).toFixed(0)}K
                    </span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${(d.revenue / maxRev) * 120}px`,
                        background: "oklch(0.58 0.14 200)",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                6-Month Revenue Trend (Oct 2025 — Mar 2026)
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patient Flow */}
        <TabsContent value="patients" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">
                Patient Inflow Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-3 h-40 mb-4">
                {MONTHLY_DATA.map((d) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-xs text-muted-foreground">
                      {d.patients}
                    </span>
                    <div
                      className="w-full rounded-t-md"
                      style={{
                        height: `${(d.patients / maxPat) * 120}px`,
                        background: "oklch(0.6 0.18 160)",
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4">
                {MONTHLY_DATA.map((d) => (
                  <div
                    key={d.month}
                    className="text-center p-3 rounded-lg bg-muted/40"
                  >
                    <p className="text-sm font-bold">{d.month}</p>
                    <p className="text-xs text-muted-foreground">
                      OPD: {d.opd} | IPD: {d.ipd}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bed: {d.bedOcc}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments */}
        <TabsContent value="departments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table data-ocid="reports.dept.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Satisfaction</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DEPT_PERFORMANCE.map((d, i) => (
                    <TableRow
                      key={d.dept}
                      data-ocid={`reports.dept.row.${i + 1}`}
                    >
                      <TableCell className="font-semibold">{d.dept}</TableCell>
                      <TableCell>{d.patients}</TableCell>
                      <TableCell className="font-medium">
                        ₹{d.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-green-500"
                              style={{ width: `${d.satisfaction}%` }}
                            />
                          </div>
                          <span className="text-xs">{d.satisfaction}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            d.growth >= 10
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }
                        >
                          +{d.growth}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctors */}
        <TabsContent value="doctors" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table data-ocid="reports.doctor.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Consultations</TableHead>
                    <TableHead>Surgeries</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {DOCTOR_PRODUCTIVITY.map((d, i) => (
                    <TableRow
                      key={d.name}
                      data-ocid={`reports.doctor.row.${i + 1}`}
                    >
                      <TableCell className="font-semibold">{d.name}</TableCell>
                      <TableCell className="text-sm">{d.dept}</TableCell>
                      <TableCell>{d.consultations}</TableCell>
                      <TableCell>{d.surgeries}</TableCell>
                      <TableCell className="font-medium">
                        ₹{d.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">★ {d.rating}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pharmacy Sales */}
        <TabsContent value="pharmacy" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table data-ocid="reports.pharmacy.table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Units Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Share</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MEDICINE_SALES.map((m, i) => {
                    const totalRev = MEDICINE_SALES.reduce(
                      (s, x) => s + x.revenue,
                      0,
                    );
                    const share = ((m.revenue / totalRev) * 100).toFixed(1);
                    return (
                      <TableRow
                        key={m.category}
                        data-ocid={`reports.pharmacy.row.${i + 1}`}
                      >
                        <TableCell className="font-semibold">
                          {m.category}
                        </TableCell>
                        <TableCell>{m.units.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">
                          ₹{m.revenue.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${share}%`,
                                  background: "oklch(0.58 0.14 200)",
                                }}
                              />
                            </div>
                            <span className="text-xs">{share}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
