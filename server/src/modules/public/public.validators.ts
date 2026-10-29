import { z } from "zod";

export const publicInquirySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(100),
    phone: z
      .string()
      .trim()
      .transform((val) => val.replace(/[\s\-()]/g, ""))
      .refine(
        (val) => /^(?:\+91|91|0)?([6-9]\d{9})$/.test(val),
        "Please enter a valid 10-digit Indian mobile number."
      )
      .transform((val) => {
        const match = val.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
        return match ? match[1] : val;
      }),
    email: z.string().trim().email("Please enter a valid email address.").optional().or(z.literal("")),
    service: z.string().trim().min(2, "Service name is required."),
    message: z.string().trim().min(5, "Message must be at least 5 characters long.").max(2000),
    hp_website_field: z.string().optional(), // Honeypot field for bot trapping
    source: z.string().optional().default("contact_form"),
  }),
});

export const publicTestimonialSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long.").max(80),
    service: z.string().trim().max(60).optional().or(z.literal("")),
    rating: z.number().int().min(1).max(5).default(5),
    message: z.string().trim().min(10, "Feedback must be at least 10 characters long.").max(1000),
  }),
});
