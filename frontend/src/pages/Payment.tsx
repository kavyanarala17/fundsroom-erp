import { useEffect, useState } from "react";
import api from "../services/api";

interface Payment {
  id: number;
  challan_id: number;
  amount: number;
  payment_method: "CASH" | "UPI" | "CARD" | "BANK_TRANSFER";
  payment_status: "PENDING" | "COMPLETED" | "FAILED";
  created_by: number;
  created_at: string;
}

export default function Payment() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const [challanId, setChallanId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<Payment["payment_method"]>("CASH");
  const [paymentStatus, setPaymentStatus] =
    useState<Payment["payment_status"]>("COMPLETED");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  async function fetchPayments() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/payments");

      console.log("Payments response:", response.data);

      setPayments(response.data.data || []);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch payments"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

  // ==========================================
  // CREATE PAYMENT
  // ==========================================

  async function handleCreatePayment(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const challanNumber = Number(challanId);
    const paymentAmount = Number(amount);

    if (!challanId || isNaN(challanNumber)) {
      setError("Please enter a valid challan ID");
      return;
    }

    if (!amount || isNaN(paymentAmount) || paymentAmount <= 0) {
      setError("Payment amount must be greater than zero");
      return;
    }

    const storedUser = localStorage.getItem("user");

    let createdBy = 0;

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        createdBy = Number(user.userId || user.id);
      } catch {
        createdBy = 0;
      }
    }

    if (!createdBy) {
      setError("User information not found. Please login again.");
      return;
    }

    try {
      setCreating(true);

      const response = await api.post("/payments", {
        challanId: challanNumber,
        amount: paymentAmount,
        paymentMethod,
        paymentStatus,
        createdBy
      });

      console.log("Payment created:", response.data);

      setSuccess("Payment created successfully");

      setChallanId("");
      setAmount("");
      setPaymentMethod("CASH");
      setPaymentStatus("COMPLETED");

      await fetchPayments();
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create payment"
      );
    } finally {
      setCreating(false);
    }
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px"
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Payments
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "6px"
            }}
          >
            Manage customer payments and payment records
          </p>
        </div>

        <button
          onClick={fetchPayments}
          style={{
            padding: "10px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 15px",
            borderRadius: "7px",
            marginBottom: "20px"
          }}
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px 15px",
            borderRadius: "7px",
            marginBottom: "20px"
          }}
        >
          {success}
        </div>
      )}

      {/* CREATE PAYMENT */}

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "25px",
          marginBottom: "25px"
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Record Payment
        </h2>

        <p
          style={{
            color: "#6b7280",
            fontSize: "13px",
            marginBottom: "20px"
          }}
        >
          Payments can only be recorded for confirmed challans.
        </p>

        <form onSubmit={handleCreatePayment}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(4, 1fr)",
              gap: "15px"
            }}
          >
            {/* CHALLAN ID */}

            <div>
              <label style={labelStyle}>
                Challan ID
              </label>

              <input
                type="number"
                placeholder="Enter challan ID"
                value={challanId}
                onChange={(e) =>
                  setChallanId(e.target.value)
                }
                required
                style={inputStyle}
              />
            </div>

            {/* AMOUNT */}

            <div>
              <label style={labelStyle}>
                Amount
              </label>

              <input
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
                required
                style={inputStyle}
              />
            </div>

            {/* PAYMENT METHOD */}

            <div>
              <label style={labelStyle}>
                Payment Method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target
                      .value as Payment["payment_method"]
                  )
                }
                style={inputStyle}
              >
                <option value="CASH">
                  Cash
                </option>

                <option value="UPI">
                  UPI
                </option>

                <option value="CARD">
                  Card
                </option>

                <option value="BANK_TRANSFER">
                  Bank Transfer
                </option>
              </select>
            </div>

            {/* PAYMENT STATUS */}

            <div>
              <label style={labelStyle}>
                Payment Status
              </label>

              <select
                value={paymentStatus}
                onChange={(e) =>
                  setPaymentStatus(
                    e.target
                      .value as Payment["payment_status"]
                  )
                }
                style={inputStyle}
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="FAILED">
                  Failed
                </option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            style={{
              marginTop: "20px",
              padding: "11px 20px",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: creating
                ? "not-allowed"
                : "pointer",
              fontWeight: 600,
              opacity: creating ? 0.7 : 1
            }}
          >
            {creating
              ? "Creating..."
              : "+ Record Payment"}
          </button>
        </form>
      </div>

      {/* PAYMENT TABLE */}

      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          overflowX: "auto"
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e7eb"
          }}
        >
          <h2 style={{ margin: 0 }}>
            Payment History
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
              fontSize: "13px"
            }}
          >
            All recorded customer payments
          </p>
        </div>

        {loading ? (
          <div style={{ padding: "30px" }}>
            Loading payments...
          </div>
        ) : payments.length === 0 ? (
          <div
            style={{
              padding: "45px",
              textAlign: "center"
            }}
          >
            <div style={{ fontSize: "40px" }}>
              💳
            </div>

            <h3>
              No Payments Found
            </h3>

            <p
              style={{
                color: "#6b7280"
              }}
            >
              No payment records have been created yet.
            </p>
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse"
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f8fafc"
                }}
              >
                <th style={thStyle}>
                  ID
                </th>

                <th style={thStyle}>
                  Challan ID
                </th>

                <th style={thStyle}>
                  Amount
                </th>

                <th style={thStyle}>
                  Payment Method
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Created By
                </th>

                <th style={thStyle}>
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td style={tdStyle}>
                    {payment.id}
                  </td>

                  <td style={tdStyle}>
                    {payment.challan_id}
                  </td>

                  <td style={tdStyle}>
                    <strong>
                      ₹
                      {Number(
                        payment.amount
                      ).toFixed(2)}
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    {payment.payment_method.replace(
                      "_",
                      " "
                    )}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 9px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        background:
                          payment.payment_status ===
                          "COMPLETED"
                            ? "#dcfce7"
                            : payment.payment_status ===
                              "FAILED"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          payment.payment_status ===
                          "COMPLETED"
                            ? "#166534"
                            : payment.payment_status ===
                              "FAILED"
                            ? "#b91c1c"
                            : "#92400e"
                      }}
                    >
                      {payment.payment_status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {payment.created_by}
                  </td>

                  <td style={tdStyle}>
                    {new Date(
                      payment.created_at
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "6px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#374151"
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  fontSize: "13px",
  boxSizing: "border-box"
};

const thStyle: React.CSSProperties = {
  padding: "13px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "13px"
};

const tdStyle: React.CSSProperties = {
  padding: "13px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "13px"
};