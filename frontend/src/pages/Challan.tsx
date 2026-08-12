import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Customer {
  id: number;
  customer_name: string;
  business_name: string;
}

interface Product {
  id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  current_stock: number;
}

interface Challan {
  id: number;
  challan_number: string;
  customer_id: number;
  total_quantity: number;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";
  created_by: number;
  created_at: string;
}

interface ChallanItem {
  id: number;
  challan_id: number;
  product_id: number;
  product_name_snapshot: string;
  sku_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  subtotal: number;
}

export default function Challan() {
  const navigate = useNavigate();

  const [challans, setChallans] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedChallan, setSelectedChallan] =
    useState<Challan | null>(null);

  const [items, setItems] = useState<ChallanItem[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showItems, setShowItems] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [challanNumber, setChallanNumber] = useState("");

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [challanResponse, customerResponse, productResponse] =
        await Promise.all([
          api.get("/challans"),
          api.get("/customers"),
          api.get("/products"),
        ]);

      setChallans(challanResponse.data.data || []);
      setCustomers(customerResponse.data.data || []);
      setProducts(productResponse.data.data || []);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load challan data"
      );
    } finally {
      setLoading(false);
    }
  }

  async function createChallan() {
    if (!customerId) {
      setError("Please select a customer");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      await api.post("/challans", {
        challanNumber: challanNumber || undefined,
        customerId: Number(customerId),
        createdBy: user.userId,
      });

      setSuccess("Challan created successfully");

      setCustomerId("");
      setChallanNumber("");
      setShowCreate(false);

      await loadData();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create challan"
      );
    }
  }

  async function viewItems(challan: Challan) {
    try {
      setError("");

      const response = await api.get(
        `/challans/${challan.id}/items`
      );

      setSelectedChallan(challan);
      setItems(response.data.data || []);
      setShowItems(true);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to fetch challan items"
      );
    }
  }

  async function addItem() {
    if (!selectedChallan) return;

    if (selectedChallan.status !== "DRAFT") {
      setError("Items can only be added to a draft challan");
      return;
    }

    if (!productId) {
      setError("Please select a product");
      return;
    }

    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setError("Quantity must be greater than zero");
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.post(
        `/challans/${selectedChallan.id}/items`,
        {
          productId: Number(productId),
          quantity: qty,
        }
      );

      setSuccess("Item added successfully");

      setProductId("");
      setQuantity("");

      await viewItems(selectedChallan);
      await loadData();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to add challan item"
      );
    }
  }

  async function confirmChallan() {
    if (!selectedChallan) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/challans/${selectedChallan.id}/confirm`
      );

      setSuccess("Challan confirmed successfully");

      setShowItems(false);
      setSelectedChallan(null);
      setItems([]);

      await loadData();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to confirm challan"
      );
    }
  }

  async function cancelChallan() {
    if (!selectedChallan) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/challans/${selectedChallan.id}/cancel`
      );

      setSuccess("Challan cancelled successfully");

      setShowItems(false);
      setSelectedChallan(null);
      setItems([]);

      await loadData();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to cancel challan"
      );
    }
  }

  function getCustomerName(customerId: number) {
    const customer = customers.find(
      (c) => c.id === customerId
    );

    if (!customer) {
      return `Customer #${customerId}`;
    }

    return customer.business_name
      ? `${customer.customer_name} - ${customer.business_name}`
      : customer.customer_name;
  }

  function getSelectedProduct() {
    return products.find(
      (product) => product.id === Number(productId)
    );
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>Challans</h1>
        <p>Loading challans...</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {/* HEADER */}

      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0 }}>Challans</h1>

          <p style={subtitleStyle}>
            Create and manage customer delivery challans
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={secondaryButtonStyle}
          >
            ← Dashboard
          </button>

          <button
            onClick={() => {
              setError("");
              setSuccess("");
              setShowCreate(true);
            }}
            style={primaryButtonStyle}
          >
            + Create Challan
          </button>
        </div>
      </div>

      {/* MESSAGES */}

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {success && (
        <div style={successStyle}>
          {success}
        </div>
      )}

      {/* SUMMARY */}

      <div style={summaryGridStyle}>
        <div style={summaryCardStyle}>
          <span style={{ fontSize: "25px" }}>📋</span>

          <div>
            <p style={summaryLabelStyle}>
              Total Challans
            </p>

            <h2 style={{ margin: 0 }}>
              {challans.length}
            </h2>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <span style={{ fontSize: "25px" }}>📝</span>

          <div>
            <p style={summaryLabelStyle}>
              Draft
            </p>

            <h2 style={{ margin: 0 }}>
              {
                challans.filter(
                  (c) => c.status === "DRAFT"
                ).length
              }
            </h2>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <span style={{ fontSize: "25px" }}>✅</span>

          <div>
            <p style={summaryLabelStyle}>
              Confirmed
            </p>

            <h2 style={{ margin: 0 }}>
              {
                challans.filter(
                  (c) => c.status === "CONFIRMED"
                ).length
              }
            </h2>
          </div>
        </div>

        <div style={summaryCardStyle}>
          <span style={{ fontSize: "25px" }}>❌</span>

          <div>
            <p style={summaryLabelStyle}>
              Cancelled
            </p>

            <h2 style={{ margin: 0 }}>
              {
                challans.filter(
                  (c) => c.status === "CANCELLED"
                ).length
              }
            </h2>
          </div>
        </div>
      </div>

      {/* CREATE CHALLAN */}

      {showCreate && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={{ margin: 0 }}>
                  Create Challan
                </h2>

                <p style={subtitleStyle}>
                  Create a draft challan for a customer
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Customer *
              </label>

              <select
                value={customerId}
                onChange={(e) =>
                  setCustomerId(e.target.value)
                }
                style={inputStyle}
              >
                <option value="">
                  Select customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.customer_name}
                    {customer.business_name
                      ? ` - ${customer.business_name}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Challan Number
              </label>

              <input
                value={challanNumber}
                onChange={(e) =>
                  setChallanNumber(e.target.value)
                }
                placeholder="Leave empty for automatic number"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setShowCreate(false)}
                style={secondaryButtonStyle}
              >
                Cancel
              </button>

              <button
                onClick={createChallan}
                style={primaryButtonStyle}
              >
                Create Challan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHALLAN LIST */}

      <div style={tableCardStyle}>
        <div style={tableHeaderStyle}>
          <div>
            <h2 style={{ margin: 0 }}>
              Challan Records
            </h2>

            <p style={subtitleStyle}>
              Manage draft, confirmed and cancelled challans
            </p>
          </div>

          <button
            onClick={loadData}
            style={secondaryButtonStyle}
          >
            ↻ Refresh
          </button>
        </div>

        {challans.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: "45px" }}>
              📋
            </div>

            <h3>No Challans Found</h3>

            <p style={subtitleStyle}>
              Create your first challan to get started.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Challan Number</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Quantity</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {challans.map((challan) => (
                  <tr key={challan.id}>
                    <td style={tdStyle}>
                      {challan.id}
                    </td>

                    <td style={tdStyle}>
                      <strong>
                        {challan.challan_number}
                      </strong>
                    </td>

                    <td style={tdStyle}>
                      {getCustomerName(
                        challan.customer_id
                      )}
                    </td>

                    <td style={tdStyle}>
                      {challan.total_quantity}
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={statusStyle(
                          challan.status
                        )}
                      >
                        {challan.status}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {new Date(
                        challan.created_at
                      ).toLocaleDateString()}
                    </td>

                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          viewItems(challan)
                        }
                        style={smallButtonStyle}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CHALLAN DETAILS */}

      {showItems && selectedChallan && (
        <div style={modalOverlayStyle}>
          <div
            style={{
              ...modalStyle,
              width: "850px",
              maxWidth: "95%",
            }}
          >
            <div style={modalHeaderStyle}>
              <div>
                <h2 style={{ margin: 0 }}>
                  {selectedChallan.challan_number}
                </h2>

                <p style={subtitleStyle}>
                  Customer:{" "}
                  {getCustomerName(
                    selectedChallan.customer_id
                  )}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowItems(false);
                  setSelectedChallan(null);
                }}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            {/* STATUS */}

            <div style={{ marginBottom: "20px" }}>
              <span
                style={statusStyle(
                  selectedChallan.status
                )}
              >
                {selectedChallan.status}
              </span>
            </div>

            {/* ADD ITEM */}

            {selectedChallan.status === "DRAFT" && (
              <div
                style={{
                  background: "#f8fafc",
                  padding: "18px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                }}
              >
                <h3 style={{ marginTop: 0 }}>
                  Add Product
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 150px auto",
                    gap: "10px",
                    alignItems: "end",
                  }}
                >
                  <div>
                    <label style={labelStyle}>
                      Product
                    </label>

                    <select
                      value={productId}
                      onChange={(e) =>
                        setProductId(e.target.value)
                      }
                      style={inputStyle}
                    >
                      <option value="">
                        Select product
                      </option>

                      {products.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                        >
                          {product.product_name} (
                          {product.sku}) — Stock:{" "}
                          {product.current_stock}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(e.target.value)
                      }
                      style={inputStyle}
                    />
                  </div>

                  <button
                    onClick={addItem}
                    style={primaryButtonStyle}
                  >
                    + Add
                  </button>
                </div>

                {getSelectedProduct() && (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "12px",
                      marginBottom: 0,
                    }}
                  >
                    Unit Price: ₹
                    {Number(
                      getSelectedProduct()!.unit_price
                    ).toFixed(2)}
                    {" | "}
                    Available Stock:{" "}
                    {getSelectedProduct()!.current_stock}
                  </p>
                )}
              </div>
            )}

            {/* ITEMS */}

            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {items.length === 0 ? (
                <div style={emptyStyle}>
                  <p>
                    No items added to this challan.
                  </p>
                </div>
              ) : (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8fafc",
                      }}
                    >
                      <th style={thStyle}>
                        Product
                      </th>

                      <th style={thStyle}>
                        SKU
                      </th>

                      <th style={thStyle}>
                        Unit Price
                      </th>

                      <th style={thStyle}>
                        Quantity
                      </th>

                      <th style={thStyle}>
                        Subtotal
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>
                          <strong>
                            {
                              item.product_name_snapshot
                            }
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {item.sku_snapshot}
                        </td>

                        <td style={tdStyle}>
                          ₹
                          {Number(
                            item.unit_price_snapshot
                          ).toFixed(2)}
                        </td>

                        <td style={tdStyle}>
                          {item.quantity}
                        </td>

                        <td style={tdStyle}>
                          ₹
                          {Number(
                            item.subtotal
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* TOTAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "18px",
                fontSize: "16px",
              }}
            >
              <strong>
                Total Quantity:{" "}
                {items.reduce(
                  (total, item) =>
                    total + Number(item.quantity),
                  0
                )}
              </strong>
            </div>

            {/* ACTIONS */}

            {selectedChallan.status === "DRAFT" &&
              items.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >
                  <button
                    onClick={cancelChallan}
                    style={dangerButtonStyle}
                  >
                    Cancel Challan
                  </button>

                  <button
                    onClick={confirmChallan}
                    style={primaryButtonStyle}
                  >
                    ✓ Confirm Challan
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
   STYLES
========================= */

const pageStyle: React.CSSProperties = {
  padding: "30px 35px",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "25px",
};

const subtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  marginTop: "6px",
  fontSize: "13px",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "white",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: 600,
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "10px 18px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: 600,
};

const smallButtonStyle: React.CSSProperties = {
  padding: "7px 12px",
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 600,
};

const summaryGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "18px",
  marginBottom: "25px",
};

const summaryCardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const summaryLabelStyle: React.CSSProperties = {
  margin: "0 0 5px",
  color: "#6b7280",
  fontSize: "12px",
};

const tableCardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  overflow: "hidden",
};

const tableHeaderStyle: React.CSSProperties = {
  padding: "20px",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const thStyle: React.CSSProperties = {
  padding: "13px",
  textAlign: "left",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "13px",
};

const tdStyle: React.CSSProperties = {
  padding: "13px",
  borderBottom: "1px solid #e5e7eb",
  fontSize: "13px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  outline: "none",
  background: "white",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  marginBottom: "6px",
};

const formGroupStyle: React.CSSProperties = {
  marginTop: "18px",
};

const errorStyle: React.CSSProperties = {
  background: "#fee2e2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "7px",
  marginBottom: "20px",
};

const successStyle: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "7px",
  marginBottom: "20px",
};

const emptyStyle: React.CSSProperties = {
  padding: "45px",
  textAlign: "center",
  color: "#6b7280",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  width: "550px",
  maxWidth: "95%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "white",
  borderRadius: "12px",
  padding: "25px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "20px",
};

const closeButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#f3f4f6",
  width: "34px",
  height: "34px",
  borderRadius: "7px",
  cursor: "pointer",
};

function statusStyle(
  status: "DRAFT" | "CONFIRMED" | "CANCELLED"
): React.CSSProperties {
  const styles = {
    DRAFT: {
      background: "#fef3c7",
      color: "#92400e",
    },
    CONFIRMED: {
      background: "#dcfce7",
      color: "#166534",
    },
    CANCELLED: {
      background: "#fee2e2",
      color: "#991b1b",
    },
  };

  return {
    ...styles[status],
    padding: "5px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
  };
}