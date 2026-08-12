import { Request, Response } from "express";

import {
  addStockMovement,
  fetchAllStockMovements,
  fetchStockMovementById
} from "../services/stockService";

export async function createStockMovement(
  req: Request,
  res: Response
) {
  try {
    const movement = await addStockMovement(req.body);

    return res.status(201).json({
      success: true,
      message: "Stock movement created successfully",
      data: movement
    });
  } catch (error: any) {
    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Insufficient stock") {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create stock movement"
    });
  }
}

export async function getStockMovements(
  req: Request,
  res: Response
) {
  try {
    const movements = await fetchAllStockMovements();

    return res.status(200).json({
      success: true,
      data: movements
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stock movements"
    });
  }
}

export async function getStockMovement(
  req: Request,
  res: Response
) {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid stock movement ID"
      });
    }

    const movement = await fetchStockMovementById(id);

    return res.status(200).json({
      success: true,
      data: movement
    });
  } catch (error: any) {
    if (error.message === "Stock movement not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stock movement"
    });
  }
}