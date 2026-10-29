import { Request, Response } from "express";
import db from "../../db/connection";
import { ApiResponse } from "../../utils/apiResponse";
import { logAuditEvent } from "../../middlewares/auditLogger";

export class SettingsController {
  static async getSettings(req: Request, res: Response) {
    const settings = await db("site_settings").select("*");
    const founder = await db("about_content").where({ section_key: "founder_profile" }).first();
    const values = await db("about_content").where({ section_key: "core_values" }).first();
    const milestones = await db("milestones").orderBy("sort_order", "asc");

    return ApiResponse.success(res, {
      settings,
      founder: founder ? (typeof founder.content_payload === "string" ? JSON.parse(founder.content_payload) : founder.content_payload) : null,
      values: values ? (typeof values.content_payload === "string" ? JSON.parse(values.content_payload) : values.content_payload) : [],
      milestones,
    });
  }

  static async updateSettings(req: Request, res: Response) {
    try {
      const { settings, founder, values } = req.body;

      if (settings && Array.isArray(settings)) {
        for (const s of settings) {
          await db("site_settings").where({ setting_key: s.setting_key }).update({
            setting_value: String(s.setting_value),
            updated_at: db.fn.now(),
          });

          // Automatically sync phone_raw when phone_display is updated
          if (s.setting_key === "phone_display") {
            const raw = String(s.setting_value).replace(/[^\d+]/g, "");
            await db("site_settings").where({ setting_key: "phone_raw" }).update({
              setting_value: raw,
              updated_at: db.fn.now(),
            });
          }
        }
      }

      if (founder) {
        await db("about_content")
          .where({ section_key: "founder_profile" })
          .update({
            content_payload: JSON.stringify(founder),
            updated_at: db.fn.now(),
          });

        if (founder.name) {
          await db("site_settings")
            .where({ setting_key: "advisor_name" })
            .update({ setting_value: String(founder.name), updated_at: db.fn.now() });
        }
        if (founder.role) {
          await db("site_settings")
            .where({ setting_key: "advisor_title" })
            .update({ setting_value: String(founder.role), updated_at: db.fn.now() });
        }
      }

      if (values) {
        await db("about_content")
          .where({ section_key: "core_values" })
          .update({
            content_payload: JSON.stringify(values),
            updated_at: db.fn.now(),
          });
      }

      await logAuditEvent({
        userId: req.user?.id,
        action: "UPDATE",
        entityName: "site_settings",
        req,
      });

      return ApiResponse.success(res, null, "Settings updated successfully.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message);
    }
  }
}
