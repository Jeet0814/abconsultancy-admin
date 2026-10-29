import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckSquare,
  Square,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { api } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { toast } from "sonner";

export function InquiriesListPage({ onSelectInquiry }: { onSelectInquiry: (id: number) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("");
  const [priority, setPriority] = useState("all");

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkStatus, setBulkStatus] = useState("In Progress");

  const fetchInquiries = useCallback(async (page = 1, showIndicator = true) => {
    if (showIndicator) {
      setIsRefreshing(true);
    }
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: "15",
        ...(search ? { search } : {}),
        ...(status !== "all" ? { status } : {}),
        ...(service ? { service } : {}),
        ...(priority !== "all" ? { priority } : {}),
      });

      const res = await api.get(`/api/admin/inquiries?${queryParams.toString()}`);
      setItems(res.data || []);
      setPagination(res.meta || { page, limit: 15, total: 0, totalPages: 1 });
    } catch (err: any) {
      if (showIndicator) {
        toast.error(err.message || "Failed to load inquiries.");
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [search, status, service, priority]);

  // Initial and filter change fetch
  useEffect(() => {
    setLoading(true);
    fetchInquiries(1, false);
  }, [fetchInquiries]);

  // Auto-refresh when tab is focused or on interval
  useEffect(() => {
    const handleFocus = () => {
      fetchInquiries(pagination.page, false);
    };
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      fetchInquiries(pagination.page, false);
    }, 15000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [fetchInquiries, pagination.page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInquiries(1);
  };

  const handleExportCsv = async () => {
    try {
      toast.info("Generating CSV export...");
      const queryParams = new URLSearchParams({
        ...(status !== "all" ? { status } : {}),
        ...(service ? { service } : {}),
        ...(search ? { search } : {}),
      });
      const apiBase = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
      window.open(`${apiBase}/api/admin/inquiries/export/csv?${queryParams.toString()}`, "_blank");
    } catch {
      toast.error("Failed to export CSV.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) return;
    try {
      await api.post("/api/admin/inquiries/bulk-status", {
        inquiryIds: selectedIds,
        status: bulkStatus,
      });
      toast.success(`Updated ${selectedIds.length} inquiries.`);
      setSelectedIds([]);
      fetchInquiries(pagination.page);
    } catch (err: any) {
      toast.error(err.message || "Bulk update failed.");
    }
  };

  const statusTabs = ["all", "New", "In Progress", "Follow-up", "Converted", "Closed", "Spam"];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prospective Inquiries & Leads</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track, assign, follow-up, and convert client tax & insurance requirements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchInquiries(pagination.page, true)}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer disabled:opacity-60 transition-all"
            title="Refresh inquiry list"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-brand-600" : ""} />
            {isRefreshing ? "Syncing..." : "Refresh"}
          </button>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {statusTabs.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              status === s
                ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {s === "all" ? "All Inquiries" : s}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or ref no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Services</option>
            <option value="Insurance Advisory">Insurance Advisory</option>
            <option value="Investment & Wealth Planning">Investment & Wealth Planning</option>
            <option value="Income Tax & ITR Filing">Income Tax & ITR Filing</option>
            <option value="GST Consultancy & Compliance">GST Consultancy & Compliance</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/70 border border-brand-200 dark:border-brand-800 flex items-center justify-between gap-4 animate-in fade-in">
          <span className="text-xs font-bold text-brand-800 dark:text-brand-300">
            {selectedIds.length} inquiries selected
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
            >
              <option value="Contacted">Mark Contacted</option>
              <option value="In Progress">Mark In Progress</option>
              <option value="Follow-up">Mark Follow-up</option>
              <option value="Converted">Mark Converted</option>
              <option value="Closed">Mark Closed</option>
              <option value="Spam">Mark Spam</option>
            </select>
            <button
              onClick={handleBulkUpdate}
              className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
            >
              Apply Status
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedIds.length === items.length && items.length > 0 ? (
                      <CheckSquare size={16} className="text-brand-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-4 font-semibold">Ref &amp; Date</th>
                <th className="p-4 font-semibold">Client Name</th>
                <th className="p-4 font-semibold">Contact Info</th>
                <th className="p-4 font-semibold">Service</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Priority</th>
                <th className="p-4 font-semibold">Assigned</th>
                <th className="p-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <Loader2 className="animate-spin inline-block mr-2" size={18} /> Loading inquiries...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No inquiries match the active filter criteria.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <button onClick={() => toggleSelectOne(row.id)} className="text-slate-400 hover:text-slate-600">
                        {selectedIds.includes(row.id) ? (
                          <CheckSquare size={16} className="text-brand-600" />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{row.reference_no}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        {new Date(row.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${row.phone}`} className="p-1 text-slate-400 hover:text-brand-600" title="Call">
                          <Phone size={13} />
                        </a>
                        <a
                          href={`https://wa.me/${row.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 text-slate-400 hover:text-emerald-600"
                          title="WhatsApp"
                        >
                          <MessageCircle size={13} />
                        </a>
                        <span className="font-mono">{row.phone}</span>
                      </div>
                      {row.email && <span className="block text-[10px] text-slate-400">{row.email}</span>}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300 max-w-[150px] truncate">{row.service_requested}</td>
                    <td className="p-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={row.priority} />
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400">
                      {row.assigned_to_name || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onSelectInquiry(row.id)}
                        className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                      >
                        Manage <ArrowUpRight size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {items.length} of {pagination.total} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchInquiries(pagination.page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchInquiries(pagination.page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
