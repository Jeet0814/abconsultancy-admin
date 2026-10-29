import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Save, X, HelpCircle } from "lucide-react";
import { api } from "../lib/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";

export function FaqsManagerPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [editingFaq, setEditingFaq] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchFaqs = async () => {
    try {
      const res = await api.get("/api/admin/masters/faqs");
      setFaqs(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load FAQs.");
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await api.post("/api/admin/masters/faqs", editingFaq);
        toast.success("FAQ created.");
      } else {
        await api.put(`/api/admin/masters/faqs/${editingFaq.id}`, editingFaq);
        toast.success("FAQ updated.");
      }
      setEditingFaq(null);
      setIsNew(false);
      fetchFaqs();
    } catch (err: any) {
      toast.error(err.message || "Failed to save FAQ.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/masters/faqs/${deleteId}`);
      toast.success("FAQ deleted.");
      setDeleteId(null);
      fetchFaqs();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions (FAQs)</h1>
          <p className="text-xs text-slate-500 mt-1">Manage service-specific and general advisory questions.</p>
        </div>
        <button
          onClick={() => {
            setEditingFaq({ category: "General", question: "", answer: "", is_active: true });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus size={14} /> Add New FAQ
        </button>
      </div>

      {/* Edit/Create Form Drawer/Card */}
      {editingFaq && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isNew ? "New FAQ" : "Edit FAQ"}</h3>
            <button type="button" onClick={() => setEditingFaq(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                required
                value={editingFaq.category}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Question</label>
            <input
              type="text"
              required
              value={editingFaq.question}
              onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Answer</label>
            <textarea
              rows={3}
              required
              value={editingFaq.answer}
              onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingFaq(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold"
            >
              Save FAQ
            </button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                {faq.category}
              </span>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white pt-1">{faq.question}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setEditingFaq(faq);
                  setIsNew(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-brand-600"
                title="Edit FAQ"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => setDeleteId(faq.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-600"
                title="Delete FAQ"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ?"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
