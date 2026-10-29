import { Request, Response } from "express";
import db from "../../db/connection";
import { ApiResponse } from "../../utils/apiResponse";

export class AuditController {
  static async listAuditLogs(req: Request, res: Response) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 20));
    const offset = (page - 1) * limit;

    let query = db("audit_logs as a")
      .leftJoin("users as u", "a.user_id", "u.id")
      .select("a.*", "u.name as user_name", "u.email as user_email");

    let countQuery = db("audit_logs");

    if (req.query.entityName) {
      query = query.where("a.entity_name", req.query.entityName as string);
      countQuery = countQuery.where("entity_name", req.query.entityName as string);
    }

    if (req.query.action) {
      query = query.where("a.action", req.query.action as string);
      countQuery = countQuery.where("action", req.query.action as string);
    }

    const [items, countResult] = await Promise.all([
      query.orderBy("a.created_at", "desc").limit(limit).offset(offset),
      countQuery.count("id as total").first(),
    ]);

    const total = Number(countResult?.total || 0);

    return ApiResponse.success(res, items, "Audit logs retrieved.", 200, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }
}
