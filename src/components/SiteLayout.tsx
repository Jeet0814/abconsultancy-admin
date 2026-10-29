import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, ChevronDown, Mail, MapPin, Menu, MessageCircle, Moon, Phone, Sun, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { contact as fallbackContact, services as fallbackServices, whatsappLink as defaultWhatsappLink } from "@/lib/site-content";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ShieldCheck, TrendingUp, FileText, ReceiptText, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  insurance: ShieldCheck,
  investments: TrendingUp,
  "income-tax": FileText,
  gst: ReceiptText,
  ShieldCheck,
  TrendingUp,
  FileText,
  ReceiptText,
};

function getServiceIcon(slugOrName?: string): LucideIcon {
  if (!slugOrName) return ShieldCheck;
  return iconMap[slugOrName] || ShieldCheck;
}

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/insurance-advisor" as const, label: "Insurance Advisor" },
  { to: "/about" as const, label: "About" },
  { to: "/contact" as const, label: "Contact" },
];

function Brand({ scrolled = false }: { scrolled?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="A B Taxway Consultancy - Helping Build The Wealthy Life"
      className="group flex min-w-0 items-center gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-transform duration-200 hover:scale-[1.02]"
    >
      <img
        src="/ab-logo.jpg"
        alt="A B Taxway logo"
        width={44}
        height={44}
        className="size-11 shrink-0 rounded-xl object-contain bg-white p-0.5 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-shadow duration-300 group-hover:shadow-md"
      />
      <span className="min-w-0 leading-tight">
        <span
          className="block font-display text-base sm:text-lg font-bold tracking-tight text-foreground"
        >
          A B Taxway
        </span>
        <span
          className="block font-mono text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
        >
          CONSULTANCY
        </span>
        <span
          className="block text-[9px] sm:text-[10px] font-medium tracking-wide text-primary dark:text-sky-300"
        >
          Helping Build The Wealthy Life
        </span>
      </span>
    </Link>
  );
}

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { content } = useSiteContent();
  const currentServices = content.services && content.services.length > 0 ? content.services : fallbackServices;
  const currentContact = {
    ...fallbackContact,
    name: content.settings?.advisor_name || fallbackContact.name,
    title: content.settings?.advisor_title || fallbackContact.title,
    tel: content.settings?.phone_raw || fallbackContact.tel,
    phoneDisplay: content.settings?.phone_display || fallbackContact.phoneDisplay,
    whatsapp: content.settings?.whatsapp_number || fallbackContact.whatsapp,
    email: content.settings?.email_address || fallbackContact.email,
    address: {
      ...fallbackContact.address,
      line1: content.settings?.address_line1 || fallbackContact.address.line1,
      city: content.settings?.address_city || fallbackContact.address.city,
    },
  };

  const getDynamicWhatsappLink = (text?: string) => {
    if (content.settings?.whatsapp_number) {
      const num = content.settings.whatsapp_number.replace(/\D/g, "");
      const msg = text ? encodeURIComponent(text) : encodeURIComponent("Hello, I'd like to enquire about your services.");
      return `https://wa.me/${num}?text=${msg}`;
    }
    return defaultWhatsappLink(text);
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const path = useRouterState({ select: (s) => s.location.pathname });
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (currentScrollY <= 40) {
        setNavVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 6) {
        setNavVisible(false); // scrolling down
      } else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 6) {
        setNavVisible(true); // scrolling up
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMenuOpen(false);
    setMega(false);
  }, [path]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMega(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      {/* Modern Floating Navbar */}
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-40 transition-all duration-300 pointer-events-none",
          scrolled ? "pt-2.5 sm:pt-3" : "pt-4 sm:pt-5",
          navVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* LEFT: Logo & Wordmark sitting directly on page */}
          <div className="pointer-events-auto">
            <Brand scrolled={scrolled} />
          </div>

          {/* RIGHT: Floating Glass Pill Container for Desktop */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center pointer-events-auto"
            onMouseLeave={() => {
              setHovered(null);
              setMega(false);
            }}
          >
            <div
              className={cn(
                "relative flex items-center gap-1 rounded-[16px] p-1.5 transition-all duration-300",
                "backdrop-blur-[16px] border",
                scrolled
                  ? "bg-white/85 dark:bg-[#0B132B]/85 border-white/80 dark:border-white/10 shadow-[0_10px_35px_-4px_rgba(15,27,61,0.12)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
                  : "bg-white/65 dark:bg-[#0B132B]/65 border-white/50 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]"
              )}
            >
              {links.map((link) => {
                const active = path === link.to;
                const isServices = link.to === "/services";
                return (
                  <div
                    key={link.to}
                    className="relative"
                    onMouseEnter={() => {
                      setHovered(link.to);
                      if (isServices) setMega(true);
                    }}
                    onMouseLeave={() => {
                      if (isServices) setMega(false);
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="floating-nav-pill-active"
                        className="absolute inset-0 rounded-[10px] bg-white dark:bg-white/20 shadow-[0_2px_8px_rgba(15,27,61,0.08)] border border-black/5 dark:border-white/25"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {!active && hovered === link.to && (
                      <motion.span
                        layoutId="floating-nav-pill-hover"
                        className="absolute inset-0 rounded-[10px] bg-[#0F1B3D]/5 dark:bg-white/10"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Link
                      to={link.to}
                      aria-current={active ? "page" : undefined}
                      aria-expanded={isServices ? mega : undefined}
                      aria-haspopup={isServices ? "true" : undefined}
                      onFocus={() => isServices && setMega(true)}
                      className={cn(
                        "relative z-10 inline-flex items-center gap-1 rounded-[10px] px-3.5 py-2 font-mono text-[12px] uppercase tracking-[0.06em] transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "font-bold text-primary dark:text-white"
                          : "font-medium text-[#0F1B3D]/80 hover:text-[#0F1B3D] dark:text-slate-200 dark:hover:text-white"
                      )}
                    >
                      {link.label}
                      {isServices && (
                        <ChevronDown
                          size={12}
                          className={cn(
                            "transition-transform duration-200",
                            mega ? "rotate-180" : ""
                          )}
                        />
                      )}
                    </Link>

                    {/* Services Glass Dropdown */}
                    {isServices && (
                      <AnimatePresence>
                        {mega && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                            className="absolute left-1/2 top-full -translate-x-1/2 pt-2.5 w-[520px] z-50 pointer-events-auto"
                          >
                            <div className="glass-strong rounded-2xl border border-white/80 dark:border-white/10 bg-white/95 dark:bg-[#0B132B]/95 p-2.5 shadow-[0_20px_50px_rgba(15,27,61,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-[20px] grid grid-cols-2 gap-1.5">
                              {currentServices.map((serviceItem: any) => {
                                const { slug, title, short, icon, iconName } = serviceItem;
                                const Icon = icon || getServiceIcon(iconName || slug);
                                return (
                                  <Link
                                    key={slug}
                                    to="/services"
                                    hash={slug}
                                    onClick={() => setMega(false)}
                                    className="group flex gap-3 rounded-xl p-2.5 transition-all duration-150 hover:bg-[#0F1B3D]/5 dark:hover:bg-white/10 focus-visible:bg-[#0F1B3D]/5 outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                  >
                                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                                      <Icon size={18} />
                                    </span>
                                    <span className="min-w-0">
                                      <span className="block text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                        {title}
                                      </span>
                                      <span className="block text-[11px] leading-snug text-muted-foreground line-clamp-1">
                                        {short}
                                      </span>
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}

              {/* Theme toggle icon inside pill */}
              <button
                type="button"
                onClick={toggle}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="relative z-10 grid size-8 place-items-center rounded-[10px] text-[#0F1B3D] dark:text-slate-200 transition-colors duration-150 hover:bg-[#0F1B3D]/5 dark:hover:bg-white/10 outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
              >
                {dark ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {/* CTA Button nested inside pill */}
              <Link
                to="/contact"
                className="group relative z-10 ml-0.5 inline-flex items-center gap-1.5 rounded-[10px] bg-[#0F1B3D] hover:bg-[#182a5c] dark:bg-primary dark:hover:bg-primary/90 px-3.5 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.06em] text-white dark:text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-[1px] outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Book a consultation</span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </nav>

          {/* MOBILE: Hamburger round glass button */}
          <div className="flex items-center gap-2 md:hidden pointer-events-auto">
            <button
              type="button"
              onClick={toggle}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="grid size-11 place-items-center rounded-full border border-white/60 dark:border-white/10 bg-white/75 dark:bg-[#0B132B]/75 backdrop-blur-[16px] text-foreground shadow-sm active:scale-95 transition-transform"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="grid size-11 place-items-center rounded-full border border-white/60 dark:border-white/10 bg-white/75 dark:bg-[#0B132B]/75 backdrop-blur-[16px] text-foreground shadow-sm active:scale-95 transition-transform"
            >
              <motion.span
                key={menuOpen ? "x" : "m"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN GLASS DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-[#0F1B3D]/30 dark:bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              aria-label="Mobile menu"
              className="glass-strong fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col border-l border-white/60 dark:border-white/10 bg-white/95 dark:bg-[#0B132B]/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              <div className="flex items-center justify-between">
                <Brand scrolled={true} />
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="grid size-9 place-items-center rounded-xl bg-secondary text-foreground hover:bg-secondary/80"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-1.5">
                {links.map((link, i) => {
                  const active = path === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 + i * 0.04 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "block rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-[0.08em] font-semibold transition-colors",
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-secondary"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto grid gap-3 pt-6 border-t border-border/60">
                <Button
                  asChild
                  className="bg-[#0F1B3D] text-white hover:bg-[#182a5c] dark:bg-primary dark:text-primary-foreground font-mono uppercase tracking-[0.06em]"
                  size="action"
                >
                  <Link to="/contact" onClick={() => setMenuOpen(false)}>
                    Book a consultation <ArrowUpRight size={16} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="action">
                  <a href={`tel:${currentContact.tel}`}>
                    <Phone size={16} /> Call {currentContact.phoneDisplay}
                  </a>
                </Button>
                <Button asChild variant="whatsapp" size="action">
                  <a
                    href={getDynamicWhatsappLink("Hello, I'd like to enquire about your services.")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main id="main">
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="relative mt-8 bg-card/50">
        <div aria-hidden className="brand-gradient h-0.5" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Brand scrolled={true} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Insurance, investments, income tax and GST guidance from {currentContact.name} — <span className="font-semibold text-foreground">Helping Build The Wealthy Life</span> since {content.settings?.since_year || 2004}.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Quick links</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Services</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              {currentServices.map((s: any) => (
                <li key={s.slug}>
                  <Link to="/services" hash={s.slug} className="hover:text-primary">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">Get in touch</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="space-y-0.5">
                <span className="block font-semibold text-foreground">{currentContact.name}</span>
                <span className="block text-xs text-muted-foreground">{currentContact.title} • Since {content.settings?.since_year || 2004}</span>
              </li>
              <li>
                <a
                  href={`tel:${currentContact.tel}`}
                  className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <Phone size={16} className="text-primary shrink-0" />
                  {currentContact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={getDynamicWhatsappLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle size={16} className="text-whatsapp shrink-0" />
                  Chat on WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${currentContact.email}`}
                  className="inline-flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
                >
                  <Mail size={16} className="text-primary shrink-0" />
                  {currentContact.email}
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-muted-foreground pt-1">
                <MapPin size={15} className="text-primary shrink-0 mt-0.5" />
                <span>{currentContact.address.line1}, {currentContact.address.city}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:px-8 md:flex-row md:items-center md:justify-between">
            <p>
              © {new Date().getFullYear()} {content.settings?.brand_name || "A B Taxway Consultancy"}. Insurance is the subject matter of solicitation. Cover and returns are subject to market risks and insurer terms &amp; conditions.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span aria-hidden="true">•</span>
              <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span aria-hidden="true">•</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-foreground hover:text-primary cursor-pointer transition-colors"
              >
                <ArrowUp size={14} /> Back to top
              </button>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
        <a
          href={`tel:${currentContact.tel}`}
          aria-label="Call us"
          className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition-transform hover:scale-110"
        >
          <Phone size={20} />
        </a>
        <a
          href={getDynamicWhatsappLink("Hello, I'd like to enquire about your services.")}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-14 place-items-center rounded-full bg-whatsapp text-primary-foreground shadow-lift transition-transform hover:scale-110"
        >
          <MessageCircle size={24} />
        </a>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
