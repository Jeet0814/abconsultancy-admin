import React from "react";

type StatusType = "New" | "Contacted" | "In Progress" | "Follow-up" | "Converted" | "Closed" | "Spam" | "pending" | "approved" | "rejected";

export function StatusBadge({ status }: { status: StatusType | string }) {
  let styles = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

  switch (status) {
    case "New":
    case "pending":
      styles = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
      break;
    case "Contacted":
      styles = "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-800";
      break;
    case "In Progress":
      styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
      break;
    case "Follow-up":
      styles = "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
      break;
    case "Converted":
    case "approved":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
      break;
    case "Closed":
      styles = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
      break;
    case "Spam":
    case "rejected":
      styles = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles}`}>
      {status}
    </span>
  );
}
