import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Calendar, X } from "lucide-react";
import { api } from "../lib/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";

export function KeyDatesManagerPage() {
  const [dates, setDates] = useState<any[]>([]);
  const [editingDate, setEditingDate] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchDates = async () => {
    try {
      const res = await api.get("/api/admin/masters/key-dates");
      setDates(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load compliance dates.");
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await api.post("/api/admin/masters/key-dates", editingDate);
        toast.success("Date added.");
      } else {
        await api.put(`/api/admin/masters/key-dates/${editingDate.id}`, editingDate);
        toast.success("Date updated.");
      }
      setEditingDate(null);
      setIsNew(false);
      fetchDates();
    } catch (err: any) {
      toast.error(err.message || "Failed to save date.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/masters/key-dates/${deleteId}`);
      toast.success("Date deleted.");
      setDeleteId(null);
      fetchDates();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tax &amp; GST Compliance Dates</h1>
          <p className="text-xs text-slate-500 mt-1">Manage statutory deadlines displayed on the public compliance calendar.</p>
        </div>
        <button
          onClick={() => {
            setEditingDate({ event_date: new Date().toISOString().split("T")[0], title: "", category: "GST", is_active: true });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus size={14} /> Add Deadline
        </button>
      </div>

      {editingDate && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isNew ? "New Deadline" : "Edit Deadline"}</h3>
            <button type="button" onClick={() => setEditingDate(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Due Date</label>
              <input
                type="date"
                required
                value={editingDate.event_date ? editingDate.event_date.split("T")[0] : ""}
                onChange={(e) => setEditingDate({ ...editingDate, event_date: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Tag</label>
              <select
                value={editingDate.category}
                onChange={(e) => setEditingDate({ ...editingDate, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              >
                <option value="GST">GST</option>
                <option value="ITR">ITR</option>
                <option value="Tax">Advance Tax</option>
                <option value="ROC">ROC Compliance</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Title / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. GSTR-3B Monthly Return Filing"
                value={editingDate.title}
                onChange={(e) => setEditingDate({ ...editingDate, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingDate(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">
              Save Deadline
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4 font-semibold">Statutory Date</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Compliance Item</th>
              <th className="p-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {dates.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-brand-600 dark:text-brand-400">
                  {new Date(d.event_date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {d.category}
                  </span>
                </td>
                <td className="p-4 font-semibold text-slate-900 dark:text-white">{d.title}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingDate(d);
                        setIsNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-600"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(d.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Compliance Date"
        message="Are you sure you want to delete this compliance deadline?"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
