import {
  createPayment,
  getAllPayments,
  getPaymentById
} from "../repositories/paymentRepository";

import { getChallanById } from "../repositories/challanRepository";

export async function addPayment(payment: {
  challanId: number;
  amount: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER";
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED";
  createdBy: number;
}) {
  // 1. Check challan exists
  const challans = await getChallanById(payment.challanId);

  if ((challans as any[]).length === 0) {
    throw new Error("Challan not found");
  }

  const challan = (challans as any[])[0];

  // 2. Payment only for confirmed challans
  if (challan.status !== "CONFIRMED") {
    throw new Error(
      "Payment can only be created for a confirmed challan"
    );
  }

  // 3. Validate amount
  if (payment.amount <= 0) {
    throw new Error("Payment amount must be greater than zero");
  }

  return await createPayment(payment);
}

export async function fetchAllPayments() {
  return await getAllPayments();
}

export async function fetchPaymentById(id: number) {
  const payments = await getPaymentById(id);

  if ((payments as any[]).length === 0) {
    throw new Error("Payment not found");
  }

  return (payments as any[])[0];
}