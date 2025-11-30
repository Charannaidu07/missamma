import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";

const formatPct = (value) => {
  if (value === null || value === undefined) return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  const fixed = num.toFixed(1);
  const arrow = num > 0 ? "↑" : num < 0 ? "↓" : "→";
  return `${arrow} ${Math.abs(parseFloat(fixed))}%`;
};

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [me, setMe] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    is_active: true,
  });

  const [statusFilter, setStatusFilter] = useState("");

  // --------- Load staff info, summary, orders, products ----------
  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await api.get("/accounts/me/");
        console.log("ME from /accounts/me/:", meRes.data);
        setMe(meRes.data);

        const summaryRes = await api.get("/store/admin/summary/");
        setSummary(summaryRes.data);

        const ordersRes = await api.get("/store/admin/orders/");
        setOrders(ordersRes.data);

        const productsRes = await api.get("/store/admin/products/");
        setProducts(productsRes.data);
      } catch (err) {
        console.error("Staff dashboard load error:", err);

        if (err.response?.status === 403) {
          setForbidden(true);
        } else if (err.response?.status === 404) {
          alert(
            "Admin summary endpoint not found (404). Check backend URL /api/store/admin/summary/."
          );
        } else {
          alert(
            "Failed to load staff dashboard. Check if backend is running and token is attached."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // --------- Filtering orders ----------
  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  // --------- Status color ----------
  const statusColor = (status) => {
    switch ((status || "").toUpperCase()) {
      case "PAID":
        return "#4caf50";
      case "PENDING":
        return "#ff9800";
      case "CANCELLED":
        return "#f44336";
      case "SHIPPED":
        return "#1976d2";
      case "DELIVERED":
        return "#2e7d32";
      default:
        return "#757575";
    }
  };

  // --------- Update order (status / delivery_status) ----------
  const updateOrder = async (orderId, changes) => {
    try {
      const res = await api.patch(`/store/admin/orders/${orderId}/`, changes);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? res.data : o)));
    } catch (err) {
      console.error(err);
      alert("Failed to update order");
    }
  };

  // --------- Add product ----------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price || 0),
        stock: parseInt(newProduct.stock || 0, 10),
      };
      const res = await api.post("/store/admin/products/", payload);
      setProducts((prev) => [res.data, ...prev]);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        description: "",
        is_active: true,
      });
      alert("Product added");
    } catch (err) {
      console.error(err);
      alert("Failed to add product");
    }
  };

  const openInvoice = (orderId) => {
    const url = `${BACKEND_BASE}/api/payments/invoice/${orderId}/`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // --------- Graph data: orders per day ----------
  const chartData = summary
    ? {
        labels: summary.orders_by_day.map((d) => d.day),
        datasets: [
          {
            label: "Orders",
            data: summary.orders_by_day.map((d) => d.count),
            borderColor: "#c2185b",
            backgroundColor: "rgba(194, 24, 91, 0.2)",
            tension: 0.3,
          },
        ],
      }
    : null;

  if (loading) return <div className="card">Loading staff dashboard...</div>;

  if (forbidden) {
    return (
      <div className="card">
        <h2>Access Denied</h2>
        <p>You must be a staff/admin user to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      <h2>Staff Dashboard</h2>

      {/* Summary + More Details Toggle */}
      {summary && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <h3 style={{ margin: 0 }}>Overview</h3>
            <button
              type="button"
              onClick={() => setShowMoreDetails((prev) => !prev)}
              style={{
                padding: "0.35rem 0.9rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                background: "#c2185b",
                color: "white",
                fontSize: "0.8rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            >
              {showMoreDetails ? "Hide details ▲" : "More details ▼"}
            </button>
          </div>

          {/* Top summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            <SummaryCard title="Total Orders" value={summary.total_orders} />
            <SummaryCard
              title="Total Revenue"
              value={`₹ ${summary.total_revenue}`}
            />
            {summary.status_counts.map((s) => (
              <SummaryCard
                key={s.status}
                title={`Status: ${s.status}`}
                value={s.count}
              />
            ))}
          </div>

          {/* More details section */}
          {showMoreDetails && (
            <div
              className="card"
              style={{
                padding: "0.9rem 1rem",
                marginTop: "0.8rem",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(252,228,236,0.9))",
                border: "1px solid rgba(0,0,0,0.03)",
              }}
            >
              <h4 style={{ marginTop: 0, marginBottom: "0.6rem" }}>
                Detailed Metrics
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {/* Orders weekly */}
                <MiniStat
                  label="Orders (Last 7 days)"
                  value={summary.orders_last_week}
                />
                <MiniStat
                  label="Orders (Prev 7 days)"
                  value={summary.orders_prev_week}
                />
                <MiniStat
                  label="Orders weekly change"
                  value={formatPct(summary.orders_last_week_change_pct)}
                />

                {/* Orders monthly */}
                <MiniStat
                  label="Orders (Last 30 days)"
                  value={summary.orders_last_month}
                />
                <MiniStat
                  label="Orders (Prev 30 days)"
                  value={summary.orders_prev_month}
                />
                <MiniStat
                  label="Orders monthly change"
                  value={formatPct(summary.orders_last_month_change_pct)}
                />

                {/* Income weekly */}
                <MiniStat
                  label="Income (Last 7 days)"
                  value={`₹ ${summary.income_last_week}`}
                />
                <MiniStat
                  label="Income (Prev 7 days)"
                  value={`₹ ${summary.income_prev_week}`}
                />
                <MiniStat
                  label="Income weekly change"
                  value={formatPct(summary.income_last_week_change_pct)}
                />

                {/* Income monthly */}
                <MiniStat
                  label="Income (Last 30 days)"
                  value={`₹ ${summary.income_last_month}`}
                />
                <MiniStat
                  label="Income (Prev 30 days)"
                  value={`₹ ${summary.income_prev_month}`}
                />
                <MiniStat
                  label="Income monthly change"
                  value={formatPct(summary.income_last_month_change_pct)}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Graph */}
      <div className="card" style={{ padding: "1rem" }}>
        <h3>Orders (Last 7 days)</h3>
        {chartData ? <Line data={chartData} /> : <p>No data available yet.</p>}
      </div>

      {/* Orders Table */}
      <div className="card" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <h3 style={{ margin: 0 }}>Recent Orders</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              border: "1px solid #ddd",
              fontSize: "0.85rem",
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Customer</th>
                <th style={th}>Created</th>
                <th style={th}>Payment</th>
                <th style={th}>Delivery</th>
                <th style={th}>Total</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={td}>#{o.id}</td>
                  <td style={td}>{o.customer_username}</td>
                  <td style={td}>{new Date(o.created_at).toLocaleString()}</td>
                  <td style={{ ...td, color: statusColor(o.status) }}>
                    <select
                      value={o.status}
                      onChange={(e) =>
                        updateOrder(o.id, { status: e.target.value })
                      }
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PAID">PAID</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td
                    style={{ ...td, color: statusColor(o.delivery_status) }}
                  >
                    <select
                      value={o.delivery_status || "PROCESSING"}
                      onChange={(e) =>
                        updateOrder(o.id, { delivery_status: e.target.value })
                      }
                    >
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="OUT_FOR_DELIVERY">
                        OUT_FOR_DELIVERY
                      </option>
                      <option value="DELIVERED">DELIVERED</option>
                    </select>
                  </td>
                  <td style={{ ...td, textAlign: "right" }}>
                    ₹ {o.total_amount}
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => openInvoice(o.id)}
                      style={{
                        padding: "0.25rem 0.7rem",
                        fontSize: "0.75rem",
                        borderRadius: "6px",
                        border: "none",
                        background: "#ec407a",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Print Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td style={td} colSpan="7">
                    No orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Management */}
      <div className="card" style={{ padding: "1rem" }}>
        <h3>Products</h3>
        <form
          onSubmit={handleAddProduct}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "0.5rem",
            marginBottom: "0.8rem",
          }}
        >
          <input
            required
            placeholder="Name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            required
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
          />
          <input
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                description: e.target.value,
              })
            }
          />
          <button type="submit" className="btn-primary">
            Add Product
          </button>
        </form>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
            }}
          >
            <thead>
              <tr>
                <th style={th}>ID</th>
                <th style={th}>Name</th>
                <th style={th}>Price</th>
                <th style={th}>Stock</th>
                <th style={th}>Active</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td style={td}>{p.id}</td>
                  <td style={td}>{p.name}</td>
                  <td style={td}>₹ {p.price}</td>
                  <td style={td}>{p.stock}</td>
                  <td style={td}>{p.is_active ? "Yes" : "No"}</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td style={td} colSpan="5">
                    No products.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const th = {
  borderBottom: "1px solid #eee",
  textAlign: "left",
  padding: "0.4rem",
};

const td = {
  borderBottom: "1px solid #f5f5f5",
  padding: "0.4rem",
};

const SummaryCard = ({ title, value }) => (
  <div
    style={{
      padding: "0.8rem 1rem",
      borderRadius: "10px",
      background:
        "linear-gradient(135deg, rgba(255,182,193,0.3), rgba(200,230,201,0.5))",
      border: "1px solid rgba(255,255,255,0.7)",
      boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    }}
  >
    <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.3rem" }}>
      {title}
    </div>
    <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#c2185b" }}>
      {value}
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div
    style={{
      padding: "0.6rem 0.7rem",
      borderRadius: "10px",
      background: "rgba(255,255,255,0.9)",
      border: "1px solid rgba(0,0,0,0.03)",
    }}
  >
    <div
      style={{
        fontSize: "0.75rem",
        color: "#777",
        marginBottom: "0.25rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      title={label}
    >
      {label}
    </div>
    <div style={{ fontSize: "1rem", fontWeight: "600", color: "#c2185b" }}>
      {value}
    </div>
  </div>
);

export default StaffDashboard;