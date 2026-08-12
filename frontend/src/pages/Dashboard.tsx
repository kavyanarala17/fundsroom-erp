import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

interface DashboardData {
  totalCustomers?: number;
  totalProducts?: number;
  totalChallans?: number;
  totalPayments?: number;
  totalSales?: number;
  lowStockProducts?: number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const response = await api.get("/dashboard");

      console.log("Dashboard response:", response.data);

      setData(response.data.data);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  if (loading) {
    return (
      <div className="loading-screen">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        {error}
      </div>
    );
  }

  return (
    <div className="erp-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="logo">
          <div className="logo-icon">
            F
          </div>

          <div>
            <h2>FundsRoom</h2>
            <span>ERP SYSTEM</span>
          </div>
        </div>


        {/* ================= NAVIGATION ================= */}

        <nav className="sidebar-nav">

          {/* DASHBOARD */}

          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            📊
            <span>Dashboard</span>
          </button>


          {/* CUSTOMERS */}

          <button
            className="nav-item"
            onClick={() => navigate("/customers")}
          >
            👥
            <span>Customers</span>
          </button>


          {/* PRODUCTS */}

          <button
            className="nav-item"
            onClick={() => navigate("/products")}
          >
            📦
            <span>Products</span>
          </button>


          {/* INVENTORY */}

          <button
            className="nav-item"
            onClick={() => navigate("/inventory")}
          >
            🏭
            <span>Inventory</span>
          </button>


          {/* CHALLANS */}

          <button
            className="nav-item"
            onClick={() => navigate("/challans")}
          >
            🧾
            <span>Challans</span>
          </button>


          {/* PAYMENTS */}

          <button
            className="nav-item"
            onClick={() => navigate("/payments")}
          >
            💳
            <span>Payments</span>
          </button>

        </nav>


        {/* ================= BOTTOM MENU ================= */}

        <div className="sidebar-bottom">

          {/* LOGOUT */}

          <button
            className="nav-item logout"
            onClick={logout}
          >
            🚪
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="main-content">

        {/* ================= HEADER ================= */}

        <header className="top-header">

          <div>
            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back to FundsRoom ERP
            </p>
          </div>


          {/* ADMIN */}

          <div className="user-section">

            <div className="user-avatar">
              A
            </div>

            <div>
              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>
            </div>

          </div>

        </header>


        {/* ================= DASHBOARD ================= */}

        <section className="dashboard-content">

          {/* PAGE HEADING */}

          <div className="page-heading">

            <h2>
              Overview
            </h2>

            <p>
              Here's what's happening in your business today.
            </p>

          </div>


          {/* ================= STAT CARDS ================= */}

          <div className="stats-grid">

            {/* CUSTOMERS */}

            <div
              className="stat-card"
              onClick={() => navigate("/customers")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon customers-icon">
                👥
              </div>

              <div>
                <p>
                  Total Customers
                </p>

                <h3>
                  {data.totalCustomers ?? 0}
                </h3>
              </div>
            </div>


            {/* PRODUCTS */}

            <div
              className="stat-card"
              onClick={() => navigate("/products")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon products-icon">
                📦
              </div>

              <div>
                <p>
                  Total Products
                </p>

                <h3>
                  {data.totalProducts ?? 0}
                </h3>
              </div>
            </div>


            {/* CHALLANS */}

            <div
              className="stat-card"
              onClick={() => navigate("/challans")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon challans-icon">
                🧾
              </div>

              <div>
                <p>
                  Total Challans
                </p>

                <h3>
                  {data.totalChallans ?? 0}
                </h3>
              </div>
            </div>


            {/* PAYMENTS */}

            <div
              className="stat-card"
              onClick={() => navigate("/payments")}
              style={{ cursor: "pointer" }}
            >
              <div className="stat-icon payments-icon">
                💳
              </div>

              <div>
                <p>
                  Total Payments
                </p>

                <h3>
                  ₹{data.totalPayments ?? 0}
                </h3>
              </div>
            </div>

          </div>


          {/* ================= SECOND ROW ================= */}

          <div className="dashboard-grid">

            {/* REVENUE */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Revenue Overview
                  </h3>

                  <p>
                    Current business revenue
                  </p>
                </div>

                <span className="panel-icon">
                  ₹
                </span>

              </div>

              <div className="revenue-value">
                ₹{data.totalSales ?? 0}
              </div>

              <p className="panel-description">
                Total revenue recorded in the system
              </p>

            </div>


            {/* INVENTORY ALERT */}

            <div className="dashboard-panel">

              <div className="panel-header">

                <div>
                  <h3>
                    Inventory Alert
                  </h3>

                  <p>
                    Products requiring attention
                  </p>
                </div>

                <span className="warning-icon">
                  ⚠️
                </span>

              </div>

              <div className="stock-value">
                {data.lowStockProducts ?? 0}
              </div>

              <p className="panel-description">
                Products currently below stock level
              </p>

              <button
                className="view-button"
                onClick={() => navigate("/inventory")}
              >
                View Inventory →
              </button>

            </div>

          </div>


          {/* ================= QUICK ACTIONS ================= */}

          <div className="quick-section">

            <h2>
              Quick Actions
            </h2>

            <div className="quick-grid">

              {/* ADD CUSTOMER */}

              <button
                className="quick-card"
                onClick={() => navigate("/customers")}
              >
                <span>
                  👥
                </span>

                <strong>
                  Add Customer
                </strong>

                <small>
                  Create a new customer
                </small>
              </button>


              {/* ADD PRODUCT */}

              <button
                className="quick-card"
                onClick={() => navigate("/products")}
              >
                <span>
                  📦
                </span>

                <strong>
                  Add Product
                </strong>

                <small>
                  Add product to inventory
                </small>
              </button>


              {/* CREATE CHALLAN */}

              <button
                className="quick-card"
                onClick={() => navigate("/challans")}
              >
                <span>
                  🧾
                </span>

                <strong>
                  Create Challan
                </strong>

                <small>
                  Create a new challan
                </small>
              </button>


              {/* RECORD PAYMENT */}

              <button
                className="quick-card"
                onClick={() => navigate("/payments")}
              >
                <span>
                  💳
                </span>

                <strong>
                  Record Payment
                </strong>

                <small>
                  Record customer payment
                </small>
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}