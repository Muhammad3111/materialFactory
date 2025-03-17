import { Router } from "express";
import {
  getInventoryLogById,
  updateInventoryLog,
  deleteInventoryLog,
  getAllIncomingLogs,
  getAllOutgoingLogs,
} from "../controllers/inventoryLogsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

// 🔹 Barcha loglarni olish (faqat ruxsati bo‘lsa)
router.get(
  "/incoming",
  authMiddleware,
  checkPermission("can_read"),
  getAllIncomingLogs
);

router.get(
  "/outgoing",
  authMiddleware,
  checkPermission("can_read"),
  getAllOutgoingLogs
);

// 🔹 Bitta logni olish (faqat ruxsati bo‘lsa)
router.get(
  "/:id",
  authMiddleware,
  checkPermission("can_read"),
  getInventoryLogById
);

// 🔹 Logni yangilash (faqat admin)
router.put(
  "/:id",
  authMiddleware,
  checkPermission("can_update"),
  updateInventoryLog
);

// 🔹 Logni o‘chirish (faqat admin)
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("can_delete"),
  deleteInventoryLog
);

export default router;
