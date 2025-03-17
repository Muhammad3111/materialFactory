import { Router } from "express";
import {
  getAllPartners,
  addPartner,
  updatePartner,
  deletePartner,
} from "../controllers/partnersController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

router.get("/", authMiddleware, checkPermission("can_read"), getAllPartners);
router.post(
  "/create",
  authMiddleware,
  checkPermission("can_create"),
  addPartner
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("can_update"),
  updatePartner
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("can_delete"),
  deletePartner
);

export default router;
