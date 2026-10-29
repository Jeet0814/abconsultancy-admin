import React, { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  ShieldCheck,
  MessageSquareQuote,
  HelpCircle,
  Calendar,
  CheckSquare,
  Building2,
  Image as ImageIcon,
  Settings,
  Users,
  History,
  User,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

type AdminLayoutProps = {
  children: React.ReactNode;
  activeRoute: string;
  onNavigate: (route: string) => void;
};

export function AdminLayout({ children, activeRoute, onNavigate }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const publicWebsiteUrl =
    typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
      ? "http://localhost:3000"
      : (import.meta.env.VITE_PUBLIC_URL || "https://abconsultancy.vercel.app");

  const navSections = [
    {
      title: "Overview & CRM",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "inquiries", label: "Enquiries & Leads", icon: Inbox },
      ],
    },
    {
      title: "Content Masters",
      items: [
        { id: "services", label: "Services", icon: ShieldCheck },
        { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
        { id: "faqs", label: "FAQs", icon: HelpCircle },
        { id: "key-dates", label: "Compliance Dates", icon: Calendar },
        { id: "checklists", label: "Checklists", icon: CheckSquare },
        { id: "partners", label: "Partners & Licences", icon: Building2 },
        { id: "slides", label: "Hero Carousel", icon: ImageIcon },
      ],
    },
    {
      title: "Configuration",
      items: [
        { id: "settings", label: "Site & Founder Settings", icon: Settings },
        ...(user?.role === "super_admin"
          ? [
              { id: "users", label: "User Management", icon: Users },
              { id: "audit", label: "Audit Logs", icon: History },
            ]
          : []),
        { id: "profile", label: "Profile & Security", icon: User },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-brand-600 text-white font-bold grid place-items-center text-sm shadow-md">
            AB
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 dark:text-white leading-none">A B Taxway</h1>
            <span className="text-[10px] text-slate-500">Admin Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Sidebar for Desktop / Mobile Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-bold grid place-items-center text-base shadow-md">
                AB
              </div>
              <div>
                <h1 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">A B Taxway</h1>
                <span className="text-[11px] font-medium text-brand-600 dark:text-brand-400">Admin Cockpit</span>
              </div>
            </div>
            <a
              href={publicWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors"
              title="Open Live Website"
            >
              <ExternalLink size={15} />
            </a>
          </div>

          {/* Navigation Links Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {sec.title}
                </p>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 font-bold border border-brand-200/60 dark:border-brand-800/60 shadow-xs"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                      }`}
                    >
                      <Icon size={17} className={isActive ? "text-brand-600 dark:text-brand-400" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Footer Actions */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 text-xs font-bold grid place-items-center shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name}</p>
                  <span className="inline-block text-[10px] uppercase font-semibold text-brand-600 dark:text-brand-400">
                    {user?.role?.replace("_", " ")}
                  </span>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className="hidden md:grid size-8 place-items-center rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
