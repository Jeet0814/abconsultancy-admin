import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit3, Shield, X, UserCheck, UserX } from "lucide-react";
import { api } from "../lib/api";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";

export function UsersManagerPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNew) {
        await api.post("/api/admin/users", editingUser);
        toast.success("User account created.");
      } else {
        await api.put(`/api/admin/users/${editingUser.id}`, editingUser);
        toast.success("User updated.");
      }
      setEditingUser(null);
      setIsNew(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save user.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/api/admin/users/${deleteId}`);
      toast.success("User removed.");
      setDeleteId(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Staff &amp; User Management</h1>
          <p className="text-xs text-slate-500 mt-1">Super Admin control: Manage staff logins, roles, and access credentials.</p>
        </div>
        <button
          onClick={() => {
            setEditingUser({ name: "", email: "", role: "staff", password: "", is_active: true });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs"
        >
          <Plus size={14} /> Add User
        </button>
      </div>

      {editingUser && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-brand-200 dark:border-brand-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isNew ? "Create Staff Account" : "Edit User"}</h3>
            <button type="button" onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={editingUser.name}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                required
                value={editingUser.email}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Role</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="staff">Staff (Inquiries &amp; Consult Notes)</option>
                <option value="admin">Admin (Full Content &amp; CRM Access)</option>
                <option value="super_admin">Super Admin (Full System &amp; User Control)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {isNew ? "Initial Password" : "Set New Password (Leave blank to keep existing)"}
              </label>
              <input
                type="password"
                required={isNew}
                placeholder="••••••••••••"
                value={editingUser.password || ""}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">
              Save User
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Last Login</th>
              <th className="p-4 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-mono">{u.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4">
                  {u.is_active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <UserCheck size={13} /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500 font-semibold">
                      <UserX size={13} /> Inactive
                    </span>
                  )}
                </td>
                <td className="p-4 text-slate-400 text-[11px]">
                  {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "Never"}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setIsNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-600"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(u.id)} className="p-1.5 text-slate-400 hover:text-red-600">
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
        title="Delete User Account"
        message="Are you sure you want to delete this staff user account?"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
