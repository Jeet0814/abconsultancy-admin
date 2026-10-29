import { z } from "zod";

export const inquiryQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().default("1"),
    limit: z.string().optional().default("15"),
    search: z.string().optional(),
    status: z.enum(["New", "Contacted", "In Progress", "Follow-up", "Converted", "Closed", "Spam", "all"]).optional(),
    service: z.string().optional(),
    priority: z.enum(["Low", "Medium", "High", "Urgent", "all"]).optional(),
    assignedTo: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    sortBy: z.enum(["created_at", "follow_up_date", "priority", "name"]).optional().default("created_at"),
    sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  }),
});

export const updateInquiryStatusSchema = z.object({
  body: z.object({
    status: z.enum(["New", "Contacted", "In Progress", "Follow-up", "Converted", "Closed", "Spam"]),
    remarks: z.string().optional().default(""),
  }),
});

export const assignInquirySchema = z.object({
  body: z.object({
    assignedToUserId: z.number().nullable(),
  }),
});

export const updateInquiryPrioritySchema = z.object({
  body: z.object({
    priority: z.enum(["Low", "Medium", "High", "Urgent"]),
  }),
});

export const addInquiryNoteSchema = z.object({
  body: z.object({
    noteText: z.string().trim().min(1, "Note cannot be empty."),
    isPinned: z.boolean().optional().default(false),
  }),
});

export const setFollowUpSchema = z.object({
  body: z.object({
    followUpDate: z.string().nullable(), // ISO string or null
  }),
});

export const bulkStatusSchema = z.object({
  body: z.object({
    inquiryIds: z.array(z.number()).min(1, "Provide at least one inquiry ID."),
    status: z.enum(["New", "Contacted", "In Progress", "Follow-up", "Converted", "Closed", "Spam"]),
    remarks: z.string().optional().default("Bulk status update"),
  }),
});
