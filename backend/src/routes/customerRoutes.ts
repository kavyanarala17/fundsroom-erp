import { Router } from "express";

import {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerSummary,
  searchCustomersController
} from "../controllers/customerController";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";
import { createCustomerValidator } from "../validators/customerValidator";

const router = Router();

router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES"),
  createCustomerValidator,
  validateRequest,
  createCustomer
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES"),
  getCustomers
);

router.get(
  "/search",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES"),
  searchCustomersController
);

router.get(
  "/:id/summary",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES", "ACCOUNTS"),
  getCustomerSummary
);

router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES"),
  getCustomer
);

router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "SALES"),
  updateCustomer
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteCustomer
);

export default router;