import React, { useEffect, useState } from "react";
import { Check, X, Star, Trash2, Plus, Sparkles, MessageSquareQuote } from "lucide-react";
import { api } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";

export function TestimonialsManagerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [statusTab, setStatusTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get(`/api/admin/masters/testimonials?status=${statusTab}`);
      setItems(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [statusTab]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await api.put(`/api/admin/masters/testimonials/${id}`, { status: newStatus });
      toast.success(`Testimonial marked as ${newStatus}`);
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err.message || "Failed to update testimonial.");
    }
  };

  const handleToggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      await api.put(`/api/admin/masters/testimonials/${id}`, { is_featured: !isFeatured });
      toast.success(`Updated featured status.`);
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle featured.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/masters/testimonials/${deleteId}`);
      toast.success("Testimonial deleted.");
      setDeleteId(null);
      fetchTestimonials();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Testimonials</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review public submissions, approve for website display, and manage featured client quotes.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {["all", "pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              statusTab === tab
                ? "bg-brand-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            No testimonials in this category.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={item.status} />
                    {item.is_featured && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                        <Sparkles size={10} /> Featured
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-current" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{item.message}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <strong className="block text-xs text-slate-900 dark:text-white font-bold">{item.name}</strong>
                  <span className="text-[11px] text-slate-400">{item.service_used || "General Financial Services"}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  {item.status !== "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "approved")}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-400 transition-colors"
                      title="Approve Review"
                    >
                      <Check size={14} />
                    </button>
                  )}

                  {item.status !== "rejected" && (
                    <button
                      onClick={() => handleUpdateStatus(item.id, "rejected")}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition-colors"
                      title="Reject Review"
                    >
                      <X size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => handleToggleFeatured(item.id, item.is_featured)}
                    className={`p-2 rounded-xl border transition-colors ${
                      item.is_featured
                        ? "bg-amber-50 text-amber-600 border-amber-200"
                        : "text-slate-400 hover:text-amber-500 border-transparent"
                    }`}
                    title="Toggle Homepage Feature"
                  >
                    <Star size={14} />
                  </button>

                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Testimonial"
        message="Are you sure you want to permanently delete this testimonial?"
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
