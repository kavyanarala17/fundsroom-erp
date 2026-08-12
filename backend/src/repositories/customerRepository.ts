import pool from "../config/database";

export async function createCustomer(customer: {
  customerName: string;
  mobileNumber: string;
  email?: string;
  businessName: string;
  gstNumber?: string;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address?: string;
  status?: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string;
  notes?: string;
}) {
  const [result] = await pool.execute(
    `INSERT INTO customers
      (
        customer_name,
        mobile_number,
        email,
        business_name,
        gst_number,
        customer_type,
        address,
        status,
        follow_up_date,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customer.customerName,
      customer.mobileNumber,
      customer.email || null,
      customer.businessName,
      customer.gstNumber || null,
      customer.customerType,
      customer.address || null,
      customer.status || "LEAD",
      customer.followUpDate || null,
      customer.notes || null
    ]
  );

  return result;
}

export async function getAllCustomers() {
  const [rows] = await pool.execute(
    `SELECT *
     FROM customers
     ORDER BY created_at DESC`
  );

  return rows;
}

export async function getCustomerById(id: number) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM customers
     WHERE id = ?`,
    [id]
  );

  return rows;
}

export async function updateCustomer(
  id: number,
  customer: {
    customerName?: string;
    mobileNumber?: string;
    email?: string;
    businessName?: string;
    gstNumber?: string;
    customerType?: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
    address?: string;
    status?: "LEAD" | "ACTIVE" | "INACTIVE";
    followUpDate?: string;
    notes?: string;
  }
) {
  const followUpDate = customer.followUpDate
    ? new Date(customer.followUpDate).toISOString().slice(0, 10)
    : null;

  const [result] = await pool.execute(
    `UPDATE customers
     SET
       customer_name = COALESCE(?, customer_name),
       mobile_number = COALESCE(?, mobile_number),
       email = COALESCE(?, email),
       business_name = COALESCE(?, business_name),
       gst_number = COALESCE(?, gst_number),
       customer_type = COALESCE(?, customer_type),
       address = COALESCE(?, address),
       status = COALESCE(?, status),
       follow_up_date = COALESCE(?, follow_up_date),
       notes = COALESCE(?, notes)
     WHERE id = ?`,
    [
      customer.customerName ?? null,
      customer.mobileNumber ?? null,
      customer.email ?? null,
      customer.businessName ?? null,
      customer.gstNumber ?? null,
      customer.customerType ?? null,
      customer.address ?? null,
      customer.status ?? null,
      followUpDate,
      customer.notes ?? null,
      id
    ]
  );

  return result;
}

export async function deleteCustomer(id: number) {
  const [result] = await pool.execute(
    `DELETE FROM customers
     WHERE id = ?`,
    [id]
  );

  return result;
}

export async function getCustomerSummary(id: number) {
  const [customerRows] = await pool.execute(
    `SELECT *
     FROM customers
     WHERE id = ?`,
    [id]
  );

  const [challanRows] = await pool.execute(
    `SELECT
       COUNT(*) AS total_challans,
       COALESCE(
         SUM(
           CASE
             WHEN status = 'CONFIRMED' THEN 1
             ELSE 0
           END
         ),
         0
       ) AS confirmed_challans
     FROM challans
     WHERE customer_id = ?`,
    [id]
  );

  const [salesRows] = await pool.execute(
    `SELECT COALESCE(SUM(ci.subtotal), 0) AS total_sales
     FROM challan_items ci
     INNER JOIN challans c
       ON c.id = ci.challan_id
     WHERE c.customer_id = ?
       AND c.status = 'CONFIRMED'`,
    [id]
  );

  const [paymentRows] = await pool.execute(
    `SELECT COALESCE(SUM(p.amount), 0) AS total_payments
     FROM payments p
     INNER JOIN challans c
       ON c.id = p.challan_id
     WHERE c.customer_id = ?
       AND p.payment_status = 'COMPLETED'`,
    [id]
  );

  if ((customerRows as any[]).length === 0) {
    return null;
  }

  const customer = (customerRows as any[])[0];
  const challans = (challanRows as any[])[0];
  const sales = (salesRows as any[])[0];
  const payments = (paymentRows as any[])[0];

  const totalSales = Number(sales.total_sales);
  const totalPayments = Number(payments.total_payments);

  return {
    customer,
    totalChallans: Number(challans.total_challans),
    confirmedChallans: Number(challans.confirmed_challans),
    totalSales,
    totalPayments,
    outstandingAmount: totalSales - totalPayments
  };
}

export async function searchCustomers(search: string) {
  const [rows] = await pool.execute(
    `SELECT *
     FROM customers
     WHERE customer_name LIKE ?
        OR mobile_number LIKE ?
        OR business_name LIKE ?
        OR gst_number LIKE ?
     ORDER BY created_at DESC`,
    [
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`
    ]
  );

  return rows;
}