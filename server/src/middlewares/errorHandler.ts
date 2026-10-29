import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/apiResponse";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`[Error] ${req.method} ${req.path}:`, err);

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, "Invalid or expired token.");
  }

  if (err.code === "ER_DUP_ENTRY") {
    return ApiResponse.badRequest(res, "A record with this unique identifier already exists.");
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return ApiResponse.badRequest(res, "Referenced parent entity does not exist.");
  }

  return ApiResponse.error(
    res,
    process.env.NODE_ENV === "production" ? "Internal server error occurred." : err.message || "Unknown error",
    err.statusCode || 500,
  );
}
