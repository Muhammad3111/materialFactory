import { Request, Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware";

// 📌 1. Barcha hamkorlarni olish
export const getAllPartners = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const partners = await pool.query(
      "SELECT * FROM partners ORDER BY id DESC"
    );
    res.json(partners.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 2. Yangi hamkor qo‘shish
export const addPartner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, phone, address } = req.body;
    if (!name) {
      res.status(400).json({ message: "Hamkor nomi talab qilinadi" });
      return;
    }

    await pool.query(
      "INSERT INTO partners (name, phone, address) VALUES ($1, $2, $3)",
      [name, phone, address]
    );

    res.json({ message: "Hamkor muvaffaqiyatli qo‘shildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 3. Hamkorni yangilash
export const updatePartner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    await pool.query(
      "UPDATE partners SET name = $1, phone = $2, address = $3 WHERE id = $4",
      [name, phone, address, id]
    );

    res.json({ message: "Hamkor muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 4. Hamkorni o‘chirish
export const deletePartner = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM partners WHERE id = $1", [id]);

    res.json({ message: "Hamkor muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
