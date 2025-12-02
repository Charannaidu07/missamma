import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

// Define your backend URL here to avoid typos
const API_BASE_URL = "http://missamma.centralindia.cloudapp.azure.com";

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState({
    billing_name: "",
    billing_address: "",
    billing_phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const handleSubmitRazorpay = async (e) => {
    e.preventDefault();
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      // Transform cart items to match backend expectation
      const cartItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      // 1. Create Order
      const res = await api.post("/payments/create-order/", {
        cart_items: cartItems,
        ...billing,
      });

      console.log("Create-order response:", res.data);

      const { order_id, razorpay_order_id, amount, currency, razorpay_key } =
        res.data;

      // 2. Load Razorpay SDK
      const ok = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!ok) {
        alert("Razorpay SDK failed to load");
        setLoading(false);
        return;
      }

      // 3. Open Payment Modal
      const options = {
        key: razorpay_key,
        amount,
        currency,
        name: "Missamma Beauty Parlour",
        description: "Jewelry / Service Payment",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await api.post("/payments/verify-payment/", {
              order_id,
              razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.status === "success") {
              alert("Payment success! Invoice: " + verifyRes.data.invoice_no);
              localStorage.removeItem("cart");

              // 5. Open Invoice in New Tab (Fixed URL)
              const token = localStorage.getItem("access");
              const invoiceUrl = `${API_BASE_URL}/api/payments/invoice/${order_id}/?token=${token}`;
              window.open(invoiceUrl, "_blank");

              // Redirect
              navigate("/my-orders"); // Make sure this route exists
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("Verify error:", err);
            const msg =
              err.response?.data?.detail ||
              JSON.stringify(err.response?.data || {}) ||
              "Payment verification failed";
            alert(msg);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: billing.billing_name,
          contact: billing.billing_phone,
        },
        theme: {
          color: "#2e7d32",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Create-order error:", err);
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data || {}) ||
        "Failed to initiate payment. Please login again.";
      alert(msg);
      setLoading(false);
    }
  };

  const handleWalletPay = async () => {
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const cartItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const res = await api.post("/payments/wallet-pay/", {
        cart_items: cartItems,
        ...billing,
      });

      if (res.data.status === "success") {
        alert("Wallet payment success! Invoice: " + res.data.invoice_no);
        localStorage.removeItem("cart");

        // Open Invoice (Fixed URL)
        const token = localStorage.getItem("access");
        const invoiceUrl = `${API_BASE_URL}/api/payments/invoice/${res.data.order_id}/?token=${token}`;
        window.open(invoiceUrl, "_blank");

        navigate("/my-orders");
      } else {
        alert("Wallet payment failed: " + res.data.error);
      }
    } catch (err) {
      console.error("Wallet payment error:", err);
      const msg =
        err.response?.data?.detail ||
        "Wallet payment failed. Check login / wallet balance.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="card">
        <h2>Checkout</h2>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div>Processing payment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Checkout</h2>

      {/* Order Summary */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "#f5f5f5",
          borderRadius: "8px",
        }}
      >
        <h3>Order Summary</h3>
        {cart.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span>
              {item.name} x {item.quantity}
            </span>
            <span>₹ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div
          style={{
            borderTop: "1px solid #ddd",
            marginTop: "0.5rem",
            paddingTop: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.25rem",
            }}
          >
            <span>Tax (18%):</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            <span>Total:</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmitRazorpay}
        style={{
          display: "grid",
          gap: "0.8rem",
          maxWidth: 420,
          marginTop: "1rem",
        }}
      >
        <input
          required
          placeholder="Full Name"
          value={billing.billing_name}
          onChange={(e) =>
            setBilling({ ...billing, billing_name: e.target.value })
          }
          disabled={loading}
        />
        <textarea
          required
          placeholder="Billing Address"
          value={billing.billing_address}
          onChange={(e) =>
            setBilling({ ...billing, billing_address: e.target.value })
          }
          disabled={loading}
          rows={3}
        />
        <input
          required
          placeholder="Phone Number"
          value={billing.billing_phone}
          onChange={(e) =>
            setBilling({ ...billing, billing_phone: e.target.value })
          }
          disabled={loading}
        />

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </form>

      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <span style={{ color: "#666" }}>OR</span>
      </div>

      <button
        type="button"
        onClick={handleWalletPay}
        disabled={loading}
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.4rem",
          borderRadius: 999,
          border: "1px solid var(--primary-green)",
          background: "white",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: loading ? 0.6 : 1,
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {loading ? "Processing..." : "Pay with Wallet"}
      </button>

      {/* Security Notice */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e8f5e8",
          borderRadius: "8px",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#2e7d32",
        }}
      >
        🔒 Secure & Encrypted Payment Processing
      </div>
    </div>
  );
};

export default Checkout;