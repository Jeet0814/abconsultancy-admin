import db from "../../db/connection";

export class InquiriesService {
  static async listInquiries(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    service?: string;
    priority?: string;
    assignedTo?: number;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, Math.min(100, params.limit || 15));
    const offset = (page - 1) * limit;

    let query = db("inquiries as i")
      .leftJoin("users as u", "i.assigned_to_user_id", "u.id")
      .whereNull("i.deleted_at")
      .select(
        "i.id",
        "i.reference_no",
        "i.name",
        "i.phone",
        "i.email",
        "i.service_requested",
        "i.message",
        "i.status",
        "i.priority",
        "i.assigned_to_user_id",
        "i.follow_up_date",
        "i.source_channel",
        "i.created_at",
        "i.updated_at",
        "u.name as assigned_to_name",
        "u.email as assigned_to_email",
      );

    let countQuery = db("inquiries as i").whereNull("i.deleted_at");

    if (params.search && params.search.trim()) {
      const s = `%${params.search.trim()}%`;
      const searchClause = function (this: any) {
        this.where("i.name", "like", s)
          .orWhere("i.phone", "like", s)
          .orWhere("i.email", "like", s)
          .orWhere("i.reference_no", "like", s);
      };
      query = query.where(searchClause);
      countQuery = countQuery.where(searchClause);
    }

    if (params.status && params.status !== "all") {
      query = query.where("i.status", params.status);
      countQuery = countQuery.where("i.status", params.status);
    }

    if (params.service) {
      query = query.where("i.service_requested", params.service);
      countQuery = countQuery.where("i.service_requested", params.service);
    }

    if (params.priority && params.priority !== "all") {
      query = query.where("i.priority", params.priority);
      countQuery = countQuery.where("i.priority", params.priority);
    }

    if (params.assignedTo) {
      query = query.where("i.assigned_to_user_id", params.assignedTo);
      countQuery = countQuery.where("i.assigned_to_user_id", params.assignedTo);
    }

    if (params.startDate) {
      query = query.where("i.created_at", ">=", params.startDate);
      countQuery = countQuery.where("i.created_at", ">=", params.startDate);
    }

    if (params.endDate) {
      query = query.where("i.created_at", "<=", `${params.endDate} 23:59:59`);
      countQuery = countQuery.where("i.created_at", "<=", `${params.endDate} 23:59:59`);
    }

    const sortColumn = params.sortBy ? `i.${params.sortBy}` : "i.created_at";
    const sortDirection = params.sortOrder || "desc";

    const [rows, countResult] = await Promise.all([
      query.orderBy(sortColumn, sortDirection).limit(limit).offset(offset),
      countQuery.count("i.id as total").first(),
    ]);

    const total = Number(countResult?.total || 0);

    return {
      items: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getInquiryDetail(id: number) {
    const inquiry = await db("inquiries as i")
      .leftJoin("users as u", "i.assigned_to_user_id", "u.id")
      .where("i.id", id)
      .whereNull("i.deleted_at")
      .select(
        "i.*",
        "u.name as assigned_to_name",
        "u.email as assigned_to_email",
      )
      .first();

    if (!inquiry) return null;

    const [notes, history, tags] = await Promise.all([
      db("inquiry_notes as n")
        .leftJoin("users as u", "n.user_id", "u.id")
        .where("n.inquiry_id", id)
        .select("n.*", "u.name as author_name")
        .orderBy("n.is_pinned", "desc")
        .orderBy("n.created_at", "desc"),

      db("inquiry_status_history as h")
        .leftJoin("users as u", "h.changed_by_user_id", "u.id")
        .where("h.inquiry_id", id)
        .select("h.*", "u.name as changed_by_name")
        .orderBy("h.created_at", "desc"),

      db("inquiry_tag_mappings as tm")
        .join("inquiry_tags as t", "tm.tag_id", "t.id")
        .where("tm.inquiry_id", id)
        .select("t.id", "t.tag_name", "t.color_hex"),
    ]);

    return {
      ...inquiry,
      notes,
      history,
      tags,
    };
  }

  static async updateStatus(inquiryId: number, newStatus: string, userId?: number, remarks?: string) {
    const inquiry = await db("inquiries").where({ id: inquiryId }).first();
    if (!inquiry) throw new Error("Inquiry not found.");

    const oldStatus = inquiry.status;

    await db("inquiries")
      .where({ id: inquiryId })
      .update({
        status: newStatus,
        updated_at: db.fn.now(),
      });

    await db("inquiry_status_history").insert({
      inquiry_id: inquiryId,
      changed_by_user_id: userId || null,
      old_status: oldStatus,
      new_status: newStatus,
      remarks: remarks || `Status changed from ${oldStatus} to ${newStatus}`,
    });

    return { id: inquiryId, oldStatus, newStatus };
  }

  static async assignUser(inquiryId: number, assignedToUserId: number | null, assignedByUserId?: number) {
    await db("inquiries")
      .where({ id: inquiryId })
      .update({
        assigned_to_user_id: assignedToUserId,
        updated_at: db.fn.now(),
      });
  }

  static async updatePriority(inquiryId: number, priority: string) {
    await db("inquiries")
      .where({ id: inquiryId })
      .update({
        priority,
        updated_at: db.fn.now(),
      });
  }

  static async setFollowUp(inquiryId: number, followUpDate: string | null) {
    await db("inquiries")
      .where({ id: inquiryId })
      .update({
        follow_up_date: followUpDate ? new Date(followUpDate) : null,
        updated_at: db.fn.now(),
      });
  }

  static async addNote(inquiryId: number, userId: number | undefined, noteText: string, isPinned = false) {
    const [noteId] = await db("inquiry_notes").insert({
      inquiry_id: inquiryId,
      user_id: userId || null,
      note_text: noteText.trim(),
      is_pinned: isPinned,
    });
    return noteId;
  }

  static async deleteNote(noteId: number) {
    await db("inquiry_notes").where({ id: noteId }).del();
  }

  static async deleteInquiry(inquiryId: number) {
    await db("inquiries").where({ id: inquiryId }).update({
      deleted_at: db.fn.now(),
    });
  }

  static async bulkUpdateStatus(inquiryIds: number[], newStatus: string, userId?: number, remarks?: string) {
    await db("inquiries")
      .whereIn("id", inquiryIds)
      .update({
        status: newStatus,
        updated_at: db.fn.now(),
      });

    const historyRows = inquiryIds.map((id) => ({
      inquiry_id: id,
      changed_by_user_id: userId || null,
      old_status: null,
      new_status: newStatus,
      remarks: remarks || "Bulk status update",
    }));

    await db("inquiry_status_history").insert(historyRows);
  }

  static async exportInquiriesCsv(filters: any) {
    const result = await this.listInquiries({ ...filters, limit: 5000, page: 1 });
    const items = result.items;

    const headers = [
      "Reference No",
      "Date",
      "Name",
      "Phone",
      "Email",
      "Service Requested",
      "Status",
      "Priority",
      "Assigned To",
      "Follow Up Date",
      "Channel",
      "Message",
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const val = String(str).replace(/"/g, '""');
      return `"${val}"`;
    };

    const lines = [headers.join(",")];
    for (const item of items) {
      lines.push([
        escapeCsv(item.reference_no),
        escapeCsv(new Date(item.created_at).toLocaleString()),
        escapeCsv(item.name),
        escapeCsv(item.phone),
        escapeCsv(item.email || ""),
        escapeCsv(item.service_requested),
        escapeCsv(item.status),
        escapeCsv(item.priority),
        escapeCsv(item.assigned_to_name || "Unassigned"),
        escapeCsv(item.follow_up_date ? new Date(item.follow_up_date).toLocaleDateString() : ""),
        escapeCsv(item.source_channel),
        escapeCsv(item.message),
      ].join(","));
    }

    return lines.join("\n");
  }

  static async getDashboardStats() {
    const today = new Date().toISOString().split("T")[0];

    const [
      totalCount,
      newCount,
      inProgressCount,
      followUpCount,
      convertedCount,
      todayCount,
      overdueFollowUps,
      serviceCounts,
    ] = await Promise.all([
      db("inquiries").whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where({ status: "New" }).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where({ status: "In Progress" }).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where({ status: "Follow-up" }).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where({ status: "Converted" }).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where("created_at", ">=", `${today} 00:00:00`).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").where("follow_up_date", "<", db.fn.now()).whereNotIn("status", ["Converted", "Closed", "Spam"]).whereNull("deleted_at").count("id as count").first(),
      db("inquiries").whereNull("deleted_at").groupBy("service_requested").select("service_requested as service", db.raw("COUNT(id) as count")),
    ]);

    // Weekly trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const sevenDaysStr = sevenDaysAgo.toISOString().split("T")[0];

    const weeklyTrendRows = await db("inquiries")
      .where("created_at", ">=", `${sevenDaysStr} 00:00:00`)
      .whereNull("deleted_at")
      .select(db.raw("DATE(created_at) as date"), db.raw("COUNT(id) as count"))
      .groupByRaw("DATE(created_at)")
      .orderBy("date", "asc");

    // Recent 5 inquiries
    const recentInquiries = await db("inquiries as i")
      .leftJoin("users as u", "i.assigned_to_user_id", "u.id")
      .whereNull("i.deleted_at")
      .select("i.id", "i.reference_no", "i.name", "i.phone", "i.service_requested", "i.status", "i.priority", "i.created_at", "u.name as assigned_to_name")
      .orderBy("i.created_at", "desc")
      .limit(6);

    return {
      metrics: {
        total: Number(totalCount?.count || 0),
        new: Number(newCount?.count || 0),
        inProgress: Number(inProgressCount?.count || 0),
        followUp: Number(followUpCount?.count || 0),
        converted: Number(convertedCount?.count || 0),
        today: Number(todayCount?.count || 0),
        overdueFollowUps: Number(overdueFollowUps?.count || 0),
      },
      serviceBreakdown: serviceCounts.map((s: any) => ({ service: s.service, count: Number(s.count) })),
      weeklyTrends: weeklyTrendRows.map((r: any) => ({ date: r.date, count: Number(r.count) })),
      recentInquiries,
    };
  }
}
