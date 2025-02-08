import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware"; // ✅ Custom Request tipini import qilamiz

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
      return;
    }

    const user = await pool.query(
      "SELECT id, fullname, phone, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (user.rows.length === 0) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      return;
    }

    res.json(user.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
