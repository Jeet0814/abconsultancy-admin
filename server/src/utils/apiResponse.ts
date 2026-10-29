import { Response } from "express";

export type ApiResponsePayload<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
};

export class ApiResponse {
  static success<T>(res: Response, data?: T, message?: string, statusCode = 200, meta?: ApiResponsePayload["meta"]) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      meta,
    });
  }

  static error(res: Response, message = "An error occurred", statusCode = 500, errors?: any) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static created<T>(res: Response, data?: T, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static badRequest(res: Response, message = "Bad Request", errors?: any) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res: Response, message = "Unauthorized access") {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message = "Forbidden: Insufficient permissions") {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message = "Resource not found") {
    return this.error(res, message, 404);
  }
}
