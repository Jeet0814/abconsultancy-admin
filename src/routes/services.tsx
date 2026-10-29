import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  FileCheck,
  HelpCircle,
  Sparkles,
  UserCheck,
  ShieldCheck,
  TrendingUp,
  FileText,
  ReceiptText,
  HeartHandshake,
  Activity,
  Car,
  Briefcase,
  PiggyBank,
  Wallet,
  Coins,
  Receipt,
  FileSpreadsheet,
  Building2,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { services as fallbackServices, type ServiceDetail } from "@/lib/site-content";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | A B Taxway Consultancy — Helping Build The Wealthy Life" },
      {
        name: "description",
        content:
          "Explore specialized financial services: Insurance Advisory, Investment & SIP Planning, Income Tax (ITR) Filing, and GST Compliance from A B Taxway Consultancy.",
      },
      { property: "og:title", content: "Services | A B Taxway Consultancy" },
      {
        property: "og:description",
        content:
          "Insurance, investments, income tax return and GST compliance guidance from Anilkumarsingh Bhadauria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  TrendingUp,
  FileText,
  ReceiptText,
  HeartHandshake,
  Activity,
  Car,
  Briefcase,
  PiggyBank,
  Wallet,
  Coins,
  Receipt,
  FileSpreadsheet,
  Building2,
  Landmark,
  insurance: ShieldCheck,
  investments: TrendingUp,
  "income-tax": FileText,
  gst: ReceiptText,
};

function getLucideIcon(nameOrSlug?: string, fallback: LucideIcon = ShieldCheck): LucideIcon {
  if (!nameOrSlug) return fallback;
  return iconMap[nameOrSlug] || fallback;
}

function ServicesPage() {
  const { content } = useSiteContent();
  const currentServices = content.services && content.services.length > 0 ? content.services : fallbackServices;
  const [activeSection, setActiveSection] = useState<string>("insurance");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && currentServices.some((s: any) => s.slug === hash)) {
        setActiveSection(hash);
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);

    // Intersection Observer to highlight active section on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -50% 0px", threshold: 0.1 }
    );

    const sections = document.querySelectorAll("section[data-service-section]");
    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener("hashchange", handleHash);
      observer.disconnect();
    };
  }, [currentServices]);

  const scrollToService = (slug: string) => {
    setActiveSection(slug);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${slug}`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 md:pt-24">
      {/* Header Banner */}
      <Reveal className="max-w-4xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
          <Sparkles size={13} /> Complete Advisory Suite
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
          The expert support you need, <span className="brand-text">all in one place.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
          Explore our dedicated practice areas across insurance protection, goal-based investments, income tax filing, and GST compliance. Every decision is grounded in clear explanations and tailored to your priorities.
        </p>
      </Reveal>

      <div className="mt-12 lg:grid lg:grid-cols-[240px_1fr] lg:gap-12 items-start">
        {/* DESKTOP STICKY SIDE INDEX */}
        <aside className="hidden lg:block sticky top-28 self-start">
          <div className="rounded-2xl border border-card/80 bg-card/60 p-4 shadow-sm backdrop-blur-md">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Services Index
            </p>
            <nav className="mt-3 flex flex-col gap-1.5" aria-label="Services in-page navigation">
              {currentServices.map((s: any) => {
                const Icon = getLucideIcon(s.iconName || s.slug, ShieldCheck);
                const isActive = activeSection === s.slug;
                return (
                  <button
                    key={s.slug}
                    onClick={() => scrollToService(s.slug)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition-all duration-200 cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon size={16} className={isActive ? "text-primary-foreground" : "text-primary"} />
                    <span className="truncate">{s.title}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-border/60 px-3">
              <Link
                to="/contact"
                className="group flex items-center justify-between text-xs font-semibold text-primary dark:text-sky-300 hover:underline"
              >
                <span>Book consultation</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </aside>

        {/* MAIN SERVICES CONTENT */}
        <div className="space-y-20 sm:space-y-28">
          {currentServices.map((service: any, index: number) => (
            <ServiceSection key={service.slug} service={service} index={index} totalCount={currentServices.length} />
          ))}
        </div>
      </div>

      {/* BOTTOM CTA BANNER */}
      <div className="mt-24">
        <Reveal>
          <div className="animated-gradient relative overflow-hidden rounded-3xl p-8 sm:p-12 text-primary-foreground shadow-xl">
            <div aria-hidden className="absolute -right-16 -top-16 size-60 rounded-full border-[24px] border-primary-foreground/10" />
            <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground/80">
                  Ready to move forward?
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold">
                  Not sure which service suits your needs?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/90">
                  Reach out with your questions. We will help you identify the right plan, compute tax savings, and prepare all necessary paperwork.
                </p>
              </div>
              <Button asChild variant="light" size="action" className="shrink-0">
                <Link to="/contact">
                  Talk to our advisor <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function ServiceSection({ service, index, totalCount = 4 }: { service: any; index: number; totalCount?: number }) {
  const Icon = service.icon || getLucideIcon(service.iconName || service.slug, ShieldCheck);

  return (
    <section
      id={service.slug}
      data-service-section
      className="scroll-mt-28 rounded-3xl border border-card/80 bg-card/40 p-6 sm:p-10 shadow-sm backdrop-blur-md"
    >
      <Reveal>
        {/* Service Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary dark:text-sky-300">
              <Icon size={28} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-primary dark:text-sky-300">
                {service.number || `0${index + 1}`} / {String(totalCount).padStart(2, "0")}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                {service.title}
              </h2>
            </div>
          </div>
          {service.badge && (
            <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary dark:text-sky-300">
              {service.badge}
            </span>
          )}
        </div>

        <p className="mt-4 text-base sm:text-lg font-medium text-foreground">
          {service.short}
        </p>
        <p className="mt-2 leading-relaxed text-muted-foreground text-sm sm:text-base">
          {service.description}
        </p>
      </Reveal>

      {/* Grid: Who it's for & What we help with */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Who it's for */}
        {service.whoItsFor && service.whoItsFor.length > 0 && (
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-border/70 bg-card/60 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
                <UserCheck size={16} /> Who It's For
              </div>
              <ul className="mt-4 space-y-3">
                {service.whoItsFor.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}

        {/* What to keep ready mini-checklist */}
        {service.keepReady && service.keepReady.length > 0 && (
          <Reveal delay={0.12}>
            <div className="h-full rounded-2xl border border-border/70 bg-secondary/50 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
                <FileCheck size={16} /> What To Keep Ready
              </div>
              <ul className="mt-4 space-y-2.5">
                {service.keepReady.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </div>

      {/* What we help with (Pillars) */}
      {service.whatWeHelpWith && service.whatWeHelpWith.length > 0 && (
        <div className="mt-6">
          <Reveal delay={0.15}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Core Coverage & Assistance
            </p>
            <div className="grid gap-3.5 sm:grid-cols-2">
              {service.whatWeHelpWith.map((item: any) => {
                const ItemIcon = item.icon || getLucideIcon(item.iconName, Sparkles);
                return (
                  <div
                    key={item.title}
                    className="glass-panel flex flex-col rounded-2xl border border-card/80 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5 text-primary">
                      <ItemIcon size={18} />
                      <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      )}

      {/* Calculator Link & CTA Row */}
      {service.calculator && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
              <Calculator size={20} />
            </div>
            <div>
              <Link
                to={service.calculator.to || "/"}
                hash={service.calculator.hash}
                className="font-display text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1"
              >
                <span>{service.calculator.label}</span>
                <ArrowUpRight size={14} />
              </Link>
              <p className="text-xs text-muted-foreground">{service.calculator.sub}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button asChild variant="consult" size="action">
              <Link to="/contact" search={{ service: service.slug }}>
                Enquire about {service.title} <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Service FAQ Accordion */}
      {service.faqs && service.faqs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border/70">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle size={17} className="text-primary" />
            <h3 className="font-display text-base font-bold text-foreground">
              Frequently Asked Questions — {service.title}
            </h3>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-2.5">
            {service.faqs.map((faq: any, i: number) => (
              <AccordionItem
                key={i}
                value={`faq-${service.slug}-${i}`}
                className="rounded-xl border border-card/80 bg-card/60 px-4 py-1"
              >
                <AccordionTrigger className="text-left text-xs sm:text-sm font-semibold hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </section>
  );
}
