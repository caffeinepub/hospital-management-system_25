import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ActivityLog } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  doctor: "bg-blue-100 text-blue-800",
  nurse: "bg-pink-100 text-pink-800",
  receptionist: "bg-amber-100 text-amber-800",
  pharmacist: "bg-green-100 text-green-800",
};

export default function StaffLogs() {
  const { actor } = useActor();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getRecentLogs()
      .then(setLogs)
      .catch(() => toast.error("Failed to load logs"))
      .finally(() => setLoading(false));
  }, [actor]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Staff Activity Logs</h1>
        <p className="text-muted-foreground text-sm">
          {logs.length} recent activities
        </p>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card">
        {loading ? (
          <div data-ocid="stafflogs.loading_state" className="p-6 space-y-3">
            {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
              <Skeleton key={k} className="h-10 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div
            data-ocid="stafflogs.empty_state"
            className="p-12 text-center text-muted-foreground"
          >
            No activity logs found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={log.id} data-ocid={`stafflogs.item.${idx + 1}`}>
                  <TableCell className="font-medium font-mono text-xs">
                    {log.userId.toString().slice(0, 12)}…
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${ROLE_COLORS[log.role] ?? "bg-gray-100 text-gray-700"} hover:${ROLE_COLORS[log.role] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {log.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(log.timestamp)).toLocaleString()}
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
