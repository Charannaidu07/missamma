import React, { useEffect, useState } from "react";
import { api, checkAuth, getToken } from "../api";
import { useNavigate } from "react-router-dom";
import './Checkout.css';

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

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [billing, setBilling] = useState({
    billing_name: "",
    billing_address: "",
    billing_phone: "",
    billing_email: ""
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [debugInfo, setDebugInfo] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkAuth()) {
      alert("Please login to checkout");
      navigate("/login?from=/checkout");
      return;
    }
    
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
    
    const userInfo = localStorage.getItem("user_info");
    const userEmail = localStorage.getItem("user_email");
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setBilling(prev => ({
          ...prev,
          billing_name: user.name || user.username || "",
          billing_phone: user.phone || user.phone_number || "",
          billing_email: userEmail || user.email || ""
        }));
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, [navigate]);

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (activeStep === 2) {
      if (!billing.billing_name?.trim()) {
        newErrors.billing_name = "Name is required";
      }
      
      if (!billing.billing_email?.trim()) {
        newErrors.billing_email = "Email is required";
      } else if (!isValidEmail(billing.billing_email)) {
        newErrors.billing_email = "Please enter a valid email";
      }
      
      if (!billing.billing_phone?.trim()) {
        newErrors.billing_phone = "Phone number is required";
      } else if (!isValidPhone(billing.billing_phone)) {
        newErrors.billing_phone = "Please enter a valid 10-digit phone number";
      }
      
      if (!billing.billing_address?.trim()) {
        newErrors.billing_address = "Address is required";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (activeStep === 1 && cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    
    if (activeStep === 2 && !validateCurrentStep()) {
      return;
    }
    
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (field, value) => {
    setBilling(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setLoading(true);

    try {
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
        billing_email: billing.billing_email.trim(),
        payment_method: "razorpay",
        total_amount: total.toFixed(2),
        notes: `Order from ${billing.billing_name}`
      };

      console.log("📦 Sending payload:", JSON.stringify(payload, null, 2));
      setDebugInfo("Creating order...");

      const res = await api.post("/payments/create-order/", payload);
      console.log("✅ Create-order response:", res.data);

      if (!res.data.razorpay_order_id) {
        throw new Error("No razorpay_order_id in response");
      }

      const { order_id, razorpay_order_id, amount, currency, razorpay_key } = res.data;
      setDebugInfo(`Order created: ${order_id}`);

      const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      
      if (!scriptLoaded) {
        alert("Failed to load Razorpay. Please check your internet connection.");
        setLoading(false);
        return;
      }

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
          email: billing.billing_email,
        },
        theme: {
          color: "#FF6B8B",
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
        errorMessage = "Server Error (500)\n\nThe backend server encountered an error.\nPlease contact the administrator.\n\nError details in console.";
        
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
    if (!validateCurrentStep()) return;
    
    setLoading(true);

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
        billing_email: billing.billing_email.trim(),
        payment_method: "wallet",
        total_amount: total.toFixed(2)
      });

      console.log("✅ Wallet payment response:", res.data);

      if (res.data.status === "success") {
        alert(`Wallet payment successful! Invoice: ${res.data.invoice_no}`);
        localStorage.removeItem("cart");
        
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

  const subtotal = cart.reduce((sum, item) => {
    const price = getSafePrice(item);
    const quantity = getSafeQuantity(item);
    return sum + (price * quantity);
  }, 0);
  
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div className="loading-text">
            <h3>Processing {paymentMethod === "razorpay" ? "Razorpay" : "Wallet"} Payment</h3>
            <p>Please wait while we process your payment...</p>
            {debugInfo && <p className="debug-info">{debugInfo}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🌸</div>
          <h2>Your Cart is Beautifully Empty</h2>
          <p>Discover our amazing beauty products and services</p>
          <button className="continue-shopping-btn" onClick={() => navigate("/")}>
            Explore Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <div className="header-content">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Complete Your Beauty Journey</h1>
          <div className="cart-indicator">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{cart.length} items</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="checkout-progress">
        <div className={`progress-step ${activeStep >= 1 ? 'active' : ''}`}>
          <div className="step-circle">
            <div className="step-number">1</div>
          </div>
          <div className="step-label">Review Cart</div>
        </div>
        <div className={`progress-step ${activeStep >= 2 ? 'active' : ''}`}>
          <div className="step-circle">
            <div className="step-number">2</div>
          </div>
          <div className="step-label">Your Details</div>
        </div>
        <div className={`progress-step ${activeStep >= 3 ? 'active' : ''}`}>
          <div className="step-circle">
            <div className="step-number">3</div>
          </div>
          <div className="step-label">Payment</div>
        </div>
      </div>

      <div className="checkout-main">
        {/* Left Column - Forms */}
        <div className="checkout-form-section">
          {activeStep === 1 && (
            <div className="step-content cart-step">
              <h2 className="step-title">
                <span className="step-icon">🛍️</span>
                Your Shopping Cart
              </h2>
              <div className="cart-items-list">
                {cart.map((item, index) => {
                  const price = getSafePrice(item);
                  const quantity = getSafeQuantity(item);
                  const itemTotal = price * quantity;
                  
                  return (
                    <div key={index} className="cart-item-card">
                      <div className="cart-item-image">
                        {item.image ? (
                          <img src={item.image} alt={item.name} />
                        ) : (
                          <div className="item-placeholder">💄</div>
                        )}
                      </div>
                      <div className="cart-item-info">
                        <h3>{item.name || `Beauty Service ${index + 1}`}</h3>
                        <div className="item-meta">
                          <span className="item-id">#{item.product_id || item.id}</span>
                          <span className="item-qty">Qty: {quantity}</span>
                        </div>
                        <div className="item-price-display">
                          <span className="unit-price">₹{price.toFixed(2)} each</span>
                          <span className="item-total">₹{itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="step-content details-step">
              <h2 className="step-title">
                <span className="step-icon">👤</span>
                Your Information
              </h2>
              <form className="billing-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={billing.billing_name}
                      onChange={(e) => handleInputChange('billing_name', e.target.value)}
                      className={errors.billing_name ? 'error' : ''}
                    />
                    {errors.billing_name && <span className="error-message">{errors.billing_name}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={billing.billing_email}
                      onChange={(e) => handleInputChange('billing_email', e.target.value)}
                      className={errors.billing_email ? 'error' : ''}
                    />
                    {errors.billing_email && <span className="error-message">{errors.billing_email}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={billing.billing_phone}
                    onChange={(e) => handleInputChange('billing_phone', e.target.value)}
                    className={errors.billing_phone ? 'error' : ''}
                  />
                  {errors.billing_phone && <span className="error-message">{errors.billing_phone}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="address">Shipping Address *</label>
                  <textarea
                    id="address"
                    placeholder="Enter your complete address for delivery"
                    value={billing.billing_address}
                    onChange={(e) => handleInputChange('billing_address', e.target.value)}
                    rows={3}
                    className={errors.billing_address ? 'error' : ''}
                  />
                  {errors.billing_address && <span className="error-message">{errors.billing_address}</span>}
                </div>
              </form>
            </div>
          )}

          {activeStep === 3 && (
            <div className="step-content payment-step">
              <h2 className="step-title">
                <span className="step-icon">💳</span>
                Payment Method
              </h2>
              <div className="payment-options">
                <div 
                  className={`payment-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="payment-card-header">
                    <div className="payment-icon">💳</div>
                    <div className="payment-title">
                      <h3>Card Payment</h3>
                      <p>Pay with credit/debit card or UPI</p>
                    </div>
                    <div className="payment-radio">
                      <div className={`radio-circle ${paymentMethod === 'razorpay' ? 'checked' : ''}`}></div>
                    </div>
                  </div>
                  <div className="payment-card-logos">
                    <span>Visa</span>
                    <span>Mastercard</span>
                    <span>Rupay</span>
                    <span>UPI</span>
                  </div>
                </div>
                
                <div 
                  className={`payment-card ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  <div className="payment-card-header">
                    <div className="payment-icon">💰</div>
                    <div className="payment-title">
                      <h3>Missamma Wallet</h3>
                      <p>Use your beauty wallet balance</p>
                    </div>
                    <div className="payment-radio">
                      <div className={`radio-circle ${paymentMethod === 'wallet' ? 'checked' : ''}`}></div>
                    </div>
                  </div>
                  <div className="wallet-info">
                    <div className="wallet-balance">
                      <span>Available Balance:</span>
                      <span className="balance-amount">₹0.00</span>
                    </div>
                    <button className="add-funds-btn">Add Funds</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="step-navigation">
            {activeStep > 1 && (
              <button className="nav-btn prev-btn" onClick={handleBack}>
                ← Previous Step
              </button>
            )}
            
            {activeStep < 3 ? (
              <button className="nav-btn next-btn" onClick={handleContinue}>
                Continue to {activeStep === 1 ? 'Details' : 'Payment'} →
              </button>
            ) : (
              <form onSubmit={paymentMethod === 'razorpay' ? handleRazorpayPayment : handleWalletPayment}>
                <button type="submit" className="nav-btn pay-btn">
                  Complete Payment ₹{total.toFixed(2)}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="order-summary-section">
          <div className="order-summary-card">
            <div className="summary-header">
              <h2>Order Summary</h2>
              <div className="order-id">#ORDER-{Date.now().toString().slice(-6)}</div>
            </div>
            
            <div className="order-items-summary">
              {cart.slice(0, 3).map((item, index) => {
                const price = getSafePrice(item);
                const quantity = getSafeQuantity(item);
                const itemTotal = price * quantity;
                
                return (
                  <div key={index} className="summary-item">
                    <div className="item-summary">
                      <span className="item-name">{item.name?.substring(0, 20) || `Item ${index + 1}`}</span>
                      <span className="item-qty-summary">×{quantity}</span>
                    </div>
                    <div className="item-price-summary">₹{itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
              {cart.length > 3 && (
                <div className="more-items-summary">
                  +{cart.length - 3} more beauty items
                </div>
              )}
            </div>
            
            <div className="order-totals-summary">
              <div className="total-line">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="total-line">
                <span>GST (18%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="total-line shipping-line">
                <span>Delivery</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-line grand-total-line">
                <span>Total Amount</span>
                <span className="grand-total">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="security-badge">
              <div className="security-icon">🔒</div>
              <div className="security-text">
                <strong>100% Secure Payment</strong>
                <p>Your payment information is encrypted</p>
              </div>
            </div>
            
            <div className="support-section">
              <h4>Need Assistance?</h4>
              <p className="support-contact">
                <span className="support-icon">📞</span>
                <strong>+91 88979 78545</strong>
              </p>
              <p className="support-email">
                <span className="support-icon">✉️</span>
                missammabeautyparlour@gmail.com
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Checkout;