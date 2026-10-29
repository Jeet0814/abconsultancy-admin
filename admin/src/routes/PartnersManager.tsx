import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, X, Building2, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { MediaUploader } from "../components/MediaUploader";
import { ConfirmModal } from "../components/ConfirmModal";
import { getAdminImageUrl } from "../lib/images";
import { toast } from "sonner";

function PartnerLogo({ url, name, itemType }: { url?: string; name: string; itemType?: string }) {
  const [error, setError] = useState(false);

  if (!url || error) {
    return (
      <div className="size-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0 text-brand-600 dark:text-brand-400 font-bold text-xs">
        {name ? name.slice(0, 3).toUpperCase() : <Building2 size={18} />}
      </div>
    );
  }

  return (
    <div className="size-12 rounded-xl bg-white dark:bg-slate-800 border p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
      <img
        src={getAdminImageUrl(url)}
        alt={name}
        onError={() => setError(true)}
        className="max-h-8 max-w-full object-contain"
      />
    </div>
  );
}

export function PartnersManagerPage() {
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      const res = await api.get("/api/admin/masters/partners");
      setItems(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load partners.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await api.post("/api/admin/masters/partners", editingItem);
        toast.success("Partner/Licence added.");
      } else {
        await api.put(`/api/admin/masters/partners/${editingItem.id}`, editingItem);
        toast.success("Partner/Licence updated.");
      }
      setEditingItem(null);
      setIsNew(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to save partner.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/masters/partners/${deleteId}`);
      toast.success("Deleted successfully.");
      setDeleteId(null);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Partners &amp; Regulatory Licences</h1>
          <p className="text-xs text-slate-500 mt-1">Manage institutional partners (LIC, HDFC, Turtlemint) and IRDAI/AMFI registrations.</p>
        </div>
        <button
          onClick={() => {
            setEditingItem({ item_type: "partner", name: "", category: "Insurance", tagline: "", logo_url: "", is_active: true });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus size={14} /> Add Partner / Licence
        </button>
      </div>

      {editingItem && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isNew ? "New Entry" : "Edit Entry"}</h3>
            <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Item Type</label>
              <select
                value={editingItem.item_type}
                onChange={(e) => setEditingItem({ ...editingItem, item_type: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              >
                <option value="partner">Institution Partner (Carousel Display)</option>
                <option value="credential">Official Regulatory Licence (IRDAI / AMFI)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name</label>
              <input
                type="text"
                required
                value={editingItem.name}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Category Tag</label>
              <input
                type="text"
                placeholder="e.g. Life & Health"
                value={editingItem.category || ""}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tagline / Licence Note</label>
              <input
                type="text"
                placeholder="e.g. Registered Mutual Fund & SIP Distribution"
                value={editingItem.tagline || ""}
                onChange={(e) => setEditingItem({ ...editingItem, tagline: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Registration / Licence Number</label>
              <input
                type="text"
                placeholder="e.g. POSP-GJ-10492 or ARN-XXXXX"
                value={editingItem.registration_number || ""}
                onChange={(e) => setEditingItem({ ...editingItem, registration_number: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <MediaUploader
                label="Partner Logo"
                value={editingItem.logo_url}
                onChange={(url) => setEditingItem({ ...editingItem, logo_url: url })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <PartnerLogo url={item.logo_url} name={item.name} itemType={item.item_type} />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.item_type}</span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.tagline}</p>
                </div>
              </div>
            </div>

            {item.registration_number && (
              <div className="font-mono text-[11px] text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-1 rounded">
                Reg: {item.registration_number}
              </div>
            )}

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setEditingItem(item);
                  setIsNew(false);
                }}
                className="p-1.5 text-slate-400 hover:text-brand-600"
              >
                <Edit3 size={14} />
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-slate-400 hover:text-red-600">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Delete Partner/Credential"
        message="Are you sure you want to remove this partner or licence entry?"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
