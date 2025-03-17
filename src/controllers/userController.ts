import { Response } from "express";
import pool from "../config/db";
import { AuthRequest } from "../middleware/authMiddleware"; // ✅ Custom Request tipini import qilamiz
import { updateEmployeeSalaries } from "../models/updateEmployeeSalaries";

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
      `SELECT id, fullname, phone, role, salary_type, salary_amount, total_hours, final_salary, total_received, total_output_products, created_at 
       FROM users WHERE id = $1`,
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

export const getAllUsers = async (
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

    const users = await pool.query(
      "SELECT id, fullname, phone, password, role, salary_type, salary_amount, total_hours, final_salary, total_received, total_output_products, created_at FROM users"
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

export const updateSalaries = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await updateEmployeeSalaries();
    res.json({ message: "Xodimlarning oyliklari muvaffaqiyatli yangilandi" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Xodimlarning oyliklarini yangilashda xatolik", error });
  }
};

// 📌 2. Foydalanuvchi o‘z profilini yangilashi mumkin
export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
      return;
    }

    const { fullname, phone } = req.body;
    await pool.query(
      "UPDATE users SET fullname = $1, phone = $2 WHERE id = $3",
      [fullname, phone, req.user.id]
    );

    res.json({ message: "Profil muvaffaqiyatli yangilandi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 3. Foydalanuvchini o‘chirish (faqat admin huquqiga ega)
export const deleteUser = async (
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

    // Admin o‘zini o‘chirib qo‘ymasligi uchun tekshiramiz
    if (parseInt(id) === req.user.id) {
      res.status(400).json({ message: "Admin o‘zini o‘chirib qo‘ya olmaydi" });
      return;
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "Foydalanuvchi muvaffaqiyatli o‘chirildi" });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};
