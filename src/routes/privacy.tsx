import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock, Shield, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand, contact } from "@/lib/site-content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${brand.fullName}` },
      { name: "description", content: `Privacy policy and data protection practices for ${brand.fullName}.` },
      { property: "og:title", content: `Privacy Policy | ${brand.fullName}` },
      { property: "og:description", content: `How ${brand.fullName} collects, uses and protects your personal and financial information.` },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8 md:pt-24">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-1.5 size-4" /> Back to Home
          </Link>
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Shield className="size-3.5" /> Privacy & Data Protection
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: October 2026 • Effective since 2004
        </p>
      </div>

      <div className="glass-panel space-y-8 rounded-3xl border border-card/80 p-6 sm:p-10 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="text-primary size-5" /> 1. Overview & Commitment
          </h2>
          <p>
            At <strong>{brand.fullName}</strong> ("we", "our", or "us"), founded and managed by{" "}
            <strong>{contact.name}</strong>, we respect your privacy and are committed to protecting the personal and financial information you share with us during our consultations, tax return preparation, GST compliance, insurance advisory, and investment planning services.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            2. Information We Collect
          </h2>
          <p>We only collect information necessary to deliver our professional advisory and compliance services:</p>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Contact & Identification Details:</strong> Name, phone number, email address, PAN, Aadhaar, date of birth, and postal address.
            </li>
            <li>
              <strong className="text-foreground">Financial & Tax Data:</strong> Form 16, salary slips, bank statements, investment proofs (80C/80D), previous ITR acknowledgements, and capital gains statements.
            </li>
            <li>
              <strong className="text-foreground">Business & GST Compliance:</strong> Business name, trade name, GSTIN, sales/purchase registers, invoices, and bank account certificates.
            </li>
            <li>
              <strong className="text-foreground">Insurance & Investment Preferences:</strong> Family coverage requirements, existing policy details, nominee information, and financial goals.
            </li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            3. How We Use Your Information
          </h2>
          <p>Your data is used strictly for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Filing accurate Income Tax Returns (ITR) on the Income Tax e-Filing portal.</li>
            <li>Preparing and submitting GST returns (GSTR-1, GSTR-3B) and registration documents on the GST Common Portal.</li>
            <li>Comparing, reviewing, and processing life, health, motor, and general insurance policies with authorized insurers.</li>
            <li>Communicating compliance reminders, upcoming statutory due dates, and replying to enquiries via phone or WhatsApp.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            4. Confidentiality & Third-Party Sharing
          </h2>
          <p>
            We adhere to strict professional confidentiality. We <strong>never sell, rent, or monetize</strong> your personal data. Your information is only shared with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Government statutory portals (Income Tax Department, GST Portal) at your explicit request.</li>
            <li>IRDAI-regulated insurance companies for policy issuance and claim assistance.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            5. Security & Storage
          </h2>
          <p>
            All physical and digital documents are kept in secure, restricted-access storage. We apply strict security protocols to prevent unauthorized access, alteration, or disclosure.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            6. Contact Us Regarding Your Privacy
          </h2>
          <p>
            If you have questions about your data or wish to update your records, please reach out directly:
          </p>
          <div className="rounded-2xl bg-card/60 p-4 border border-card/80 text-sm space-y-1">
            <p className="font-bold text-foreground">{contact.name}</p>
            <p className="text-muted-foreground">{brand.fullName}</p>
            <p className="text-muted-foreground">Phone / WhatsApp: <a href={`tel:${contact.tel}`} className="text-primary hover:underline">{contact.phoneDisplay}</a></p>
            <p className="text-muted-foreground">Email: <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
