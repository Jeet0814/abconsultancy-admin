import React, { useEffect, useState } from "react";
import { Plus, Trash2, Save, CheckSquare } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function ChecklistsManagerPage() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchChecklists = async () => {
    try {
      const res = await api.get("/api/admin/masters/checklists");
      setChecklists(res.data || []);
      if (res.data?.length > 0 && !selectedChecklist) {
        setSelectedChecklist(res.data[0]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load checklists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChecklist) return;

    setSaving(true);
    try {
      await api.put(`/api/admin/masters/checklists/${selectedChecklist.id}`, {
        title: selectedChecklist.title,
        category: selectedChecklist.category,
        items: (selectedChecklist.items || []).map((i: any) => (typeof i === "string" ? i : i.item_text)),
      });
      toast.success("Checklist updated successfully.");
      fetchChecklists();
    } catch (err: any) {
      toast.error(err.message || "Failed to update checklist.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document Checklists</h1>
        <p className="text-xs text-slate-500 mt-1">Manage client document preparation lists for ITR and GST.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector */}
        <div className="space-y-2 lg:col-span-1">
          {checklists.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedChecklist(c)}
              className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedChecklist?.id === c.id
                  ? "bg-brand-50 dark:bg-brand-950/70 border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
              }`}
            >
              <span className="font-bold text-sm block">{c.title}</span>
              <span className="text-[11px] font-normal text-slate-400 block mt-0.5">{c.category}</span>
            </button>
          ))}
        </div>

        {/* Editor */}
        {selectedChecklist && (
          <form
            onSubmit={handleSave}
            className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">{selectedChecklist.title}</h3>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
              >
                <Save size={14} /> Save Checklist
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Document Items Required</label>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedChecklist({
                      ...selectedChecklist,
                      items: [...(selectedChecklist.items || []), { item_text: "New Document Requirement" }],
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  <Plus size={13} /> Add Item
                </button>
              </div>

              <div className="space-y-2">
                {(selectedChecklist.items || []).map((item: any, idx: number) => {
                  const textVal = typeof item === "string" ? item : item.item_text;
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                      <input
                        type="text"
                        value={textVal}
                        onChange={(e) => {
                          const updated = [...selectedChecklist.items];
                          updated[idx] = { item_text: e.target.value };
                          setSelectedChecklist({ ...selectedChecklist, items: updated });
                        }}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedChecklist.items.filter((_: any, i: number) => i !== idx);
                          setSelectedChecklist({ ...selectedChecklist, items: updated });
                        }}
                        className="p-2 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
