import React, { useState } from "react";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ user: any; accessToken: string }>("/api/auth/login", {
        email,
        password,
      });

      if (res.data?.user) {
        login({ user: res.data.user });
        toast.success(`Welcome back, ${res.data.user.name}!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex size-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-black text-2xl items-center justify-center shadow-lg shadow-brand-500/20">
            AB
          </div>
          <h1 className="text-2xl font-bold tracking-tight">A B Taxway Consultancy</h1>
          <p className="text-xs text-slate-400">Secure Administrative Management Cockpit</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-7 sm:p-8 rounded-3xl shadow-2xl space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Staff Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@abtaxway.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-brand-400" /> 256-bit Encrypted Session
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Signing in...
                </>
              ) : (
                <>
                  Sign in to Cockpit <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Authorized personnel only. All access and activity is logged.
        </p>
      </div>
    </div>
  );
}
