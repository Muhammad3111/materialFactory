import { Router } from "express";
import { getInventoryStats } from "../controllers/inventoryStatsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

// 🔹 Ombor statistikalarini olish (faqat ruxsati bo‘lsa)
router.get("/", authMiddleware, checkPermission("can_read"), getInventoryStats);

export default router;
