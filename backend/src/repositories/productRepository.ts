import pool from "../config/database";

export async function createProduct(product: {
  productName: string;
  sku: string;
  category: string;
  unitPrice: number;
  currentStock?: number;
  minimumStockAlertQuantity?: number;
  locationWarehouse?: string;
}) {
  const [result] = await pool.execute(
    `INSERT INTO products
    (
      product_name,
      sku,
      category,
      unit_price,
      current_stock,
      minimum_stock_alert_quantity,
      location_warehouse
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      product.productName,
      product.sku,
      product.category,
      product.unitPrice,
      product.currentStock ?? 0,
      product.minimumStockAlertQuantity ?? 0,
      product.locationWarehouse ?? null
    ]
  );

  return result;
}

export async function getAllProducts() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM products
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getProductById(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM products
     WHERE id = ?`,
    [id]
  );

  return rows;
}

export async function updateProduct(
  id: number,
  product: {
    productName?: string;
    sku?: string;
    category?: string;
    unitPrice?: number;
    currentStock?: number;
    minimumStockAlertQuantity?: number;
    locationWarehouse?: string;
  }
) {
  const [result] = await pool.execute(
    `UPDATE products
     SET
       product_name = COALESCE(?, product_name),
       sku = COALESCE(?, sku),
       category = COALESCE(?, category),
       unit_price = COALESCE(?, unit_price),
       current_stock = COALESCE(?, current_stock),
       minimum_stock_alert_quantity = COALESCE(?, minimum_stock_alert_quantity),
       location_warehouse = COALESCE(?, location_warehouse)
     WHERE id = ?`,
    [
      product.productName ?? null,
      product.sku ?? null,
      product.category ?? null,
      product.unitPrice ?? null,
      product.currentStock ?? null,
      product.minimumStockAlertQuantity ?? null,
      product.locationWarehouse ?? null,
      id
    ]
  );

  return result;
}

export async function deleteProduct(id: number) {
  const [result] = await pool.execute(
    `DELETE FROM products
     WHERE id = ?`,
    [id]
  );

  return result;
}