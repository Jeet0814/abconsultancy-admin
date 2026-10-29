import { Router } from "express";
import { PublicController } from "./public.controller";
import { validate } from "../../middlewares/validate";
import { publicInquiryRateLimiter, publicReadRateLimiter } from "../../middlewares/rateLimiter";
import { publicInquirySchema, publicTestimonialSchema } from "./public.validators";

const router = Router();

router.get("/content", publicReadRateLimiter, PublicController.getSiteContent);
router.post("/inquiries", publicInquiryRateLimiter, validate(publicInquirySchema), PublicController.submitInquiry);
router.post("/testimonials", publicInquiryRateLimiter, validate(publicTestimonialSchema), PublicController.submitTestimonial);

export default router;
