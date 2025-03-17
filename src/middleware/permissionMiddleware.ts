import { Response, NextFunction } from "express";
import pool from "../config/db";
import { AuthRequest } from "./authMiddleware";

export const checkPermission = (
  action: "can_read" | "can_create" | "can_update" | "can_delete"
) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
      return;
    }

    try {
      const { role } = req.user;

      const result = await pool.query(
        `SELECT ${action} FROM permissions WHERE role = $1`,
        [role]
      );

      if (result.rows.length === 0 || !result.rows[0][action]) {
        res
          .status(403)
          .json({ message: "Bu amalni bajarish uchun ruxsat yo‘q" });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Server xatosi", error });
    }
  };
};
