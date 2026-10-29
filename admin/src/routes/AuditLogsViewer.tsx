import React, { useEffect, useState } from "react";
import { History, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function AuditLogsViewerPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/audit?page=${page}&limit=20`);
      setLogs(res.data || []);
      setPagination(res.meta || { page, limit: 20, total: 0, totalPages: 1 });
    } catch (err: any) {
      toast.error(err.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Audit Trail</h1>
        <p className="text-xs text-slate-500 mt-1">Immutable security ledger recording administrative changes, logins, and data exports.</p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">Staff User</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">Target Entity</th>
              <th className="p-4 font-semibold">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  <Loader2 className="animate-spin inline-block mr-2" size={16} /> Loading audit log entries...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">
                  No audit log entries recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="p-4 font-mono text-slate-500 text-[11px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <strong className="text-slate-900 dark:text-white block">{log.user_name || "System"}</strong>
                    <span className="text-[10px] text-slate-400">{log.user_email || "Automated trigger"}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {log.entity_name} {log.entity_id ? `(#${log.entity_id})` : ""}
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[10px]">{log.ip_address || "Internal"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total {pagination.total} audit events logged
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchLogs(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchLogs(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
