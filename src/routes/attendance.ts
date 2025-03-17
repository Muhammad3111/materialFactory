import { Router } from "express";
import {
  checkIn,
  checkOut,
  getAllAttendanceLogs,
} from "../controllers/attendanceController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

// 📌 Ishga kirish (Check-in)
router.post("/check-in", authMiddleware, checkIn);

// 📌 Ishdan chiqish (Check-out)
router.post("/check-out", authMiddleware, checkOut);

// 📌 Barcha yoki foydalanuvchining kirdi-chiqdi ma’lumotlarini olish
router.get("/logs", authMiddleware, getAllAttendanceLogs);

export default router;
