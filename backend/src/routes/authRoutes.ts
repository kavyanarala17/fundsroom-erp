import { Router } from "express";
import { register, login } from "../controllers/authController";
import {
  registerValidator,
  loginValidator
} from "../validators/authValidator";
import { validateRequest } from "../middleware/validationMiddleware";
import {
  authenticateToken,
  AuthRequest
} from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

const router = Router();

router.post(
  "/register",
  registerValidator,
  validateRequest,
  register
);

router.post(
  "/login",
  loginValidator,
  validateRequest,
  login
);

router.get(
  "/me",
  authenticateToken,
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Authenticated user",
      user: req.user
    });
  }
);

router.get(
  "/admin-test",
  authenticateToken,
  authorizeRoles("ADMIN"),
  (req: AuthRequest, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted"
    });
  }
);

export default router;