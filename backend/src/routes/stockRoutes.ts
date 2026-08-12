import { Router } from "express";

import {
  createStockMovement,
  getStockMovements,
  getStockMovement
} from "../controllers/stockController";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE"),
  createStockMovement
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE"),
  getStockMovements
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "WAREHOUSE"),
  getStockMovement
);

export default router;