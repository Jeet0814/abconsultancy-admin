import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Scale, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand, contact } from "@/lib/site-content";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: `Terms of Service | ${brand.fullName}` },
      { name: "description", content: `Terms of service, consulting guidelines and regulatory disclaimers for ${brand.fullName}.` },
      { property: "og:title", content: `Terms of Service | ${brand.fullName}` },
      { property: "og:description", content: `Terms of service and regulatory compliance details for ${brand.fullName}.` },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-20 sm:px-8 md:pt-24">
      <div className="mb-8">
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-4 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-1.5 size-4" /> Back to Home
          </Link>
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Scale className="size-3.5" /> Legal & Terms of Service
        </div>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: October 2026 • Established 2004
        </p>
      </div>

      <div className="glass-panel space-y-8 rounded-3xl border border-card/80 p-6 sm:p-10 text-sm leading-relaxed text-foreground/90 sm:text-base">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="text-primary size-5" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing this website or engaging <strong>{brand.fullName}</strong> for consultancy regarding insurance, investment planning, income tax return filing, or GST compliance, you agree to these Terms of Service. If you do not agree with any part of these terms, please contact us prior to using our services.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            2. Scope of Advisory & Services
          </h2>
          <p>
            Our consultancy provides professional guidance based on the provisions of the Income Tax Act, 1961, Goods and Services Tax (GST) Acts and Rules, and IRDAI insurance guidelines. We assist clients with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
            <li>Reviewing and submitting Income Tax Returns (ITR).</li>
            <li>GST Registration, monthly / quarterly filing, and compliance reconciliations.</li>
            <li>Life, Health, Motor, and General Insurance policy advisory and comparisons.</li>
            <li>Financial goal planning and investment portfolio review.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            3. Client Responsibilities & Accuracy of Documents
          </h2>
          <p>
            Clients are responsible for providing complete, genuine, and accurate financial statements, invoices, KYC documents, and income details. {brand.fullName} prepares filings in good faith based on the data and documents supplied by the client.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="text-primary size-5" /> 4. Regulatory & Statutory Disclaimers
          </h2>
          <div className="rounded-2xl border border-card/80 bg-card/60 p-4 text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">Insurance Solicitation:</strong> Insurance is the subject matter of solicitation. Policy terms, exclusions, premium rates, and claim settlements are determined solely by the respective insurance underwriting company according to IRDAI regulations.
            </p>
            <p>
              <strong className="text-foreground">Market Risks:</strong> Investment products and mutual funds are subject to market risks. Past performance does not guarantee future results.
            </p>
            <p>
              <strong className="text-foreground">Tax Law Interpretations:</strong> While every effort is made to apply the latest tax laws, statutory authorities (ITD, GST Council) maintain ultimate assessment authority.
            </p>
          </div>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            5. Online Calculators & Estimators
          </h2>
          <p>
            Calculators (such as the Old vs New Tax Regime estimator, SIP calculator, and Life Cover estimator) on this website are provided free of charge for illustrative purposes only. They do not constitute a binding quote or official legal computation.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            6. Governing Law & Jurisdiction
          </h2>
          <p>
            These terms are governed by the laws of India. Any disputes arising in connection with our services shall be subject to the exclusive jurisdiction of the competent courts in Ahmedabad, Gujarat, India.
          </p>
        </section>

        <section className="space-y-3 border-t border-border/60 pt-6">
          <h2 className="font-display text-lg font-bold text-foreground">
            7. Contact Information
          </h2>
          <div className="rounded-2xl bg-card/60 p-4 border border-card/80 text-sm space-y-1">
            <p className="font-bold text-foreground">{contact.name}</p>
            <p className="text-muted-foreground">{brand.fullName}</p>
            <p className="text-muted-foreground">Phone: <a href={`tel:${contact.tel}`} className="text-primary hover:underline">{contact.phoneDisplay}</a></p>
            <p className="text-muted-foreground">Email: <a href={`mailto:${contact.email}`} className="text-primary hover:underline">{contact.email}</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
