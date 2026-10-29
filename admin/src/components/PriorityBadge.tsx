import React from "react";

export function PriorityBadge({ priority }: { priority: "Low" | "Medium" | "High" | "Urgent" | string }) {
  let styles = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";

  switch (priority) {
    case "Low":
      styles = "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
      break;
    case "Medium":
      styles = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300";
      break;
    case "High":
      styles = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300";
      break;
    case "Urgent":
      styles = "bg-red-50 text-red-700 border-red-200 animate-pulse dark:bg-red-950/60 dark:text-red-300";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${styles}`}>
      {priority}
    </span>
  );
}
