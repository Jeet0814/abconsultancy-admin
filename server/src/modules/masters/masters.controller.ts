import { Request, Response } from "express";
import { MastersService } from "./masters.service";
import { ApiResponse } from "../../utils/apiResponse";
import { logAuditEvent } from "../../middlewares/auditLogger";

export class MastersController {
  // Services
  static async listServices(req: Request, res: Response) {
    const list = await MastersService.listServices();
    return ApiResponse.success(res, list);
  }

  static async getService(req: Request, res: Response) {
    const service = await MastersService.getServiceById(Number(req.params.id));
    if (!service) return ApiResponse.notFound(res, "Service not found.");
    return ApiResponse.success(res, service);
  }

  static async updateService(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await MastersService.updateService(id, req.body);
      await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "services", entityId: id, req });
      return ApiResponse.success(res, updated, "Service updated.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }

  // Testimonials
  static async listTestimonials(req: Request, res: Response) {
    const status = req.query.status as string;
    const list = await MastersService.listTestimonials(status);
    return ApiResponse.success(res, list);
  }

  static async updateTestimonial(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = await MastersService.updateTestimonial(id, req.body);
      await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "testimonials", entityId: id, req });
      return ApiResponse.success(res, updated, "Testimonial updated.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }

  static async deleteTestimonial(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MastersService.deleteTestimonial(id);
    await logAuditEvent({ userId: req.user?.id, action: "DELETE", entityName: "testimonials", entityId: id, req });
    return ApiResponse.success(res, null, "Testimonial deleted.");
  }

  // FAQs
  static async listFaqs(req: Request, res: Response) {
    const list = await MastersService.listFaqs(req.query.category as string);
    return ApiResponse.success(res, list);
  }

  static async createFaq(req: Request, res: Response) {
    const created = await MastersService.createFaq(req.body);
    await logAuditEvent({ userId: req.user?.id, action: "CREATE", entityName: "faqs", entityId: created.id, req });
    return ApiResponse.created(res, created, "FAQ created.");
  }

  static async updateFaq(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await MastersService.updateFaq(id, req.body);
    await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "faqs", entityId: id, req });
    return ApiResponse.success(res, updated, "FAQ updated.");
  }

  static async deleteFaq(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MastersService.deleteFaq(id);
    await logAuditEvent({ userId: req.user?.id, action: "DELETE", entityName: "faqs", entityId: id, req });
    return ApiResponse.success(res, null, "FAQ deleted.");
  }

  // Key Dates
  static async listKeyDates(req: Request, res: Response) {
    const list = await MastersService.listKeyDates();
    return ApiResponse.success(res, list);
  }

  static async createKeyDate(req: Request, res: Response) {
    const created = await MastersService.createKeyDate(req.body);
    await logAuditEvent({ userId: req.user?.id, action: "CREATE", entityName: "key_dates", entityId: created.id, req });
    return ApiResponse.created(res, created, "Key date added.");
  }

  static async updateKeyDate(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await MastersService.updateKeyDate(id, req.body);
    await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "key_dates", entityId: id, req });
    return ApiResponse.success(res, updated, "Key date updated.");
  }

  static async deleteKeyDate(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MastersService.deleteKeyDate(id);
    await logAuditEvent({ userId: req.user?.id, action: "DELETE", entityName: "key_dates", entityId: id, req });
    return ApiResponse.success(res, null, "Key date deleted.");
  }

  // Checklists
  static async listChecklists(req: Request, res: Response) {
    const list = await MastersService.listChecklists();
    return ApiResponse.success(res, list);
  }

  static async updateChecklist(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await MastersService.updateChecklist(id, req.body);
    await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "document_checklists", entityId: id, req });
    return ApiResponse.success(res, updated, "Checklist updated.");
  }

  // Partners & Credentials
  static async listPartners(req: Request, res: Response) {
    const list = await MastersService.listPartnersAndCredentials(req.query.itemType as string);
    return ApiResponse.success(res, list);
  }

  static async createPartner(req: Request, res: Response) {
    const created = await MastersService.createPartner(req.body);
    await logAuditEvent({ userId: req.user?.id, action: "CREATE", entityName: "credentials_partners", entityId: created.id, req });
    return ApiResponse.created(res, created, "Item added.");
  }

  static async updatePartner(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await MastersService.updatePartner(id, req.body);
    await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "credentials_partners", entityId: id, req });
    return ApiResponse.success(res, updated, "Item updated.");
  }

  static async deletePartner(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MastersService.deletePartner(id);
    await logAuditEvent({ userId: req.user?.id, action: "DELETE", entityName: "credentials_partners", entityId: id, req });
    return ApiResponse.success(res, null, "Item deleted.");
  }

  // Carousel Slides
  static async listSlides(req: Request, res: Response) {
    const list = await MastersService.listSlides();
    return ApiResponse.success(res, list);
  }

  static async createSlide(req: Request, res: Response) {
    const created = await MastersService.createSlide(req.body);
    await logAuditEvent({ userId: req.user?.id, action: "CREATE", entityName: "carousel_slides", entityId: created.id, req });
    return ApiResponse.created(res, created, "Slide added.");
  }

  static async updateSlide(req: Request, res: Response) {
    const id = Number(req.params.id);
    const updated = await MastersService.updateSlide(id, req.body);
    await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: "carousel_slides", entityId: id, req });
    return ApiResponse.success(res, updated, "Slide updated.");
  }

  static async deleteSlide(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MastersService.deleteSlide(id);
    await logAuditEvent({ userId: req.user?.id, action: "DELETE", entityName: "carousel_slides", entityId: id, req });
    return ApiResponse.success(res, null, "Slide deleted.");
  }

  // Generic Reorder
  static async reorder(req: Request, res: Response) {
    try {
      const { table, items } = req.body;
      await MastersService.reorderTable(table, items);
      await logAuditEvent({ userId: req.user?.id, action: "UPDATE", entityName: `${table}_reorder`, req });
      return ApiResponse.success(res, null, "Sort order updated.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }
}
