import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Users Table
  await knex.schema.createTable("users", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 100).notNullable();
    table.string("email", 191).notNullable().unique();
    table.string("password_hash", 255).notNullable();
    table.enum("role", ["super_admin", "admin", "staff"]).defaultTo("staff").notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.datetime("last_login_at").nullable();
    table.string("refresh_token_hash", 255).nullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["email", "role", "is_active"], "idx_users_lookup");
  });

  // 2. Audit Logs Table
  await knex.schema.createTable("audit_logs", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.string("action", 50).notNullable(); // CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT
    table.string("entity_name", 100).notNullable(); // services, inquiries, settings, etc.
    table.string("entity_id", 100).nullable();
    table.json("old_values").nullable();
    table.json("new_values").nullable();
    table.string("ip_address", 45).nullable();
    table.text("user_agent").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.index(["entity_name", "created_at"], "idx_audit_entity_time");
    table.index(["user_id", "created_at"], "idx_audit_user_time");
  });

  // 3. Site Settings Table
  await knex.schema.createTable("site_settings", (table) => {
    table.bigIncrements("id").primary();
    table.string("setting_group", 50).defaultTo("general").notNullable();
    table.string("setting_key", 100).notNullable().unique();
    table.text("setting_value").notNullable();
    table.string("setting_type", 30).defaultTo("text").notNullable(); // text, json, boolean, number, image
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
    table.index(["setting_group"], "idx_settings_group");
  });

  // 4. Carousel Slides Table
  await knex.schema.createTable("carousel_slides", (table) => {
    table.bigIncrements("id").primary();
    table.string("title", 200).notNullable();
    table.string("subtitle", 300).nullable();
    table.string("image_url", 500).notNullable();
    table.string("cta_label", 100).nullable();
    table.string("cta_link", 300).nullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.datetime("schedule_start").nullable();
    table.datetime("schedule_end").nullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["is_active", "sort_order"], "idx_slides_active_sort");
  });

  // 5. Services Table
  await knex.schema.createTable("services", (table) => {
    table.bigIncrements("id").primary();
    table.string("slug", 100).notNullable().unique();
    table.string("number_label", 10).notNullable(); // '01', '02', '03', '04'
    table.string("title", 150).notNullable();
    table.string("badge", 100).notNullable();
    table.string("short_description", 300).notNullable();
    table.text("full_description").notNullable();
    table.string("icon_name", 100).defaultTo("ShieldCheck").notNullable();
    table.string("calculator_label", 200).nullable();
    table.string("calculator_sub", 300).nullable();
    table.string("calculator_hash", 100).nullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["slug", "is_active"], "idx_services_slug_active");
  });

  // 6. Service Features ("What We Help With")
  await knex.schema.createTable("service_features", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("service_id").unsigned().notNullable().references("id").inTable("services").onDelete("CASCADE");
    table.string("title", 150).notNullable();
    table.text("description").notNullable();
    table.string("icon_name", 100).defaultTo("CheckCircle2").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.index(["service_id", "sort_order"], "idx_service_features");
  });

  // 7. Service Target Audiences ("Who It's For")
  await knex.schema.createTable("service_target_audiences", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("service_id").unsigned().notNullable().references("id").inTable("services").onDelete("CASCADE");
    table.text("audience_text").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.index(["service_id", "sort_order"], "idx_service_audiences");
  });

  // 8. Service Checklists ("Keep Ready")
  await knex.schema.createTable("service_checklists", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("service_id").unsigned().notNullable().references("id").inTable("services").onDelete("CASCADE");
    table.text("document_name").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.index(["service_id", "sort_order"], "idx_service_checklists");
  });

  // 9. Testimonials Table
  await knex.schema.createTable("testimonials", (table) => {
    table.bigIncrements("id").primary();
    table.string("name", 100).notNullable();
    table.string("service_used", 100).nullable();
    table.integer("rating").defaultTo(5).notNullable();
    table.text("message").notNullable();
    table.enum("status", ["pending", "approved", "rejected"]).defaultTo("pending").notNullable();
    table.enum("source", ["public_form", "admin_entry"]).defaultTo("public_form").notNullable();
    table.boolean("is_featured").defaultTo(false).notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["status", "sort_order", "created_at"], "idx_testimonials_status");
  });

  // 10. FAQs Table
  await knex.schema.createTable("faqs", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("service_id").unsigned().nullable().references("id").inTable("services").onDelete("SET NULL");
    table.string("category", 100).defaultTo("General").notNullable();
    table.text("question").notNullable();
    table.text("answer").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["category", "is_active", "sort_order"], "idx_faqs_cat_sort");
  });

  // 11. Key Compliance Dates Table
  await knex.schema.createTable("key_dates", (table) => {
    table.bigIncrements("id").primary();
    table.date("event_date").notNullable();
    table.string("title", 200).notNullable();
    table.string("category", 50).defaultTo("Tax").notNullable(); // GST, ITR, Tax, ROC
    table.text("notes").nullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["event_date", "is_active"], "idx_key_dates_active");
  });

  // 12. Master Document Checklists
  await knex.schema.createTable("document_checklists", (table) => {
    table.bigIncrements("id").primary();
    table.string("slug", 100).notNullable().unique();
    table.string("title", 200).notNullable();
    table.string("category", 100).defaultTo("Tax").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
  });

  // 13. Master Checklist Items
  await knex.schema.createTable("checklist_items", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("checklist_id").unsigned().notNullable().references("id").inTable("document_checklists").onDelete("CASCADE");
    table.text("item_text").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.index(["checklist_id", "sort_order"], "idx_checklist_items");
  });

  // 14. Credentials and Partners
  await knex.schema.createTable("credentials_partners", (table) => {
    table.bigIncrements("id").primary();
    table.enum("item_type", ["credential", "partner"]).defaultTo("partner").notNullable();
    table.string("name", 150).notNullable();
    table.string("category", 100).nullable();
    table.string("tagline", 200).nullable();
    table.string("registration_number", 100).nullable();
    table.string("logo_url", 500).notNullable();
    table.string("link_url", 500).nullable();
    table.string("badge_class", 255).nullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["item_type", "is_active", "sort_order"], "idx_credentials_partners");
  });

  // 15. About / Founder Content Payload
  await knex.schema.createTable("about_content", (table) => {
    table.bigIncrements("id").primary();
    table.string("section_key", 100).notNullable().unique(); // founder_profile, core_values, firm_story
    table.json("content_payload").notNullable();
    table.timestamp("updated_at").defaultTo(knex.fn.now()).notNullable();
  });

  // 16. Milestones Table
  await knex.schema.createTable("milestones", (table) => {
    table.bigIncrements("id").primary();
    table.string("year_label", 50).notNullable(); // '2004', '2010', 'Present'
    table.string("title", 200).notNullable();
    table.text("description").notNullable();
    table.integer("sort_order").defaultTo(0).notNullable();
    table.boolean("is_active").defaultTo(true).notNullable();
    table.timestamps(true, true);
  });

  // 17. Inquiries Table
  await knex.schema.createTable("inquiries", (table) => {
    table.bigIncrements("id").primary();
    table.string("reference_no", 50).notNullable().unique();
    table.string("name", 100).notNullable();
    table.string("phone", 30).notNullable();
    table.string("email", 191).nullable();
    table.string("service_requested", 100).notNullable();
    table.text("message").notNullable();
    table.enum("status", ["New", "Contacted", "In Progress", "Follow-up", "Converted", "Closed", "Spam"]).defaultTo("New").notNullable();
    table.enum("priority", ["Low", "Medium", "High", "Urgent"]).defaultTo("Medium").notNullable();
    table.bigInteger("assigned_to_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.datetime("follow_up_date").nullable();
    table.string("source_channel", 50).defaultTo("contact_form").notNullable();
    table.string("ip_address", 45).nullable();
    table.text("user_agent").nullable();
    table.timestamps(true, true);
    table.datetime("deleted_at").nullable();
    table.index(["status", "created_at"], "idx_inquiries_status");
    table.index(["phone", "email"], "idx_inquiries_contact");
    table.index(["assigned_to_user_id", "follow_up_date"], "idx_inquiries_followup");
  });

  // 18. Inquiry Internal Notes Table
  await knex.schema.createTable("inquiry_notes", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("inquiry_id").unsigned().notNullable().references("id").inTable("inquiries").onDelete("CASCADE");
    table.bigInteger("user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.text("note_text").notNullable();
    table.boolean("is_pinned").defaultTo(false).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.index(["inquiry_id", "created_at"], "idx_inquiry_notes");
  });

  // 19. Inquiry Status History Table
  await knex.schema.createTable("inquiry_status_history", (table) => {
    table.bigIncrements("id").primary();
    table.bigInteger("inquiry_id").unsigned().notNullable().references("id").inTable("inquiries").onDelete("CASCADE");
    table.bigInteger("changed_by_user_id").unsigned().nullable().references("id").inTable("users").onDelete("SET NULL");
    table.string("old_status", 50).nullable();
    table.string("new_status", 50).notNullable();
    table.text("remarks").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now()).notNullable();
    table.index(["inquiry_id", "created_at"], "idx_inquiry_history");
  });

  // 20. Inquiry Tags
  await knex.schema.createTable("inquiry_tags", (table) => {
    table.bigIncrements("id").primary();
    table.string("tag_name", 50).notNullable().unique();
    table.string("color_hex", 10).defaultTo("#2563eb").notNullable();
  });

  // 21. Inquiry Tag Mappings (Many-to-Many)
  await knex.schema.createTable("inquiry_tag_mappings", (table) => {
    table.bigInteger("inquiry_id").unsigned().notNullable().references("id").inTable("inquiries").onDelete("CASCADE");
    table.bigInteger("tag_id").unsigned().notNullable().references("id").inTable("inquiry_tags").onDelete("CASCADE");
    table.primary(["inquiry_id", "tag_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("inquiry_tag_mappings");
  await knex.schema.dropTableIfExists("inquiry_tags");
  await knex.schema.dropTableIfExists("inquiry_status_history");
  await knex.schema.dropTableIfExists("inquiry_notes");
  await knex.schema.dropTableIfExists("inquiries");
  await knex.schema.dropTableIfExists("milestones");
  await knex.schema.dropTableIfExists("about_content");
  await knex.schema.dropTableIfExists("credentials_partners");
  await knex.schema.dropTableIfExists("checklist_items");
  await knex.schema.dropTableIfExists("document_checklists");
  await knex.schema.dropTableIfExists("key_dates");
  await knex.schema.dropTableIfExists("faqs");
  await knex.schema.dropTableIfExists("testimonials");
  await knex.schema.dropTableIfExists("service_checklists");
  await knex.schema.dropTableIfExists("service_target_audiences");
  await knex.schema.dropTableIfExists("service_features");
  await knex.schema.dropTableIfExists("services");
  await knex.schema.dropTableIfExists("carousel_slides");
  await knex.schema.dropTableIfExists("site_settings");
  await knex.schema.dropTableIfExists("audit_logs");
  await knex.schema.dropTableIfExists("users");
}
