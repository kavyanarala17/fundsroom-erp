import { Router } from "express";

import {
  createPayment,
  getPayments,
  getPayment
} from "../controllers/paymentController";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "ACCOUNTS"),
  createPayment
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "ACCOUNTS", "SALES"),
  getPayments
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "ACCOUNTS", "SALES"),
  getPayment
);

export default router;