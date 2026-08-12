import pool from "../config/database";

export async function getDashboardData() {
  const [customerRows] = await pool.execute(
    `SELECT COUNT(*) AS total_customers
     FROM customers`
  );

  const [productRows] = await pool.execute(
    `SELECT COUNT(*) AS total_products,
            COALESCE(SUM(current_stock), 0) AS total_stock
     FROM products`
  );

  const [lowStockRows] = await pool.execute(
    `SELECT COUNT(*) AS low_stock_products
     FROM products
     WHERE current_stock <= minimum_stock_alert_quantity`
  );

  const [challanRows] = await pool.execute(
    `SELECT
       COUNT(*) AS total_challans,
       COALESCE(SUM(CASE WHEN status = 'CONFIRMED' THEN 1 ELSE 0 END), 0)
         AS confirmed_challans
     FROM challans`
  );

  const [salesRows] = await pool.execute(
    `SELECT COALESCE(SUM(ci.subtotal), 0) AS total_sales
     FROM challan_items ci
     INNER JOIN challans c
       ON c.id = ci.challan_id
     WHERE c.status = 'CONFIRMED'`
  );

  const [paymentRows] = await pool.execute(
    `SELECT COALESCE(SUM(amount), 0) AS total_payments
     FROM payments
     WHERE payment_status = 'COMPLETED'`
  );

  const [stockMovementRows] = await pool.execute(
    `SELECT
       COALESCE(SUM(CASE WHEN movement_type = 'IN'
                         THEN quantity_changed ELSE 0 END), 0)
         AS total_stock_in,
       COALESCE(SUM(CASE WHEN movement_type = 'OUT'
                         THEN quantity_changed ELSE 0 END), 0)
         AS total_stock_out
     FROM stock_movements`
  );

  const customerData = (customerRows as any[])[0];
  const productData = (productRows as any[])[0];
  const lowStockData = (lowStockRows as any[])[0];
  const challanData = (challanRows as any[])[0];
  const salesData = (salesRows as any[])[0];
  const paymentData = (paymentRows as any[])[0];
  const stockMovementData = (stockMovementRows as any[])[0];

  const totalSales = Number(salesData.total_sales);
  const totalPayments = Number(paymentData.total_payments);

  return {
    totalCustomers: Number(customerData.total_customers),
    totalProducts: Number(productData.total_products),
    totalStock: Number(productData.total_stock),
    lowStockProducts: Number(lowStockData.low_stock_products),

    totalChallans: Number(challanData.total_challans),
    confirmedChallans: Number(challanData.confirmed_challans),

    totalSales,
    totalPayments,
    outstandingAmount: totalSales - totalPayments,

    totalStockIn: Number(stockMovementData.total_stock_in),
    totalStockOut: Number(stockMovementData.total_stock_out)
  };
}