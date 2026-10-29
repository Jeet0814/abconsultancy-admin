import db from "../../db/connection";

export class MastersService {
  // ================= SERVICES =================
  static async listServices() {
    return db("services").whereNull("deleted_at").orderBy("sort_order", "asc");
  }

  static async getServiceById(id: number) {
    const service = await db("services").where({ id }).whereNull("deleted_at").first();
    if (!service) return null;

    const [features, audiences, checklists, faqs] = await Promise.all([
      db("service_features").where({ service_id: id }).orderBy("sort_order", "asc"),
      db("service_target_audiences").where({ service_id: id }).orderBy("sort_order", "asc"),
      db("service_checklists").where({ service_id: id }).orderBy("sort_order", "asc"),
      db("faqs").where({ service_id: id }).whereNull("deleted_at").orderBy("sort_order", "asc"),
    ]);

    return { ...service, features, audiences, checklists, faqs };
  }

  static async updateService(id: number, data: any) {
    const { features, audiences, checklists, ...serviceFields } = data;

    await db("services").where({ id }).update({
      ...serviceFields,
      updated_at: db.fn.now(),
    });

    if (features && Array.isArray(features)) {
      await db("service_features").where({ service_id: id }).del();
      if (features.length > 0) {
        await db("service_features").insert(
          features.map((f: any, idx: number) => ({
            service_id: id,
            title: f.title,
            description: f.description,
            icon_name: f.icon_name || "CheckCircle2",
            sort_order: f.sort_order ?? idx + 1,
          })),
        );
      }
    }

    if (audiences && Array.isArray(audiences)) {
      await db("service_target_audiences").where({ service_id: id }).del();
      if (audiences.length > 0) {
        await db("service_target_audiences").insert(
          audiences.map((text: string, idx: number) => ({
            service_id: id,
            audience_text: text,
            sort_order: idx + 1,
          })),
        );
      }
    }

    if (checklists && Array.isArray(checklists)) {
      await db("service_checklists").where({ service_id: id }).del();
      if (checklists.length > 0) {
        await db("service_checklists").insert(
          checklists.map((doc: string, idx: number) => ({
            service_id: id,
            document_name: doc,
            sort_order: idx + 1,
          })),
        );
      }
    }

    return this.getServiceById(id);
  }

  // ================= TESTIMONIALS =================
  static async listTestimonials(status?: string) {
    let q = db("testimonials").whereNull("deleted_at");
    if (status && status !== "all") {
      q = q.where({ status });
    }
    return q.orderBy("created_at", "desc");
  }

  static async updateTestimonial(id: number, data: any) {
    await db("testimonials").where({ id }).update({
      ...data,
      updated_at: db.fn.now(),
    });
    return db("testimonials").where({ id }).first();
  }

  static async deleteTestimonial(id: number) {
    await db("testimonials").where({ id }).update({ deleted_at: db.fn.now() });
  }

  // ================= FAQS =================
  static async listFaqs(category?: string) {
    let q = db("faqs as f")
      .leftJoin("services as s", "f.service_id", "s.id")
      .whereNull("f.deleted_at")
      .select("f.*", "s.title as service_title");
    if (category && category !== "all") {
      q = q.where("f.category", category);
    }
    return q.orderBy("f.sort_order", "asc");
  }

  static async createFaq(data: any) {
    const [id] = await db("faqs").insert(data);
    return db("faqs").where({ id }).first();
  }

  static async updateFaq(id: number, data: any) {
    await db("faqs").where({ id }).update({ ...data, updated_at: db.fn.now() });
    return db("faqs").where({ id }).first();
  }

  static async deleteFaq(id: number) {
    await db("faqs").where({ id }).update({ deleted_at: db.fn.now() });
  }

  // ================= KEY DATES =================
  static async listKeyDates() {
    return db("key_dates").whereNull("deleted_at").orderBy("event_date", "asc");
  }

  static async createKeyDate(data: any) {
    const [id] = await db("key_dates").insert(data);
    return db("key_dates").where({ id }).first();
  }

  static async updateKeyDate(id: number, data: any) {
    await db("key_dates").where({ id }).update({ ...data, updated_at: db.fn.now() });
    return db("key_dates").where({ id }).first();
  }

  static async deleteKeyDate(id: number) {
    await db("key_dates").where({ id }).update({ deleted_at: db.fn.now() });
  }

  // ================= CHECKLISTS =================
  static async listChecklists() {
    const lists = await db("document_checklists").whereNull("deleted_at").orderBy("sort_order", "asc");
    return Promise.all(
      lists.map(async (l) => {
        const items = await db("checklist_items").where({ checklist_id: l.id }).orderBy("sort_order", "asc");
        return { ...l, items };
      }),
    );
  }

  static async updateChecklist(id: number, data: any) {
    const { items, ...fields } = data;
    await db("document_checklists").where({ id }).update({ ...fields, updated_at: db.fn.now() });

    if (items && Array.isArray(items)) {
      await db("checklist_items").where({ checklist_id: id }).del();
      if (items.length > 0) {
        await db("checklist_items").insert(
          items.map((it: string, idx: number) => ({
            checklist_id: id,
            item_text: it,
            sort_order: idx + 1,
          })),
        );
      }
    }
    return db("document_checklists").where({ id }).first();
  }

  // ================= PARTNERS & CREDENTIALS =================
  static async listPartnersAndCredentials(itemType?: string) {
    let q = db("credentials_partners").whereNull("deleted_at");
    if (itemType && itemType !== "all") {
      q = q.where({ item_type: itemType });
    }
    return q.orderBy("sort_order", "asc");
  }

  static async createPartner(data: any) {
    const [id] = await db("credentials_partners").insert(data);
    return db("credentials_partners").where({ id }).first();
  }

  static async updatePartner(id: number, data: any) {
    await db("credentials_partners").where({ id }).update({ ...data, updated_at: db.fn.now() });
    return db("credentials_partners").where({ id }).first();
  }

  static async deletePartner(id: number) {
    await db("credentials_partners").where({ id }).update({ deleted_at: db.fn.now() });
  }

  // ================= CAROUSEL SLIDES =================
  static async listSlides() {
    return db("carousel_slides").whereNull("deleted_at").orderBy("sort_order", "asc");
  }

  static async createSlide(data: any) {
    const [id] = await db("carousel_slides").insert(data);
    return db("carousel_slides").where({ id }).first();
  }

  static async updateSlide(id: number, data: any) {
    await db("carousel_slides").where({ id }).update({ ...data, updated_at: db.fn.now() });
    return db("carousel_slides").where({ id }).first();
  }

  static async deleteSlide(id: number) {
    await db("carousel_slides").where({ id }).update({ deleted_at: db.fn.now() });
  }

  // ================= GENERIC REORDER =================
  static async reorderTable(tableName: string, items: Array<{ id: number; sort_order: number }>) {
    const allowed = ["services", "faqs", "key_dates", "document_checklists", "credentials_partners", "carousel_slides", "milestones"];
    if (!allowed.includes(tableName)) throw new Error("Invalid table for reordering.");

    await db.transaction(async (trx) => {
      for (const item of items) {
        await trx(tableName).where({ id: item.id }).update({ sort_order: item.sort_order });
      }
    });
  }
}
