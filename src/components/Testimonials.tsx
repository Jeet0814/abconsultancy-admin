import { useState, useRef, type FormEvent } from "react";
import { MessageSquareHeart, Quote, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Reveal } from "@/components/Reveal";

import { initialTestimonials, type TestimonialItem } from "@/config/testimonials";

import { useSiteContent, getApiBaseUrl } from "@/hooks/useSiteContent";

type Testimonial = TestimonialItem;
const initials = (n: string) => n.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]!.toUpperCase()).join("");

function Stars({ value }: { value: number }) {
  return <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map(i => <Star key={i} size={15} className={i <= value ? "fill-accent text-accent" : "text-border"} />)}</div>;
}

export function Testimonials() {
  const { content } = useSiteContent();
  const items = content.testimonials;
  const [form, setForm] = useState({ name: "", service: "", message: "", rating: 5 });
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Please write at least 10 characters.");
      return;
    }
    setSending(true);
    const API_URL = getApiBaseUrl();

    try {
      await fetch(`${API_URL}/api/public/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          service: form.service.trim() || undefined,
          message: form.message.trim(),
          rating: form.rating,
        }),
      });
    } catch {
      // Fallback
    } finally {
      setSending(false);
      toast.success("Thank you! Your feedback will appear once reviewed.");
      setForm({ name: "", service: "", message: "", rating: 5 });
    }
  }

  return <section id="testimonials" className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
    <Reveal><p className="text-xs font-bold uppercase tracking-wider text-primary">Client voices</p>
    <h2 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">What clients say about working with <span className="brand-text">Anilkumarsingh Bhadauria</span></h2></Reveal>
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <Reveal className="min-w-0">
        {items === null ? <div className="grid gap-4 sm:grid-cols-2"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-48 rounded-2xl" /></div>
        : items.length === 0 ? <div className="glass-panel flex h-full flex-col items-center justify-center rounded-3xl border border-card/80 p-10 text-center">
          <div className="relative"><span className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" /><span className="brand-gradient relative grid size-20 place-items-center rounded-3xl text-primary-foreground shadow-lift"><MessageSquareHeart size={36} /></span></div>
          <h3 className="mt-6 font-display text-xl font-bold text-foreground">No reviews yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">Have you worked with us? Your words help other families and businesses choose with confidence.</p>
          <Button variant="gradient" size="consult" className="mt-6" onClick={() => nameRef.current?.focus()}>Be the first to share your experience</Button>
        </div>
        : <Carousel opts={{ align: "start" }} className="px-1">
          <CarouselContent>{items.map(t => <CarouselItem key={t.id} className="sm:basis-1/2">
            <figure className="glass-panel flex h-full flex-col rounded-2xl border border-card/80 p-6">
              <div className="flex items-center justify-between"><Quote className="text-primary" size={22} />{t.rating && <Stars value={t.rating} />}</div>
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-foreground">{t.message}</blockquote>
              <figcaption className="mt-5 flex items-center gap-3"><span className="brand-gradient grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-primary-foreground">{initials(t.name)}</span><span className="text-sm font-semibold text-foreground">{t.name}{t.service && <span className="block text-xs font-normal text-muted-foreground">{t.service}</span>}</span></figcaption>
            </figure>
          </CarouselItem>)}</CarouselContent>
          <div className="mt-4 flex justify-end gap-2 [&>button]:static [&>button]:translate-y-0"><CarouselPrevious /><CarouselNext /></div>
        </Carousel>}
      </Reveal>
      <Reveal delay={0.1} className="glass-panel rounded-3xl border border-card/80 p-6 sm:p-7">
        <form onSubmit={submit} className="space-y-4">
          <h3 className="font-display text-xl font-bold">Share your experience</h3>
          <fieldset><legend className="mb-2 text-sm font-medium">Your rating</legend>
            <div className="flex gap-1" onMouseLeave={() => setHover(0)}>{[1, 2, 3, 4, 5].map(i => <button type="button" key={i} aria-label={`${i} star${i > 1 ? "s" : ""}`} aria-pressed={form.rating === i} onMouseEnter={() => setHover(i)} onClick={() => setForm({ ...form, rating: i })} className="rounded p-0.5 transition-transform hover:scale-110"><Star size={26} className={i <= (hover || form.rating) ? "fill-accent text-accent" : "text-border"} /></button>)}</div>
          </fieldset>
          <div className="space-y-2"><Label htmlFor="t-name">Your name</Label><Input ref={nameRef} id="t-name" required maxLength={80} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="t-service">Service used (optional)</Label><Input id="t-service" maxLength={60} placeholder="e.g. ITR filing" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} /></div>
          <div className="space-y-2"><Label htmlFor="t-message">Your feedback</Label><Textarea id="t-message" required minLength={10} maxLength={1000} rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="resize-none" /></div>
          <p className="text-xs text-muted-foreground">Feedback is shown after review.</p>
          <Button type="submit" variant="gradient" size="action" disabled={sending}>{sending ? "Submitting…" : "Submit feedback"}</Button>
        </form>
      </Reveal>
    </div>
  </section>;
}
