import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// 📌 1. Barcha mahsulotlarni olish
export const getAllProducts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const products = await pool.query(
      "SELECT * FROM products ORDER BY created_at DESC"
    );
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const product = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (product.rowCount === 0) {
      res.status(404).json({ message: "Mahsulot topilmadi" });
      return;
    }

    res.json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 2. Yangi mahsulot qo‘shish
export const addProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, category, quantity, price, low_stock_threshold } = req.body;

    if (!name || !quantity || !price || low_stock_threshold === undefined) {
      res.status(400).json({ message: "Barcha maydonlarni to‘ldiring" });
      return;
    }

    await pool.query(
      "INSERT INTO products (name, category, quantity, price, low_stock_threshold) VALUES ($1, $2, $3, $4, $5)",
      [name, category, quantity, price, low_stock_threshold]
    );

    res.json({ message: "Mahsulot muvaffaqiyatli qo‘shildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 3. Mahsulotni yangilash
export const updateProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, category, quantity, price, low_stock_threshold } = req.body;

    await pool.query(
      "UPDATE products SET name = $1, category = $2, quantity = $3, price = $4, low_stock_threshold = $5 WHERE id = $6",
      [name, category, quantity, price, low_stock_threshold, id]
    );

    res.json({ message: "Mahsulot muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 4. Mahsulotni o‘chirish
export const deleteProduct = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ message: "Mahsulot muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
