import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getPublicImageUrl } from "@/hooks/useSiteContent";

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  ctaLink?: string;
};

export function HeroCampaignCarousel({ slides }: { slides?: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const slideCount = slides?.length || 0;

  // Auto-advance slides every 6 seconds if multiple slides exist (always at top level)
  useEffect(() => {
    if (slideCount <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slideCount);
    }, 6000);
    return () => clearInterval(timer);
  }, [slideCount]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const activeSlide = slides[current] || slides[0];
  if (!activeSlide) return null;

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="mx-auto mt-4 max-w-[1600px] px-3 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-card/80 bg-slate-950 text-white shadow-2xl min-h-[380px] sm:min-h-[460px] flex items-center">
        {/* Background Slide Image with Fade Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <img
              src={getPublicImageUrl(activeSlide.imageUrl)}
              alt={activeSlide.title}
              className="h-full w-full object-cover object-center"
            />
            {/* Rich gradient wash for high readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
          </motion.div>
        </AnimatePresence>

        {/* Content Container */}
        <div className="relative z-10 max-w-4xl px-6 py-12 sm:px-12 lg:px-16 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300 backdrop-blur-md">
            <Sparkles size={14} className="text-sky-300" />
            Featured Announcement
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id + "-content"}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-white leading-[1.15]">
                {activeSlide.title}
              </h2>
              {activeSlide.subtitle && (
                <p className="max-w-2xl text-base sm:text-lg text-slate-200/90 leading-relaxed font-normal">
                  {activeSlide.subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {activeSlide.ctaLabel && (
            <div className="pt-2">
              <Button asChild variant="gradient" size="action" className="group shadow-lg shadow-brand-500/25">
                <Link to={activeSlide.ctaLink || "/contact"}>
                  {activeSlide.ctaLabel}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Carousel Navigation Controls (Arrows & Indicators) */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 right-6 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-full shadow-lg">
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5 px-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all ${
                    current === idx ? "w-6 bg-sky-400" : "w-2 bg-slate-600 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

