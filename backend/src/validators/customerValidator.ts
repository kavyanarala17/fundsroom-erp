import { body } from "express-validator";

const allowedCustomerTypes = [
  "RETAIL",
  "WHOLESALE",
  "DISTRIBUTOR"
];

const allowedStatuses = [
  "LEAD",
  "ACTIVE",
  "INACTIVE"
];

export const createCustomerValidator = [
  body("customerName")
    .trim()
    .notEmpty()
    .withMessage("Customer name is required"),

  body("mobileNumber")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required"),

  body("email")
    .optional({ values: "falsy" })
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required"),

  body("gstNumber")
    .optional({ values: "falsy" })
    .trim(),

  body("customerType")
    .isIn(allowedCustomerTypes)
    .withMessage(
      "Customer type must be RETAIL, WHOLESALE, or DISTRIBUTOR"
    ),

  body("address")
    .optional({ values: "falsy" })
    .trim(),

  body("status")
    .optional()
    .isIn(allowedStatuses)
    .withMessage(
      "Status must be LEAD, ACTIVE, or INACTIVE"
    ),

  body("followUpDate")
    .optional({ values: "falsy" })
    .isISO8601()
    .withMessage("Follow-up date must be a valid date"),

  body("notes")
    .optional({ values: "falsy" })
    .trim()
];