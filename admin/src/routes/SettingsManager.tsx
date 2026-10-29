import React, { useEffect, useState } from "react";
import { Save, Loader2, Sparkles, User, MapPin, Phone, Building2 } from "lucide-react";
import { api } from "../lib/api";
import { MediaUploader } from "../components/MediaUploader";
import { toast } from "sonner";

export function SettingsManagerPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/api/admin/settings");
      setData(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSettingChange = (key: string, value: string) => {
    const list = data?.settings || [];
    const exists = list.some((s: any) => s.setting_key === key);
    const updatedSettings = exists
      ? list.map((s: any) => (s.setting_key === key ? { ...s, setting_value: value } : s))
      : [...list, { setting_group: "general", setting_key: key, setting_value: value, setting_type: "text" }];
    setData({ ...data, settings: updatedSettings });
  };

  const getSettingValue = (key: string, defaultVal = "") => {
    const item = (data?.settings || []).find((s: any) => s.setting_key === key);
    return item ? item.setting_value : defaultVal;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/admin/settings", {
        settings: data.settings,
        founder: data.founder,
        values: data.values,
      });
      toast.success("Site and founder settings updated successfully!");
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading settings...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site &amp; Founder Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Authoritative business identity, direct contact channels, office location, and founder profile.</p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save All Changes
        </button>
      </div>

      {/* 1. Brand & Identity */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles size={15} /> Brand &amp; Identity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Short Name</label>
            <input
              type="text"
              value={getSettingValue("brand_name")}
              onChange={(e) => handleSettingChange("brand_name", e.target.value)}
              placeholder="e.g. A B Taxway"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brand Full Official Name</label>
            <input
              type="text"
              value={getSettingValue("brand_full_name")}
              onChange={(e) => handleSettingChange("brand_full_name", e.target.value)}
              placeholder="e.g. A B Taxway Consultancy"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tagline / Motto</label>
            <input
              type="text"
              value={getSettingValue("tagline")}
              onChange={(e) => handleSettingChange("tagline", e.target.value)}
              placeholder="e.g. Helping Build The Wealthy Life"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Established / Since Year</label>
            <input
              type="number"
              value={getSettingValue("since_year")}
              onChange={(e) => handleSettingChange("since_year", e.target.value)}
              placeholder="e.g. 2004"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* 2. Business & Contact Details */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Phone size={15} /> Direct Contact &amp; Channels
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Display Phone Number</label>
            <input
              type="text"
              value={getSettingValue("phone_display")}
              onChange={(e) => handleSettingChange("phone_display", e.target.value)}
              placeholder="e.g. +91 94268 44926"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
            <span className="text-[10px] text-slate-400">Shown in header, footer, and contact buttons.</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">WhatsApp Number</label>
            <input
              type="text"
              value={getSettingValue("whatsapp_number")}
              onChange={(e) => handleSettingChange("whatsapp_number", e.target.value)}
              placeholder="e.g. 919426844926"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
            />
            <span className="text-[10px] text-slate-400">International format with country code, no + or spaces.</span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Official Email</label>
            <input
              type="email"
              value={getSettingValue("email_address")}
              onChange={(e) => handleSettingChange("email_address", e.target.value)}
              placeholder="e.g. abtaxway@gmail.com"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Office Working Hours</label>
            <input
              type="text"
              value={getSettingValue("office_hours")}
              onChange={(e) => handleSettingChange("office_hours", e.target.value)}
              placeholder="e.g. Monday - Saturday: 10:00 AM - 7:00 PM"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 3. Office Location & Map */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <MapPin size={15} /> Office Location &amp; Address
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Address Line (Building / Street)</label>
            <input
              type="text"
              value={getSettingValue("address_line1")}
              onChange={(e) => handleSettingChange("address_line1", e.target.value)}
              placeholder="e.g. Office No. 12, Commercial Plaza, Main Market"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">City &amp; State</label>
            <input
              type="text"
              value={getSettingValue("address_city")}
              onChange={(e) => handleSettingChange("address_city", e.target.value)}
              placeholder="e.g. Ahmedabad, Gujarat"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Postal / PIN Code</label>
            <input
              type="text"
              value={getSettingValue("address_pincode")}
              onChange={(e) => handleSettingChange("address_pincode", e.target.value)}
              placeholder="e.g. 380001"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Google Maps Direction URL (Link)</label>
            <input
              type="text"
              value={getSettingValue("google_maps_url")}
              onChange={(e) => handleSettingChange("google_maps_url", e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Google Maps Embed URL (Iframe)</label>
            <input
              type="text"
              value={getSettingValue("google_maps_embed_url")}
              onChange={(e) => handleSettingChange("google_maps_embed_url", e.target.value)}
              placeholder="https://maps.google.com/maps?q=...&output=embed"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 4. Founder & Advisory Profile */}
      {data.founder && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User size={15} /> Principal Advisor &amp; Founder Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Founder &amp; Principal Advisor Name</label>
              <input
                type="text"
                value={data.founder.name}
                onChange={(e) => setData({ ...data, founder: { ...data.founder, name: e.target.value } })}
                placeholder="e.g. Anilkumarsingh Bhadauria"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role Title</label>
              <input
                type="text"
                value={data.founder.role}
                onChange={(e) => setData({ ...data, founder: { ...data.founder, role: e.target.value } })}
                placeholder="e.g. Founder & Principal Advisor"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Qualifications &amp; Practice Domain</label>
              <input
                type="text"
                value={data.founder.qualifications}
                onChange={(e) => setData({ ...data, founder: { ...data.founder, qualifications: e.target.value } })}
                placeholder="e.g. Financial Advisor, Tax Practitioner & General Insurance Specialist"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Founder Biography</label>
              <textarea
                rows={3}
                value={data.founder.bio}
                onChange={(e) => setData({ ...data, founder: { ...data.founder, bio: e.target.value } })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs resize-none"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <MediaUploader
                label="Founder Official Photograph"
                value={data.founder.photo}
                onChange={(url) => setData({ ...data, founder: { ...data.founder, photo: url } })}
                helperText="If left empty, an initials avatar badge is displayed automatically on the public site."
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky-like Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02]"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save All Changes
        </button>
      </div>
    </form>
  );
}
