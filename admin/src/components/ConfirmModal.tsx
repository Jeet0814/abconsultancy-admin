import React from "react";
import { AlertTriangle, X } from "lucide-react";

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className={`p-2.5 rounded-xl ${isDestructive ? "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400" : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"}`}>
              <AlertTriangle size={22} />
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-xl shadow-sm transition-colors ${
              isDestructive ? "bg-red-600 hover:bg-red-700" : "bg-brand-600 hover:bg-brand-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
