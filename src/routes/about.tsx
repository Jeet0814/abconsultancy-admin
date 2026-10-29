import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  MessagesSquare,
  Milestone,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  User,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { siteConfig } from "@/config/site";
import { useSiteContent, getPublicImageUrl } from "@/hooks/useSiteContent";
import defaultOfficeImage from "@/assets/advisory-office.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | A B Taxway Consultancy — Helping Build The Wealthy Life" },
      {
        name: "description",
        content: `Learn about A B Taxway Consultancy and founder Anilkumarsingh Bhadauria. Guiding families and businesses across insurance, investments, ITR, and GST in Ahmedabad since 2004 with our core mission: Helping Build The Wealthy Life.`,
      },
      { property: "og:title", content: "About Us | A B Taxway Consultancy — Helping Build The Wealthy Life" },
      {
        property: "og:description",
        content: "Transparent financial and tax guidance led by Anilkumarsingh Bhadauria since 2004.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const { content } = useSiteContent();
  const brand = {
    ...siteConfig.brand,
    name: content.settings?.brand_name || siteConfig.brand.name,
    fullName: content.settings?.brand_full_name || siteConfig.brand.fullName,
    tagline: content.settings?.tagline || siteConfig.brand.tagline,
    since: content.settings?.since_year || siteConfig.brand.since,
  };
  const founder = content.about?.founder || siteConfig.founder;
  const milestones = content.about?.milestones && content.about.milestones.length > 0 ? content.about.milestones : siteConfig.milestones;
  const values = content.about?.values && content.about.values.length > 0 ? content.about.values : siteConfig.values;
  const officialCredentials = content.officialCredentials && content.officialCredentials.length > 0 ? content.officialCredentials : siteConfig.officialCredentials;
  const officePhoto = content.settings?.office_photo_url || siteConfig.officePhoto;

  const currentOfficeImage = officePhoto && officePhoto.trim().length > 0 ? officePhoto : defaultOfficeImage;

  // Filter out any credentials that have no assigned value (hide empty sections)
  const activeCredentials = (officialCredentials || []).filter(
    (cred: any) => cred.value && cred.value.trim().length > 0
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 md:pt-24">
      {/* HERO / INTRO */}
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
            <Sparkles size={13} /> {brand.tagline} · Since {brand.since}
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Good guidance starts with <span className="brand-text">a clear conversation.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted-foreground">
            Financial decisions, insurance policies, and tax obligations are easier to navigate when every detail is explained in plain terms. Under the leadership of <strong>{founder.name}</strong>, A B Taxway Consultancy has been serving individuals, families, and business owners since 2004 with a singular focus: <strong>Helping Build The Wealthy Life</strong>.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Button asChild variant="consult" size="action">
              <Link to="/contact">
                Schedule a consultation <ArrowRight size={16} />
              </Link>
            </Button>
            <div className="glass-strong inline-flex items-center gap-2.5 rounded-xl border border-card/80 px-4 py-2.5 text-xs font-semibold text-foreground">
              <span className="font-display text-sm font-bold text-primary dark:text-sky-300">22+ Years</span>
              <span className="text-muted-foreground">Continuous Client Trust</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-card/80 bg-card/60 shadow-xl">
            <img
              src={getPublicImageUrl(currentOfficeImage)}
              alt="A B Taxway Consultancy advisory workspace"
              width={1600}
              height={900}
              className="aspect-[4/3] w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/40 p-3.5 backdrop-blur-md border border-white/10 text-white">
              <p className="text-xs font-semibold">{brand.fullName} Office Desk</p>
              <p className="text-[11px] text-white/80">Ahmedabad, Gujarat • Professional Financial & Tax Consulting</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOUNDER PROFILE SECTION */}
      {founder && founder.name && (
        <section className="mt-24">
          <Reveal>
            <div className="rounded-3xl border border-card/80 bg-card/40 p-6 sm:p-10 backdrop-blur-xl shadow-sm">
              <div className="grid gap-8 lg:grid-cols-[280px_1fr] items-center">
                {/* Founder Photo or Avatar Slot */}
                <div className="flex flex-col items-center text-center">
                  {founder.photo && founder.photo.trim().length > 0 ? (
                    <img
                      src={getPublicImageUrl(founder.photo)}
                      alt={founder.name}
                      width={220}
                      height={220}
                      className="size-48 sm:size-56 rounded-3xl object-cover object-top shadow-md ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="grid size-44 sm:size-52 place-items-center rounded-3xl bg-gradient-to-br from-primary/20 via-card to-primary/10 border border-primary/30 shadow-inner">
                      <span className="font-display text-4xl sm:text-5xl font-extrabold text-primary dark:text-sky-300">
                        AB
                      </span>
                    </div>
                  )}
                  <h3 className="mt-4 font-display text-lg font-bold text-foreground">{founder.name}</h3>
                  <p className="text-xs text-primary dark:text-sky-300 font-semibold">{founder.role}</p>
                </div>

                {/* Founder Bio & Qualifications */}
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
                    <User size={14} /> Founder & Principal Consultant
                  </span>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                    Meet {founder.name}
                  </h2>
                  <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                    {founder.bio}
                  </p>

                  {founder.qualifications && (
                    <div className="flex items-start gap-2.5 rounded-2xl border border-border/70 bg-card/60 p-4 text-xs sm:text-sm text-foreground">
                      <GraduationCap size={18} className="mt-0.5 shrink-0 text-primary dark:text-sky-300" />
                      <div>
                        <strong className="block font-semibold">Specialization & Practice:</strong>
                        <span className="text-muted-foreground">{founder.qualifications}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button asChild variant="consult" size="action">
                      <Link to="/contact">Book direct consultation with {founder.name.split(" ")[0]}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* OFFICIAL CREDENTIALS STRIP (Only rendered if non-empty real data is provided in site.ts) */}
      {activeCredentials.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
                <BadgeCheck size={16} /> Official Regulatory Credentials & Registrations
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeCredentials.map((cred) => (
                  <div key={cred.id} className="rounded-2xl border border-card/80 bg-card/80 p-4 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">{cred.label}</p>
                    <p className="mt-1 font-mono text-base font-bold text-foreground">{cred.value}</p>
                    {cred.note && <p className="mt-1 text-[11px] text-muted-foreground">{cred.note}</p>}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* TIMELINE SINCE 2004 */}
      {milestones && milestones.length > 0 && (
        <section className="mt-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
              <Milestone size={14} /> Our Journey
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-foreground">
              Over two decades of trusted guidance.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Key milestones in our practice as we evolved to meet the changing financial landscape.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.08}>
                <div className="glass-panel relative flex h-full flex-col rounded-3xl border border-card/80 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-primary dark:text-sky-300">
                      {m.year}
                    </span>
                    <Calendar size={18} className="text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold text-foreground">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {m.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CORE VALUES */}
      {values && values.length > 0 && (
        <section className="mt-24">
          <Reveal className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
              <HeartHandshake size={14} /> Principles & Standards
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-foreground">
              Values that anchor every client relationship.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {values.map((val, i) => (
              <Reveal key={val.title} delay={i * 0.08}>
                <div className="glass-panel flex flex-col rounded-3xl border border-card/80 p-6 sm:p-7 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary dark:text-sky-300">
                      <CheckCircle2 size={20} />
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">{val.title}</h3>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {val.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* OUR 3-STEP METHODOLOGY */}
      <section className="mt-24 rounded-3xl border border-card/80 bg-card/30 p-6 sm:p-12 backdrop-blur-md">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">Our Approach</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
            Simple steps. Considered decisions.
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: MessagesSquare,
              title: "Understand",
              text: "We start by listening to your family circumstances, income sources, existing policies, and risk tolerance.",
            },
            {
              icon: ScanSearch,
              title: "Explore",
              text: "We compare options across insurers, calculate tax savings, and clarify exclusions so you know exactly what is involved.",
            },
            {
              icon: FileCheck2,
              title: "Execute & Support",
              text: "We handle paperwork, filing, timely renewals, and stand with you during claims and tax intimations.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass-panel rounded-2xl border border-card/80 p-6">
              <Icon size={24} className="text-primary dark:text-sky-300" />
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mt-20">
        <Reveal>
          <div className="animated-gradient flex flex-col items-start justify-between gap-6 rounded-3xl p-8 sm:p-12 text-primary-foreground sm:flex-row sm:items-center shadow-lg">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Have a question for our team?</h2>
              <p className="mt-2 text-sm text-primary-foreground/85">
                Reach out to discuss insurance coverage, mutual fund SIPs, or tax return filing.
              </p>
            </div>
            <Button asChild variant="light" size="action">
              <Link to="/contact">
                Connect with us <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
