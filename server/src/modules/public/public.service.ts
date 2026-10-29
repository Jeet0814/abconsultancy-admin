import db from "../../db/connection";

export class PublicService {
  static async getFullSiteContent() {
    // 1. Site Settings
    const settingsRows = await db("site_settings").select("setting_key", "setting_value", "setting_type");
    const settings: Record<string, any> = {};
    for (const row of settingsRows) {
      if (row.setting_type === "number") settings[row.setting_key] = Number(row.setting_value);
      else if (row.setting_type === "boolean") settings[row.setting_key] = row.setting_value === "true";
      else if (row.setting_type === "json") {
        try { settings[row.setting_key] = JSON.parse(row.setting_value); } catch { settings[row.setting_key] = row.setting_value; }
      } else {
        settings[row.setting_key] = row.setting_value;
      }
    }

    // 2. Services with nested features, audiences, checklists, faqs
    const services = await db("services")
      .where({ is_active: true })
      .whereNull("deleted_at")
      .orderBy("sort_order", "asc");

    const servicesWithChildren = await Promise.all(
      services.map(async (svc) => {
        const [features, audiences, checklists, faqs] = await Promise.all([
          db("service_features").where({ service_id: svc.id }).orderBy("sort_order", "asc"),
          db("service_target_audiences").where({ service_id: svc.id }).orderBy("sort_order", "asc"),
          db("service_checklists").where({ service_id: svc.id }).orderBy("sort_order", "asc"),
          db("faqs").where({ service_id: svc.id, is_active: true }).whereNull("deleted_at").orderBy("sort_order", "asc"),
        ]);

        return {
          id: svc.id,
          slug: svc.slug,
          number: svc.number_label,
          title: svc.title,
          badge: svc.badge,
          short: svc.short_description,
          description: svc.full_description,
          iconName: svc.icon_name,
          calculator: {
            label: svc.calculator_label,
            sub: svc.calculator_sub,
            to: "/",
            hash: svc.calculator_hash,
          },
          whoItsFor: audiences.map((a) => a.audience_text),
          whatWeHelpWith: features.map((f) => ({
            iconName: f.icon_name,
            title: f.title,
            text: f.description,
          })),
          keepReady: checklists.map((c) => c.document_name),
          faqs: faqs.map((faq) => ({ q: faq.question, a: faq.answer })),
        };
      }),
    );

    // 3. Approved Testimonials
    const testimonials = await db("testimonials")
      .select("id", "name", "service_used as service", "message", "rating", "is_featured")
      .where({ status: "approved" })
      .whereNull("deleted_at")
      .orderBy("sort_order", "asc")
      .orderBy("created_at", "desc")
      .limit(16);

    // 4. General FAQs
    const generalFaqs = await db("faqs")
      .select("id", "question as q", "answer as a")
      .whereNull("service_id")
      .where({ is_active: true })
      .whereNull("deleted_at")
      .orderBy("sort_order", "asc");

    // 5. Key Compliance Dates
    const keyDates = await db("key_dates")
      .select("id", "event_date as date", "title", "category as tag", "notes")
      .where({ is_active: true })
      .whereNull("deleted_at")
      .orderBy("event_date", "asc");

    // 6. Master Document Checklists
    const rawChecklists = await db("document_checklists")
      .where({ is_active: true })
      .whereNull("deleted_at")
      .orderBy("sort_order", "asc");

    const checklists = await Promise.all(
      rawChecklists.map(async (c) => {
        const items = await db("checklist_items").where({ checklist_id: c.id }).orderBy("sort_order", "asc");
        return {
          id: c.id,
          slug: c.slug,
          title: c.title,
          category: c.category,
          items: items.map((i) => i.item_text),
        };
      }),
    );

    // 7. Partners & Credentials
    const partnersAndCredentials = await db("credentials_partners")
      .where({ is_active: true })
      .whereNull("deleted_at")
      .orderBy("sort_order", "asc");

    const partners = partnersAndCredentials
      .filter((p) => p.item_type === "partner")
      .map((p) => ({
        id: String(p.id),
        name: p.name,
        category: p.category,
        tagline: p.tagline,
        logoUrl: p.logo_url,
        badgeClass: p.badge_class,
        linkUrl: p.link_url,
      }));

    const officialCredentials = partnersAndCredentials
      .filter((p) => p.item_type === "credential")
      .map((c) => ({
        id: String(c.id),
        label: c.name,
        value: c.registration_number,
        note: c.tagline,
        logoUrl: c.logo_url,
      }));

    // 8. About Section (Founder & Milestones)
    const [founderSection, valuesSection, milestones, slides] = await Promise.all([
      db("about_content").where({ section_key: "founder_profile" }).first(),
      db("about_content").where({ section_key: "core_values" }).first(),
      db("milestones").where({ is_active: true }).orderBy("sort_order", "asc"),
      db("carousel_slides")
        .where({ is_active: true })
        .whereNull("deleted_at")
        .orderBy("sort_order", "asc")
        .select("id", "title", "subtitle", "image_url as imageUrl", "cta_label as ctaLabel", "cta_link as ctaLink"),
    ]);

    let founder = null;
    let values = [];
    if (founderSection) {
      try { founder = typeof founderSection.content_payload === "string" ? JSON.parse(founderSection.content_payload) : founderSection.content_payload; } catch {}
    }
    if (valuesSection) {
      try { values = typeof valuesSection.content_payload === "string" ? JSON.parse(valuesSection.content_payload) : valuesSection.content_payload; } catch {}
    }

    return {
      settings,
      services: servicesWithChildren,
      testimonials,
      generalFaqs,
      keyDates,
      checklists,
      partners,
      officialCredentials,
      about: {
        founder,
        values,
        milestones: milestones.map((m) => ({
          year: m.year_label,
          title: m.title,
          description: m.description,
        })),
      },
      slides: slides || [],
    };
  }

  static async submitInquiry(payload: {
    name: string;
    phone: string;
    email?: string;
    service: string;
    message: string;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Generate unique reference number like AB-2026-1042
    const currentYear = new Date().getFullYear();
    const countResult = await db("inquiries").count("id as total").first();
    const sequence = Number(countResult?.total || 0) + 1001;
    const referenceNo = `AB-${currentYear}-${sequence}`;

    const [id] = await db("inquiries").insert({
      reference_no: referenceNo,
      name: payload.name.trim(),
      phone: payload.phone.trim(),
      email: payload.email?.trim() || null,
      service_requested: payload.service.trim(),
      message: payload.message.trim(),
      status: "New",
      priority: "Medium",
      source_channel: payload.source || "contact_form",
      ip_address: payload.ipAddress || null,
      user_agent: payload.userAgent || null,
    });

    // Record initial status history
    await db("inquiry_status_history").insert({
      inquiry_id: id,
      changed_by_user_id: null,
      old_status: null,
      new_status: "New",
      remarks: `Inquiry submitted via ${payload.source || "contact_form"}`,
    });

    return { id, referenceNo };
  }

  static async submitTestimonial(payload: {
    name: string;
    service?: string;
    rating: number;
    message: string;
  }) {
    const [id] = await db("testimonials").insert({
      name: payload.name.trim(),
      service_used: payload.service?.trim() || null,
      rating: payload.rating,
      message: payload.message.trim(),
      status: "pending",
      source: "public_form",
      is_featured: false,
    });

    return { id };
  }
}
