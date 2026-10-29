export function getAdminImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  if (url.startsWith("/uploads/")) {
    const apiBase = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";
    return `${apiBase}${url}`;
  }
  return url;
}

