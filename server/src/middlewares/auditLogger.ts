import { Request } from "express";
import db from "../db/connection";

export async function logAuditEvent(params: {
  userId?: number | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "PASSWORD_CHANGE";
  entityName: string;
  entityId?: string | number | null;
  oldValues?: any;
  newValues?: any;
  req?: Request;
}) {
  try {
    const ipAddress = params.req?.ip || params.req?.socket?.remoteAddress || null;
    const userAgent = params.req?.headers["user-agent"] || null;

    await db("audit_logs").insert({
      user_id: params.userId || params.req?.user?.id || null,
      action: params.action,
      entity_name: params.entityName,
      entity_id: params.entityId ? String(params.entityId) : null,
      old_values: params.oldValues ? JSON.stringify(params.oldValues) : null,
      new_values: params.newValues ? JSON.stringify(params.newValues) : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  } catch (error) {
    console.error("[Audit Logger Error] Failed to write audit log:", error);
  }
}
