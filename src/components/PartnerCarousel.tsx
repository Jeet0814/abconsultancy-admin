import { motion } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

export type Partner = {
  id: string;
  name: string;
  category: string;
  tagline: string;
  logoUrl: string;
  badgeClass: string;
};

export const partners: Partner[] = [
  {
    id: "lic",
    name: "LIC of India",
    category: "Life & Pension",
    tagline: "Life Insurance Corporation of India",
    logoUrl: "/partners/lic.png",
    badgeClass: "from-amber-500/15 to-yellow-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
  },
  {
    id: "taxway",
    name: "Taxway",
    category: "Tax & Accounting",
    tagline: "Professional Accounting Solutions ®",
    logoUrl: "/partners/taxway.png",
    badgeClass: "from-emerald-500/15 to-green-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
  },
  {
    id: "nj",
    name: "NJ Mutual Fund",
    category: "Mutual Funds & SIP",
    tagline: "NJ India Invest • Built on Rules",
    logoUrl: "/partners/nj-mutual-fund.png",
    badgeClass: "from-red-500/15 to-rose-500/10 border-red-500/30 text-red-700 dark:text-red-400",
  },
  {
    id: "turtlemint",
    name: "Turtlemint",
    category: "InsurTech Advisory",
    tagline: "Multi-Insurer Technology Partner",
    logoUrl: "/partners/turtlemint.png",
    badgeClass: "from-teal-500/15 to-emerald-500/10 border-teal-500/30 text-teal-700 dark:text-teal-400",
  },
  {
    id: "hdfc-life",
    name: "HDFC Life",
    category: "Life & Health",
    tagline: "Sar Utha Ke Jiyo • Protection",
    logoUrl: "/partners/hdfc-life.png",
    badgeClass: "from-blue-500/15 to-indigo-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
  },
];

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="group relative flex shrink-0 items-center gap-4 rounded-2xl border border-card/80 bg-card/75 px-5 py-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/95 hover:shadow-lift select-none">
      {/* Official Brand Logo Box */}
      <div className="flex h-14 w-36 sm:w-40 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
        <img
          src={partner.logoUrl}
          alt={`${partner.name} logo`}
          className="max-h-10 max-w-[92%] object-contain"
          loading="lazy"
        />
      </div>

      {/* Partner Info */}
      <div className="min-w-0 pr-2">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-sm font-bold text-foreground transition-colors group-hover:text-primary">
            {partner.name}
          </h3>
          <span
            className={`hidden sm:inline-block rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${partner.badgeClass}`}
          >
            {partner.category}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {partner.tagline}
        </p>
      </div>
    </div>
  );
}

import { useSiteContent } from "@/hooks/useSiteContent";

export function PartnerCarousel() {
  const { content } = useSiteContent();
  const currentPartners = content.partners && content.partners.length > 0 ? content.partners : partners;
  // Multiply array for smooth infinite marquee loop
  const marqueeItems = [...currentPartners, ...currentPartners, ...currentPartners];

  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-3 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-card/80 bg-card/40 p-5 sm:p-7 backdrop-blur-xl shadow-sm">
          {/* Header Row */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <Sparkles size={16} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  Authorized Advisory &amp; Distribution Platforms
                </p>
                <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                  Partnered with India's leading financial institutions
                </h2>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Direct partnerships &amp; authorized advisory</span>
            </div>
          </div>

          {/* Marquee Track with Fade Gradient Edges */}
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <motion.div
              className="flex gap-4 w-max py-2"
              animate={{
                x: ["0%", "-33.333%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                },
              }}
              whileHover={{ animationPlayState: "paused" }}
            >
              {marqueeItems.map((p, idx) => (
                <PartnerCard key={`${p.id}-${idx}`} partner={p} />
              ))}
            </motion.div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
