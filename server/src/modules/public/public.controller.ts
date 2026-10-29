import { Request, Response } from "express";
import { PublicService } from "./public.service";
import { ApiResponse } from "../../utils/apiResponse";

export class PublicController {
  static async getSiteContent(req: Request, res: Response) {
    try {
      const data = await PublicService.getFullSiteContent();
      // Ensure instant synchronization with Admin edits
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return ApiResponse.success(res, data, "Site content retrieved successfully.");
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to retrieve site content.", 500, err.message);
    }
  }

  static async submitInquiry(req: Request, res: Response) {
    try {
      const { name, phone, email, service, message, hp_website_field, source } = req.body;

      // Spam honeypot trap: if filled by a bot, silently return success without saving
      if (hp_website_field && hp_website_field.trim().length > 0) {
        return ApiResponse.success(res, { referenceNo: "AB-SPAM-FILTERED" }, "Enquiry submitted successfully.");
      }

      const ipAddress = req.ip || req.socket?.remoteAddress || undefined;
      const userAgent = (req.headers["user-agent"] as string) || undefined;

      const result = await PublicService.submitInquiry({
        name,
        phone,
        email,
        service,
        message,
        source: source || "contact_form",
        ipAddress,
        userAgent,
      });

      return ApiResponse.created(res, result, "Your enquiry has been received successfully.");
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to submit enquiry.", 500, err.message);
    }
  }

  static async submitTestimonial(req: Request, res: Response) {
    try {
      const { name, service, rating, message } = req.body;
      const result = await PublicService.submitTestimonial({ name, service, rating, message });
      return ApiResponse.created(res, result, "Thank you! Your feedback will appear once reviewed.");
    } catch (err: any) {
      return ApiResponse.error(res, "Failed to submit testimonial.", 500, err.message);
    }
  }
}
