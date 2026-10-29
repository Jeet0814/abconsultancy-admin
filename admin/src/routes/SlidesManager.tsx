import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, X, Image as ImageIcon } from "lucide-react";
import { api } from "../lib/api";
import { MediaUploader } from "../components/MediaUploader";
import { ConfirmModal } from "../components/ConfirmModal";
import { getAdminImageUrl } from "../lib/images";
import { toast } from "sonner";

export function SlidesManagerPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchSlides = async () => {
    try {
      const res = await api.get("/api/admin/masters/slides");
      setSlides(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load slides.");
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await api.post("/api/admin/masters/slides", editingSlide);
        toast.success("Slide added.");
      } else {
        await api.put(`/api/admin/masters/slides/${editingSlide.id}`, editingSlide);
        toast.success("Slide updated.");
      }
      setEditingSlide(null);
      setIsNew(false);
      fetchSlides();
    } catch (err: any) {
      toast.error(err.message || "Failed to save slide.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/masters/slides/${deleteId}`);
      toast.success("Slide deleted.");
      setDeleteId(null);
      fetchSlides();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hero &amp; Banner Carousel Slides</h1>
          <p className="text-xs text-slate-500 mt-1">Manage promotional campaign slides, CTA links, and banners.</p>
        </div>
        <button
          onClick={() => {
            setEditingSlide({ title: "", subtitle: "", image_url: "", cta_label: "Consult Now", cta_link: "/contact", is_active: true });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus size={14} /> Add Slide
        </button>
      </div>

      {editingSlide && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isNew ? "New Slide" : "Edit Slide"}</h3>
            <button type="button" onClick={() => setEditingSlide(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Slide Heading Title</label>
              <input
                type="text"
                required
                value={editingSlide.title}
                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Subtitle / Tagline</label>
              <input
                type="text"
                value={editingSlide.subtitle || ""}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Button Label</label>
              <input
                type="text"
                value={editingSlide.cta_label || ""}
                onChange={(e) => setEditingSlide({ ...editingSlide, cta_label: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CTA Destination Link</label>
              <input
                type="text"
                value={editingSlide.cta_link || ""}
                onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <MediaUploader
                label="Banner Background Image"
                value={editingSlide.image_url}
                onChange={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingSlide(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">
              Save Slide
            </button>
          </div>
        </form>
      )}

      {/* Slide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slides.map((s) => (
          <div
            key={s.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            {s.image_url ? (
              <div className="h-36 w-full bg-slate-100 dark:bg-slate-800 relative">
                <img src={getAdminImageUrl(s.image_url)} alt={s.title} className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-28 w-full bg-gradient-to-r from-brand-700 to-brand-900 flex items-center justify-center text-white">
                <ImageIcon size={28} />
              </div>
            )}

            <div className="p-5 space-y-2 flex-1">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h4>
              <p className="text-xs text-slate-500">{s.subtitle}</p>
              {s.cta_label && (
                <span className="inline-block text-[11px] font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded">
                  CTA: {s.cta_label} ({s.cta_link})
                </span>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-1">
              <button
                onClick={() => {
                  setEditingSlide(s);
                  setIsNew(false);
                }}
                className="p-1.5 text-slate-400 hover:text-brand-600"
              >
                <Edit3 size={14} />
              </button>
              <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Carousel Slide"
        message="Are you sure you want to remove this slide?"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
