import pool from "../config/database";

export async function getLowStockProducts() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM products
     WHERE current_stock <= minimum_stock_alert_quantity
     ORDER BY current_stock ASC`
  );

  return rows;
}

export async function getInventorySummary() {
  const [rows] = await pool.execute(
    `SELECT
       COALESCE(SUM(current_stock), 0) AS total_current_stock,
       COUNT(DISTINCT location_warehouse) AS total_warehouses
     FROM products
     WHERE location_warehouse IS NOT NULL
       AND location_warehouse != ''`
  );

  return (rows as any[])[0];
}