import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export function roleGuard(allowedRoles: Array<"super_admin" | "admin" | "staff">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, "Authentication required.");
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, `Access denied. Requires one of: ${allowedRoles.join(", ")}`);
    }

    return next();
  };
}
