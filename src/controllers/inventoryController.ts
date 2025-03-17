import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// 📌 1. Omborga mahsulot qabul qilish (incoming)
export const addIncomingProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
      return;
    }

    const { product_id, partner_id, quantity, cost, unit, expense, flaw } =
      req.body;
    if (
      !product_id ||
      !quantity ||
      !cost ||
      !unit ||
      expense === undefined ||
      flaw === undefined
    ) {
      res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
      return;
    }

    const total_cost = quantity * cost;

    // ✅ Ombordagi mahsulotni yangilash
    await pool.query(
      "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
      [quantity, product_id]
    );

    // ✅ Logga yozamiz
    await pool.query(
      "INSERT INTO inventory_log (product_id, partner_id, user_id, type, quantity, cost, total_cost, unit, expense, flaw) VALUES ($1, $2, $3, 'incoming', $4, $5, $6, $7, $8, $9)",
      [
        product_id,
        partner_id,
        req.user.id,
        quantity,
        cost,
        total_cost,
        unit,
        expense,
        flaw,
      ]
    );

    res.json({ message: "Mahsulot omborga muvaffaqiyatli qo‘shildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 2. Ombordan mahsulot chiqarish (outgoing)
export const removeOutgoingProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
      return;
    }

    const { product_id, partner_id, quantity, cost, unit, flaw } = req.body;
    if (!product_id || !quantity || !cost || !unit || flaw === undefined) {
      res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
      return;
    }

    const total_cost = quantity * cost;

    // ✅ Ombordagi mahsulot miqdorini kamaytiramiz
    await pool.query(
      "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
      [quantity, product_id]
    );

    // ✅ Logga yozamiz
    await pool.query(
      "INSERT INTO inventory_log (product_id, partner_id, user_id, type, quantity, cost, total_cost, unit, flaw) VALUES ($1, $2, $3, 'outgoing', $4, $5, $6, $7, $8)",
      [
        product_id,
        partner_id,
        req.user.id,
        quantity,
        cost,
        total_cost,
        unit,
        flaw,
      ]
    );

    res.json({ message: "Mahsulot ombordan chiqarildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
