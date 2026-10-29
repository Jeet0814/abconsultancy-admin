import { Router } from "express";
import { InquiriesController } from "./inquiries.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";
import { validate } from "../../middlewares/validate";
import {
  inquiryQuerySchema,
  updateInquiryStatusSchema,
  assignInquirySchema,
  updateInquiryPrioritySchema,
  addInquiryNoteSchema,
  setFollowUpSchema,
  bulkStatusSchema,
} from "./inquiries.validators";

const router = Router();

// All inquiry management routes require authentication (super_admin, admin, staff)
router.use(authGuard);

router.get("/dashboard/stats", InquiriesController.getDashboard);
router.get("/export/csv", InquiriesController.exportCsv);
router.get("/", validate(inquiryQuerySchema), InquiriesController.list);
router.get("/:id", InquiriesController.getDetail);
router.patch("/:id/status", validate(updateInquiryStatusSchema), InquiriesController.updateStatus);
router.patch("/:id/assign", validate(assignInquirySchema), InquiriesController.assignUser);
router.patch("/:id/priority", validate(updateInquiryPrioritySchema), InquiriesController.updatePriority);
router.patch("/:id/follow-up", validate(setFollowUpSchema), InquiriesController.setFollowUp);
router.post("/:id/notes", validate(addInquiryNoteSchema), InquiriesController.addNote);
router.delete("/notes/:noteId", InquiriesController.deleteNote);
router.post("/bulk-status", validate(bulkStatusSchema), InquiriesController.bulkStatus);
router.delete("/:id", roleGuard(["super_admin", "admin"]), InquiriesController.deleteInquiry);

export default router;
