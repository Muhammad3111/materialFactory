import { Router } from "express";
import {
  deleteUser,
  getAllUsers,
  getProfile,
  updateProfile,
  updateSalaries,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, checkPermission("can_read"), getAllUsers);
router.put("/update-salaries", authMiddleware, updateSalaries);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("can_update"),
  updateProfile
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("can_delete"),
  deleteUser
);

export default router;
