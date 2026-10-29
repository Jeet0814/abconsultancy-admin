import { Router } from "express";
import { MastersController } from "./masters.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// Master updates require at least admin role
router.use(authGuard);
router.use(roleGuard(["super_admin", "admin"]));

// Services
router.get("/services", MastersController.listServices);
router.get("/services/:id", MastersController.getService);
router.put("/services/:id", MastersController.updateService);

// Testimonials
router.get("/testimonials", MastersController.listTestimonials);
router.put("/testimonials/:id", MastersController.updateTestimonial);
router.delete("/testimonials/:id", MastersController.deleteTestimonial);

// FAQs
router.get("/faqs", MastersController.listFaqs);
router.post("/faqs", MastersController.createFaq);
router.put("/faqs/:id", MastersController.updateFaq);
router.delete("/faqs/:id", MastersController.deleteFaq);

// Key Dates
router.get("/key-dates", MastersController.listKeyDates);
router.post("/key-dates", MastersController.createKeyDate);
router.put("/key-dates/:id", MastersController.updateKeyDate);
router.delete("/key-dates/:id", MastersController.deleteKeyDate);

// Checklists
router.get("/checklists", MastersController.listChecklists);
router.put("/checklists/:id", MastersController.updateChecklist);

// Partners & Credentials
router.get("/partners", MastersController.listPartners);
router.post("/partners", MastersController.createPartner);
router.put("/partners/:id", MastersController.updatePartner);
router.delete("/partners/:id", MastersController.deletePartner);

// Carousel Slides
router.get("/slides", MastersController.listSlides);
router.post("/slides", MastersController.createSlide);
router.put("/slides/:id", MastersController.updateSlide);
router.delete("/slides/:id", MastersController.deleteSlide);

// Reorder
router.patch("/reorder", MastersController.reorder);

export default router;
