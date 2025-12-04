import React, { useEffect, useState } from "react";
import { api, checkAuth, getToken } from "../api";
import { useNavigate } from "react-router-dom";

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      resolve(false);
    };
    document.body.appendChild(script);
  });

// Helper functions
const getSafePrice = (item) => {
  if (!item) return 0;
  let price = item.price || item.product_price || item.amount || item.total_price || 0;
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof price === 'number') return price;
  return 0;
};

const getSafeQuantity = (item) => {
  if (!item) return 1;
  const qty = item.quantity || item.qty || 1;
  if (typeof qty === 'string') {
    const parsed = parseInt(qty, 10);
    return isNaN(parsed) ? 1 : parsed;
  }
  return qty || 1;
};

const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState({
    billing_name: "",
    billing_address: "",
    billing_phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [debugInfo, setDebugInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!checkAuth()) {
      alert("Please login to checkout");
      navigate("/login?from=/checkout");
      return;
    }
    
    // Load cart
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      try {
        const parsedCart = JSON.parse(cartData);
        console.log("🛒 Cart loaded:", parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error parsing cart:", error);
        setCart([]);
        localStorage.removeItem("cart");
      }
    }
    
    // Pre-fill billing info
    const userInfo = localStorage.getItem("user_info");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setBilling(prev => ({
          ...prev,
          billing_name: user.name || user.username || "",
          billing_phone: user.phone || user.phone_number || "",
        }));
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, [navigate]);

  const validateForm = () => {
    if (!cart || cart.length === 0) {
      alert("Your cart is empty");
      return false;
    }
    
    if (!billing.billing_name?.trim()) {
      alert("Please enter your name");
      return false;
    }
    
    if (!billing.billing_address?.trim()) {
      alert("Please enter your address");
      return false;
    }
    
    if (!billing.billing_phone?.trim() || !isValidPhone(billing.billing_phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }
    
    return true;
  };

  // Direct backend test function
  const testBackendDirectly = async () => {
    const token = getToken();
    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    setDebugInfo("Testing backend connection...");
    
    try {
      // Simple test payload
      const testPayload = {
        cart_items: [{
          product_id: 2,
          quantity: 1,
          price: 2000
        }],
        billing_name: "Test User",
        billing_address: "Test Address",
        billing_phone: "1234567890",
        total_amount: "2360.00"
      };

      const response = await fetch('https://missamma.centralindia.cloudapp.azure.com/api/payments/create-order/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });
      
      console.log("📡 Direct test response:", response.status, response.statusText);
      
      if (response.status === 500) {
        const text = await response.text();
        setDebugInfo(`Server 500 error`);
        alert("Backend returned 500 error. Check console for details.");
        console.error("Server error HTML:", text.substring(0, 500));
      } else if (response.ok) {
        const data = await response.json();
        setDebugInfo(`Test successful! Order ID: ${data.order_id}`);
        alert(`Backend test successful! Order created: ${data.order_id}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setDebugInfo(`Test failed: ${response.status}`);
        alert(`Backend test failed: ${response.status} ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("❌ Direct test error:", error);
      setDebugInfo(`Test error: ${error.message}`);
      alert(`Test failed: ${error.message}`);
    }
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setPaymentMethod("razorpay");

    try {
      console.log("🛒 Processing cart items:", cart.length);
      
      // Prepare cart items
      const cartItems = cart.map((item) => ({
        product_id: item.product_id || item.id || 0,
        quantity: getSafeQuantity(item),
        price: getSafePrice(item),
        product_name: item.name || `Product ${item.product_id}`,
      }));

      const payload = {
        cart_items: cartItems,
        billing_name: billing.billing_name.trim(),
        billing_address: billing.billing_address.trim(),
        billing_phone: billing.billing_phone.replace(/\D/g, '').slice(0, 10),
        payment_method: "razorpay",
        total_amount: total.toFixed(2),
        notes: `Order from ${billing.billing_name}`
      };

      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));
      setDebugInfo("Creating order...");

      // 1. Create Order
      const res = await api.post("/payments/create-order/", payload);
      console.log("✅ Create-order response:", res.data);

      if (!res.data.razorpay_order_id) {
        throw new Error("No razorpay_order_id in response");
      }

      const { order_id, razorpay_order_id, amount, currency, razorpay_key } = res.data;
      setDebugInfo(`Order created: ${order_id}`);

      // 2. Load Razorpay SDK
      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      
      if (!scriptLoaded) {
        alert("Failed to load Razorpay. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 3. Open Payment Modal
      const options = {
        key: razorpay_key,
        amount: amount.toString(),
        currency: currency || "INR",
        name: "Missamma Beauty Parlour",
        description: "Payment for Order",
        order_id: razorpay_order_id,
        handler: async function (response) {
          console.log("💰 Payment successful:", response);
          setDebugInfo("Verifying payment...");
          
          try {
            // 4. Verify Payment
            const verifyRes = await api.post("/payments/verify-payment/", {
              order_id: order_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("✅ Verification response:", verifyRes.data);

            if (verifyRes.data.status === "success") {
              alert(`Payment successful! Invoice: ${verifyRes.data.invoice_no}`);
              localStorage.removeItem("cart");
              
              // Open invoice in new tab
              const token = getToken();
              const invoiceUrl = `https://missamma.centralindia.cloudapp.azure.com/api/payments/invoice/${order_id}/?token=${token}`;
              window.open(invoiceUrl, "_blank");
              
              navigate("/my-orders");
            } else {
              alert(`Payment verification failed: ${verifyRes.data.message || "Unknown error"}`);
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert(err.response?.data?.detail || "Payment verification failed");
          } finally {
            setLoading(false);
            setDebugInfo("");
          }
        },
        prefill: {
          name: billing.billing_name,
          contact: billing.billing_phone,
          email: localStorage.getItem("user_email") || "",
        },
        theme: {
          color: "#2e7d32",
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Payment modal dismissed");
            setLoading(false);
            setDebugInfo("");
          },
        },
        notes: {
          order_id: order_id,
        }
      };

      console.log("🎯 Razorpay options:", options);
      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
        setDebugInfo("");
      });
      
      rzp.open();
      
    } catch (err) {
      console.error("❌ Create-order error:", err);
      
      let errorMessage = "Failed to create order.";
      
      if (err.response?.status === 500) {
        errorMessage = "Server Error (500)\n\n";
        errorMessage += "The backend server encountered an error.\n";
        errorMessage += "Please contact the administrator.\n\n";
        errorMessage += "Error details in console.";
        
        if (err.response?.data && typeof err.response.data === 'string') {
          console.error("🔍 Server 500 error HTML:", err.response.data.substring(0, 500));
        }
      } else if (err.response?.data) {
        errorMessage = `Error: ${JSON.stringify(err.response.data)}`;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
      setLoading(false);
      setDebugInfo(`Error: ${err.message}`);
    }
  };

  const handleWalletPayment = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setPaymentMethod("wallet");

    try {
      const cartItems = cart.map((item) => ({
        product_id: item.product_id || item.id || 0,
        quantity: getSafeQuantity(item),
        price: getSafePrice(item),
        product_name: item.name || `Product ${item.product_id}`,
      }));

      const res = await api.post("/payments/wallet-pay/", {
        cart_items: cartItems,
        billing_name: billing.billing_name.trim(),
        billing_address: billing.billing_address.trim(),
        billing_phone: billing.billing_phone.replace(/\D/g, '').slice(0, 10),
        payment_method: "wallet",
        total_amount: total.toFixed(2)
      });

      console.log("✅ Wallet payment response:", res.data);

      if (res.data.status === "success") {
        alert(`Wallet payment successful! Invoice: ${res.data.invoice_no}`);
        localStorage.removeItem("cart");
        
        // Open invoice
        const token = getToken();
        const invoiceUrl = `https://missamma.centralindia.cloudapp.azure.com/api/payments/invoice/${res.data.order_id}/?token=${token}`;
        window.open(invoiceUrl, "_blank");
        
        navigate("/my-orders");
      } else {
        alert(`Wallet payment failed: ${res.data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Wallet payment error:", err);
      
      let errorMessage = "Wallet payment failed";
      if (err.response?.status === 500) {
        errorMessage = "Server error (500) processing wallet payment.";
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const price = getSafePrice(item);
    const quantity = getSafeQuantity(item);
    return sum + (price * quantity);
  }, 0);
  
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  // Show loading state
  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Processing {paymentMethod} Payment...</h2>
        <div style={{ margin: "2rem 0" }}>
          <div style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #2e7d32",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            margin: "0 auto"
          }}></div>
        </div>
        <p>Please wait while we process your payment.</p>
        {debugInfo && (
          <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "1rem" }}>
            {debugInfo}
          </p>
        )}
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <h2>Your Cart is Empty</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.8rem 1.5rem",
            background: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "1rem"
          }}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Checkout</h2>
      
      {/* Debug info */}
      {debugInfo && (
        <div style={{
          padding: "0.8rem",
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "5px",
          marginBottom: "1rem",
          fontSize: "0.9rem"
        }}>
          ℹ️ {debugInfo}
        </div>
      )}
      
      {/* Cart Summary */}
      <div style={{
        background: "#f9f9f9",
        borderRadius: "10px",
        padding: "1.5rem",
        marginBottom: "2rem"
      }}>
        <h3>Order Summary ({cart.length} items)</h3>
        {cart.map((item, index) => {
          const price = getSafePrice(item);
          const quantity = getSafeQuantity(item);
          const itemTotal = price * quantity;
          
          return (
            <div key={index} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.8rem 0",
              borderBottom: "1px solid #eee"
            }}>
              <div style={{ flex: 1 }}>
                <strong>{item.name || `Item ${index + 1}`}</strong>
                <div style={{ fontSize: "0.9rem", color: "#666", marginTop: "0.2rem" }}>
                  ID: {item.product_id || item.id} • Qty: {quantity} × ₹{price.toFixed(2)}
                </div>
              </div>
              <div style={{ fontWeight: "600" }}>₹ {itemTotal.toFixed(2)}</div>
            </div>
          );
        })}
        
        <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "2px solid #ddd" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Subtotal:</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span>Tax (18%):</span>
            <span>₹ {tax.toFixed(2)}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            color: "#2e7d32",
            fontSize: "1.2rem",
            marginTop: "1rem",
            paddingTop: "1rem",
            borderTop: "1px solid #ccc"
          }}>
            <span>Total:</span>
            <span>₹ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Billing Form */}
      <div style={{ marginBottom: "2rem" }}>
        <h3>Billing Information</h3>
        <form onSubmit={handleRazorpayPayment}>
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={billing.billing_name}
              onChange={(e) => setBilling({ ...billing, billing_name: e.target.value })}
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="Enter your 10-digit phone number"
              value={billing.billing_phone}
              onChange={(e) => setBilling({ ...billing, billing_phone: e.target.value })}
              disabled={loading}
              style={{ 
                width: "100%", 
                padding: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
          </div>
          
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Billing Address *
            </label>
            <textarea
              required
              placeholder="Enter complete address"
              value={billing.billing_address}
              onChange={(e) => setBilling({ ...billing, billing_address: e.target.value })}
              disabled={loading}
              rows={4}
              style={{ 
                width: "100%", 
                padding: "0.8rem",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            />
          </div>

          {/* Payment Methods */}
          <div style={{ marginTop: "2rem" }}>
            <h3>Select Payment Method</h3>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                marginBottom: "1rem",
                border: "none",
                borderRadius: "5px",
                background: "#2e7d32",
                color: "white",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              Pay with Razorpay
            </button>
            
            <button
              type="button"
              onClick={handleWalletPayment}
              disabled={loading}
              style={{
                width: "100%",
                padding: "1rem",
                marginBottom: "1rem",
                border: "2px solid #2e7d32",
                borderRadius: "5px",
                background: "white",
                color: "#2e7d32",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              Pay with Wallet
            </button>
          </div>
        </form>
      </div>

      {/* Debug Section */}
      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#f5f5f5",
        borderRadius: "8px",
        fontSize: "0.9rem"
      }}>
        <h4>Debug Tools</h4>
        <div style={{ marginBottom: "1rem" }}>
          <div>Cart Items: {cart.length}</div>
          <div>Product IDs: {cart.map(item => item.product_id || item.id).join(', ')}</div>
          <div>Total: ₹{total.toFixed(2)}</div>
        </div>
        
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            onClick={testBackendDirectly}
            style={{
              padding: "0.5rem 1rem",
              background: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Test Backend Directly
          </button>
          
          <button
            onClick={() => {
              console.log("🛒 Current cart:", cart);
              console.log("📝 Current billing:", billing);
              console.log("🔑 Token:", getToken()?.substring(0, 30) + "...");
            }}
            style={{
              padding: "0.5rem 1rem",
              background: "#f8f9fa",
              border: "1px solid #ddd",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Log Current State
          </button>
        </div>
        
        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "#666" }}>
          <p><strong>Status:</strong> The 500 error is a server-side issue. Frontend is working correctly.</p>
          <p><strong>Next Step:</strong> Contact backend developer with console error details.</p>
        </div>
      </div>
    </div>
  );
};

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default Checkout;