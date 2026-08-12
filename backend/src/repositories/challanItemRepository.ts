import pool from "../config/database";

export async function createChallanItem(item: {
  challanId: number;
  productId: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  subtotal: number;
}) {
  const [result] = await pool.execute(
    `INSERT INTO challan_items
      (
        challan_id,
        product_id,
        product_name_snapshot,
        sku_snapshot,
        unit_price_snapshot,
        quantity,
        subtotal
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      item.challanId,
      item.productId,
      item.productNameSnapshot,
      item.skuSnapshot,
      item.unitPriceSnapshot,
      item.quantity,
      item.subtotal
    ]
  );

  return result;
}

export async function getChallanItems(challanId: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM challan_items
     WHERE challan_id = ?
     ORDER BY id ASC`,
    [challanId]
  );

  return rows;
}