import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText } from "lucide-react";

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      // Fetch logs with profile data
      const { data, error } = await supabase
        .from("activity_logs")
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching logs:", error);
      } else {
        setLogs(data || []);
      }
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
           <FileText className="h-6 w-6 text-muted-foreground" />
           <h1 className="text-2xl font-bold">Activity Logs</h1>
        </div>

        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                 <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No logs found.</TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs">
                       {format(new Date(log.created_at), "MMM d, HH:mm:ss")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {log.user?.full_name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded bg-secondary text-xs">
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-xs" title={log.details}>
                      {log.details}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
