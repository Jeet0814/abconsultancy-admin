import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate";
import { authGuard } from "../../middlewares/authGuard";
import { loginRateLimiter } from "../../middlewares/rateLimiter";
import { loginSchema, changePasswordSchema } from "./auth.validators";

const router = Router();

router.post("/login", loginRateLimiter, validate(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refresh);
router.post("/logout", authGuard, AuthController.logout);
router.get("/me", authGuard, AuthController.getMe);
router.post("/change-password", authGuard, validate(changePasswordSchema), AuthController.changePassword);

export default router;
