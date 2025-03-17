import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// 📌 Ombor statistikalarini olish
export const getInventoryStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const stats = await pool.query(`
      SELECT 
        -- Omborda mavjud mahsulotlarning umumiy soni va narxi
        COALESCE((SELECT SUM(quantity) FROM products)::INTEGER, 0) AS total_stock_quantity,
        COALESCE((SELECT SUM(quantity * price) FROM products)::NUMERIC(12,2), 0) AS total_stock_value,

        -- Kirim (incoming) mahsulotlar statistikasi
        COALESCE((SELECT SUM(quantity) FROM inventory_log WHERE type = 'incoming')::INTEGER, 0) AS total_incoming_quantity,
        COALESCE((SELECT SUM(total_cost) FROM inventory_log WHERE type = 'incoming')::NUMERIC(12,2), 0) AS total_incoming_value,
        COALESCE((SELECT SUM(expense) FROM inventory_log WHERE type = 'incoming')::NUMERIC(12,2), 0) AS total_incoming_expense,

        -- Chiqim (outgoing) mahsulotlar statistikasi
        COALESCE((SELECT SUM(quantity) FROM inventory_log WHERE type = 'outgoing')::INTEGER, 0) AS total_outgoing_quantity,
        COALESCE((SELECT SUM(total_cost) FROM inventory_log WHERE type = 'outgoing')::NUMERIC(12,2), 0) AS total_outgoing_value,
        COALESCE((SELECT SUM(expense) FROM inventory_log WHERE type = 'outgoing')::NUMERIC(12,2), 0) AS total_outgoing_expense,

        -- Umumiy kamomat foiz sifatida
        COALESCE((SELECT AVG(flaw) FROM inventory_log WHERE type = 'outgoing')::NUMERIC(5,2), 0) AS average_flaw_percentage,

        -- Kirim (incoming) mahsulotlarning kamomati (real miqdorda)
        COALESCE((SELECT SUM(quantity * (flaw / 100)) FROM inventory_log WHERE type = 'incoming')::NUMERIC(10,2), 0) AS total_incoming_flaw_quantity,

        -- Chiqim (outgoing) mahsulotlarning kamomati (real miqdorda)
        COALESCE((SELECT SUM(quantity * (flaw / 100)) FROM inventory_log WHERE type = 'outgoing')::NUMERIC(10,2), 0) AS total_outgoing_flaw_quantity
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
