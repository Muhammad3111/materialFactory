import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { validationResult } from "express-validator";

// JWT yaratish funksiyasi
const generateToken = (id: number, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "24h",
  });
};

/// 📌 Ro‘yxatdan o‘tish (faqat admin foydalanuvchi qo‘shishi mumkin)
export const register = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  // 📌 Tokenni olish
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token mavjud emas" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    // 📌 Faqat admin foydalanuvchi yaratishi mumkin
    if (decoded.role !== "admin") {
      res
        .status(403)
        .json({ message: "Sizda foydalanuvchi yaratish huquqi yo‘q" });
      return;
    }

    const {
      fullname,
      phone,
      password,
      role,
      salary_type = "oylik",
      salary_amount = 0.0,
    } = req.body;

    const userCheck = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    if (userCheck.rows.length > 0) {
      res
        .status(400)
        .json({ message: "Bu telefon raqam allaqachon ro‘yxatdan o‘tgan" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      `INSERT INTO users 
      (fullname, phone, password, role, salary_type, salary_amount, total_hours, final_salary, total_received, total_output_products) 
      VALUES ($1, $2, $3, $4, $5, $6, 0.00, 0.00, 0.00, 0.00) 
      RETURNING *`,
      [
        fullname,
        phone,
        hashedPassword,
        role || "ishchi",
        salary_type,
        salary_amount,
      ]
    );

    res.status(201).json({
      message: "Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi",
    });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

/// 📌 Kirish (Login)
export const login = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { phone, password } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE phone = $1", [
      phone,
    ]);
    if (userCheck.rows.length === 0) {
      res.status(400).json({ message: "Telefon raqam yoki parol noto‘g‘ri" });
      return;
    }

    const user = userCheck.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Telefon raqam yoki parol noto‘g‘ri" });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    res.json({ message: "Tizimga muvaffaqiyatli kirdingiz", token });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

// 📌 Chiqish (Logout)
export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie("token");
  res.json({ message: "Tizimdan muvaffaqiyatli chiqildi" });
};
