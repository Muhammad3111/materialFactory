import { Router } from "express";
import {
  addIncomingProduct,
  removeOutgoingProduct,
} from "../controllers/inventoryController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

router.post(
  "/incoming",
  authMiddleware,
  checkPermission("can_create"),
  addIncomingProduct
);
router.post(
  "/outgoing",
  authMiddleware,
  checkPermission("can_create"),
  removeOutgoingProduct
);

export default router;
