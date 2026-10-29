import { Request, Response } from "express";
import { InquiriesService } from "./inquiries.service";
import { ApiResponse } from "../../utils/apiResponse";
import { logAuditEvent } from "../../middlewares/auditLogger";

export class InquiriesController {
  static async list(req: Request, res: Response) {
    try {
      const { page, limit, search, status, service, priority, assignedTo, startDate, endDate, sortBy, sortOrder } = req.query as any;

      const result = await InquiriesService.listInquiries({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 15,
        search,
        status,
        service,
        priority,
        assignedTo: assignedTo ? Number(assignedTo) : undefined,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      });

      return ApiResponse.success(res, result.items, "Inquiries retrieved.", 200, result.pagination);
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to retrieve inquiries.", 500, err.message);
    }
  }

  static async getDetail(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const inquiry = await InquiriesService.getInquiryDetail(id);

      if (!inquiry) {
        return ApiResponse.notFound(res, "Inquiry not found.");
      }

      return ApiResponse.success(res, inquiry, "Inquiry details retrieved.");
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to retrieve inquiry detail.", 500, err.message);
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { status, remarks } = req.body;

      const result = await InquiriesService.updateStatus(id, status, req.user?.id, remarks);

      await logAuditEvent({
        userId: req.user?.id,
        action: "UPDATE",
        entityName: "inquiries_status",
        entityId: id,
        newValues: { status, remarks },
        req,
      });

      return ApiResponse.success(res, result, "Status updated successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to update status.");
    }
  }

  static async assignUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { assignedToUserId } = req.body;

      await InquiriesService.assignUser(id, assignedToUserId, req.user?.id);

      await logAuditEvent({
        userId: req.user?.id,
        action: "UPDATE",
        entityName: "inquiries_assignment",
        entityId: id,
        newValues: { assignedToUserId },
        req,
      });

      return ApiResponse.success(res, null, "Inquiry assigned successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to assign inquiry.");
    }
  }

  static async updatePriority(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { priority } = req.body;

      await InquiriesService.updatePriority(id, priority);

      return ApiResponse.success(res, null, "Priority updated successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to update priority.");
    }
  }

  static async setFollowUp(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { followUpDate } = req.body;

      await InquiriesService.setFollowUp(id, followUpDate);

      return ApiResponse.success(res, null, "Follow-up schedule updated.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to set follow up.");
    }
  }

  static async addNote(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { noteText, isPinned } = req.body;

      const noteId = await InquiriesService.addNote(id, req.user?.id, noteText, isPinned);

      return ApiResponse.created(res, { noteId }, "Note added successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to add note.");
    }
  }

  static async deleteNote(req: Request, res: Response) {
    try {
      const noteId = Number(req.params.noteId);
      await InquiriesService.deleteNote(noteId);
      return ApiResponse.success(res, null, "Note removed.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to delete note.");
    }
  }

  static async deleteInquiry(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await InquiriesService.deleteInquiry(id);

      await logAuditEvent({
        userId: req.user?.id,
        action: "DELETE",
        entityName: "inquiries",
        entityId: id,
        req,
      });

      return ApiResponse.success(res, null, "Inquiry deleted.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to delete inquiry.");
    }
  }

  static async bulkStatus(req: Request, res: Response) {
    try {
      const { inquiryIds, status, remarks } = req.body;
      await InquiriesService.bulkUpdateStatus(inquiryIds, status, req.user?.id, remarks);

      await logAuditEvent({
        userId: req.user?.id,
        action: "UPDATE",
        entityName: "inquiries_bulk",
        entityId: inquiryIds.join(","),
        newValues: { status, count: inquiryIds.length },
        req,
      });

      return ApiResponse.success(res, null, `Updated ${inquiryIds.length} inquiries to ${status}.`);
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed bulk update.");
    }
  }

  static async exportCsv(req: Request, res: Response) {
    try {
      const filters = req.query;
      const csv = await InquiriesService.exportInquiriesCsv(filters);

      await logAuditEvent({
        userId: req.user?.id,
        action: "EXPORT",
        entityName: "inquiries_csv",
        req,
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="inquiries-${new Date().toISOString().split("T")[0]}.csv"`);
      return res.send(csv);
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to export CSV.", 500, err.message);
    }
  }

  static async getDashboard(req: Request, res: Response) {
    try {
      const stats = await InquiriesService.getDashboardStats();
      return ApiResponse.success(res, stats, "Dashboard statistics retrieved.");
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to retrieve dashboard stats.", 500, err.message);
    }
  }
}
