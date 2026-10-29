import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Bell, CalendarDays, ClipboardList, MessageSquareText, Handshake, Route as RouteIcon } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { checklists, faqs, keyDates, whatsappLink } from "@/lib/site-content";

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(to);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current || reduce) return;
    hasAnimated.current = true;
    let raf = 0;
    const start = performance.now();
    setN(0);
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce]);

  return <span ref={ref}>{n}{suffix}</span>;
}

const steps = [
  { icon: MessageSquareText, title: "Share your needs", text: "Tell us about your goals, policies, income or business over a call or WhatsApp." },
  { icon: RouteIcon, title: "Get a clear plan", text: "We explain your options in plain language and what documents are needed." },
  { icon: Handshake, title: "We handle it with you", text: "From paperwork to filing and renewals, we stay with you at every step." },
];

export function HowItWorks() {
  return <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
    <Reveal className="text-center"><p className="text-xs font-bold uppercase tracking-wider text-primary">How it works</p><h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Three simple steps.</h2></Reveal>
    <div className="relative mt-12 grid gap-8 md:grid-cols-3">
      <motion.div aria-hidden className="brand-gradient absolute left-[16%] right-[16%] top-8 hidden h-0.5 origin-left md:block" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: "easeOut" }} />
      {steps.map(({ icon: Icon, title, text }, i) => <Reveal key={title} delay={0.2 + i * 0.15} className="relative text-center">
        <span className="brand-gradient relative mx-auto grid size-16 place-items-center rounded-2xl text-primary-foreground shadow-lift"><Icon size={26} /><span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-card text-xs font-bold text-primary shadow">{i + 1}</span></span>
        <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
      </Reveal>)}
    </div>
  </section>;
}

import { useSiteContent } from "@/hooks/useSiteContent";

export function DatesAndChecklist() {
  const { content, getWhatsappLink } = useSiteContent();
  const currentKeyDates = content.keyDates && content.keyDates.length > 0 ? content.keyDates : keyDates;
  const currentChecklists = content.checklists && content.checklists.length > 0 ? content.checklists : checklists;

  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const upcoming = currentKeyDates.filter(d => !today || d.date >= today).slice(0, 5);
  return <section id="compliance" className="mx-auto grid max-w-7xl scroll-mt-24 gap-6 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
    <Reveal className="glass-panel rounded-3xl border border-card/80 p-6 sm:p-8">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><CalendarDays size={21} /></span><div><h2 className="font-display text-xl font-bold text-foreground">Key dates</h2><p className="text-xs text-muted-foreground">Upcoming ITR & GST deadlines</p></div></div>
      <ul className="mt-6 space-y-2.5">
        {upcoming.map(d => { const dt = new Date(d.date + "T00:00:00"); return <li key={d.date + d.title} className="flex items-center gap-4 rounded-xl bg-card/70 p-3">
          <span className="grid w-14 shrink-0 rounded-lg bg-secondary py-1.5 text-center"><span className="text-[10px] font-semibold uppercase text-muted-foreground">{dt.toLocaleString("en-IN", { month: "short" })}</span><span className="font-display text-lg font-bold leading-none text-primary">{dt.getDate()}</span></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-foreground">{d.title}</span><span className="text-xs text-muted-foreground">{d.tag} · {dt.getFullYear()}</span></span>
          <Button asChild variant="ghost" size="sm" className="shrink-0"><a href={getWhatsappLink(`Hello, please remind me about: ${d.title} (due ${d.date}).`)} target="_blank" rel="noreferrer" aria-label={`Remind me about ${d.title}`}><Bell /> <span className="hidden sm:inline">Remind me</span></a></Button>
        </li>; })}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Dates may be extended by the government — always confirm on the official portal.</p>
    </Reveal>
    <Reveal delay={0.1} className="glass-panel rounded-3xl border border-card/80 p-6 sm:p-8">
      <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><ClipboardList size={21} /></span><div><h2 className="font-display text-xl font-bold text-foreground">What to keep ready</h2><p className="text-xs text-muted-foreground">Document checklists for ITR & GST</p></div></div>
      <Accordion type="single" collapsible defaultValue="0" className="mt-4">
        {currentChecklists.map((c, i) => <AccordionItem key={c.title} value={String(i)}><AccordionTrigger className="text-left font-semibold">{c.title}</AccordionTrigger><AccordionContent><ul className="grid gap-2 sm:grid-cols-2">{c.items.map((it: string) => <li key={it} className="flex gap-2 text-sm text-muted-foreground"><span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />{it}</li>)}</ul></AccordionContent></AccordionItem>)}
      </Accordion>
    </Reveal>
  </section>;
}

export function Faq() {
  const { content, getWhatsappLink } = useSiteContent();
  const currentFaqs = content.generalFaqs && content.generalFaqs.length > 0 ? content.generalFaqs : faqs;

  return <section className="mx-auto max-w-4xl px-5 pb-24 pt-6 sm:px-8">
    <Reveal className="text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">FAQ</p>
      <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">Common questions.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Clear answers to questions we are asked most often.</p>
    </Reveal>
    <Reveal delay={0.1} className="mt-10">
      <Accordion type="single" collapsible className="divide-y divide-border/60 border-y border-border/60">
        {currentFaqs.map((f, i) => (
          <AccordionItem key={f.q} value={String(i)} className="border-b-0 py-1 transition-colors">
            <AccordionTrigger className="text-left font-display text-base font-semibold text-foreground hover:no-underline hover:text-primary sm:text-lg py-4">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base leading-relaxed text-muted-foreground pb-5">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  </section>;
}
