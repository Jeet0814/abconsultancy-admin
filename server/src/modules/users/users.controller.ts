import { Request, Response } from "express";
import db from "../../db/connection";
import { hashPassword } from "../../utils/password";
import { ApiResponse } from "../../utils/apiResponse";
import { logAuditEvent } from "../../middlewares/auditLogger";

export class UsersController {
  static async listUsers(req: Request, res: Response) {
    const users = await db("users")
      .whereNull("deleted_at")
      .select("id", "name", "email", "role", "is_active", "last_login_at", "created_at")
      .orderBy("created_at", "desc");

    return ApiResponse.success(res, users);
  }

  static async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;
      const existing = await db("users").where({ email: email.toLowerCase().trim() }).first();
      if (existing) {
        return ApiResponse.badRequest(res, "A user with this email already exists.");
      }

      const passwordHash = await hashPassword(password);
      const [id] = await db("users").insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password_hash: passwordHash,
        role: role || "staff",
        is_active: true,
      });

      await logAuditEvent({
        userId: req.user?.id,
        action: "CREATE",
        entityName: "users",
        entityId: id,
        newValues: { name, email, role },
        req,
      });

      return ApiResponse.created(res, { id, name, email, role }, "User created successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { name, email, role, is_active, password } = req.body;

      const updateData: any = { updated_at: db.fn.now() };
      if (name) updateData.name = name.trim();
      if (email) updateData.email = email.toLowerCase().trim();
      if (role) updateData.role = role;
      if (is_active !== undefined) updateData.is_active = is_active;
      if (password && password.trim().length >= 6) {
        updateData.password_hash = await hashPassword(password);
      }

      await db("users").where({ id }).update(updateData);

      await logAuditEvent({
        userId: req.user?.id,
        action: "UPDATE",
        entityName: "users",
        entityId: id,
        newValues: { name, email, role, is_active },
        req,
      });

      return ApiResponse.success(res, null, "User updated successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (req.user?.id === id) {
        return ApiResponse.badRequest(res, "You cannot delete your own account.");
      }

      await db("users").where({ id }).update({ deleted_at: db.fn.now() });

      await logAuditEvent({
        userId: req.user?.id,
        action: "DELETE",
        entityName: "users",
        entityId: id,
        req,
      });

      return ApiResponse.success(res, null, "User deleted.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }
}
