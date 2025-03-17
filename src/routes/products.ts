import { Router } from "express";
import {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { checkPermission } from "../middleware/permissionMiddleware";

const router = Router();

router.get("/", authMiddleware, checkPermission("can_read"), getAllProducts);
router.get("/:id", authMiddleware, checkPermission("can_read"), getProductById);
router.post(
  "/create",
  authMiddleware,
  checkPermission("can_create"),
  addProduct
);
router.put(
  "/:id",
  authMiddleware,
  checkPermission("can_update"),
  updateProduct
);
router.delete(
  "/:id",
  authMiddleware,
  checkPermission("can_delete"),
  deleteProduct
);

export default router;
