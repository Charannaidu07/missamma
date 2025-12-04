import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          alert("Please login to view your orders.");
          navigate("/login");
          return;
        }

        const response = await api.get("/store/orders/");
        setOrders(response.data);

      } catch (err) {
        console.error("Orders error:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert("Failed to load orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

//   const openInvoice = (orderId) => {
//   const token = localStorage.getItem("access");
//   const url = `https://missamma.centralindia.cloudapp.azure.com/api/payments/invoice/${orderId}/?token=${token}`;
//   window.open(url, "_blank");
// };
const openInvoice = (orderId) => {
  const token = localStorage.getItem("access");
  // Use the correct URL pattern from your urls.py
  const url = `https://missamma.centralindia.cloudapp.azure.com/api/payments/invoice/${orderId}/?token=${token}`;
  window.open(url, "_blank");
};
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "#4caf50"; // green
      case "PROCESSING":
        return "#1976d2"; // blue
      case "SHIPPED":
        return "#ff9800"; // orange
      case "OUT_FOR_DELIVERY":
        return "#9c27b0"; // purple
      case "DELIVERED":
        return "#2e7d32"; // dark green
      case "PENDING":
      default:
        return "#777";
    }
  };

  if (loading) return <div className="card">Loading orders...</div>;

  return (
    <div className="card">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p style={{ fontSize: "0.9rem" }}>You have no orders yet.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
            fontSize: "0.9rem",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Order ID</th>
              <th style={th}>Date</th>
              <th style={th}>Payment Status</th>
              <th style={th}>Delivery Status</th>
              <th style={th}>Total</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={td}>#{order.id}</td>

                <td style={td}>
                  {new Date(order.created_at).toLocaleString()}
                </td>

                <td style={{ ...td, color: getStatusColor(order.status) }}>
                  <strong>{order.status}</strong>
                </td>

                <td
                  style={{
                    ...td,
                    color: getStatusColor(order.delivery_status),
                    fontWeight: 600,
                  }}
                >
                  {order.delivery_status
                    ? order.delivery_status.replace(/_/g, " ")
                    : "Not Updated"}
                </td>

                <td style={td}>₹ {order.total_amount}</td>

                <td style={td}>
                  <button
                    className="btn-primary"
                    style={{
                      padding: "0.4rem 0.9rem",
                      fontSize: "0.8rem",
                      background: "#ec407a",
                      borderRadius: "6px",
                    }}
                    onClick={() => openInvoice(order.id)}
                  >
                    🧾 Print Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// styles
const th = {
  borderBottom: "1px solid #eee",
  textAlign: "left",
  padding: "0.5rem",
};

const td = {
  borderBottom: "1px solid #f5f5f5",
  padding: "0.5rem",
};

export default MyOrders;
