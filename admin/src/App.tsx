import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "./context/AuthContext";
import { AdminLayout } from "./components/AdminLayout";
import { LoginPage } from "./routes/Login";
import { DashboardPage } from "./routes/Dashboard";
import { InquiriesListPage } from "./routes/InquiriesList";
import { InquiryDetailPage } from "./routes/InquiryDetail";
import { ServicesManagerPage } from "./routes/ServicesManager";
import { TestimonialsManagerPage } from "./routes/TestimonialsManager";
import { FaqsManagerPage } from "./routes/FaqsManager";
import { KeyDatesManagerPage } from "./routes/KeyDatesManager";
import { ChecklistsManagerPage } from "./routes/ChecklistsManager";
import { PartnersManagerPage } from "./routes/PartnersManager";
import { SlidesManagerPage } from "./routes/SlidesManager";
import { SettingsManagerPage } from "./routes/SettingsManager";
import { UsersManagerPage } from "./routes/UsersManager";
import { AuditLogsViewerPage } from "./routes/AuditLogsViewer";
import { ProfilePage } from "./routes/ProfilePage";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

type RouteState = {
  route: string;
  inquiryId: number | null;
};

const VALID_ROUTES = [
  "dashboard",
  "inquiries",
  "services",
  "testimonials",
  "faqs",
  "key-dates",
  "checklists",
  "partners",
  "slides",
  "settings",
  "users",
  "audit",
  "profile",
];

function parseLocation(): RouteState {
  if (typeof window === "undefined") {
    return { route: "dashboard", inquiryId: null };
  }

  // Support both clean pathname and hash-based paths
  let path = window.location.pathname.replace(/^\/+|\/+$/g, "");
  if (!path && window.location.hash) {
    path = window.location.hash.replace(/^#\/?/, "");
  }

  if (!path || path === "login") {
    return { route: "dashboard", inquiryId: null };
  }

  if (path.startsWith("inquiries/")) {
    const rawId = path.split("/")[1];
    const id = rawId ? Number(rawId) : NaN;
    if (!isNaN(id)) {
      return { route: "inquiry-detail", inquiryId: id };
    }
  }

  if (VALID_ROUTES.includes(path)) {
    return { route: path, inquiryId: null };
  }

  return { route: "dashboard", inquiryId: null };
}

export function App() {
  const { user, loading } = useAuth();
  const [routeState, setRouteState] = useState<RouteState>(parseLocation);

  const activeRoute = routeState.route;
  const selectedInquiryId = routeState.inquiryId;

  const navigate = useCallback((route: string, inquiryId: number | null = null, replace = false) => {
    let targetPath = `/${route}`;
    if (route === "inquiry-detail" && inquiryId) {
      targetPath = `/inquiries/${inquiryId}`;
    } else if (route === "dashboard") {
      targetPath = `/`;
    }

    if (replace) {
      window.history.replaceState({ route, inquiryId }, "", targetPath);
    } else {
      window.history.pushState({ route, inquiryId }, "", targetPath);
    }

    setRouteState({ route, inquiryId });
  }, []);

  // Sync state when user clicks browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-brand-500" />
          <p className="text-xs font-semibold text-slate-400">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors />
        <LoginPage />
      </>
    );
  }

  const renderContent = () => {
    if (activeRoute === "inquiry-detail" && selectedInquiryId) {
      return (
        <InquiryDetailPage
          inquiryId={selectedInquiryId}
          onBack={() => {
            navigate("inquiries");
          }}
        />
      );
    }

    switch (activeRoute) {
      case "dashboard":
        return (
          <DashboardPage
            onSelectInquiry={(id) => {
              navigate("inquiry-detail", id);
            }}
          />
        );
      case "inquiries":
        return (
          <InquiriesListPage
            onSelectInquiry={(id) => {
              navigate("inquiry-detail", id);
            }}
          />
        );
      case "services":
        return <ServicesManagerPage />;
      case "testimonials":
        return <TestimonialsManagerPage />;
      case "faqs":
        return <FaqsManagerPage />;
      case "key-dates":
        return <KeyDatesManagerPage />;
      case "checklists":
        return <ChecklistsManagerPage />;
      case "partners":
        return <PartnersManagerPage />;
      case "slides":
        return <SlidesManagerPage />;
      case "settings":
        return <SettingsManagerPage />;
      case "users":
        return <UsersManagerPage />;
      case "audit":
        return <AuditLogsViewerPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return (
          <DashboardPage
            onSelectInquiry={(id) => {
              navigate("inquiry-detail", id);
            }}
          />
        );
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <AdminLayout
        activeRoute={activeRoute}
        onNavigate={(route) => {
          navigate(route);
        }}
      >
        {renderContent()}
      </AdminLayout>
    </>
  );
}
