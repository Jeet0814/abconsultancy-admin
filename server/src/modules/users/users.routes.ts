import { Router } from "express";
import { UsersController } from "./users.controller";
import { authGuard } from "../../middlewares/authGuard";
import { roleGuard } from "../../middlewares/roleGuard";

const router = Router();

// User management is strictly super_admin only
router.use(authGuard);
router.use(roleGuard(["super_admin"]));

router.get("/", UsersController.listUsers);
router.post("/", UsersController.createUser);
router.put("/:id", UsersController.updateUser);
router.delete("/:id", UsersController.deleteUser);

export default router;
