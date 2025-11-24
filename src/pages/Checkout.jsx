import React, { useEffect, useState } from "react";
import { api } from "../api";

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

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const handleSubmitRazorpay = async (e) => {
  e.preventDefault();
  if (!cart.length) {
    alert("Cart is empty");
    return;
  }

  try {
    const res = await api.post("/payments/create-order/", {
      cart_items: cart,
      ...billing,
    });

    console.log("Create-order response:", res.data);

    const { order_id, razorpay_order_id, amount, currency, razorpay_key } = res.data;

    const ok = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!ok) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const options = {
      key: razorpay_key,
      amount,
      currency,
      name: "Missamma Beauty Parlour",
      description: "Jewelry / Service Payment",
      order_id: razorpay_order_id,
      handler: async function (response) {
        try {
          const verifyRes = await api.post("/payments/verify-payment/", {
            order_id,
            razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.status === "success") {
            alert("Payment success! Invoice: " + verifyRes.data.invoice_no);
            localStorage.removeItem("cart");
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
        }
      },
      prefill: {
        name: billing.billing_name,
        contact: billing.billing_phone,
      },
      theme: {
        color: "#2e7d32",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Create-order error:", err);
    const msg =
      err.response?.data?.detail ||
      JSON.stringify(err.response?.data || {}) ||
      "Failed to initiate payment.";
    alert(msg); // ← This will show the exact reason for 400
  }
};


  const handleWalletPay = async () => {
    if (!cart.length) {
      alert("Cart is empty");
      return;
    }
    try {
      const res = await api.post("/payments/wallet-pay/", {
        cart_items: cart,
        ...billing,
      });
      if (res.data.status === "success") {
        alert("Wallet payment success! Invoice: " + res.data.invoice_no);
        localStorage.removeItem("cart");
      } else {
        alert("Wallet payment failed: " + res.data.error);
      }
    } catch (err) {
      alert("Wallet payment failed. Check login / wallet balance.");
    }
  };

  return (
    <div className="card">
      <h2>Checkout</h2>
      <form
        onSubmit={handleSubmitRazorpay}
        style={{ display: "grid", gap: "0.8rem", maxWidth: 420, marginTop: "1rem" }}
      >
        <input
          required
          placeholder="Full Name"
          value={billing.billing_name}
          onChange={(e) => setBilling({ ...billing, billing_name: e.target.value })}
        />
        <textarea
          required
          placeholder="Billing Address"
          value={billing.billing_address}
          onChange={(e) => setBilling({ ...billing, billing_address: e.target.value })}
        />
        <input
          required
          placeholder="Phone Number"
          value={billing.billing_phone}
          onChange={(e) => setBilling({ ...billing, billing_phone: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Pay with Razorpay
        </button>
      </form>
      <button
        type="button"
        onClick={handleWalletPay}
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.4rem",
          borderRadius: 999,
          border: "1px solid var(--primary-green)",
          background: "white",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Pay with Wallet
      </button>
    </div>
  );
};

export default Checkout;
