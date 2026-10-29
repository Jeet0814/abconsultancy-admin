import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Clock,
  User,
  ShieldAlert,
  Send,
  Pin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { ConfirmModal } from "../components/ConfirmModal";
import { toast } from "sonner";

export function InquiryDetailPage({ inquiryId, onBack }: { inquiryId: number; onBack: () => void }) {
  const [inquiry, setInquiry] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Note form state
  const [noteText, setNoteText] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [submittingNote, setSubmittingNote] = useState(false);

  // Status update state
  const [status, setStatus] = useState("");
  const [statusRemarks, setStatusRemarks] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchDetail = async () => {
    try {
      const [res, usersRes] = await Promise.all([
        api.get(`/api/admin/inquiries/${inquiryId}`),
        api.get("/api/admin/users").catch(() => ({ data: [] })),
      ]);
      setInquiry(res.data);
      setStatus(res.data.status);
      setUsers(usersRes.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load inquiry details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [inquiryId]);

  const handleStatusChange = async () => {
    try {
      await api.patch(`/api/admin/inquiries/${inquiryId}/status`, {
        status,
        remarks: statusRemarks,
      });
      toast.success("Status updated successfully.");
      setShowStatusModal(false);
      setStatusRemarks("");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  const handleQuickContacted = async () => {
    try {
      await api.patch(`/api/admin/inquiries/${inquiryId}/status`, {
        status: "Contacted",
        remarks: "Quick action: Marked as Contacted via Admin Cockpit",
      });
      toast.success("Marked as Contacted.");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      await api.patch(`/api/admin/inquiries/${inquiryId}/priority`, { priority: newPriority });
      toast.success(`Priority set to ${newPriority}`);
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to update priority.");
    }
  };

  const handleAssignUser = async (userId: number | null) => {
    try {
      await api.patch(`/api/admin/inquiries/${inquiryId}/assign`, { assignedToUserId: userId });
      toast.success("Staff assignment updated.");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign user.");
    }
  };

  const handleFollowUpChange = async (dateStr: string) => {
    try {
      await api.patch(`/api/admin/inquiries/${inquiryId}/follow-up`, { followUpDate: dateStr || null });
      toast.success("Follow-up date updated.");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to set follow up.");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setSubmittingNote(true);
    try {
      await api.post(`/api/admin/inquiries/${inquiryId}/notes`, { noteText, isPinned });
      toast.success("Internal note added.");
      setNoteText("");
      setIsPinned(false);
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to add note.");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await api.delete(`/api/admin/inquiries/notes/${noteId}`);
      toast.success("Note deleted.");
      fetchDetail();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note.");
    }
  };

  const handleDeleteInquiry = async () => {
    try {
      await api.delete(`/api/admin/inquiries/${inquiryId}`);
      toast.success("Inquiry deleted successfully.");
      onBack();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete inquiry.");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400">
        <Loader2 className="animate-spin inline-block mr-2" size={24} /> Loading inquiry details...
      </div>
    );
  }

  if (!inquiry) return null;

  const cleanPhone = inquiry.phone.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to all inquiries
        </button>

        <div className="flex items-center gap-2">
          {inquiry.status === "New" && (
            <button
              onClick={handleQuickContacted}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={14} /> Mark Contacted
            </button>
          )}

          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
            title="Delete Inquiry"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Detail Header & Client Info */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg border border-brand-200/60 dark:border-brand-800">
                {inquiry.reference_no}
              </span>
              <StatusBadge status={inquiry.status} />
              <PriorityBadge priority={inquiry.priority} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{inquiry.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Service: <strong className="text-slate-700 dark:text-slate-300">{inquiry.service_requested}</strong> • Submitted:{" "}
              {new Date(inquiry.created_at).toLocaleString()}
            </p>
          </div>

          {/* Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`tel:${inquiry.phone}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs"
            >
              <Phone size={14} className="text-brand-600" /> Call Client
            </a>

            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${inquiry.name}, thank you for reaching out to A B Taxway Consultancy regarding ${inquiry.service_requested}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              <MessageCircle size={14} /> WhatsApp Chat
            </a>

            {inquiry.email && (
              <a
                href={`mailto:${inquiry.email}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs"
              >
                <Mail size={14} className="text-brand-600" /> Email
              </a>
            )}
          </div>
        </div>

        {/* 2-Column Details: Meta controls & Message */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Metadata Controls */}
          <div className="md:col-span-1 space-y-4 text-xs">
            {/* Status Control */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Status</label>
              <select
                value={inquiry.status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setShowStatusModal(true);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-semibold"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Converted">Converted</option>
                <option value="Closed">Closed</option>
                <option value="Spam">Spam</option>
              </select>
            </div>

            {/* Priority Control */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Priority</label>
              <select
                value={inquiry.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-semibold"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            {/* Assignment */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Assigned Staff</label>
              <select
                value={inquiry.assigned_to_user_id || ""}
                onChange={(e) => handleAssignUser(e.target.value ? Number(e.target.value) : null)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-semibold"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Follow-up Date */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">Follow-up Scheduled</label>
              <input
                type="date"
                value={inquiry.follow_up_date ? inquiry.follow_up_date.split("T")[0] : ""}
                onChange={(e) => handleFollowUpChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5"
              />
            </div>
          </div>

          {/* Client Message Payload */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Requirement Message</label>
              <div className="mt-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                {inquiry.message}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-slate-50/60 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block">Source Channel:</span>
                <strong className="text-slate-700 dark:text-slate-300">{inquiry.source_channel}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">IP / Network:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{inquiry.ip_address || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section: Internal Notes & Timeline History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Internal Notes */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Internal Consultation Notes</h3>

          <form onSubmit={handleAddNote} className="space-y-2">
            <textarea
              rows={3}
              placeholder="Add call notes, client documents received, tax discussion points..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-brand-600"
                />
                Pin note to top
              </label>
              <button
                type="submit"
                disabled={submittingNote || !noteText.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs"
              >
                <Send size={12} /> Post Note
              </button>
            </div>
          </form>

          {/* Notes List */}
          <div className="space-y-3 pt-2">
            {(inquiry.notes || []).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No notes added yet.</p>
            ) : (
              (inquiry.notes || []).map((n: any) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    n.is_pinned
                      ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200/70 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      {n.is_pinned && <Pin size={12} className="text-amber-600" />} {n.author_name || "Staff"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{new Date(n.created_at).toLocaleDateString()}</span>
                      <button
                        onClick={() => handleDeleteNote(n.id)}
                        className="text-slate-400 hover:text-red-600 p-0.5"
                        title="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{n.note_text}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status History Timeline */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Activity &amp; Status Timeline</h3>

          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {(inquiry.history || []).map((h: any) => (
              <div key={h.id} className="relative pl-8 text-xs space-y-1">
                <span className="absolute left-1.5 top-1 size-3 rounded-full bg-brand-600 ring-4 ring-white dark:ring-slate-900" />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">
                    {h.old_status ? `${h.old_status} → ` : "Initial: "}
                    <span className="text-brand-600 dark:text-brand-400">{h.new_status}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{new Date(h.created_at).toLocaleString()}</span>
                </div>
                {h.remarks && <p className="text-slate-600 dark:text-slate-400 italic text-[11px]">{h.remarks}</p>}
                {h.changed_by_name && (
                  <span className="text-[10px] text-slate-400 block">By {h.changed_by_name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal with Remarks */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Confirm Status Change: <span className="text-brand-600">{status}</span>
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Remarks / Discussion Summary (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Discussed term plan quotes via phone; documents pending."
                value={statusRemarks}
                onChange={(e) => setStatusRemarks(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChange}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-brand-600 text-white shadow-xs"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Inquiry Record"
        message={`Are you sure you want to delete inquiry #${inquiry.reference_no}? This will archive the record and remove it from active CRM views.`}
        confirmLabel="Delete"
        isDestructive
        onConfirm={handleDeleteInquiry}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
