import { Router } from "express";

import {
  getLowStockProducts,
  getInventorySummary
} from "../controllers/inventoryController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.get(
  "/low-stock",
  authenticateToken,
  getLowStockProducts
);

router.get(
  "/summary",
  authenticateToken,
  getInventorySummary
);

export default router;