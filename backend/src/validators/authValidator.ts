import { body } from "express-validator";

const allowedRoles = ["ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"];

export const registerValidator = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("role")
    .isIn(allowedRoles)
    .withMessage("Role must be ADMIN, SALES, WAREHOUSE, or ACCOUNTS")
];

export const loginValidator = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
];