import type { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing records in reverse dependency order
  await knex("inquiry_tag_mappings").del();
  await knex("inquiry_tags").del();
  await knex("inquiry_status_history").del();
  await knex("inquiry_notes").del();
  await knex("inquiries").del();
  await knex("milestones").del();
  await knex("about_content").del();
  await knex("credentials_partners").del();
  await knex("checklist_items").del();
  await knex("document_checklists").del();
  await knex("key_dates").del();
  await knex("faqs").del();
  await knex("testimonials").del();
  await knex("service_checklists").del();
  await knex("service_target_audiences").del();
  await knex("service_features").del();
  await knex("services").del();
  await knex("carousel_slides").del();
  await knex("site_settings").del();
  await knex("audit_logs").del();
  await knex("users").del();

  // 1. Seed Initial Super Admin
  const adminEmail = process.env.SUPERADMIN_EMAIL || "abtaxway@gmail.com";
  const adminName = process.env.SUPERADMIN_NAME || "Anilkumarsingh Bhadauria";
  const adminPassword = process.env.SUPERADMIN_PASSWORD || "ChangeMe@2026#Secure";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const [adminId] = await knex("users").insert({
    name: adminName,
    email: adminEmail,
    password_hash: passwordHash,
    role: "super_admin",
    is_active: true,
  });

  // 2. Seed Site Settings
  await knex("site_settings").insert([
    { setting_group: "brand", setting_key: "brand_name", setting_value: "A B Taxway", setting_type: "text" },
    { setting_group: "brand", setting_key: "brand_full_name", setting_value: "A B Taxway Consultancy", setting_type: "text" },
    { setting_group: "brand", setting_key: "tagline", setting_value: "Helping Build The Wealthy Life", setting_type: "text" },
    { setting_group: "brand", setting_key: "since_year", setting_value: "2004", setting_type: "number" },
    { setting_group: "contact", setting_key: "advisor_name", setting_value: "Anilkumarsingh Bhadauria", setting_type: "text" },
    { setting_group: "contact", setting_key: "advisor_title", setting_value: "Founder & Financial Advisor", setting_type: "text" },
    { setting_group: "contact", setting_key: "phone_display", setting_value: "+91 94268 44926", setting_type: "text" },
    { setting_group: "contact", setting_key: "phone_raw", setting_value: "+919426844926", setting_type: "text" },
    { setting_group: "contact", setting_key: "whatsapp_number", setting_value: "919426844926", setting_type: "text" },
    { setting_group: "contact", setting_key: "email_address", setting_value: "abtaxway@gmail.com", setting_type: "text" },
    { setting_group: "contact", setting_key: "office_hours", setting_value: "Monday – Saturday: 10:00 AM – 7:00 PM", setting_type: "text" },
    { setting_group: "address", setting_key: "address_title", setting_value: "A B Taxway Consultancy", setting_type: "text" },
    { setting_group: "address", setting_key: "address_line1", setting_value: "Office No. 12, Commercial Plaza, Main Market", setting_type: "text" },
    { setting_group: "address", setting_key: "address_city", setting_value: "Ahmedabad, Gujarat", setting_type: "text" },
    { setting_group: "address", setting_key: "address_pincode", setting_value: "380001", setting_type: "text" },
    { setting_group: "address", setting_key: "google_maps_url", setting_value: "https://www.google.com/maps/search/?api=1&query=Office+No.+12+Commercial+Plaza+Main+Market+Ahmedabad+Gujarat+380001", setting_type: "text" },
    { setting_group: "address", setting_key: "google_maps_embed_url", setting_value: "https://maps.google.com/maps?q=Office%20No.%2012,%20Commercial%20Plaza,%20Main%20Market,%20Ahmedabad,%20Gujarat%20380001&t=&z=14&ie=UTF8&iwloc=&output=embed", setting_type: "text" },
  ]);

  // 3. Seed Services & Sub-items
  const servicesData = [
    {
      slug: "insurance",
      number_label: "01",
      title: "Insurance Advisory",
      badge: "Life, Health & Assets",
      short_description: "The right cover for the people and things that matter most.",
      full_description: "Explore comprehensive protection for your family, healthcare expenses, vehicles, residential property, and business assets. We help you compare policies, understand hidden exclusions, and ensure seamless claim assistance.",
      icon_name: "ShieldCheck",
      calculator_label: "Life Cover & Human Life Value (HLV) Calculator",
      calculator_sub: "Estimate the ideal term cover needed for your family's future",
      calculator_hash: "calculators",
      sort_order: 1,
      is_active: true,
      features: [
        { icon_name: "HeartPulse", title: "Life & Term Protection", description: "Pure term insurance with critical illness riders and family income benefit options.", sort_order: 1 },
        { icon_name: "ShieldCheck", title: "Health & Mediclaim", description: "Individual, family floater, OPD benefits, and pre-existing disease coverage guidance.", sort_order: 2 },
        { icon_name: "CarFront", title: "Motor & Vehicle Insurance", description: "Comprehensive, zero-depreciation, engine protect, and third-party commercial vehicle covers.", sort_order: 3 },
        { icon_name: "Home", title: "Home & Property Insurance", description: "Fire, flood, theft, and natural calamity protection for your residence and home contents.", sort_order: 4 },
      ],
      audiences: [
        "Sole earning members seeking sufficient life cover for dependants",
        "Families looking for high-sum insured health insurance & super top-ups",
        "Senior citizen parents needing tailored health & critical illness cover",
        "Vehicle & property owners requiring zero-depreciation and all-risk policies",
      ],
      checklists: [
        "PAN Card & Aadhaar of the proposer and insured members",
        "Existing policy bond copies (if reviewing or renewing existing cover)",
        "Recent medical history, doctor prescriptions & discharge summaries (if any)",
        "Income proof (Form 16 / ITR acknowledgement / 3 months salary slips) for high term covers",
      ],
      faqs: [
        { q: "How much life insurance cover is really recommended?", a: "A reliable rule of thumb is 10–15 times your gross annual income, plus any outstanding home loans and personal liabilities, minus your existing liquid savings. We compute this using the Human Life Value (HLV) method during consultation." },
        { q: "Is the health insurance provided by my employer sufficient?", a: "Corporate policies terminate immediately if you switch jobs or retire, and often have room-rent sub-limits and co-payments. A personal or family floater policy guarantees uninterrupted lifelong renewability." },
        { q: "What is the waiting period for pre-existing diseases in health insurance?", a: "Standard retail health policies have a 24 to 36 month waiting period for declared pre-existing ailments (like diabetes or hypertension). We guide you toward policies with shorter waiting periods or specific buyback riders." },
        { q: "How do you help during the claim settlement process?", a: "We assist with cashless pre-authorisation paperwork, coordinate with third-party administrators (TPAs), and ensure reimbursement bills are filed accurately without deductions." },
      ],
    },
    {
      slug: "investments",
      number_label: "02",
      title: "Investment & Wealth Planning",
      badge: "SIP, Mutual Funds & Goals",
      short_description: "Disciplined wealth creation mapped to your financial priorities.",
      full_description: "Bring your financial goals, time horizon, and risk appetite into clear focus. We help you design disciplined SIP strategies, review existing portfolios, and structure savings for child education, retirement, and emergency funds.",
      icon_name: "TrendingUp",
      calculator_label: "SIP Wealth Growth & Compounding Calculator",
      calculator_sub: "Simulate future corpus growth with monthly systematic investments",
      calculator_hash: "calculators",
      sort_order: 2,
      is_active: true,
      features: [
        { icon_name: "TrendingUp", title: "Goal-Based SIP Planning", description: "Align equity and hybrid mutual funds to specific target years and future milestones.", sort_order: 1 },
        { icon_name: "FileText", title: "Portfolio Health Check", description: "Audit your existing mutual fund schemes, eliminate overlapping holdings, and balance risk.", sort_order: 2 },
        { icon_name: "Coins", title: "Retirement & Pension Corpus", description: "Design accumulation strategies during earning years and systematic withdrawal plans (SWP) post-retirement.", sort_order: 3 },
        { icon_name: "Scale", title: "Emergency & Debt Allocation", description: "Allocate liquid and short-duration debt funds for unpredictable life events and capital safety.", sort_order: 4 },
      ],
      audiences: [
        "Salaried professionals starting structured wealth creation through monthly SIPs",
        "Parents planning long-term funds for higher education & children's marriage",
        "Individuals approaching retirement wanting stable, tax-efficient regular cash flows",
        "Investors with scattered schemes looking for a consolidated portfolio review",
      ],
      checklists: [
        "PAN Card & Aadhaar (KYC compliant)",
        "Bank account details (cancelled cheque with printed name)",
        "Consolidated Account Statement (CAS) or portfolio PDF if reviewing existing investments",
        "List of short-term (1-3 yrs), medium-term (3-7 yrs), and long-term (7+ yrs) goals",
      ],
      faqs: [
        { q: "How is an SIP better than a lump-sum investment?", a: "Systematic Investment Plans (SIPs) enforce financial discipline and average out market volatility through Rupee Cost Averaging, allowing you to buy more units when markets dip." },
        { q: "Can I increase or pause my SIP amount whenever I want?", a: "Yes. Modern mutual fund SIPs offer step-up options to increase with your annual salary increments, and you can pause, stop, or redeem without penalty in open-ended schemes." },
        { q: "How often should I review my investment portfolio?", a: "An annual review is ideal. We track scheme performance against category benchmarks, ensure asset allocation remains within your target risk limits, and rebalance where needed." },
        { q: "What is the difference between Direct and Regular mutual funds?", a: "Regular plans include professional advisory and ongoing support from an AMFI-registered distributor for documentation, switches, nomination updates, and tax reporting." },
      ],
    },
    {
      slug: "income-tax",
      number_label: "03",
      title: "Income Tax & ITR Filing",
      badge: "Individual & Business Tax",
      short_description: "Accurate filing support and proactive tax optimisation without confusion.",
      full_description: "Get hands-on help organising documents, computing complex capital gains, maximising eligible deductions (80C, 80D, 80G, HRA, home loan interest), and e-filing your returns securely before deadlines.",
      icon_name: "FileText",
      calculator_label: "Old vs New Tax Regime Comparison Calculator",
      calculator_sub: "Instant side-by-side computation of tax liability under both tax regimes",
      calculator_hash: "calculators",
      sort_order: 3,
      is_active: true,
      features: [
        { icon_name: "FileText", title: "ITR-1 to ITR-4 E-Filing", description: "Error-free return preparation for salaried employees, pensioners, house owners, and professionals.", sort_order: 1 },
        { icon_name: "ReceiptText", title: "AIS / TIS & 26AS Reconciliation", description: "Thorough cross-checking of high-value transactions, TDS deductions, and interest records.", sort_order: 2 },
        { icon_name: "Scale", title: "Old vs New Regime Optimization", description: "Comparative mathematical analysis to select the regime that saves the most tax for your situation.", sort_order: 3 },
        { icon_name: "Building2", title: "Capital Gains & Advance Tax", description: "Accurate computation of short/long-term capital gains on shares, mutual funds, gold, and real estate.", sort_order: 4 },
      ],
      audiences: [
        "Salaried individuals with multiple Form 16s, house property income, or HRA claims",
        "Traders & equity investors with capital gains/losses from stocks, mutual funds & F&O",
        "Freelancers, consultants & professionals eligible for Presumptive Taxation (44ADA)",
        "Business proprietors wanting smooth year-end tax computations and advance tax planning",
      ],
      checklists: [
        "PAN and Aadhaar (linked on e-filing portal)",
        "Form 16 (Part A & B) from your employer(s)",
        "Annual Information Statement (AIS), TIS & Form 26AS",
        "Bank statements & interest certificates for all active savings and fixed deposit accounts",
        "Deduction proofs (Life insurance, ELSS, Health insurance 80D, Home loan interest certificates, NPS)",
        "Capital gains statements from Zerodha, Groww, CAMS, KFintech, or your broker",
      ],
      faqs: [
        { q: "Which tax regime is better for salaried individuals: Old or New?", a: "Under the New Tax Regime, rates are lower and standard deduction is ₹75,000, but most chapter VI-A deductions are unavailable. If your total deductions (80C, 80D, HRA, home loan interest) exceed ₹3.75–4 Lakhs, the Old Regime may still save more. We calculate both to determine the exact winner." },
        { q: "What happens if I miss the 31st July ITR filing deadline?", a: "You can file a belated return up to 31st December, but you will incur a late filing fee (up to ₹5,000 under Section 234F), interest on unpaid tax (Section 234A), and you cannot carry forward capital losses." },
        { q: "Why is it important to reconcile AIS (Annual Information Statement)?", a: "The Income Tax Department automatically matches your return with data reported by banks, mutual funds, and stock exchanges in AIS/TIS. Any mismatch can trigger automated defective return notices." },
        { q: "Can you help with notice responses or revised return filings?", a: "Yes. We review intimation letters (Section 143(1)), rectify calculation errors, and prepare revised or belated returns before statutory deadlines." },
      ],
    },
    {
      slug: "gst",
      number_label: "04",
      title: "GST Consultancy & Compliance",
      badge: "Registration & Monthly Filing",
      short_description: "Stay fully compliant with GST laws, reconciliation and timely returns.",
      full_description: "Practical, dependable support for Goods & Services Tax (GST). From new registrations and amendments to monthly GSTR-1, GSTR-3B filings, input tax credit (ITC) reconciliation, and annual returns.",
      icon_name: "ReceiptText",
      calculator_label: "Upcoming Compliance Deadlines & Checklists",
      calculator_sub: "View key statutory dates for monthly GSTR-1, GSTR-3B, and annual returns",
      calculator_hash: "compliance",
      sort_order: 4,
      is_active: true,
      features: [
        { icon_name: "BriefcaseBusiness", title: "New GST Registration & Modification", description: "End-to-end documentation, application filing, address updates, and authorised signatory registration.", sort_order: 1 },
        { icon_name: "ReceiptText", title: "Monthly GSTR-1 & GSTR-3B Filings", description: "Timely computation of outward supplies, tax liability, and return submission before the 11th and 20th.", sort_order: 2 },
        { icon_name: "Scale", title: "GSTR-2B ITC Reconciliation", description: "Rigorous matching of supplier invoices to claim 100% eligible Input Tax Credit and prevent loss of funds.", sort_order: 3 },
        { icon_name: "Users2", title: "Annual Returns (GSTR-9) & Audit", description: "Comprehensive yearly turnover reconciliation, tax payment verification, and audit support.", sort_order: 4 },
      ],
      audiences: [
        "New businesses, startups & traders needing fast, hassle-free GST registration",
        "Manufacturers, wholesalers & retailers managing regular monthly sales/purchase filings",
        "E-commerce sellers on Amazon, Flipkart, or Meesho requiring mandatory GST compliance",
        "Small business owners looking to avoid ITC mismatches and GST departmental notices",
      ],
      checklists: [
        "PAN Card & Aadhaar of proprietor / partners / directors",
        "Business address proof (Electricity bill / Property tax receipt / Rent agreement + NOC)",
        "Bank details (Cancelled cheque / Bank statement / First page of passbook)",
        "Monthly sales register, purchase bills, debit/credit notes, and export documents",
        "E-way bills and delivery challan records for the filing period",
      ],
      faqs: [
        { q: "When is GST registration mandatory for a business?", a: "Registration is mandatory if aggregate annual turnover exceeds ₹40 Lakhs for goods (₹20 Lakhs in special category states) or ₹20 Lakhs for services. It is also compulsory for inter-state sales and online e-commerce sellers regardless of turnover." },
        { q: "What is the QRMP scheme, and is my business eligible?", a: "The Quarterly Return Monthly Payment (QRMP) scheme allows registered taxpayers with aggregate turnover up to ₹5 Crore to file GSTR-1 and GSTR-3B quarterly while paying estimated tax monthly via challan." },
        { q: "What causes Input Tax Credit (ITC) blockage in GSTR-2B?", a: "If your supplier fails to file GSTR-1 on time or inputs an incorrect GSTIN, the invoice will not reflect in your GSTR-2B statement, temporarily blocking your ITC claim. We help track and follow up with non-compliant vendors." },
        { q: "What are the late fees for delayed GST return filing?", a: "Late fees are ₹50 per day (₹25 CGST + ₹25 SGST) for regular returns and ₹20 per day for Nil returns, plus 18% p.a. interest on unpaid net tax liability." },
      ],
    },
  ];

  for (const s of servicesData) {
    const [serviceId] = await knex("services").insert({
      slug: s.slug,
      number_label: s.number_label,
      title: s.title,
      badge: s.badge,
      short_description: s.short_description,
      full_description: s.full_description,
      icon_name: s.icon_name,
      calculator_label: s.calculator_label,
      calculator_sub: s.calculator_sub,
      calculator_hash: s.calculator_hash,
      sort_order: s.sort_order,
      is_active: s.is_active,
    });

    for (const f of s.features) {
      await knex("service_features").insert({ service_id: serviceId, title: f.title, description: f.description, icon_name: f.icon_name, sort_order: f.sort_order });
    }

    for (let i = 0; i < s.audiences.length; i++) {
      await knex("service_target_audiences").insert({ service_id: serviceId, audience_text: s.audiences[i], sort_order: i + 1 });
    }

    for (let i = 0; i < s.checklists.length; i++) {
      await knex("service_checklists").insert({ service_id: serviceId, document_name: s.checklists[i], sort_order: i + 1 });
    }

    for (let i = 0; i < s.faqs.length; i++) {
      await knex("faqs").insert({ service_id: serviceId, category: s.title, question: s.faqs[i].q, answer: s.faqs[i].a, sort_order: i + 1, is_active: true });
    }
  }

  // 4. Seed General FAQs
  const generalFaqs = [
    { q: "How much life insurance cover do I need?", a: "A common starting point is 10–15 times your annual income, adjusted for loans, dependants and existing savings. Try the cover estimator on our homepage, then let us review your situation." },
    { q: "Is health insurance from my employer enough?", a: "Employer cover usually ends when you change jobs and may be limited. A personal family floater policy gives continuity. We can help you compare options." },
    { q: "Should I choose the old or new tax regime?", a: "It depends on your deductions. If you claim large deductions (80C, HRA, home loan), the old regime may suit you; otherwise the new regime often works out lower. Use the estimator on our homepage for a rough idea." },
    { q: "What happens if I miss the ITR deadline?", a: "You can still file a belated return, usually with a late fee and interest on tax due, and some losses cannot be carried forward." },
    { q: "Who needs GST registration?", a: "Generally businesses above the turnover threshold, inter-state suppliers, and e-commerce sellers, among others. We can check whether it applies to you." },
    { q: "How often are GST returns filed?", a: "Most regular taxpayers file GSTR-1 and GSTR-3B monthly or quarterly (under QRMP), plus an annual return." },
  ];

  for (let i = 0; i < generalFaqs.length; i++) {
    await knex("faqs").insert({ service_id: null, category: "General", question: generalFaqs[i].q, answer: generalFaqs[i].a, sort_order: i + 1, is_active: true });
  }

  // 5. Seed Key Compliance Dates
  const keyDatesData = [
    { event_date: "2026-10-11", title: "GSTR-1 (monthly)", category: "GST", sort_order: 1 },
    { event_date: "2026-10-20", title: "GSTR-3B (monthly)", category: "GST", sort_order: 2 },
    { event_date: "2026-10-31", title: "ITR for audit cases", category: "ITR", sort_order: 3 },
    { event_date: "2026-12-15", title: "Advance tax – 3rd instalment", category: "Tax", sort_order: 4 },
    { event_date: "2026-12-31", title: "Belated / revised ITR (FY 2025-26)", category: "ITR", sort_order: 5 },
    { event_date: "2026-12-31", title: "GSTR-9 annual return", category: "GST", sort_order: 6 },
    { event_date: "2027-03-15", title: "Advance tax – final instalment", category: "Tax", sort_order: 7 },
    { event_date: "2027-07-31", title: "ITR for individuals (non-audit)", category: "ITR", sort_order: 8 },
  ];

  for (const kd of keyDatesData) {
    await knex("key_dates").insert({ ...kd, is_active: true });
  }

  // 6. Seed Master Document Checklists
  const checklistsData = [
    {
      slug: "itr-filing",
      title: "Income Tax Return (ITR)",
      category: "Income Tax",
      sort_order: 1,
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
      slug: "gst-registration",
      title: "GST Registration",
      category: "GST",
      sort_order: 2,
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
      slug: "gst-return-filing",
      title: "GST Return Filing (GSTR-1 & GSTR-3B)",
      category: "GST",
      sort_order: 3,
      items: [
        "Monthly / quarterly sales invoices (B2B, B2C, exports, nil-rated)",
        "Purchase invoices, debit notes and credit notes for the period",
        "GSTR-2B reconciliation for eligible Input Tax Credit (ITC)",
        "Input Tax Credit (ITC) reversal & reverse charge (RCM) details",
        "Previous tax period return filing copies & acknowledgement numbers",
        "E-way bills and delivery challan summaries (where applicable)",
      ],
    },
  ];

  for (const c of checklistsData) {
    const [cId] = await knex("document_checklists").insert({ slug: c.slug, title: c.title, category: c.category, sort_order: c.sort_order, is_active: true });
    for (let i = 0; i < c.items.length; i++) {
      await knex("checklist_items").insert({ checklist_id: cId, item_text: c.items[i], sort_order: i + 1 });
    }
  }

  // 7. Seed Partners & Official Credentials
  const partnersData = [
    {
      item_type: "partner",
      name: "LIC of India",
      category: "Life & Pension",
      tagline: "Life Insurance Corporation of India",
      logo_url: "/partners/lic.png",
      badge_class: "from-amber-500/15 to-yellow-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400",
      sort_order: 1,
      is_active: true,
    },
    {
      item_type: "partner",
      name: "Taxway",
      category: "Tax & Accounting",
      tagline: "Professional Accounting Solutions ®",
      logo_url: "/partners/taxway.png",
      badge_class: "from-emerald-500/15 to-green-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
      sort_order: 2,
      is_active: true,
    },
    {
      item_type: "partner",
      name: "NJ Mutual Fund",
      category: "Mutual Funds & SIP",
      tagline: "NJ India Invest • Built on Rules",
      logo_url: "/partners/nj-mutual-fund.png",
      badge_class: "from-red-500/15 to-rose-500/10 border-red-500/30 text-red-700 dark:text-red-400",
      sort_order: 3,
      is_active: true,
    },
    {
      item_type: "partner",
      name: "Turtlemint",
      category: "InsurTech Advisory",
      tagline: "Multi-Insurer Technology Partner",
      logo_url: "/partners/turtlemint.png",
      badge_class: "from-teal-500/15 to-emerald-500/10 border-teal-500/30 text-teal-700 dark:text-teal-400",
      sort_order: 4,
      is_active: true,
    },
    {
      item_type: "partner",
      name: "HDFC Life",
      category: "Life & Health",
      tagline: "Sar Utha Ke Jiyo • Protection",
      logo_url: "/partners/hdfc-life.png",
      badge_class: "from-blue-500/15 to-indigo-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400",
      sort_order: 5,
      is_active: true,
    },
    {
      item_type: "credential",
      name: "IRDAI / POSP Registration",
      category: "Insurance",
      tagline: "Authorized Insurance Advisory (Life, Health & General)",
      registration_number: "",
      logo_url: "/icons/shield.svg",
      sort_order: 6,
      is_active: true,
    },
    {
      item_type: "credential",
      name: "AMFI ARN License",
      category: "Mutual Funds",
      tagline: "Registered Mutual Fund & SIP Distribution",
      registration_number: "",
      logo_url: "/icons/trending.svg",
      sort_order: 7,
      is_active: true,
    },
    {
      item_type: "credential",
      name: "Tax Practitioner Registration",
      category: "Tax",
      tagline: "Income Tax & GST Compliance Desk",
      registration_number: "",
      logo_url: "/icons/file.svg",
      sort_order: 8,
      is_active: true,
    },
  ];

  for (const p of partnersData) {
    await knex("credentials_partners").insert(p as any);
  }

  // 8. Seed About Founder, Milestones & Values
  await knex("about_content").insert([
    {
      section_key: "founder_profile",
      content_payload: JSON.stringify({
        name: "Anilkumarsingh Bhadauria",
        role: "Founder & Principal Advisor",
        experienceYears: 22,
        qualifications: "Financial Advisor, Tax Practitioner & General Insurance Specialist",
        bio: "Guiding individuals, families, and business owners across Ahmedabad and India since 2004. Dedicated to transparent, ethical, and customized financial solutions with our guiding motto: Helping Build The Wealthy Life.",
        photo: "",
      }),
    },
    {
      section_key: "core_values",
      content_payload: JSON.stringify([
        { title: "Unbiased & Need-Based", description: "Every insurance policy, mutual fund SIP, and tax deduction is customized to your exact financial profile and life stage—never driven by sales targets." },
        { title: "End-to-End Claim Support", description: "We stand firmly beside you and your family when it matters most, guiding documentation and settlement processes with insurers." },
        { title: "Meticulous Compliance", description: "Error-free tax computation and proactive deadline reminders ensure you stay compliant without last-minute panic or penalties." },
        { title: "Lifelong Partnership", description: "Financial planning is not a one-time transaction. We conduct ongoing reviews to keep your portfolio aligned with your changing life goals." },
      ]),
    },
  ]);

  const milestonesData = [
    { year_label: "2004", title: "Inception of Advisory Practice", description: "Founded by Anilkumarsingh Bhadauria with a mission to deliver transparent, client-first life and general insurance advisory in Ahmedabad.", sort_order: 1, is_active: true },
    { year_label: "2010", title: "Tax Planning & ITR Filing Expansion", description: "Expanded core practice into end-to-end Income Tax Return (ITR) preparation, deduction planning, and individual tax compliance.", sort_order: 2, is_active: true },
    { year_label: "2017", title: "Dedicated GST & MSME Desk", description: "Guided local business owners, traders, and service providers through the nationwide GST rollout, e-way bills, and monthly GSTR compliance.", sort_order: 3, is_active: true },
    { year_label: "Present", title: "Comprehensive Wealth & Protection Hub", description: "Over 22 years of trusted service, supporting hundreds of client families and businesses under the ethos 'Helping Build The Wealthy Life'.", sort_order: 4, is_active: true },
  ];

  for (const m of milestonesData) {
    await knex("milestones").insert(m);
  }

  // 9. Seed Inquiry Tags
  const defaultTags = [
    { tag_name: "High Priority", color_hex: "#dc2626" },
    { tag_name: "ITR Filing", color_hex: "#2563eb" },
    { tag_name: "GST Compliance", color_hex: "#059669" },
    { tag_name: "Life Insurance", color_hex: "#d97706" },
    { tag_name: "Mediclaim", color_hex: "#7c3aed" },
    { tag_name: "Mutual Fund SIP", color_hex: "#0284c7" },
  ];

  for (const t of defaultTags) {
    await knex("inquiry_tags").insert(t);
  }

  console.log(`[Seed Complete] Super Admin created: ${adminEmail}`);
}
