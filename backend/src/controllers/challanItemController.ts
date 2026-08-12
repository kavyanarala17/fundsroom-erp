import { Request, Response } from "express";

import {
  addChallanItem,
  fetchChallanItems
} from "../services/challanItemService";

export async function createChallanItem(
  req: Request,
  res: Response
) {
  try {
    const challanId = Number(req.params.challanId);
    const { productId, quantity } = req.body;

    if (isNaN(challanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID"
      });
    }

    const item = await addChallanItem({
      challanId,
      productId: Number(productId),
      quantity: Number(quantity)
    });

    return res.status(201).json({
      success: true,
      message: "Challan item added successfully",
      data: item
    });
  } catch (error: any) {
    console.error(error);

    if (
      error.message === "Challan not found" ||
      error.message === "Product not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (
      error.message === "Insufficient stock" ||
      error.message === "Quantity must be greater than zero" ||
      error.message === "Cannot add items to confirmed or cancelled challan"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add challan item"
    });
  }
}

export async function getChallanItems(
  req: Request,
  res: Response
) {
  try {
    const challanId = Number(req.params.challanId);

    if (isNaN(challanId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid challan ID"
      });
    }

    const items = await fetchChallanItems(challanId);

    return res.status(200).json({
      success: true,
      data: items
    });
  } catch (error: any) {
    if (error.message === "Challan not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch challan items"
    });
  }
}