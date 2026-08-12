import { Router } from "express";

import {
  createChallan,
  getChallans,
  getChallan,
  confirmChallan,
  cancelChallan
} from "../controllers/challanController";

import {
  createChallanItem,
  getChallanItems
} from "../controllers/challanItemController";

import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authenticateToken,
  createChallan
);

router.get(
  "/",
  authenticateToken,
  getChallans
);

router.get(
  "/:id",
  authenticateToken,
  getChallan
);

router.post(
  "/:challanId/items",
  authenticateToken,
  createChallanItem
);

router.get(
  "/:challanId/items",
  authenticateToken,
  getChallanItems
);

router.patch(
  "/:id/confirm",
  authenticateToken,
  confirmChallan
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  cancelChallan
);

export default router;