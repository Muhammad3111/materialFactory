import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// 📌 1. Barcha inventory loglarni olish (Kim, qachon, nima qildi?)
export const getAllIncomingLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const logs = await pool.query(`
      SELECT il.id, 
             json_build_object(
               'id', p.id,
               'name', p.name,
               'category', p.category,
               'quantity', p.quantity,
               'price', p.price,
               'low_stock_threshold', p.low_stock_threshold,
               'created_at', p.created_at
             ) AS product,
             pr.name AS partner_name,
             u.fullname AS user_name,
             il.type, il.quantity, il.cost, il.total_cost, 
             il.expense, il.flaw, il.unit, il.created_at
      FROM inventory_log il
      LEFT JOIN products p ON il.product_id = p.id
      LEFT JOIN partners pr ON il.partner_id = pr.id
      LEFT JOIN users u ON il.user_id = u.id
      WHERE il.type = 'incoming'
      ORDER BY il.created_at DESC
    `);

    res.json(logs.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

export const getAllOutgoingLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const logs = await pool.query(`
      SELECT il.id, 
             json_build_object(
               'id', p.id,
               'name', p.name,
               'category', p.category,
               'quantity', p.quantity,
               'price', p.price,
               'low_stock_threshold', p.low_stock_threshold,
               'created_at', p.created_at
             ) AS product,
             pr.name AS partner_name,
             u.fullname AS user_name,
             il.type, il.quantity, il.cost, il.total_cost, 
             il.expense, il.flaw, il.unit, il.created_at
      FROM inventory_log il
      LEFT JOIN products p ON il.product_id = p.id
      LEFT JOIN partners pr ON il.partner_id = pr.id
      LEFT JOIN users u ON il.user_id = u.id
      WHERE il.type = 'outgoing'
      ORDER BY il.created_at DESC
    `);

    res.json(logs.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 2. Bitta logni olish (ID orqali)
export const getInventoryLogById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await pool.query(
      `
      SELECT il.id, 
             json_build_object(
               'id', p.id,
               'name', p.name,
               'category', p.category,
               'quantity', p.quantity,
               'price', p.price,
               'low_stock_threshold', p.low_stock_threshold,
               'created_at', p.created_at
             ) AS product,
             pr.name AS partner_name,
             u.fullname AS user_name,
             il.type, il.quantity, il.cost, il.total_cost, 
             il.expense, il.flaw, il.unit, il.created_at
      FROM inventory_log il
      LEFT JOIN products p ON il.product_id = p.id
      LEFT JOIN partners pr ON il.partner_id = pr.id
      LEFT JOIN users u ON il.user_id = u.id
      WHERE il.id = $1
    `,
      [id]
    );

    if (log.rows.length === 0) {
      res.status(404).json({ message: "Log topilmadi" });
      return;
    }

    res.json(log.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 3. Logni yangilash (faqat admin ruxsat oladi)
export const updateInventoryLog = async (
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

    const { id } = req.params;
    const { quantity, cost, expense, flaw, unit } = req.body;

    if (!quantity || !cost || !expense || !flaw || !unit) {
      res
        .status(400)
        .json({ message: "Yangilash uchun barcha maydonlarni to‘ldiring" });
      return;
    }

    const total_cost = quantity * cost;

    await pool.query(
      "UPDATE inventory_log SET quantity = $1, cost = $2, total_cost = $3, expense = $4, flaw = $5, unit = $6 WHERE id = $7",
      [quantity, cost, total_cost, expense, flaw, unit, id]
    );

    res.json({ message: "Log muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 4. Logni o‘chirish (faqat admin ruxsat oladi)
export const deleteInventoryLog = async (
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

    const { id } = req.params;

    await pool.query("DELETE FROM inventory_log WHERE id = $1", [id]);

    res.json({ message: "Log muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
