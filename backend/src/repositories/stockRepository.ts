import pool from "../config/database";

export async function createStockMovement(movement: {
  productId: number;
  quantityChanged: number;
  movementType: "IN" | "OUT";
  reason: string;
  createdBy: number;
}) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Check whether product exists
    const [products]: any = await connection.execute(
      `SELECT current_stock
       FROM products
       WHERE id = ?
       FOR UPDATE`,
      [movement.productId]
    );

    if (products.length === 0) {
      throw new Error("Product not found");
    }

    const currentStock = products[0].current_stock;

    // 2. Calculate new stock
    let newStock: number;

    if (movement.movementType === "IN") {
      newStock = currentStock + movement.quantityChanged;
    } else {
      newStock = currentStock - movement.quantityChanged;

      // Don't allow stock to become negative
      if (newStock < 0) {
        throw new Error("Insufficient stock");
      }
    }

    // 3. Insert stock movement
    const [result] = await connection.execute(
      `INSERT INTO stock_movements
      (
        product_id,
        quantity_changed,
        movement_type,
        reason,
        created_by
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        movement.productId,
        movement.quantityChanged,
        movement.movementType,
        movement.reason,
        movement.createdBy
      ]
    );

    // 4. Update product stock
    await connection.execute(
      `UPDATE products
       SET current_stock = ?
       WHERE id = ?`,
      [newStock, movement.productId]
    );

    // 5. Commit both operations
    await connection.commit();

    return result;
  } catch (error) {
    // If anything fails, undo the database changes
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getAllStockMovements() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM stock_movements
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getStockMovementById(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM stock_movements
     WHERE id = ?`,
    [id]
  );

  return rows;
}