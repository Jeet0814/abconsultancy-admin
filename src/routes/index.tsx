import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, BadgeCheck, Check, Clock, FileText, MessageCircle, Phone, ReceiptText, ShieldCheck, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Testimonials } from "@/components/Testimonials";
import { QuickTools } from "@/components/QuickTools";
import { Counter, DatesAndChecklist, Faq, HowItWorks } from "@/components/HomeExtras";
import { PartnerCarousel } from "@/components/PartnerCarousel";
import { HeroCampaignCarousel } from "@/components/HeroCampaignCarousel";
import { Reveal } from "@/components/Reveal";
import { contact as fallbackContact, services as fallbackServices, whatsappLink as fallbackWhatsappLink } from "@/lib/site-content";
import { credentials as fallbackCredentials } from "@/config/credentials";
import { useSiteContent } from "@/hooks/useSiteContent";
import { getLucideIcon } from "@/lib/icons";
import officeImage from "@/assets/advisory-office.webp";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "A B Taxway Consultancy | Helping Build The Wealthy Life" },
    { name: "description", content: "Helping Build The Wealthy Life — Insurance, investment, income tax return and GST consultancy from A B Taxway Consultancy. Free calculators, key dates and expert guidance since 2004." },
    { property: "og:title", content: "A B Taxway Consultancy | Helping Build The Wealthy Life" },
    { property: "og:description", content: "Practical guidance for insurance, investments, income tax returns and GST — Helping Build The Wealthy Life since 2004." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const picture = [
  { icon: FileText, title: "Income Tax Filing", subtitle: "Returns & tax guidance", slug: "income-tax" },
  { icon: ReceiptText, title: "GST Consultancy", subtitle: "Registration & compliance", slug: "gst" },
  { icon: TrendingUp, title: "Investment Planning", subtitle: "Goals & choices", slug: "investments" },
  { icon: ShieldCheck, title: "Insurance Advisory", subtitle: "Cover that fits your needs", slug: "insurance" },
];

function Headline() {
  const reduce = useReducedMotion();
  const words = ["Clarity", "for", "every"];
  const anim = (i: number) => reduce ? {} : { initial: { opacity: 0, y: 30, filter: "blur(6px)" }, animate: { opacity: 1, y: 0, filter: "blur(0px)" }, transition: { delay: 0.1 + i * 0.08, duration: 0.6 } };
  return <h1 className="mt-7 max-w-[12ch] font-display text-[clamp(2.6rem,5vw,4.75rem)] font-bold leading-[1.06] text-foreground">
    {words.map((w, i) => <motion.span key={w} className="mr-[0.25em] inline-block" {...anim(i)}>{w}</motion.span>)}
    <motion.span className="brand-text inline" {...anim(3)}>rupee you protect.</motion.span>
  </h1>;
}

function Index() {
  const { content, getWhatsappLink } = useSiteContent();
  const sinceYear = Number(content.settings?.since_year) || 2004;
  const years = new Date().getFullYear() - sinceYear;
  const tagline = content.settings?.tagline || "HELPING BUILD THE WEALTHY LIFE";
  const advisorName = content.settings?.advisor_name || fallbackContact.name;
  const phoneDisplay = content.settings?.phone_display || fallbackContact.phoneDisplay;
  const phoneRaw = content.settings?.phone_raw || fallbackContact.tel;

  const currentServices = content.services && content.services.length > 0 ? content.services : fallbackServices;
  const currentCredentials = content.officialCredentials && content.officialCredentials.length > 0
    ? content.officialCredentials.map((c: any) => ({
        name: c.label || c.name,
        logo: c.logoUrl || c.logo,
      }))
    : fallbackCredentials;

  return <>
    {content.slides && content.slides.length > 0 && (
      <HeroCampaignCarousel slides={content.slides} />
    )}

    <section className="relative mx-auto mt-4 max-w-[1600px] px-3 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl">
        <img src={officeImage} alt="Bright, organised financial consultancy workspace" width={1600} height={900} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="hero-wash absolute inset-0" />
        <div className="hero-mesh absolute inset-0" />
        <div aria-hidden className="orb left-[5%] top-[10%] size-64 bg-primary/25" />
        <div aria-hidden className="orb bottom-[5%] right-[10%] size-72 bg-accent/25 [animation-delay:-4s]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-7">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong inline-flex items-center gap-2 rounded-full border border-card px-4 py-2 text-xs font-bold text-primary dark:text-sky-300 shadow-sm"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" /><span className="relative size-2 rounded-full bg-primary" /></span> {tagline.toUpperCase()} · SINCE {sinceYear}</motion.span>
            <Headline />
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 max-w-[49ch] text-base leading-relaxed text-foreground/90 dark:text-slate-200 font-normal">Insurance, investments, income tax returns and GST—thoughtful guidance for your finances, helping build the wealthy life you deserve.</motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gradient" size="action" className="group shine"><Link to="/contact">Start a conversation <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></Button>
              <Button asChild variant="glass" size="action"><Link to="/services">Explore services <ArrowRight /></Link></Button>
            </motion.div>
            <div className="mt-10 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { v: <Counter to={years} suffix="+" />, l: `Years of experience, since ${sinceYear}` },
                { v: "Clear", l: "Straightforward guidance" },
                { v: "Personal", l: "Your goals come first" },
              ].map((s, i) => <motion.div key={s.l} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="glass-strong rounded-2xl border border-card/80 p-4 shadow-sm"><strong className="block font-display text-2xl text-primary dark:text-sky-300 font-bold">{s.v}</strong><span className="mt-1 block text-xs leading-snug text-muted-foreground font-medium">{s.l}</span></motion.div>)}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="lg:col-span-5">
            <div className="glass-panel ml-auto max-w-sm rounded-3xl border border-card/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">The whole picture</p>
              <div className="mt-5 space-y-2.5">
                {picture.map(({ icon: Icon, title, subtitle, slug }, i) => <Link key={slug} to="/services" hash={slug} className="glass-strong group flex items-center gap-3 rounded-2xl border border-card/70 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-110"><Icon size={19} /></div>
                  <div className="min-w-0"><p className="text-sm font-semibold text-foreground">{title}</p><p className="text-xs text-muted-foreground">{subtitle}</p></div>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.15, type: "spring" }} className="ml-auto grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"><Check size={14} /></motion.span>
                </Link>)}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">A more connected view of your financial needs.</p>
            </div>
          </motion.div>
        </div>
      </div>
      {currentCredentials && currentCredentials.length > 0 ? (
        <Reveal className="mx-auto mt-6 flex max-w-7xl flex-col items-center gap-4 px-5 sm:flex-row sm:justify-between sm:px-8">
          <p className="text-sm font-semibold text-muted-foreground">Trusted by families & businesses</p>
          <div className="flex flex-wrap justify-center gap-3">
            {currentCredentials.map((cred: any, i: number) => (
              <div
                key={cred.name || i}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-card/80 bg-card/60 px-4 text-xs font-semibold text-foreground shadow-sm"
              >
                {cred.logo ? <img src={cred.logo} alt={cred.name} className="h-5 w-auto object-contain" /> : <BadgeCheck size={16} className="text-primary" />}
                <span>{cred.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      ) : null}
    </section>

    <PartnerCarousel />

    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">What we handle</p><h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Advisory, end to end.</h2></div>
        <Link to="/services" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-sky-300">View all services <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currentServices.map((svc: any, i: number) => {
          const Icon = getLucideIcon(svc.iconName || svc.slug);
          const numberLabel = svc.number || `0${i + 1}`;
          return (
            <Reveal key={svc.slug || i} delay={i * 0.08}>
              <Link to="/services" hash={svc.slug} className="glass-panel glow-border group flex h-full min-h-64 flex-col rounded-3xl border border-card/80 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift">
                <div className="flex items-start justify-between"><span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground"><Icon size={23} /></span><span className="text-xs font-semibold text-muted-foreground">{numberLabel} / 04</span></div>
                <h3 className="mt-7 font-display text-xl font-semibold text-foreground">{svc.title}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{svc.short}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-primary dark:text-sky-300">Explore <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>

    <HowItWorks />
    <QuickTools />
    <DatesAndChecklist />
    <Testimonials />
    <Faq />

    <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
      <Reveal className="animated-gradient relative overflow-hidden rounded-3xl px-7 py-12 text-primary-foreground sm:px-14 sm:py-14">
        <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full border-[28px] border-primary-foreground/10" />
        <div aria-hidden className="absolute -bottom-20 left-1/3 size-48 rounded-full bg-primary-foreground/10 blur-2xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div><p className="text-xs font-bold uppercase tracking-wider text-primary-foreground/75">Let's talk</p><h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">Make your next decision with more confidence.</h2><p className="mt-4 text-sm leading-relaxed text-primary-foreground/80 sm:text-base">Whether it is a policy, an investment question or a filing deadline, tell us what is on your mind.</p>
            <div className="mt-7 flex flex-wrap gap-3"><Button asChild variant="light" size="action"><Link to="/contact">Get in touch <ArrowUpRight /></Link></Button><Button asChild variant="outline-light" size="action"><Link to="/services">See our services</Link></Button></div></div>
          <div className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/10 p-6 backdrop-blur-xl">
            <p className="font-display text-lg font-bold">Talk to {advisorName}</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href={`tel:${phoneRaw}`} className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/20"><Phone size={18} /><span><span className="block text-xs text-primary-foreground/70">Call</span><span className="font-semibold">{phoneDisplay}</span></span></a></li>
              <li><a href={getWhatsappLink("Hello, I'd like to enquire about your services.")} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-3 transition-colors hover:bg-primary-foreground/20"><MessageCircle size={18} /><span><span className="block text-xs text-primary-foreground/70">WhatsApp</span><span className="font-semibold">Send a message</span></span></a></li>
              <li className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-3"><Clock size={18} /><span><span className="block text-xs text-primary-foreground/70">Experience</span><span className="font-semibold">Advising clients since {sinceYear}</span></span></li>
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  </>;
}
