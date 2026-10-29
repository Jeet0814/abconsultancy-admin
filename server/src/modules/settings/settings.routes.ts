import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

router.use(authGuard);
router.use(roleGuard(["super_admin", "admin"]));

router.get("/", SettingsController.getSettings);
router.put("/", SettingsController.updateSettings);

export default router;
