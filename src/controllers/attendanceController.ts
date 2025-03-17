import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import pool from "../config/db";

// 📌 Xodim ishga kirganini qayd qilish (Check-in)
export const checkIn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
      return;
    }

    const userId = req.user.id;

    // 📌 Foydalanuvchi allaqachon ishga kirganmi?
    const existingCheckIn = await pool.query(
      `SELECT id FROM attendance_log WHERE user_id = $1 AND check_out IS NULL`,
      [userId]
    );

    if (existingCheckIn.rows.length > 0) {
      res.status(400).json({ message: "Siz allaqachon ishga kirgansiz!" });
      return;
    }

    // 📌 Yangi check-in yozish
    await pool.query(
      `INSERT INTO attendance_log (user_id, check_in) VALUES ($1, NOW())`,
      [userId]
    );

    res.json({ message: "Ishga kirish muvaffaqiyatli qayd qilindi!" });
  } catch (error) {
    res.status(500).json({ message: "Check-in jarayonida xatolik", error });
  }
};

// 📌 Xodim ishni tugatganini qayd qilish (Check-out)
export const checkOut = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Foydalanuvchi aniqlanmadi" });
      return;
    }

    const userId = req.user.id;

    // 📌 Ochiq (hali tugallanmagan) check-in yozuvini topish
    const checkInLog = await pool.query(
      `SELECT id, check_in FROM attendance_log WHERE user_id = $1 AND check_out IS NULL`,
      [userId]
    );

    if (checkInLog.rows.length === 0) {
      res.status(400).json({ message: "Siz hali ish boshlamadingiz!" });
      return;
    }

    const checkInTime = new Date(checkInLog.rows[0].check_in);
    const checkOutTime = new Date();
    const workedHours =
      (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // Soatlarda hisoblash

    // 📌 Check-out qilish va ishlagan soatlarni yangilash
    await pool.query(
      `UPDATE attendance_log 
         SET check_out = NOW(), worked_hours = $1
         WHERE id = $2`,
      [workedHours, checkInLog.rows[0].id]
    );

    // 📌 `users` jadvalidagi `total_hours` ni yangilash
    await pool.query(
      `UPDATE users SET total_hours = total_hours + $1 WHERE id = $2`,
      [workedHours, userId]
    );

    res.json({
      message: "Ishdan chiqish muvaffaqiyatli qayd qilindi!",
      workedHours,
    });
  } catch (error) {
    res.status(500).json({ message: "Check-out jarayonida xatolik", error });
  }
};

// 📌 Barcha yoki bitta foydalanuvchining ishlagan soatlarini olish
export const getAllAttendanceLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Avtorizatsiya talab qilinadi" });
      return;
    }

    let query = `
        SELECT al.id, u.fullname, u.role, al.check_in, al.check_out, al.worked_hours, al.created_at
        FROM attendance_log al
        LEFT JOIN users u ON al.user_id = u.id
      `;

    const values: any[] = [];

    // 📌 Agar foydalanuvchi `admin` bo‘lmasa, faqat o‘ziga tegishli ma’lumotlarni olishi kerak
    if (req.user.role !== "admin") {
      query += " WHERE al.user_id = $1";
      values.push(req.user.id);
    }

    query += " ORDER BY al.created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Kirdi-chiqdi ma’lumotlarini olishda xatolik", error });
  }
};
