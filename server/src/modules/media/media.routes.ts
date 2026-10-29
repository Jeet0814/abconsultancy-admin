import { Router } from "express";
import { MediaController, uploadMiddleware } from "./media.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

router.use(authGuard);
router.use(roleGuard(["super_admin", "admin"]));

router.post("/upload", uploadMiddleware.single("image"), MediaController.uploadImage);

export default router;
