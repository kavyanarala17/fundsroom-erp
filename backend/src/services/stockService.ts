import {
  createStockMovement,
  getAllStockMovements,
  getStockMovementById
} from "../repositories/stockRepository";

export async function addStockMovement(movement: {
  productId: number;
  quantityChanged: number;
  movementType: "IN" | "OUT";
  reason: string;
  createdBy: number;
}) {
  return await createStockMovement(movement);
}

export async function fetchAllStockMovements() {
  return await getAllStockMovements();
}

export async function fetchStockMovementById(id: number) {
  const movements = await getStockMovementById(id);

  if ((movements as any[]).length === 0) {
    throw new Error("Stock movement not found");
  }

  return (movements as any[])[0];
}