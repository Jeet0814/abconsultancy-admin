import React, { useState } from "react";
import { Lock, User, ShieldCheck, Key, Save, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { toast } from "sonner";

export function ProfilePage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully! Please log in again.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile &amp; Security</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your administrator account credentials and password.</p>
      </div>

      {/* Account Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User size={15} /> Logged In Account
        </h2>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Name:</span>
            <strong className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Email:</span>
            <strong className="text-sm font-bold font-mono text-slate-900 dark:text-white">{user?.email}</strong>
          </div>
          <div>
            <span className="text-slate-400 block">Role:</span>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
              {user?.role?.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Key size={15} /> Change Security Password
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">New Password (Min 8 characters, uppercase, number & symbol)</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white py-2.5 px-4 rounded-xl text-xs font-semibold shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
