import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtUserPayload } from "../utils/tokens";
import { ApiResponse } from "../utils/apiResponse";

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  // 1. Check cookies first (httpOnly secure cookie)
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Check Authorization Header as fallback
  else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return ApiResponse.unauthorized(res, "Authentication required. Please log in.");
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return ApiResponse.unauthorized(res, "Session expired or invalid token. Please log in again.");
  }

  req.user = payload;
  return next();
}
