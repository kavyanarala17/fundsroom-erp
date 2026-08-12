import { Router } from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE"),
  createProduct
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE", "SALES"),
  getProducts
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE", "SALES"),
  getProduct
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE"),
  updateProduct
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteProduct
);

export default router;