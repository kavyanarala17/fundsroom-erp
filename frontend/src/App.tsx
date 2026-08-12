import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Product from "./pages/Product";
import Inventory from "./pages/Inventory";
import Challan from "./pages/Challan";
import Payment from "./pages/Payment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Customers */}
        <Route
          path="/customers"
          element={<Customer />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Product />}
        />

        {/* Challans */}
        <Route
          path="/challans"
          element={<Challan />}
        />
         
         {/* Payments */}
        <Route
          path="/payments"
          element={<Payment />}
        />
        

        {/* Inventory */}
        <Route
          path="/inventory"
          element={<Inventory />}
        />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;