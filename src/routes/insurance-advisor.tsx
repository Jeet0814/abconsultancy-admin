import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  Lightbulb,
  Loader2,
  MessageCircle,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/Reveal";
import { whatsappLink, contact } from "@/lib/site-content";

export const Route = createFileRoute("/insurance-advisor")({
  head: () => ({
    meta: [
      { title: "AI Insurance Advisor | A B Taxway Consultancy — Helping Build The Wealthy Life" },
      {
        name: "description",
        content:
          "Describe your family, age and protection needs to receive tailored insurance category suggestions, document checklists, and direct guidance from Anilkumarsingh Bhadauria.",
      },
      { property: "og:title", content: "AI Insurance Advisor | A B Taxway Consultancy" },
      {
        property: "og:description",
        content: "Discover which insurance covers suit your life stage and what documents to prepare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdvisorPage,
});

const exampleChips = [
  {
    label: "Young Family Breadwinner",
    prompt: "I am 32, married with a 3-year-old daughter. I am the sole earning member. I have no term insurance yet and want adequate life and family health coverage.",
  },
  {
    label: "Senior Citizen Parents Health",
    prompt: "My father (62) has mild diabetes and my mother (58) has hypertension. They have no private health insurance. What mediclaim options should we look for?",
  },
  {
    label: "Small Business / Retail Store",
    prompt: "I own a retail clothing shop in Ahmedabad with ₹20 Lakhs of inventory. I want to protect the stock from fire, burglary and get personal accident cover.",
  },
  {
    label: "Self-Employed Professional",
    prompt: "I am a 28-year-old freelance designer. I need term insurance with critical illness cover and a personal health plan with low waiting periods.",
  },
];

const howItWorksSteps = [
  {
    step: "01",
    title: "Describe",
    description: "Share your age, family dependants, work profile & key risks.",
    icon: MessageSquare,
  },
  {
    step: "02",
    title: "Get Suggestions",
    description: "Receive instant guidance on cover types & document checklists.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Talk to Us",
    description: "Connect with Anilkumarsingh ji to compare insurer quotes & fine print.",
    icon: Users,
  },
];

function generateClientGuidance(text: string): string {
  const lower = text.toLowerCase();
  const options: string[] = [];
  const docs: string[] = ["PAN Card & Aadhaar Card (KYC)", "Recent passport-size photographs"];
  const questions: string[] = [];

  const isFamily = /child|daughter|son|wife|husband|family|parents|father|mother/.test(lower);
  const isSenior = /parents|father|mother|elderly|senior|60|62|65|70/.test(lower);
  const isMedical = /health|mediclaim|hospital|illness|disease|diabetes|hypertension|surgery/.test(lower);
  const isBusiness = /shop|business|inventory|commercial|stock|office|factory/.test(lower);
  const isTerm = /term|life|death|sole earning|breadwinner|family protection|dependent/.test(lower);

  if (isTerm || isFamily) {
    options.push("• Pure Term Life Insurance: Provides high financial protection for your dependants with critical illness riders at affordable premiums.");
    docs.push("Last 3-6 months bank statements and recent income tax returns / Form 16");
    questions.push("What is the optimal cover multiplier (typically 10-15x annual income) for your liabilities?");
  }

  if (isSenior || isMedical) {
    options.push("• Comprehensive Health Insurance / Senior Citizen Mediclaim: Covers hospitalization, day-care treatments, and pre/post hospitalization with minimal co-pay.");
    docs.push("Past medical prescription records and existing health checkup reports (if any)");
    questions.push("What are the pre-existing disease waiting periods and network hospital cashless limits?");
  }

  if (isFamily && !isSenior) {
    options.push("• Family Floater Mediclaim: One shared umbrella sum insured protecting you, your spouse, and children seamlessly.");
    questions.push("Would adding a top-up / super top-up policy reduce total premium costs significantly?");
  }

  if (isBusiness) {
    options.push("• Business / Shopkeeper's Package Policy: Protects physical inventory, stock, and premises against fire, burglary, and accidental damage.");
    docs.push("GST registration certificate, stock valuation summary & rent agreement / ownership papers");
    questions.push("What are the burglary and transit insurance sub-limits included?");
  }

  if (options.length === 0) {
    options.push("• Comprehensive Health & Term Insurance Combination: Essential foundational cover for health emergencies and family income protection.");
    options.push("• Personal Accident & Disability Cover: Covers partial/total permanent disability from road and workplace mishaps.");
    docs.push("Salary slips or income tax return acknowledgement");
    questions.push("What insurance covers do you currently have, and where are the potential protection gaps?");
  }

  return `Recommended Options:
${options.join("\n")}

What to Prepare:
${docs.map(d => `• ${d}`).join("\n")}

Questions to Discuss with Anilkumarsingh ji:
${questions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

We invite you to reach out directly on WhatsApp or call to discuss quotes across all major providers (LIC, HDFC Life, Care, Star Health, Turtlemint).`;
}

export function AdvisorPage() {
  const [needs, setNeeds] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (needs.trim().length < 10) {
      setError("Please describe your situation in at least a few words.");
      return;
    }

    setAnswer("");
    setError("");
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const guidance = generateClientGuidance(needs);
      setAnswer(guidance);
    } catch {
      setError("Something went wrong while generating suggestions. Please reach out directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
  }

  const handleChipClick = (prompt: string) => {
    setNeeds(prompt);
    setError("");
  };

  const resetForm = () => {
    setNeeds("");
    setAnswer("");
    setError("");
  };

  const whatsappEnquiryText = `Hello Anilkumarsingh ji,\nI used the Insurance Advisor on your website and would like to discuss my insurance requirements.\n\nMy Situation:\n${needs}\n\nPlease let me know suitable policy options and quote details.`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 md:pt-24">
      {/* Top Hero Section */}
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] items-start">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
              <Sparkles size={13} /> AI Insurance Advisor
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Find the cover that <span className="brand-text">fits your life.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base sm:text-lg leading-relaxed text-muted-foreground">
              Describe your age, family dependants, and what matters most to you. Our intelligent tool provides an initial assessment of recommended insurance types and a preparation checklist.
            </p>

            {/* Prominent Privacy & Guidance Callout */}
            <div className="mt-6 space-y-3 rounded-2xl border border-card/80 bg-card/60 p-5 backdrop-blur-md">
              <div className="flex items-start gap-3">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-primary dark:text-sky-300" />
                <div className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  <strong className="block font-semibold text-foreground">General Guidance, Not a Final Recommendation</strong>
                  These suggestions are educational starting points. We never ask for or store sensitive identifiers (no Aadhaar, PAN, or bank account details required).
                </div>
              </div>
            </div>
          </Reveal>

          {/* "How It Works" 3-Step Strip */}
          <Reveal delay={0.1} className="mt-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              How It Works
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {howItWorksSteps.map((step) => {
                const StepIcon = step.icon;
                return (
                  <div
                    key={step.step}
                    className="rounded-2xl border border-card/80 bg-card/40 p-4 backdrop-blur-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary dark:text-sky-300">
                        {step.step}
                      </span>
                      <StepIcon size={16} className="text-muted-foreground" />
                    </div>
                    <h3 className="mt-2 font-display text-sm font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* Advisor Interactive Form & Result Display */}
        <Reveal delay={0.15}>
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-card/80 p-6 sm:p-9 shadow-lg backdrop-blur-xl">
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="needs" className="text-sm font-bold text-foreground">
                  Describe your insurance needs & profile
                </Label>
                {needs && !loading && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Clear
                  </button>
                )}
              </div>

              <Textarea
                id="needs"
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={needs}
                onChange={(e) => {
                  setNeeds(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Mention your age, family members, profession, existing insurance policies, and what worries you most (e.g. medical expenses, debt protection, income loss)..."
                className="resize-none bg-card/70 p-4 text-sm leading-relaxed focus-visible:ring-primary"
              />

              {/* Example Prompt Chips */}
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-2.5">
                  <Lightbulb size={13} className="text-amber-500" /> Click an example to test:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleChips.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => handleChipClick(chip.prompt)}
                      className="rounded-xl border border-border/80 bg-card/60 px-3 py-1.5 text-left text-xs font-medium text-foreground/80 transition-all hover:border-primary hover:bg-card/90 hover:text-foreground cursor-pointer"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="gradient"
                  size="action"
                  disabled={loading}
                  className="w-full sm:w-auto cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={16} /> Analysing needs...
                    </>
                  ) : (
                    <>
                      Get Personalised Suggestions <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Error Display */}
            {error && (
              <div
                role="alert"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Unable to generate suggestions</p>
                  <p className="mt-0.5 text-xs opacity-90">{error}</p>
                </div>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && !answer && (
              <div className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card/40 p-6 animate-pulse">
                <div className="h-5 w-48 rounded bg-primary/20" />
                <div className="space-y-2.5 pt-2">
                  <div className="h-4 w-full rounded bg-muted/60" />
                  <div className="h-4 w-[90%] rounded bg-muted/60" />
                  <div className="h-4 w-[75%] rounded bg-muted/60" />
                </div>
                <div className="grid gap-3 pt-4 sm:grid-cols-2">
                  <div className="h-20 rounded-xl bg-muted/40" />
                  <div className="h-20 rounded-xl bg-muted/40" />
                </div>
              </div>
            )}

            {/* Result Card */}
            <AnimatePresence>
              {answer && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 rounded-2xl border border-card/80 bg-card/75 p-6 shadow-sm backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5 pb-4 border-b border-border/60">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary dark:text-sky-300">
                      <FileText size={18} />
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-foreground">
                        Recommended Insurance Roadmap
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Customized initial overview based on your input
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-foreground/90 space-y-3">
                    {answer}
                  </div>

                  {/* WhatsApp Action Strip */}
                  {!loading && (
                    <div className="mt-6 pt-5 border-t border-border/60 space-y-3">
                      <div className="flex flex-wrap gap-3">
                        <Button asChild variant="consult" size="action">
                          <a
                            href={whatsappLink(whatsappEnquiryText)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle size={16} /> Discuss with {contact.name} on WhatsApp
                          </a>
                        </Button>
                        <Button asChild variant="outline" size="action">
                          <Link to="/contact" search={{ service: "insurance" }}>
                            Send formal enquiry
                          </Link>
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Anilkumarsingh ji will review suitable policy quotes from LIC, HDFC Life, Turtlemint and other authorized insurers.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
