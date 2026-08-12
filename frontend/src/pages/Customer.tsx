import { useEffect, useState } from "react";
import api from "../services/api";

interface Customer {
  id: number;
  customer_name: string;
  mobile_number: string;
  email: string;
  business_name: string;
  gst_number: string;
  customer_type: string;
  address: string;
  status: string;
  follow_up_date: string;
  notes: string;
  created_at: string;
}

interface CustomerSummary {
  customer: Customer;
  totalChallans: number;
  confirmedChallans: number;
  totalSales: number;
  totalPayments: number;
  outstandingAmount: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [customerType, setCustomerType] = useState("RETAIL");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("LEAD");
  const [followUpDate, setFollowUpDate] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // SEARCH
  const [search, setSearch] = useState("");

  // VIEW
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [summary, setSummary] =
    useState<CustomerSummary | null>(null);

  const [showView, setShowView] = useState(false);

  // EDIT
  const [editingCustomer, setEditingCustomer] =
    useState<Customer | null>(null);

  const [showEdit, setShowEdit] = useState(false);

  // DELETE
  const [deleting, setDeleting] = useState(false);

  async function fetchCustomers() {
    try {
      setLoading(true);

      const response = await api.get("/customers");

      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==============================
  // SEARCH
  // ==============================

  async function handleSearch() {
    try {
      setLoading(true);

      if (!search.trim()) {
        await fetchCustomers();
        return;
      }

      const response = await api.get(
        `/customers/search?search=${encodeURIComponent(
          search.trim()
        )}`
      );

      setCustomers(response.data.data || []);
    } catch (error) {
      console.error("Failed to search customers", error);
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // CREATE
  // ==============================

  async function handleCreateCustomer(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      await api.post("/customers", {
        customerName,
        mobileNumber,
        email,
        businessName,
        gstNumber,
        customerType,
        address,
        status,
        followUpDate: followUpDate || undefined,
        notes
      });

      setCustomerName("");
      setMobileNumber("");
      setEmail("");
      setBusinessName("");
      setGstNumber("");
      setCustomerType("RETAIL");
      setAddress("");
      setStatus("LEAD");
      setFollowUpDate("");
      setNotes("");

      setShowForm(false);

      await fetchCustomers();
    } catch (error: any) {
      console.error("Failed to create customer", error);

      setError(
        error.response?.data?.message ||
          "Failed to create customer"
      );
    } finally {
      setSaving(false);
    }
  }

  // ==============================
  // VIEW CUSTOMER
  // ==============================

  async function handleView(customer: Customer) {
    try {
      setSelectedCustomer(customer);

      const response = await api.get(
        `/customers/${customer.id}/summary`
      );

      setSummary(response.data.data);

      setShowView(true);
    } catch (error) {
      console.error("Failed to fetch customer summary", error);
    }
  }

  // ==============================
  // EDIT CUSTOMER
  // ==============================

  function openEdit(customer: Customer) {
    setEditingCustomer(customer);
    setShowEdit(true);
  }

  async function handleUpdateCustomer(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!editingCustomer) return;

    try {
      await api.put(
        `/customers/${editingCustomer.id}`,
        {
          customerName: editingCustomer.customer_name,
          mobileNumber: editingCustomer.mobile_number,
          email: editingCustomer.email,
          businessName: editingCustomer.business_name,
          gstNumber: editingCustomer.gst_number,
          customerType: editingCustomer.customer_type,
          address: editingCustomer.address,
          status: editingCustomer.status,
          followUpDate:
            editingCustomer.follow_up_date || undefined,
          notes: editingCustomer.notes
        }
      );

      setShowEdit(false);
      setEditingCustomer(null);

      await fetchCustomers();
    } catch (error: any) {
      console.error("Failed to update customer", error);

      alert(
        error.response?.data?.message ||
          "Failed to update customer"
      );
    }
  }

  // ==============================
  // DELETE CUSTOMER
  // ==============================

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await api.delete(`/customers/${id}`);

      await fetchCustomers();
    } catch (error: any) {
      console.error("Failed to delete customer", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete customer"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      style={{
        padding: "30px"
      }}
    >
      {/* ==============================
          HEADER
      ============================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            Customers
          </h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: "5px"
            }}
          >
            Manage customer information and records
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
          {showForm
            ? "✕ Close"
            : "+ Add Customer"}
        </button>
      </div>

      {/* ==============================
          SEARCH
      ============================== */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px"
        }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="🔍 Search customer..."
          style={{
            flex: 1,
            padding: "11px 14px",
            border: "1px solid #d1d5db",
            borderRadius: "7px",
            fontSize: "14px"
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Search
        </button>

        {search && (
          <button
            onClick={async () => {
              setSearch("");
              await fetchCustomers();
            }}
            style={{
              padding: "10px 16px",
              background: "white",
              color: "#374151",
              border: "1px solid #d1d5db",
              borderRadius: "7px",
              cursor: "pointer"
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* ==============================
          ADD CUSTOMER FORM
      ============================== */}

      {showForm && (
        <form
          onSubmit={handleCreateCustomer}
          style={{
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#f8fafc"
          }}
        >
          <h2>Add Customer</h2>

          {error && (
            <p style={{ color: "red" }}>
              {error}
            </p>
          )}

          <div style={formGridStyle}>
            <div>
              <label>Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                required
                style={inputStyle}
                placeholder="Customer name"
              />
            </div>

            <div>
              <label>Mobile Number</label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(e.target.value)
                }
                required
                style={inputStyle}
                placeholder="9876543210"
              />
            </div>

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                style={inputStyle}
                placeholder="customer@example.com"
              />
            </div>

            <div>
              <label>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) =>
                  setBusinessName(e.target.value)
                }
                required
                style={inputStyle}
                placeholder="ABC Traders"
              />
            </div>

            <div>
              <label>GST Number</label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) =>
                  setGstNumber(e.target.value)
                }
                style={inputStyle}
                placeholder="GST number"
              />
            </div>

            <div>
              <label>Customer Type</label>
              <select
                value={customerType}
                onChange={(e) =>
                  setCustomerType(e.target.value)
                }
                style={inputStyle}
              >
                <option value="RETAIL">
                  RETAIL
                </option>
                <option value="WHOLESALE">
                  WHOLESALE
                </option>
                <option value="DISTRIBUTOR">
                  DISTRIBUTOR
                </option>
              </select>
            </div>

            <div>
              <label>Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                style={inputStyle}
              >
                <option value="LEAD">
                  LEAD
                </option>
                <option value="ACTIVE">
                  ACTIVE
                </option>
                <option value="INACTIVE">
                  INACTIVE
                </option>
              </select>
            </div>

            <div>
              <label>Follow-up Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) =>
                  setFollowUpDate(e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginTop: "15px" }}>
            <label>Address</label>
            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              style={inputStyle}
              rows={3}
              placeholder="Bangalore, Karnataka"
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              style={inputStyle}
              rows={3}
              placeholder="Customer notes"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: "15px",
              padding: "10px 18px",
              background: "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            {saving
              ? "Creating..."
              : "Create Customer"}
          </button>
        </form>
      )}

      {/* ==============================
          CUSTOMER TABLE
      ============================== */}

      {loading ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "10px"
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
                <th style={thStyle}>
                  ID
                </th>

                <th style={thStyle}>
                  Customer
                </th>

                <th style={thStyle}>
                  Mobile
                </th>

                <th style={thStyle}>
                  Email
                </th>

                <th style={thStyle}>
                  Business
                </th>

                <th style={thStyle}>
                  Type
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td style={tdStyle}>
                    {customer.id}
                  </td>

                  <td style={tdStyle}>
                    <strong>
                      {customer.customer_name}
                    </strong>
                  </td>

                  <td style={tdStyle}>
                    {customer.mobile_number}
                  </td>

                  <td style={tdStyle}>
                    {customer.email || "-"}
                  </td>

                  <td style={tdStyle}>
                    {customer.business_name}
                  </td>

                  <td style={tdStyle}>
                    {customer.customer_type}
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "5px 9px",
                        borderRadius: "15px",
                        background:
                          customer.status ===
                          "ACTIVE"
                            ? "#dcfce7"
                            : customer.status ===
                              "LEAD"
                            ? "#fef3c7"
                            : "#fee2e2",
                        color:
                          customer.status ===
                          "ACTIVE"
                            ? "#15803d"
                            : customer.status ===
                              "LEAD"
                            ? "#b45309"
                            : "#b91c1c",
                        fontSize: "12px",
                        fontWeight: 600
                      }}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px"
                      }}
                    >
                      <button
                        onClick={() =>
                          handleView(customer)
                        }
                        style={viewButton}
                      >
                        View
                      </button>

                      <button
                        onClick={() =>
                          openEdit(customer)
                        }
                        style={editButton}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(customer.id)
                        }
                        disabled={deleting}
                        style={deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ==============================
          VIEW MODAL
      ============================== */}

      {showView &&
        selectedCustomer &&
        summary && (
          <div style={overlayStyle}>
            <div style={modalStyle}>
              <button
                onClick={() => {
                  setShowView(false);
                  setSummary(null);
                  setSelectedCustomer(null);
                }}
                style={closeButton}
              >
                ✕
              </button>

              <h2
                style={{
                  marginTop: 0,
                  textAlign: "center"
                }}
              >
                {selectedCustomer.customer_name}
              </h2>

              <p
                style={{
                  textAlign: "center",
                  color: "#6b7280"
                }}
              >
                {selectedCustomer.business_name}
              </p>

              <div style={detailsGrid}>
                <Detail
                  label="Mobile"
                  value={
                    selectedCustomer.mobile_number
                  }
                />

                <Detail
                  label="Email"
                  value={
                    selectedCustomer.email || "-"
                  }
                />

                <Detail
                  label="GST Number"
                  value={
                    selectedCustomer.gst_number || "-"
                  }
                />

                <Detail
                  label="Customer Type"
                  value={
                    selectedCustomer.customer_type
                  }
                />

                <Detail
                  label="Status"
                  value={
                    selectedCustomer.status
                  }
                />

                <Detail
                  label="Follow-up Date"
                  value={
                    selectedCustomer.follow_up_date ||
                    "-"
                  }
                />

                <Detail
                  label="Address"
                  value={
                    selectedCustomer.address || "-"
                  }
                />

                <Detail
                  label="Notes"
                  value={
                    selectedCustomer.notes || "-"
                  }
                />
              </div>

              <h3
                style={{
                  marginTop: "25px"
                }}
              >
                Customer Summary
              </h3>

              <div style={summaryGrid}>
                <SummaryCard
                  label="Total Challans"
                  value={summary.totalChallans}
                />

                <SummaryCard
                  label="Confirmed Challans"
                  value={
                    summary.confirmedChallans
                  }
                />

                <SummaryCard
                  label="Total Sales"
                  value={`₹${summary.totalSales.toLocaleString()}`}
                />

                <SummaryCard
                  label="Total Payments"
                  value={`₹${summary.totalPayments.toLocaleString()}`}
                />

                <SummaryCard
                  label="Outstanding"
                  value={`₹${summary.outstandingAmount.toLocaleString()}`}
                />
              </div>
            </div>
          </div>
        )}

      {/* ==============================
          EDIT MODAL
      ============================== */}

      {showEdit && editingCustomer && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <button
              onClick={() => {
                setShowEdit(false);
                setEditingCustomer(null);
              }}
              style={closeButton}
            >
              ✕
            </button>

            <h2>Edit Customer</h2>

            <form
              onSubmit={handleUpdateCustomer}
            >
              <div style={formGridStyle}>
                <div>
                  <label>Customer Name</label>

                  <input
                    value={
                      editingCustomer.customer_name
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        customer_name:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label>Mobile</label>

                  <input
                    value={
                      editingCustomer.mobile_number
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        mobile_number:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label>Email</label>

                  <input
                    value={
                      editingCustomer.email || ""
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        email: e.target.value
                      })
                    }
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label>Business Name</label>

                  <input
                    value={
                      editingCustomer.business_name
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        business_name:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label>Customer Type</label>

                  <select
                    value={
                      editingCustomer.customer_type
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        customer_type:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="RETAIL">
                      RETAIL
                    </option>

                    <option value="WHOLESALE">
                      WHOLESALE
                    </option>

                    <option value="DISTRIBUTOR">
                      DISTRIBUTOR
                    </option>
                  </select>
                </div>

                <div>
                  <label>Status</label>

                  <select
                    value={
                      editingCustomer.status
                    }
                    onChange={(e) =>
                      setEditingCustomer({
                        ...editingCustomer,
                        status:
                          e.target.value
                      })
                    }
                    style={inputStyle}
                  >
                    <option value="LEAD">
                      LEAD
                    </option>

                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "15px" }}>
                <label>GST Number</label>

                <input
                  value={
                    editingCustomer.gst_number || ""
                  }
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      gst_number:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <label>Address</label>

                <textarea
                  value={
                    editingCustomer.address || ""
                  }
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      address:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                  rows={3}
                />
              </div>

              <div style={{ marginTop: "15px" }}>
                <label>Notes</label>

                <textarea
                  value={
                    editingCustomer.notes || ""
                  }
                  onChange={(e) =>
                    setEditingCustomer({
                      ...editingCustomer,
                      notes:
                        e.target.value
                    })
                  }
                  style={inputStyle}
                  rows={3}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: "18px",
                  padding: "10px 20px",
                  background: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "7px",
                  cursor: "pointer",
                  fontWeight: 600
                }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==============================
   SMALL COMPONENTS
============================== */

function Detail({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p
        style={{
          margin: "0 0 4px",
          color: "#6b7280",
          fontSize: "12px"
        }}
      >
        {label}
      </p>

      <strong>{value}</strong>
    </div>
  );
}

function SummaryCard({
  label,
  value
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        padding: "15px",
        textAlign: "center"
      }}
    >
      <p
        style={{
          margin: "0 0 5px",
          color: "#6b7280",
          fontSize: "12px"
        }}
      >
        {label}
      </p>

      <strong
        style={{
          fontSize: "18px"
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* ==============================
   STYLES
============================== */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: "6px"
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "15px"
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

const viewButton: React.CSSProperties = {
  padding: "6px 10px",
  background: "#eff6ff",
  color: "#2563eb",
  border: "1px solid #bfdbfe",
  borderRadius: "5px",
  cursor: "pointer"
};

const editButton: React.CSSProperties = {
  padding: "6px 10px",
  background: "#fefce8",
  color: "#ca8a04",
  border: "1px solid #fde68a",
  borderRadius: "5px",
  cursor: "pointer"
};

const deleteButton: React.CSSProperties = {
  padding: "6px 10px",
  background: "#fef2f2",
  color: "#dc2626",
  border: "1px solid #fecaca",
  borderRadius: "5px",
  cursor: "pointer"
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "20px"
};

const modalStyle: React.CSSProperties = {
  position: "relative",
  background: "white",
  borderRadius: "12px",
  padding: "30px",
  width: "100%",
  maxWidth: "750px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxSizing: "border-box"
};

const closeButton: React.CSSProperties = {
  position: "absolute",
  right: "15px",
  top: "15px",
  border: "none",
  background: "#f3f4f6",
  borderRadius: "6px",
  width: "35px",
  height: "35px",
  cursor: "pointer",
  fontSize: "16px"
};

const detailsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "18px",
  marginTop: "20px"
};

const summaryGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "12px"
};