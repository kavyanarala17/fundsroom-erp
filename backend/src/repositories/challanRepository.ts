import pool from "../config/database";

export async function createChallan(challan: {
  challanNumber: string;
  customerId: number;
  createdBy: number;
}) {
  const [result] = await pool.execute(
    `INSERT INTO challans
      (
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by
      )
      VALUES (?, ?, ?, ?, ?)`,
    [
      challan.challanNumber,
      challan.customerId,
      0,
      "DRAFT",
      challan.createdBy
    ]
  );

  return result;
}

export async function getAllChallans() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM challans
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getChallanById(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM challans
     WHERE id = ?`,
    [id]
  );

  return rows;
}

export async function updateChallanTotalQuantity(
  challanId: number
) {
  const [result] = await pool.execute(
    `UPDATE challans
     SET total_quantity = (
       SELECT COALESCE(SUM(quantity), 0)
       FROM challan_items
       WHERE challan_id = ?
     )
     WHERE id = ?`,
    [challanId, challanId]
  );

  return result;
}

// ==========================================
// CONFIRM CHALLAN
// ==========================================

export async function confirmChallan(
  challanId: number
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Get challan
    const [challanRows]: any = await connection.execute(
      `SELECT *
       FROM challans
       WHERE id = ?
       FOR UPDATE`,
      [challanId]
    );

    if (challanRows.length === 0) {
      throw new Error("Challan not found");
    }

    const challan = challanRows[0];

    // 2. Check status
    if (challan.status !== "DRAFT") {
      throw new Error(
        "Only DRAFT challans can be confirmed"
      );
    }

    // 3. Get all items and combine quantity by product
    const [items]: any = await connection.execute(
      `SELECT
         product_id,
         SUM(quantity) AS total_quantity
       FROM challan_items
       WHERE challan_id = ?
       GROUP BY product_id`,
      [challanId]
    );

    if (items.length === 0) {
      throw new Error(
        "Cannot confirm challan without items"
      );
    }

    // 4. Check stock and deduct it
    for (const item of items) {
      const [productRows]: any = await connection.execute(
        `SELECT *
         FROM products
         WHERE id = ?
         FOR UPDATE`,
        [item.product_id]
      );

      if (productRows.length === 0) {
        throw new Error(
          `Product ${item.product_id} not found`
        );
      }

      const product = productRows[0];
      const quantity = Number(item.total_quantity);
      const currentStock = Number(product.current_stock);

      // 5. Check sufficient stock
      if (currentStock < quantity) {
        throw new Error(
          `Insufficient stock for product ${product.product_name}`
        );
      }

      // 6. Deduct stock
      await connection.execute(
        `UPDATE products
         SET current_stock = current_stock - ?
         WHERE id = ?`,
        [quantity, item.product_id]
      );

      // 7. Create stock OUT movement
      await connection.execute(
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
          item.product_id,
          quantity,
          "OUT",
          `Challan ${challan.challan_number} confirmed`,
          challan.created_by
        ]
      );
    }

    // 8. Update challan status
    await connection.execute(
      `UPDATE challans
       SET status = 'CONFIRMED'
       WHERE id = ?`,
      [challanId]
    );

    await connection.commit();

    return {
      id: challanId,
      status: "CONFIRMED"
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// ==========================================
// CANCEL CHALLAN
// ==========================================

export async function cancelChallan(
  challanId: number
) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [challanRows]: any = await connection.execute(
      `SELECT *
       FROM challans
       WHERE id = ?
       FOR UPDATE`,
      [challanId]
    );

    if (challanRows.length === 0) {
      throw new Error("Challan not found");
    }

    const challan = challanRows[0];

    if (challan.status !== "DRAFT") {
      throw new Error(
        "Only DRAFT challans can be cancelled"
      );
    }

    await connection.execute(
      `UPDATE challans
       SET status = 'CANCELLED'
       WHERE id = ?`,
      [challanId]
    );

    await connection.commit();

    return {
      id: challanId,
      status: "CANCELLED"
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}