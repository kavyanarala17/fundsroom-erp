import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
  id: number;
  product_name: string;
  sku: string;
  category: string;
  unit_price: number;
  current_stock: number;
  minimum_stock_alert_quantity: number;
  location_warehouse: string | null;
  created_at: string;
}

interface InventorySummary {
  totalCurrentStock: number;
  totalWarehouses: number;
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<InventorySummary>({
    totalCurrentStock: 0,
    totalWarehouses: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchInventory() {
    try {
      setLoading(true);
      setError("");

      const [lowStockResponse, summaryResponse] =
        await Promise.all([
          api.get("/inventory/low-stock"),
          api.get("/inventory/summary")
        ]);

      console.log(
        "Low stock response:",
        lowStockResponse.data
      );

      console.log(
        "Inventory summary:",
        summaryResponse.data
      );

      setProducts(
        lowStockResponse.data.data || []
      );

      setSummary(
        summaryResponse.data.data || {
          totalCurrentStock: 0,
          totalWarehouses: 0
        }
      );
    } catch (error: any) {
      console.error(
        "Failed to fetch inventory",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to fetch inventory"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div style={{ padding: "30px" }}>

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
            Inventory
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "6px"
            }}
          >
            Monitor products that require stock attention
          </p>
        </div>

        <button
          onClick={fetchInventory}
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
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "20px"
          }}
        >
          {error}
        </div>
      )}

      {/* SUMMARY */}

      {!loading && !error && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "18px",
            marginBottom: "25px"
          }}
        >
          {/* LOW STOCK */}

          <div style={summaryCardStyle}>
            <span style={summaryIconStyle}>
              ⚠️
            </span>

            <div>
              <p style={summaryLabelStyle}>
                Low Stock Products
              </p>

              <h2 style={{ margin: 0 }}>
                {products.length}
              </h2>
            </div>
          </div>

          {/* TOTAL CURRENT STOCK */}

          <div style={summaryCardStyle}>
            <span style={summaryIconStyle}>
              📦
            </span>

            <div>
              <p style={summaryLabelStyle}>
                Total Current Stock
              </p>

              <h2 style={{ margin: 0 }}>
                {summary.totalCurrentStock}
              </h2>
            </div>
          </div>

          {/* WAREHOUSES */}

          <div style={summaryCardStyle}>
            <span style={summaryIconStyle}>
              🏭
            </span>

            <div>
              <p style={summaryLabelStyle}>
                Warehouses
              </p>

              <h2 style={{ margin: 0 }}>
                {summary.totalWarehouses}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}

      {loading ? (
        <p>Loading inventory...</p>
      ) : products.length === 0 ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "45px",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "40px" }}>
            ✅
          </div>

          <h3>
            No Low Stock Products
          </h3>

          <p style={{ color: "#6b7280" }}>
            All products are currently above their
            minimum stock alert level.
          </p>
        </div>
      ) : (
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
              Low Stock Alert
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#6b7280",
                fontSize: "13px"
              }}
            >
              Products where current stock is at or
              below the minimum alert quantity.
            </p>
          </div>

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
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>
                  Current Stock
                </th>
                <th style={thStyle}>
                  Minimum Alert
                </th>
                <th style={thStyle}>Warehouse</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>

                  <td style={tdStyle}>
                    {product.id}
                  </td>

                  <td style={tdStyle}>
                    <strong>
                      {product.product_name}
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    {product.sku}
                  </td>

                  <td style={tdStyle}>
                    {product.category}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: 700
                      }}
                    >
                      {product.current_stock}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    {
                      product.minimum_stock_alert_quantity
                    }
                  </td>

                  <td style={tdStyle}>
                    {
                      product.location_warehouse ||
                      "-"
                    }
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const summaryCardStyle: React.CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "20px",
  display: "flex",
  alignItems: "center",
  gap: "15px"
};

const summaryIconStyle: React.CSSProperties = {
  width: "45px",
  height: "45px",
  borderRadius: "10px",
  background: "#fef3c7",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px"
};

const summaryLabelStyle: React.CSSProperties = {
  margin: "0 0 5px",
  color: "#6b7280",
  fontSize: "12px"
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