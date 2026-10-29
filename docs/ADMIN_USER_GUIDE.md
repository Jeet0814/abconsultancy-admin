# A B Taxway Consultancy — Administrator & Staff User Manual

Welcome to the **A B Taxway Consultancy Admin Portal**. This manual provides step-by-step guidance for managing prospective client inquiries, content updates, and staff accounts.

---

## 1. Accessing the Portal & Logging In

1. Open your browser and navigate to the admin portal URL (e.g. `http://localhost:5174` in development or `https://admin.abtaxway.com` in production).
2. Enter your authorized staff email address and password.
3. Tap **Sign in to Cockpit**.
4. Sessions use encrypted **256-bit httpOnly cookies**. For security, you will be automatically prompted to re-authenticate when your session expires.

---

## 2. Managing Prospective Client Inquiries & CRM

The **Enquiries & Leads** module is the central hub for tracking inbound client requests.

### 2.1 Inquiry Lifecycle & Statuses
- **New**: Fresh inquiry submitted via the website contact form.
- **Contacted**: Advisor has called or messaged the client via WhatsApp.
- **In Progress**: Active discussion regarding policy quotes, ITR computation, or GST documentation.
- **Follow-up**: Client requested a callback on a specific date (e.g., after salary credit or tax audit).
- **Converted**: Client successfully filed ITR, purchased an insurance policy, or registered for GST.
- **Closed**: Inquiry resolved or completed.
- **Spam**: Invalid or promotional automated submissions.

### 2.2 Quick Action Triggers
Inside any inquiry detail drawer:
- **Call Client**: Immediately triggers your phone dialer (`tel:+91...`).
- **WhatsApp Chat**: Opens a pre-filled WhatsApp conversation directly to the client's mobile number.
- **Email**: Launches your default mail client (`mailto:...`).
- **Mark Contacted**: 1-click status update that simultaneously timestamps the activity log.

### 2.3 Adding Internal Notes & Follow-ups
1. Open the inquiry.
2. Scroll to **Internal Consultation Notes**.
3. Type your notes (e.g. *“Client needs 1 Cr Term Life quote for 32yo non-smoker. Form 16 received.”*).
4. Check **Pin note to top** if it contains critical case details.
5. Tap **Post Note**.
6. Under **Follow-up Scheduled**, pick a future calendar date to receive reminders on the dashboard.

---

## 3. Moderating Testimonials

When a client shares their review using the public "Share your experience" form:
1. Navigate to **Testimonials** in the sidebar.
2. The submission appears in the **Pending** tab.
3. Tap the **Green Check (Approve)** icon to publish it to the live website.
4. Tap the **Star (Featured)** icon to highlight it prominently on the homepage carousel.
5. Tap the **Cross (Reject)** icon if the submission is spam.

---

## 4. Updating Compliance Deadlines & Checklists

1. Navigate to **Compliance Dates**.
2. Tap **Add Deadline** or edit an existing date.
3. Select the statutory date (e.g., `2026-10-20`), category (`GST` or `ITR`), and title (`GSTR-3B Monthly Return`).
4. Tap **Save Deadline**. The public compliance banner updates automatically.

---

## 5. Editing Services, FAQs & Partner Logos

- **Services**: Change badge tags, "What We Help With" sub-features, or "Keep Ready" document requirements.
- **FAQs**: Add or update answers to common taxpayer and insurance questions.
- **Partners & Licences**: Upload partner brand logos (LIC, HDFC, Turtlemint) or update official registration numbers (IRDAI / AMFI / Tax Practitioner). Uploaded images are automatically compressed into optimized WebP formats.

---

## 6. Security & Profile Best Practices

- Change your password periodically under **Profile & Security**.
- Use passwords with at least 8 characters containing uppercase letters, numbers, and special symbols.
- Never share administrator login credentials with third parties.
