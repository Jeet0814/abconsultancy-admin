import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { api } from "../lib/api";
import { getAdminImageUrl } from "../lib/images";
import { toast } from "sonner";

type MediaUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
};

export function MediaUploader({ value, onChange, label = "Upload Image", helperText }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be under 5 MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post<{ url: string }>("/api/admin/media/upload", formData);
      if (res.data?.url) {
        onChange(res.data.url);
        toast.success("Image uploaded and optimized.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}

      {value ? (
        <div className="relative inline-block border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 p-1 group">
          <img src={getAdminImageUrl(value)} alt="Preview" className="h-28 w-44 object-contain rounded-lg" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-2xl p-6 cursor-pointer bg-slate-50/50 dark:bg-slate-900/50 hover:bg-brand-50/20 transition-all"
        >
          {uploading ? (
            <Loader2 className="animate-spin text-brand-600 size-6" />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <Upload size={18} />
              </span>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Click to upload <span className="font-normal text-slate-500">or drag & drop</span>
              </p>
              <p className="text-[10px] text-slate-400">PNG, JPG, WebP, SVG up to 5MB (Auto-optimized to WebP)</p>
            </div>
          )}
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      {helperText && <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}
