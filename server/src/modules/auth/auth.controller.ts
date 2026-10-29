import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ApiResponse } from "../../utils/apiResponse";
import { logAuditEvent } from "../../middlewares/auditLogger";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "strict" : "lax") as "strict" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      if (!result) {
        return ApiResponse.unauthorized(res, "Invalid email or password.");
      }

      res.cookie("accessToken", result.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

      await logAuditEvent({
        userId: result.user.id,
        action: "LOGIN",
        entityName: "users",
        entityId: result.user.id,
        req,
      });

      return ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, "Login successful.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to log in.");
    }
  }

  static async refresh(req: Request, res: Response) {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) {
      return ApiResponse.unauthorized(res, "Refresh token required.");
    }

    const result = await AuthService.refresh(token);
    if (!result) {
      return ApiResponse.unauthorized(res, "Invalid refresh token. Please log in again.");
    }

    res.cookie("accessToken", result.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, COOKIE_OPTIONS);

    return ApiResponse.success(res, { accessToken: result.accessToken, user: result.user }, "Token refreshed.");
  }

  static async logout(req: Request, res: Response) {
    if (req.user) {
      await AuthService.logout(req.user.id);
      await logAuditEvent({
        userId: req.user.id,
        action: "LOGOUT",
        entityName: "users",
        entityId: req.user.id,
        req,
      });
    }

    res.clearCookie("accessToken", COOKIE_OPTIONS);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    return ApiResponse.success(res, null, "Logged out successfully.");
  }

  static async getMe(req: Request, res: Response) {
    return ApiResponse.success(res, { user: req.user });
  }

  static async changePassword(req: Request, res: Response) {
    try {
      if (!req.user) return ApiResponse.unauthorized(res);
      const { currentPassword, newPassword } = req.body;

      await AuthService.changePassword(req.user.id, currentPassword, newPassword);

      await logAuditEvent({
        userId: req.user.id,
        action: "PASSWORD_CHANGE",
        entityName: "users",
        entityId: req.user.id,
        req,
      });

      res.clearCookie("accessToken", COOKIE_OPTIONS);
      res.clearCookie("refreshToken", COOKIE_OPTIONS);

      return ApiResponse.success(res, null, "Password changed successfully. Please log in with your new password.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to change password.");
    }
  }
}
