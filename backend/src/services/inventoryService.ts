import {
  getLowStockProducts,
  getInventorySummary
} from "../repositories/inventoryRepository";

export async function fetchLowStockProducts() {
  return await getLowStockProducts();
}

export async function fetchInventorySummary() {
  return await getInventorySummary();
}