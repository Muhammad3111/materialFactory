import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

// 📌 Tokenni tekshirish va foydalanuvchini aniqlash
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Token mavjud emas" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      role: string;
    };

    req.user = decoded;
    next(); // 📌 Keyingi middleware yoki controllerga o‘tish
  } catch (error) {
    res.status(401).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
  }
};
