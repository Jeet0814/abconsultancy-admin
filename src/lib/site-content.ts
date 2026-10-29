import {
  HeartPulse,
  ShieldCheck,
  CarFront,
  Home,
  BriefcaseBusiness,
  TrendingUp,
  FileText,
  ReceiptText,
  Coins,
  Scale,
  Building2,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const brand = siteConfig.brand;
export const contact = siteConfig.contact;

export type ServiceDetail = {
  slug: "insurance" | "investments" | "income-tax" | "gst";
  number: string;
  title: string;
  short: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  whoItsFor: string[];
  whatWeHelpWith: { icon: LucideIcon; title: string; text: string }[];
  keepReady: string[];
  calculator: {
    label: string;
    sub: string;
    to: string;
    hash?: string;
  };
  faqs: { q: string; a: string }[];
};

export const services: ServiceDetail[] = [
  {
    slug: "insurance",
    number: "01",
    title: "Insurance Advisory",
    badge: "Life, Health & Assets",
    short: "The right cover for the people and things that matter most.",
    description:
      "Explore comprehensive protection for your family, healthcare expenses, vehicles, residential property, and business assets. We help you compare policies, understand hidden exclusions, and ensure seamless claim assistance.",
    icon: ShieldCheck,
    whoItsFor: [
      "Sole earning members seeking sufficient life cover for dependants",
      "Families looking for high-sum insured health insurance & super top-ups",
      "Senior citizen parents needing tailored health & critical illness cover",
      "Vehicle & property owners requiring zero-depreciation and all-risk policies",
    ],
    whatWeHelpWith: [
      {
        icon: HeartPulse,
        title: "Life & Term Protection",
        text: "Pure term insurance with critical illness riders and family income benefit options.",
      },
      {
        icon: ShieldCheck,
        title: "Health & Mediclaim",
        text: "Individual, family floater, OPD benefits, and pre-existing disease coverage guidance.",
      },
      {
        icon: CarFront,
        title: "Motor & Vehicle Insurance",
        text: "Comprehensive, zero-depreciation, engine protect, and third-party commercial vehicle covers.",
      },
      {
        icon: Home,
        title: "Home & Property Insurance",
        text: "Fire, flood, theft, and natural calamity protection for your residence and home contents.",
      },
    ],
    keepReady: [
      "PAN Card & Aadhaar of the proposer and insured members",
      "Existing policy bond copies (if reviewing or renewing existing cover)",
      "Recent medical history, doctor prescriptions & discharge summaries (if any)",
      "Income proof (Form 16 / ITR acknowledgement / 3 months salary slips) for high term covers",
    ],
    calculator: {
      label: "Life Cover & Human Life Value (HLV) Calculator",
      sub: "Estimate the ideal term cover needed for your family's future",
      to: "/",
      hash: "calculators",
    },
    faqs: [
      {
        q: "How much life insurance cover is really recommended?",
        a: "A reliable rule of thumb is 10–15 times your gross annual income, plus any outstanding home loans and personal liabilities, minus your existing liquid savings. We compute this using the Human Life Value (HLV) method during consultation.",
      },
      {
        q: "Is the health insurance provided by my employer sufficient?",
        a: "Corporate policies terminate immediately if you switch jobs or retire, and often have room-rent sub-limits and co-payments. A personal or family floater policy guarantees uninterrupted lifelong renewability.",
      },
      {
        q: "What is the waiting period for pre-existing diseases in health insurance?",
        a: "Standard retail health policies have a 24 to 36 month waiting period for declared pre-existing ailments (like diabetes or hypertension). We guide you toward policies with shorter waiting periods or specific buyback riders.",
      },
      {
        q: "How do you help during the claim settlement process?",
        a: "We assist with cashless pre-authorisation paperwork, coordinate with third-party administrators (TPAs), and ensure reimbursement bills are filed accurately without deductions.",
      },
    ],
  },
  {
    slug: "investments",
    number: "02",
    title: "Investment & Wealth Planning",
    badge: "SIP, Mutual Funds & Goals",
    short: "Disciplined wealth creation mapped to your financial priorities.",
    description:
      "Bring your financial goals, time horizon, and risk appetite into clear focus. We help you design disciplined SIP strategies, review existing portfolios, and structure savings for child education, retirement, and emergency funds.",
    icon: TrendingUp,
    whoItsFor: [
      "Salaried professionals starting structured wealth creation through monthly SIPs",
      "Parents planning long-term funds for higher education & children's marriage",
      "Individuals approaching retirement wanting stable, tax-efficient regular cash flows",
      "Investors with scattered schemes looking for a consolidated portfolio review",
    ],
    whatWeHelpWith: [
      {
        icon: TrendingUp,
        title: "Goal-Based SIP Planning",
        text: "Align equity and hybrid mutual funds to specific target years and future milestones.",
      },
      {
        icon: FileText,
        title: "Portfolio Health Check",
        text: "Audit your existing mutual fund schemes, eliminate overlapping holdings, and balance risk.",
      },
      {
        icon: Coins,
        title: "Retirement & Pension Corpus",
        text: "Design accumulation strategies during earning years and systematic withdrawal plans (SWP) post-retirement.",
      },
      {
        icon: Scale,
        title: "Emergency & Debt Allocation",
        text: "Allocate liquid and short-duration debt funds for unpredictable life events and capital safety.",
      },
    ],
    keepReady: [
      "PAN Card & Aadhaar (KYC compliant)",
      "Bank account details (cancelled cheque with printed name)",
      "Consolidated Account Statement (CAS) or portfolio PDF if reviewing existing investments",
      "List of short-term (1-3 yrs), medium-term (3-7 yrs), and long-term (7+ yrs) goals",
    ],
    calculator: {
      label: "SIP Wealth Growth & Compounding Calculator",
      sub: "Simulate future corpus growth with monthly systematic investments",
      to: "/",
      hash: "calculators",
    },
    faqs: [
      {
        q: "How is an SIP better than a lump-sum investment?",
        a: "Systematic Investment Plans (SIPs) enforce financial discipline and average out market volatility through Rupee Cost Averaging, allowing you to buy more units when markets dip.",
      },
      {
        q: "Can I increase or pause my SIP amount whenever I want?",
        a: "Yes. Modern mutual fund SIPs offer step-up options to increase with your annual salary increments, and you can pause, stop, or redeem without penalty in open-ended schemes.",
      },
      {
        q: "How often should I review my investment portfolio?",
        a: "An annual review is ideal. We track scheme performance against category benchmarks, ensure asset allocation remains within your target risk limits, and rebalance where needed.",
      },
      {
        q: "What is the difference between Direct and Regular mutual funds?",
        a: "Regular plans include professional advisory and ongoing support from an AMFI-registered distributor for documentation, switches, nomination updates, and tax reporting.",
      },
    ],
  },
  {
    slug: "income-tax",
    number: "03",
    title: "Income Tax & ITR Filing",
    badge: "Individual & Business Tax",
    short: "Accurate filing support and proactive tax optimisation without confusion.",
    description:
      "Get hands-on help organising documents, computing complex capital gains, maximising eligible deductions (80C, 80D, 80G, HRA, home loan interest), and e-filing your returns securely before deadlines.",
    icon: FileText,
    whoItsFor: [
      "Salaried individuals with multiple Form 16s, house property income, or HRA claims",
      "Traders & equity investors with capital gains/losses from stocks, mutual funds & F&O",
      "Freelancers, consultants & professionals eligible for Presumptive Taxation (44ADA)",
      "Business proprietors wanting smooth year-end tax computations and advance tax planning",
    ],
    whatWeHelpWith: [
      {
        icon: FileText,
        title: "ITR-1 to ITR-4 E-Filing",
        text: "Error-free return preparation for salaried employees, pensioners, house owners, and professionals.",
      },
      {
        icon: ReceiptText,
        title: "AIS / TIS & 26AS Reconciliation",
        text: "Thorough cross-checking of high-value transactions, TDS deductions, and interest records.",
      },
      {
        icon: Scale,
        title: "Old vs New Regime Optimization",
        text: "Comparative mathematical analysis to select the regime that saves the most tax for your situation.",
      },
      {
        icon: Building2,
        title: "Capital Gains & Advance Tax",
        text: "Accurate computation of short/long-term capital gains on shares, mutual funds, gold, and real estate.",
      },
    ],
    keepReady: [
      "PAN and Aadhaar (linked on e-filing portal)",
      "Form 16 (Part A & B) from your employer(s)",
      "Annual Information Statement (AIS), TIS & Form 26AS",
      "Bank statements & interest certificates for all active savings and fixed deposit accounts",
      "Deduction proofs (Life insurance, ELSS, Health insurance 80D, Home loan interest certificates, NPS)",
      "Capital gains statements from Zerodha, Groww, CAMS, KFintech, or your broker",
    ],
    calculator: {
      label: "Old vs New Tax Regime Comparison Calculator",
      sub: "Instant side-by-side computation of tax liability under both tax regimes",
      to: "/",
      hash: "calculators",
    },
    faqs: [
      {
        q: "Which tax regime is better for salaried individuals: Old or New?",
        a: "Under the New Tax Regime, rates are lower and standard deduction is ₹75,000, but most chapter VI-A deductions are unavailable. If your total deductions (80C, 80D, HRA, home loan interest) exceed ₹3.75–4 Lakhs, the Old Regime may still save more. We calculate both to determine the exact winner.",
      },
      {
        q: "What happens if I miss the 31st July ITR filing deadline?",
        a: "You can file a belated return up to 31st December, but you will incur a late filing fee (up to ₹5,000 under Section 234F), interest on unpaid tax (Section 234A), and you cannot carry forward capital losses.",
      },
      {
        q: "Why is it important to reconcile AIS (Annual Information Statement)?",
        a: "The Income Tax Department automatically matches your return with data reported by banks, mutual funds, and stock exchanges in AIS/TIS. Any mismatch can trigger automated defective return notices.",
      },
      {
        q: "Can you help with notice responses or revised return filings?",
        a: "Yes. We review intimation letters (Section 143(1)), rectify calculation errors, and prepare revised or belated returns before statutory deadlines.",
      },
    ],
  },
  {
    slug: "gst",
    number: "04",
    title: "GST Consultancy & Compliance",
    badge: "Registration & Monthly Filing",
    short: "Stay fully compliant with GST laws, reconciliation and timely returns.",
    description:
      "Practical, dependable support for Goods & Services Tax (GST). From new registrations and amendments to monthly GSTR-1, GSTR-3B filings, input tax credit (ITC) reconciliation, and annual returns.",
    icon: ReceiptText,
    whoItsFor: [
      "New businesses, startups & traders needing fast, hassle-free GST registration",
      "Manufacturers, wholesalers & retailers managing regular monthly sales/purchase filings",
      "E-commerce sellers on Amazon, Flipkart, or Meesho requiring mandatory GST compliance",
      "Small business owners looking to avoid ITC mismatches and GST departmental notices",
    ],
    whatWeHelpWith: [
      {
        icon: BriefcaseBusiness,
        title: "New GST Registration & Modification",
        text: "End-to-end documentation, application filing, address updates, and authorised signatory registration.",
      },
      {
        icon: ReceiptText,
        title: "Monthly GSTR-1 & GSTR-3B Filings",
        text: "Timely computation of outward supplies, tax liability, and return submission before the 11th and 20th.",
      },
      {
        icon: Scale,
        title: "GSTR-2B ITC Reconciliation",
        text: "Rigorous matching of supplier invoices to claim 100% eligible Input Tax Credit and prevent loss of funds.",
      },
      {
        icon: Users2,
        title: "Annual Returns (GSTR-9) & Audit",
        text: "Comprehensive yearly turnover reconciliation, tax payment verification, and audit support.",
      },
    ],
    keepReady: [
      "PAN Card & Aadhaar of proprietor / partners / directors",
      "Business address proof (Electricity bill / Property tax receipt / Rent agreement + NOC)",
      "Bank details (Cancelled cheque / Bank statement / First page of passbook)",
      "Monthly sales register, purchase bills, debit/credit notes, and export documents",
      "E-way bills and delivery challan records for the filing period",
    ],
    calculator: {
      label: "Upcoming Compliance Deadlines & Checklists",
      sub: "View key statutory dates for monthly GSTR-1, GSTR-3B, and annual returns",
      to: "/",
      hash: "compliance",
    },
    faqs: [
      {
        q: "When is GST registration mandatory for a business?",
        a: "Registration is mandatory if aggregate annual turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs in special category states) or ₹20 Lakhs for services. It is also compulsory for inter-state sales and online e-commerce sellers regardless of turnover.",
      },
      {
        q: "What is the QRMP scheme, and is my business eligible?",
        a: "The Quarterly Return Monthly Payment (QRMP) scheme allows registered taxpayers with aggregate turnover up to ₹5 Crore to file GSTR-1 and GSTR-3B quarterly while paying estimated tax monthly via challan.",
      },
      {
        q: "What causes Input Tax Credit (ITC) blockage in GSTR-2B?",
        a: "If your supplier fails to file GSTR-1 on time or inputs an incorrect GSTIN, the invoice will not reflect in your GSTR-2B statement, temporarily blocking your ITC claim. We help track and follow up with non-compliant vendors.",
      },
      {
        q: "What are the late fees for delayed GST return filing?",
        a: "Late fees are ₹50 per day (₹25 CGST + ₹25 SGST) for regular returns and ₹20 per day for Nil returns, plus 18% p.a. interest on unpaid net tax liability.",
      },
    ],
  },
];

export function whatsappLink(text?: string) {
  return `https://wa.me/${contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Upcoming compliance dates. Edit this list each year; past dates are hidden automatically. */
export const keyDates = [
  { date: "2026-10-11", title: "GSTR-1 (monthly)", tag: "GST" },
  { date: "2026-10-20", title: "GSTR-3B (monthly)", tag: "GST" },
  { date: "2026-10-31", title: "ITR for audit cases", tag: "ITR" },
  { date: "2026-12-15", title: "Advance tax – 3rd instalment", tag: "Tax" },
  { date: "2026-12-31", title: "Belated / revised ITR (FY 2025-26)", tag: "ITR" },
  { date: "2026-12-31", title: "GSTR-9 annual return", tag: "GST" },
  { date: "2027-03-15", title: "Advance tax – final instalment", tag: "Tax" },
  { date: "2027-07-31", title: "ITR for individuals (non-audit)", tag: "ITR" },
] as const;

export const checklists = [
  {
    title: "Income Tax Return (ITR)",
    items: [
      "PAN and Aadhaar (linked)",
      "Form 16 / salary slips for the financial year",
      "Form 26AS, Annual Information Statement (AIS) & TIS",
      "Bank account statements and interest certificates",
      "Investment & deduction proofs (80C, 80D, 80G, NPS, etc.)",
      "Home loan interest & principal repayment certificate",
      "Capital gains statements (shares, mutual funds, property)",
      "Rent receipts & landlord PAN (for HRA exemption claim)",
    ],
  },
  {
    title: "GST Registration",
    items: [
      "PAN of the business entity / proprietor / partners / directors",
      "Aadhaar card & passport size photographs of applicants",
      "Proof of principal place of business (electricity bill, property tax receipt, or rent agreement with NOC)",
      "Bank account details (cancelled cheque, passbook copy, or bank statement)",
      "Business registration proof (Partnership deed, Certificate of Incorporation, or MOA/AOA)",
      "Authorisation letter / Board resolution for authorised signatory",
    ],
  },
  {
    title: "GST Return Filing (GSTR-1 & GSTR-3B)",
    items: [
      "Monthly / quarterly sales invoices (B2B, B2C, exports, nil-rated)",
      "Purchase invoices, debit notes and credit notes for the period",
      "GSTR-2B reconciliation for eligible Input Tax Credit (ITC)",
      "Input Tax Credit (ITC) reversal & reverse charge (RCM) details",
      "Previous tax period return filing copies & acknowledgement numbers",
      "E-way bills and delivery challan summaries (where applicable)",
    ],
  },
] as const;

export const faqs = [
  {
    q: "How much life insurance cover do I need?",
    a: "A common starting point is 10–15 times your annual income, adjusted for loans, dependants and existing savings. Try the cover estimator on our homepage, then let us review your situation.",
  },
  {
    q: "Is health insurance from my employer enough?",
    a: "Employer cover usually ends when you change jobs and may be limited. A personal family floater policy gives continuity. We can help you compare options.",
  },
  {
    q: "Should I choose the old or new tax regime?",
    a: "It depends on your deductions. If you claim large deductions (80C, HRA, home loan), the old regime may suit you; otherwise the new regime often works out lower. Use the estimator on our homepage for a rough idea.",
  },
  {
    q: "What happens if I miss the ITR deadline?",
    a: "You can still file a belated return, usually with a late fee and interest on tax due, and some losses cannot be carried forward.",
  },
  {
    q: "Who needs GST registration?",
    a: "Generally businesses above the turnover threshold, inter-state suppliers, and e-commerce sellers, among others. We can check whether it applies to you.",
  },
  {
    q: "How often are GST returns filed?",
    a: "Most regular taxpayers file GSTR-1 and GSTR-3B monthly or quarterly (under QRMP), plus an annual return.",
  },
] as const;
