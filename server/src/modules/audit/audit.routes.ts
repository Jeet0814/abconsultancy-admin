import { Router } from "express";
import { AuditController } from "./audit.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

router.use(authGuard);
router.use(roleGuard(["super_admin"]));

router.get("/", AuditController.listAuditLogs);

export default router;
