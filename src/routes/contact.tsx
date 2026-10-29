import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Send,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { contact as fallbackContact, whatsappLink as defaultWhatsappLink } from "@/lib/site-content";
import { useSiteContent, getApiBaseUrl } from "@/hooks/useSiteContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/Reveal";

const serviceOptions = [
  "Insurance Advisory",
  "Investment & Wealth Planning",
  "Income Tax & ITR Filing",
  "GST Consultancy & Compliance",
  "General Financial Consultation",
];

const serviceFromSlug: Record<string, string> = {
  insurance: "Insurance Advisory",
  investments: "Investment & Wealth Planning",
  "income-tax": "Income Tax & ITR Filing",
  gst: "GST Consultancy & Compliance",
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { service?: string } =>
    typeof search["service"] === "string" ? { service: search["service"] } : {},
  head: () => ({
    meta: [
      { title: "Contact | A B Taxway Consultancy — Helping Build The Wealthy Life" },
      {
        name: "description",
        content: `Get in touch with Anilkumarsingh Bhadauria at A B Taxway Consultancy for insurance, investment, income tax return, and GST services. Visit our Ahmedabad office or connect directly via WhatsApp and phone.`,
      },
      { property: "og:title", content: "Contact | A B Taxway Consultancy" },
      {
        property: "og:description",
        content: "Start a conversation about insurance, investments, income tax returns or GST with Anilkumarsingh Bhadauria.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

/**
 * Validates Indian 10-digit mobile number format
 * Accepts: 9876543210, +919876543210, 09876543210, 91-9876543210
 */
function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^(?:(?:\+|0{0,2})91)?[6-9]\d{9}$/.test(cleaned);
}

function ContactPage() {
  const { content } = useSiteContent();
  const contact = {
    ...fallbackContact,
    name: content.settings?.advisor_name || fallbackContact.name,
    title: content.settings?.advisor_title || fallbackContact.title,
    tel: content.settings?.phone_raw || fallbackContact.tel,
    phoneDisplay: content.settings?.phone_display || fallbackContact.phoneDisplay,
    whatsapp: content.settings?.whatsapp_number || fallbackContact.whatsapp,
    email: content.settings?.email_address || fallbackContact.email,
    hours: content.settings?.office_hours || fallbackContact.hours,
    address: {
      ...fallbackContact.address,
      title: content.settings?.address_title || fallbackContact.address.title,
      line1: content.settings?.address_line1 || fallbackContact.address.line1,
      city: content.settings?.address_city || fallbackContact.address.city,
      pincode: content.settings?.address_pincode || fallbackContact.address.pincode,
      googleMapsUrl: content.settings?.google_maps_url || fallbackContact.address.googleMapsUrl,
      googleMapsEmbedUrl: content.settings?.google_maps_embed_url || fallbackContact.address.googleMapsEmbedUrl,
    },
  };

  const getWhatsappLink = (text?: string) => {
    if (content.settings?.whatsapp_number) {
      const num = content.settings.whatsapp_number.replace(/\D/g, "");
      const msg = text ? encodeURIComponent(text) : encodeURIComponent("Hello, I'd like to enquire about your services.");
      return `https://wa.me/${num}?text=${msg}`;
    }
    return defaultWhatsappLink(text);
  };

  const { service } = Route.useSearch();
  const [selected, setSelected] = useState(
    service && serviceFromSlug[service] ? serviceFromSlug[service] : "Insurance Advisory"
  );

  // Sync state if query param changes dynamically
  useEffect(() => {
    if (service && serviceFromSlug[service]) {
      setSelected(serviceFromSlug[service]);
    }
  }, [service]);

  const [details, setDetails] = useState({ name: "", phone: "", email: "" });
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMode, setSubmitMode] = useState<"inquiry" | "whatsapp">("inquiry");
  const [referenceNo, setReferenceNo] = useState<string>("");

  const enquiryText = `A B Taxway Consultancy enquiry\nName: ${details.name}\nPhone: ${details.phone}\nEmail: ${details.email || "Not provided"}\nService: ${selected}\nMessage: ${message}`;

  async function submitForm(targetMode: "inquiry" | "whatsapp") {
    setPhoneError("");

    if (!details.name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }

    // 10-digit Indian phone validation
    if (!isValidIndianPhone(details.phone)) {
      setPhoneError("Please enter a valid 10-digit Indian mobile number (e.g. 98765 43210).");
      toast.error("Please enter a valid Indian mobile number.");
      return;
    }

    if (!message.trim()) {
      toast.error("Please describe your requirement in the message box.");
      return;
    }

    // Spam honeypot trap
    if (honeypot.trim().length > 0) {
      setSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitMode(targetMode);

    const API_URL = getApiBaseUrl();
    let generatedRef = "";
    // Clean phone number of spaces/dashes before posting
    const cleanedPhone = details.phone.replace(/[\s\-()]/g, "");

    try {
      const res = await fetch(`${API_URL}/api/public/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name.trim(),
          phone: cleanedPhone,
          email: details.email.trim() || undefined,
          service: selected,
          message: message.trim(),
          hp_website_field: honeypot,
          source: targetMode === "whatsapp" ? "contact_form_whatsapp" : "contact_form",
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMsg = json?.message || json?.errors?.[0]?.message || "Failed to submit enquiry.";
        toast.error(errorMsg);
        setIsSubmitting(false);
        return;
      }

      if (json?.data?.referenceNo) {
        generatedRef = json.data.referenceNo;
        setReferenceNo(json.data.referenceNo);
      }

      toast.success(
        targetMode === "whatsapp"
          ? "Enquiry recorded! Opening WhatsApp..."
          : `Enquiry received! Ref: ${generatedRef || "Saved"}`
      );

      setSubmitted(true);

      // Only open WhatsApp if user clicked "Send via WhatsApp"
      if (targetMode === "whatsapp") {
        try {
          const whatsappMsg = `${enquiryText}${generatedRef ? `\nReference: ${generatedRef}` : ""}`;
          window.open(getWhatsappLink(whatsappMsg), "_blank", "noopener,noreferrer");
        } catch {
          // Pop-up blocked fallback
        }
      }
    } catch (err: any) {
      console.error("Enquiry submission error:", err);
      // If network fails completely and user wanted WhatsApp, allow them to still open WhatsApp
      if (targetMode === "whatsapp") {
        setSubmitted(true);
        toast.info("Opening WhatsApp directly...");
        window.open(getWhatsappLink(enquiryText), "_blank", "noopener,noreferrer");
      } else {
        toast.error("Unable to connect to server. Please try again or reach out on WhatsApp.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setSubmitted(false);
    setDetails({ name: "", phone: "", email: "" });
    setMessage("");
    setPhoneError("");
    setReferenceNo("");
    setSubmitMode("inquiry");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-8 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 items-start">
        {/* LEFT COLUMN: Contact info and direct channels */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">
              <Sparkles size={13} /> Direct Contact & Consultation
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Let's get the <span className="brand-text">conversation started.</span>
            </h1>
            <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
              Have a question regarding insurance cover, mutual fund SIPs, income tax filing, or GST compliance? Your enquiry reaches {contact.name} directly.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 space-y-4">
            {/* Direct Advisor Profile Badge */}
            <div className="rounded-2xl border border-card/80 bg-card/60 p-5 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary dark:text-sky-300 font-display font-bold text-lg">
                  AB
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary dark:text-sky-300">Principal Advisor</p>
                  <p className="font-display text-lg font-bold text-foreground">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.title} • Advising since 2004</p>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href={`tel:${contact.tel}`}
                className="glass-strong group flex items-center gap-3.5 rounded-2xl border border-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Phone size={18} />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Call directly</span>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {contact.phoneDisplay}
                  </span>
                </div>
              </a>

              <a
                href={getWhatsappLink("Hello Anilkumarsingh ji, I would like to consult regarding financial services.")}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-strong group flex items-center gap-3.5 rounded-2xl border border-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-whatsapp/40 hover:shadow-sm"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-whatsapp/10 text-whatsapp transition-transform group-hover:scale-105 group-hover:bg-whatsapp group-hover:text-white">
                  <MessageCircle size={18} />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">WhatsApp Chat</span>
                  <span className="font-semibold text-foreground group-hover:text-whatsapp transition-colors">
                    Fast response on WhatsApp
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="glass-strong group flex items-center gap-3.5 rounded-2xl border border-card/80 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Send an email</span>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {contact.email}
                  </span>
                </div>
              </a>

              <div className="glass-strong flex items-center gap-3.5 rounded-2xl border border-card/80 p-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="block text-xs text-muted-foreground">Office hours</span>
                  <span className="font-semibold text-foreground">{contact.hours}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* RIGHT COLUMN: Interactive Form / Success State */}
        <Reveal delay={0.15}>
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-card/80 p-6 sm:p-9 shadow-lg backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success-state"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  role="status"
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={28} />
                    </span>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        {submitMode === "whatsapp" ? "Enquiry Registered & WhatsApp Ready!" : "Enquiry Received Successfully!"}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {referenceNo ? `Tracking Reference: ${referenceNo}` : "Your details have been registered securely in our CRM."}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 text-sm text-foreground">
                    <p className="font-medium">
                      {submitMode === "whatsapp"
                        ? `WhatsApp has been launched with your enquiry. If it didn't open automatically, tap below to chat directly with ${contact.name}.`
                        : `Thank you! Your enquiry has been received. ${contact.name} and our advisory team will review your requirements and reach out to you at ${details.phone} shortly.`}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-border/70 bg-card/60 p-5 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary of your message</p>
                      {referenceNo && (
                        <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                          {referenceNo}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Name:</span> <strong className="text-foreground">{details.name}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Phone:</span> <strong className="text-foreground">{details.phone}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Service:</span> <strong className="text-foreground">{selected}</strong>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50 text-xs">
                      <span className="text-muted-foreground">Message:</span>
                      <p className="mt-1 font-mono text-[11px] text-foreground/90 whitespace-pre-wrap rounded-lg bg-secondary/50 p-2.5">
                        {message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {submitMode === "whatsapp" ? (
                      <Button asChild variant="consult" size="action">
                        <a href={getWhatsappLink(enquiryText)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={16} /> Open in WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="action">
                        <a href={getWhatsappLink(enquiryText)} target="_blank" rel="noopener noreferrer">
                          <MessageCircle size={16} className="text-[#25D366]" /> Chat on WhatsApp
                        </a>
                      </Button>
                    )}
                    <Button type="button" variant="ghost" size="action" onClick={handleReset}>
                      <RotateCcw size={16} /> Submit another enquiry
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitForm("inquiry");
                  }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="font-display text-2xl font-bold text-foreground">Tell us what you need</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Fill out the form below. We will reach out promptly to assist you.
                    </p>
                  </div>

                  {/* Spam Honeypot (Hidden from real users) */}
                  <input
                    type="text"
                    name="hp_website_field"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-semibold text-foreground">
                        Your Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        required
                        autoComplete="name"
                        placeholder="e.g. Rajesh Sharma"
                        value={details.name}
                        onChange={(e) => setDetails({ ...details, name: e.target.value })}
                        className="h-12 bg-card/70 px-4 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold text-foreground">
                        Phone Number (10-digit Indian) <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        required
                        type="tel"
                        placeholder="e.g. 98765 43210"
                        value={details.phone}
                        onChange={(e) => {
                          setDetails({ ...details, phone: e.target.value });
                          if (phoneError) setPhoneError("");
                        }}
                        className={`h-12 bg-card/70 px-4 ${phoneError ? "border-destructive focus-visible:ring-destructive" : "focus-visible:ring-primary"}`}
                      />
                      {phoneError && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                          <AlertCircle size={13} /> {phoneError}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                      Email Address <span className="text-muted-foreground text-[11px]">(Optional)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g. yourname@example.com"
                      value={details.email}
                      onChange={(e) => setDetails({ ...details, email: e.target.value })}
                      className="h-12 bg-card/70 px-4 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="service" className="text-xs font-semibold text-foreground">
                      Service Required
                    </Label>
                    <select
                      id="service"
                      value={selected}
                      onChange={(e) => setSelected(e.target.value)}
                      className="h-12 w-full rounded-md border border-input bg-card/70 px-4 text-sm text-foreground outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option} value={option} className="bg-card text-foreground">
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-xs font-semibold text-foreground">
                      Your Message / Requirement <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      required
                      rows={4}
                      placeholder="Describe your tax filing, insurance, GST or investment requirement..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="resize-none bg-card/70 p-4 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-primary shrink-0" />
                    <span>Your contact details are kept strictly confidential.</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    {/* Button 1: Send Enquiry (Direct CRM Submit) */}
                    <Button
                      type="button"
                      onClick={() => submitForm("inquiry")}
                      variant="gradient"
                      size="action"
                      disabled={isSubmitting}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 h-12 text-sm font-semibold shadow-md"
                    >
                      {isSubmitting && submitMode === "inquiry" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Sending Enquiry...
                        </>
                      ) : (
                        <>
                          Send Enquiry <Send size={16} />
                        </>
                      )}
                    </Button>

                    {/* Button 2: Send via WhatsApp (Direct WhatsApp redirect) */}
                    <button
                      type="button"
                      onClick={() => submitForm("whatsapp")}
                      disabled={isSubmitting}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold h-12 px-6 text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting && submitMode === "whatsapp" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" /> Connecting to WhatsApp...
                        </>
                      ) : (
                        <>
                          Send via WhatsApp <MessageCircle size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>

      {/* OFFICE ADDRESS & GOOGLE MAPS SECTION */}
      <div className="mt-20 border-t border-border/70 pt-16">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-sky-300">
                <MapPin size={14} /> Our Office Location
              </div>
              <h2 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-foreground">
                Visit our office in Ahmedabad
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We welcome clients for in-person consultations regarding ITR filing, GST registration & compliance, portfolio reviews, and insurance claims.
              </p>

              <div className="mt-6 space-y-3 rounded-2xl border border-card/80 bg-card/60 p-5 backdrop-blur-sm shadow-sm">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <strong className="block font-semibold text-foreground">{contact.address.title}</strong>
                    <span className="text-muted-foreground">{contact.address.line1}</span>
                    <span className="block text-muted-foreground">
                      {contact.address.city}, {contact.address.pincode}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm pt-2 border-t border-border/50 text-muted-foreground">
                  <Clock size={16} className="text-primary shrink-0" />
                  <span>{contact.hours}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild variant="consult" size="action">
                  <a href={contact.address.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    <Navigation size={16} /> Open in Google Maps
                  </a>
                </Button>
                <Button asChild variant="outline" size="action">
                  <Link to="/services">Explore all services</Link>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-card/80 shadow-lg bg-card/60">
              <iframe
                title="A B Taxway Consultancy Location Map"
                src={contact.address.googleMapsEmbedUrl}
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full grayscale contrast-[1.05] dark:invert-[0.9] dark:hue-rotate-180"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
