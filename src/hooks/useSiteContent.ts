import { useEffect, useState, useCallback } from "react";
import { siteConfig } from "@/config/site";
import { services as fallbackServices, keyDates as fallbackKeyDates, checklists as fallbackChecklists, faqs as fallbackFaqs } from "@/lib/site-content";
import { partners as fallbackPartners } from "@/components/PartnerCarousel";
import { initialTestimonials as fallbackTestimonials } from "@/config/testimonials";

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env["VITE_API_URL"] || process.env["API_URL"] || "http://localhost:5000";
  }
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }
  return "";
}

export function getPublicImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  if (url.startsWith("/uploads/")) {
    return `${getApiBaseUrl()}${url}`;
  }
  return url;
}

export type SiteSettings = {
  brand_name?: string;
  brand_full_name?: string;
  tagline?: string;
  since_year?: number | string;
  advisor_name?: string;
  advisor_title?: string;
  phone_display?: string;
  phone_raw?: string;
  whatsapp_number?: string;
  email_address?: string;
  office_hours?: string;
  address_title?: string;
  address_line1?: string;
  address_city?: string;
  address_pincode?: string;
  google_maps_url?: string;
  google_maps_embed_url?: string;
  office_photo_url?: string;
  [key: string]: any;
};

export type DynamicSiteContent = {
  settings: SiteSettings;
  services: any[];
  testimonials: any[];
  generalFaqs: any[];
  keyDates: any[];
  checklists: any[];
  partners: any[];
  officialCredentials: any[];
  about: {
    founder: any;
    values: any[];
    milestones: any[];
  };
  slides: any[];
};

const DEFAULT_CONTENT: DynamicSiteContent = {
  settings: {
    brand_name: siteConfig.brand.name,
    brand_full_name: siteConfig.brand.fullName,
    tagline: siteConfig.brand.tagline,
    since_year: siteConfig.brand.since,
    advisor_name: siteConfig.contact.name,
    advisor_title: siteConfig.contact.title,
    phone_display: siteConfig.contact.phoneDisplay,
    phone_raw: siteConfig.contact.tel,
    whatsapp_number: siteConfig.contact.whatsapp,
    email_address: siteConfig.contact.email,
    office_hours: siteConfig.contact.hours,
    address_title: siteConfig.contact.address.title,
    address_line1: siteConfig.contact.address.line1,
    address_city: siteConfig.contact.address.city,
    address_pincode: siteConfig.contact.address.pincode,
    google_maps_url: siteConfig.contact.address.googleMapsUrl,
    google_maps_embed_url: siteConfig.contact.address.googleMapsEmbedUrl,
  },
  services: fallbackServices,
  testimonials: fallbackTestimonials,
  generalFaqs: fallbackFaqs as any,
  keyDates: fallbackKeyDates as any,
  checklists: fallbackChecklists as any,
  partners: fallbackPartners,
  officialCredentials: siteConfig.officialCredentials,
  about: {
    founder: siteConfig.founder,
    values: siteConfig.values,
    milestones: siteConfig.milestones,
  },
  slides: [],
};

let cachedContent: DynamicSiteContent | null = null;
let listeners: Array<(c: DynamicSiteContent) => void> = [];

function notifyListeners(nextContent: DynamicSiteContent) {
  cachedContent = nextContent;
  listeners.forEach((listener) => listener(nextContent));
}

export function useSiteContent() {
  const [content, setContent] = useState<DynamicSiteContent>(cachedContent || DEFAULT_CONTENT);
  const [loading, setLoading] = useState(!cachedContent);

  const fetchDynamicContent = useCallback(async () => {
    const baseUrl = getApiBaseUrl();
    try {
      const res = await fetch(`${baseUrl}/api/public/content`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          notifyListeners(json.data);
        }
      }
    } catch {
      // Graceful fallback to default content if backend is offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = (newContent: DynamicSiteContent) => {
      setContent(newContent);
    };

    listeners.push(handleUpdate);

    // Initial fetch
    fetchDynamicContent();

    // Re-synchronize automatically when user switches back to this tab from Admin
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchDynamicContent();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      listeners = listeners.filter((l) => l !== handleUpdate);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [fetchDynamicContent]);

  const getWhatsappLink = useCallback(
    (text?: string) => {
      const num = (content.settings?.whatsapp_number || siteConfig.contact.whatsapp || "").replace(/\D/g, "");
      const msg = text ? encodeURIComponent(text) : encodeURIComponent("Hello, I'd like to enquire about your services.");
      return `https://wa.me/${num}?text=${msg}`;
    },
    [content.settings?.whatsapp_number]
  );

  return {
    content,
    loading,
    defaultContent: DEFAULT_CONTENT,
    refetch: fetchDynamicContent,
    getWhatsappLink,
  };
}
