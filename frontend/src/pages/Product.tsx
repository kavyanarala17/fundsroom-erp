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

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [productName, setProductName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [minimumStock, setMinimumStock] = useState("");
  const [warehouse, setWarehouse] = useState("");

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await api.get("/products");

      console.log("Products response:", response.data);

      setProducts(response.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch products", error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleCreateProduct(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.post("/products", {
        productName,
        sku,
        category,
        unitPrice: Number(unitPrice),
        currentStock: Number(currentStock || 0),
        minimumStockAlertQuantity: Number(
          minimumStock || 0
        ),
        locationWarehouse: warehouse || undefined
      });

      setProductName("");
      setSku("");
      setCategory("");
      setUnitPrice("");
      setCurrentStock("");
      setMinimumStock("");
      setWarehouse("");

      setShowForm(false);

      await fetchProducts();
    } catch (error: any) {
      console.error("Failed to create product", error);

      setError(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setSaving(false);
    }
  }

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
          <h1 style={{ margin: 0 }}>Products</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "6px"
            }}
          >
            Manage products and inventory information
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setError("");
          }}
          style={{
            padding: "11px 18px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          {showForm ? "✕ Close" : "+ Add Product"}
        </button>
      </div>

      {/* FORM */}

      {showForm && (
        <form
          onSubmit={handleCreateProduct}
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            maxWidth: "700px"
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Add Product
          </h2>

          {error && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px"
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px"
            }}
          >
            <div>
              <label>Product Name</label>

              <input
                type="text"
                value={productName}
                onChange={(e) =>
                  setProductName(e.target.value)
                }
                required
                placeholder="Example: Premium T-Shirt"
                style={inputStyle}
              />
            </div>

            <div>
              <label>SKU</label>

              <input
                type="text"
                value={sku}
                onChange={(e) =>
                  setSku(e.target.value)
                }
                required
                placeholder="SKU001"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Category</label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                placeholder="Clothing"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Unit Price</label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={unitPrice}
                onChange={(e) =>
                  setUnitPrice(e.target.value)
                }
                required
                placeholder="500"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Current Stock</label>

              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) =>
                  setCurrentStock(e.target.value)
                }
                placeholder="100"
                style={inputStyle}
              />
            </div>

            <div>
              <label>Minimum Stock Alert</label>

              <input
                type="number"
                min="0"
                value={minimumStock}
                onChange={(e) =>
                  setMinimumStock(e.target.value)
                }
                placeholder="10"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <label>Location / Warehouse</label>

            <input
              type="text"
              value={warehouse}
              onChange={(e) =>
                setWarehouse(e.target.value)
              }
              placeholder="Bangalore Warehouse"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: "20px",
              padding: "11px 20px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {saving ? "Creating..." : "Create Product"}
          </button>
        </form>
      )}

      {/* ERROR */}

      {error && !showForm && (
        <div
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "20px"
          }}
        >
          {error}
        </div>
      )}

      {/* PRODUCT TABLE */}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center"
          }}
        >
          <h3>No products found</h3>

          <p style={{ color: "#6b7280" }}>
            Click "+ Add Product" to create your first product.
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
                <th style={thStyle}>Unit Price</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Min Alert</th>
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
                    ₹{Number(product.unit_price).toFixed(2)}
                  </td>

                  <td style={tdStyle}>
                    {product.current_stock}
                  </td>

                  <td style={tdStyle}>
                    {product.minimum_stock_alert_quantity}
                  </td>

                  <td style={tdStyle}>
                    {product.location_warehouse || "-"}
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
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