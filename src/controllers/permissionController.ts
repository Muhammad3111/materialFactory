import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

export const createPermission = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Sizda bu amalni bajarish uchun ruxsat yo‘q" });
      return;
    }

    const { role, can_read, can_create, can_update, can_delete } = req.body;

    await pool.query(
      `INSERT INTO permissions (role, can_read, can_create, can_update, can_delete)
         VALUES ($1, $2, $3, $4, $5) ON CONFLICT (role) DO UPDATE 
         SET can_read = $2, can_create = $3, can_update = $4, can_delete = $5`,
      [role, can_read, can_create, can_update, can_delete]
    );

    res.json({
      message: `Ruxsat muvaffaqiyatli qo‘shildi yoki yangilandi: ${role}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 1. Ruxsatlarni ko‘rish (faqat admin)
export const getPermissions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Sizda bu amalni bajarish uchun ruxsat yo‘q" });
      return;
    }

    const permissions = await pool.query("SELECT * FROM permissions");
    res.json(permissions.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 2. Ruxsatlarni yangilash (faqat admin)
export const updatePermissions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || req.user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Sizda bu amalni bajarish uchun ruxsat yo‘q" });
      return;
    }

    const { id } = req.params; // ✅ `id` ni URL orqali olamiz
    const { can_read, can_create, can_update, can_delete } = req.body;

    if (!id) {
      res.status(400).json({ message: "Permission ID talab qilinadi" });
      return;
    }

    // 📌 Dinamik SQL query va parametrlar yaratamiz
    const updates = [];
    const values: any[] = [];

    if (can_read !== undefined) {
      updates.push("can_read = $" + (values.length + 1));
      values.push(can_read);
    }
    if (can_create !== undefined) {
      updates.push("can_create = $" + (values.length + 1));
      values.push(can_create);
    }
    if (can_update !== undefined) {
      updates.push("can_update = $" + (values.length + 1));
      values.push(can_update);
    }
    if (can_delete !== undefined) {
      updates.push("can_delete = $" + (values.length + 1));
      values.push(can_delete);
    }

    if (updates.length === 0) {
      res
        .status(400)
        .json({ message: "Yangilash uchun hech qanday ma’lumot yuborilmadi" });
      return;
    }

    values.push(id);
    const query = `UPDATE permissions SET ${updates.join(", ")} WHERE id = $${
      values.length
    }`;

    await pool.query(query, values);

    res.json({ message: `Ruxsat muvaffaqiyatli yangilandi (ID: ${id})` });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
