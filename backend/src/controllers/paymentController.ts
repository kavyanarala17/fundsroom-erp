import { Request, Response } from "express";

import {
  addPayment,
  fetchAllPayments,
  fetchPaymentById
} from "../services/paymentService";

export async function createPayment(
  req: Request,
  res: Response
) {
  try {
    const payment = await addPayment(req.body);

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: payment
    });

  } catch (error: any) {
    console.error(error);

    if (error.message === "Challan not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message ===
        "Payment can only be created for a confirmed challan" ||
      error.message ===
        "Payment amount must be greater than zero"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create payment"
    });
  }
}

export async function getPayments(
  req: Request,
  res: Response
) {
  try {
    const payments = await fetchAllPayments();

    return res.status(200).json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments"
    });
  }
}

export async function getPayment(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment ID"
      });
    }

    const payment = await fetchPaymentById(id);

    return res.status(200).json({
      success: true,
      data: payment
    });

  } catch (error: any) {
    if (error.message === "Payment not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment"
    });
  }
}