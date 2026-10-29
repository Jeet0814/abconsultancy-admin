import React, { useEffect, useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { api } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";

const COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#e11d48"];

export function DashboardPage({ onSelectInquiry }: { onSelectInquiry: (id: number) => void }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/admin/inquiries/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load dashboard statistics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const handleFocus = () => fetchStats();
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(fetchStats, 20000);
    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const metrics = stats?.metrics || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Management Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time prospective client inquiries, conversion trends, and compliance pulse.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold">
          <Sparkles size={14} /> Live Sync Active
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">New Inquiries</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Inbox size={18} />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.new || 0}</span>
            <span className="ml-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              +{metrics.today || 0} today
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Follow-Up</span>
            <span className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Clock size={18} />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.followUp || 0}</span>
            {metrics.overdueFollowUps > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle size={12} /> {metrics.overdueFollowUps} overdue
              </span>
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Progress</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp size={18} />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.inProgress || 0}</span>
            <span className="ml-2 text-xs text-slate-500">Active consults</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Converted Clients</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.converted || 0}</span>
            <span className="ml-2 text-xs font-medium text-emerald-600">Total closed</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Line Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">7-Day Inquiry Volume</h3>
              <p className="text-xs text-slate-500">Daily incoming prospective leads</p>
            </div>
          </div>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.weeklyTrends || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown Pie Chart */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Service Breakdown</h3>
            <p className="text-xs text-slate-500">Demand across practice verticals</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.serviceBreakdown || []}
                  dataKey="count"
                  nameKey="service"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                  paddingAngle={3}
                >
                  {(stats?.serviceBreakdown || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {(stats?.serviceBreakdown || []).map((item: any, idx: number) => (
              <div key={item.service} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-2 truncate">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {item.service}
                </span>
                <span className="font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Incoming Inquiries</h3>
            <p className="text-xs text-slate-500">Quick action list</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Ref No</th>
                <th className="pb-3 font-semibold">Client Name</th>
                <th className="pb-3 font-semibold">Phone / WhatsApp</th>
                <th className="pb-3 font-semibold">Service</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {(stats?.recentInquiries || []).map((row: any) => (
                <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-brand-600 dark:text-brand-400">{row.reference_no}</td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
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
                      <span>{row.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">{row.service_requested}</td>
                  <td className="py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-3">
                    <PriorityBadge priority={row.priority} />
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => onSelectInquiry(row.id)}
                      className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
                    >
                      View <ArrowUpRight size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
