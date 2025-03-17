import { Router } from "express";
import {
  createPermission,
  getPermissions,
  updatePermissions,
} from "../controllers/permissionController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/create", authMiddleware, createPermission);

// 🔹 Barcha ruxsatlarni ko‘rish (faqat admin)
router.get("/", authMiddleware, getPermissions);

// 🔹 Ruxsatlarni yangilash (faqat admin)
router.put("/:id", authMiddleware, updatePermissions);

export default router;
