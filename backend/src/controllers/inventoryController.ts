import { Request, Response } from "express";

import {
  fetchLowStockProducts,
  fetchInventorySummary
} from "../services/inventoryService";

export async function getLowStockProducts(
  req: Request,
  res: Response
) {
  try {
    const products = await fetchLowStockProducts();

    return res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch low stock products"
    });
  }
}

export async function getInventorySummary(
  req: Request,
  res: Response
) {
  try {
    const summary = await fetchInventorySummary();

    return res.status(200).json({
      success: true,
      data: {
        totalCurrentStock: Number(summary.total_current_stock),
        totalWarehouses: Number(summary.total_warehouses)
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory summary"
    });
  }
}