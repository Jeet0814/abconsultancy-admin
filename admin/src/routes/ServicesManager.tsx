import React, { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2, Edit3, Check, Loader2, Save } from "lucide-react";
import { api } from "../lib/api";
import { toast } from "sonner";

export function ServicesManagerPage() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get("/api/admin/masters/services");
      setServices(res.data || []);
      if (res.data?.length > 0 && !selectedService) {
        loadServiceDetail(res.data[0].id);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const loadServiceDetail = async (id: number) => {
    try {
      const res = await api.get(`/api/admin/masters/services/${id}`);
      setSelectedService(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load service detail.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setSaving(true);
    try {
      await api.put(`/api/admin/masters/services/${selectedService.id}`, selectedService);
      toast.success("Service updated successfully.");
      fetchServices();
    } catch (err: any) {
      toast.error(err.message || "Failed to update service.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services Management</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Edit service descriptions, sub-offerings, target audiences, and keep-ready checklists.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Service Selector Tabs */}
        <div className="space-y-2 lg:col-span-1">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => loadServiceDetail(s.id)}
              className={`w-full text-left p-3.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                selectedService?.id === s.id
                  ? "bg-brand-50 dark:bg-brand-950/70 border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-300 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 block mb-1">#{s.number_label}</span>
              <span className="font-bold text-sm block">{s.title}</span>
              <span className="text-[11px] font-normal text-slate-500 line-clamp-1 mt-0.5">{s.badge}</span>
            </button>
          ))}
        </div>

        {/* Edit Form */}
        {selectedService && (
          <form
            onSubmit={handleSave}
            className="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedService.title}</h2>
                <span className="text-xs font-mono text-slate-400">/{selectedService.slug}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Changes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Service Title</label>
                <input
                  type="text"
                  value={selectedService.title}
                  onChange={(e) => setSelectedService({ ...selectedService, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Badge Label</label>
                <input
                  type="text"
                  value={selectedService.badge}
                  onChange={(e) => setSelectedService({ ...selectedService, badge: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Short Summary</label>
              <input
                type="text"
                value={selectedService.short_description}
                onChange={(e) => setSelectedService({ ...selectedService, short_description: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Description</label>
              <textarea
                rows={3}
                value={selectedService.full_description}
                onChange={(e) => setSelectedService({ ...selectedService, full_description: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs resize-none"
              />
            </div>

            {/* Sub-Offerings ("What We Help With") */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What We Help With (Features)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedService({
                      ...selectedService,
                      features: [
                        ...(selectedService.features || []),
                        { title: "New Feature", description: "Details...", icon_name: "CheckCircle2" },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                >
                  <Plus size={13} /> Add Feature
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(selectedService.features || []).map((f: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={f.title}
                        onChange={(e) => {
                          const updated = [...selectedService.features];
                          updated[idx].title = e.target.value;
                          setSelectedService({ ...selectedService, features: updated });
                        }}
                        className="font-bold text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-brand-500 focus:outline-none w-full mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = selectedService.features.filter((_: any, i: number) => i !== idx);
                          setSelectedService({ ...selectedService, features: updated });
                        }}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={f.description}
                      onChange={(e) => {
                        const updated = [...selectedService.features];
                        updated[idx].description = e.target.value;
                        setSelectedService({ ...selectedService, features: updated });
                      }}
                      className="w-full bg-transparent text-[11px] text-slate-600 dark:text-slate-400 focus:outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
