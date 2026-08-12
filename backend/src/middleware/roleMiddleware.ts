import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

type Role = "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";

export function authorizeRoles(...allowedRoles: Role[]) {
  return (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }

    next();
  };
}