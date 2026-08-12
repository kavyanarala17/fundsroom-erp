import pool from "../config/database";

export async function createPayment(payment: {
  challanId: number;
  amount: number;
  paymentMethod: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER";
  paymentStatus?: "PENDING" | "COMPLETED" | "FAILED";
  createdBy: number;
}) {
  const [result] = await pool.execute(
    `INSERT INTO payments
      (
        challan_id,
        amount,
        payment_method,
        payment_status,
        created_by
      )
      VALUES (?, ?, ?, ?, ?)`,
    [
      payment.challanId,
      payment.amount,
      payment.paymentMethod,
      payment.paymentStatus ?? "COMPLETED",
      payment.createdBy
    ]
  );

  return result;
}

export async function getAllPayments() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM payments
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getPaymentById(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM payments
     WHERE id = ?`,
    [id]
  );

  return rows;
}