import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("🔑 Attempting login...");
      
      const res = await api.post("/accounts/login/", form);
      console.log("✅ Login response:", res.data);

      // Extract and clean tokens
      const { access, refresh, user } = res.data;
      
      if (!access) {
        throw new Error("No access token in response");
      }
      
      // Clean tokens (remove quotes, whitespace)
      const cleanAccess = access.replace(/^["'\s]+|["'\s]+$/g, '');
      const cleanRefresh = refresh ? refresh.replace(/^["'\s]+|["'\s]+$/g, '') : null;
      
      console.log("✅ Cleaned access token:", cleanAccess.substring(0, 30) + '...');
      
      // Store tokens in multiple locations for compatibility
      localStorage.setItem("access_token", cleanAccess);
      localStorage.setItem("access", cleanAccess);
      
      if (cleanRefresh) {
        localStorage.setItem("refresh_token", cleanRefresh);
      }
      
      // Also store in sessionStorage as backup
      sessionStorage.setItem("access_token", cleanAccess);
      sessionStorage.setItem("access", cleanAccess);
      
      if (user) {
        localStorage.setItem("user_info", JSON.stringify(user));
      }
      
      // Test the token immediately
      console.log("🧪 Testing token...");
      try {
        const testResponse = await fetch('https://missamma.centralindia.cloudapp.azure.com/api/payments/create-order/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cleanAccess}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cart_items: [{ product_id: 2, quantity: 1, price: 2000 }],
            billing_name: "Test",
            billing_address: "Test",
            billing_phone: "1234567890",
            total_amount: "2360.00"
          })
        });
        
        console.log("📡 Token test response:", testResponse.status);
        
        if (testResponse.status === 401) {
          console.error("❌ Token is invalid!");
          localStorage.clear();
          sessionStorage.clear();
          alert("Login failed: Token is invalid. Please try again.");
          return;
        }
      } catch (testError) {
        console.log("ℹ️ Token test failed (expected for non-existent products):", testError.message);
      }
      
      alert("Login successful!");
      
      // Redirect
      const from = new URLSearchParams(window.location.search).get("from") || "/";
      navigate(from);
      
    } catch (err) {
      console.error("❌ Login failed:", err);
      
      let errorMessage = "Login failed";
      if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      
      {/* Debug button */}
      <button 
        onClick={() => {
          console.log("🔍 Debug localStorage:");
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            console.log(`${key}: ${value?.substring(0, 50)}...`);
          }
          
          // Test current token
          const token = localStorage.getItem('access_token');
          if (token) {
            console.log("🔑 Current token:", token.substring(0, 50) + '...');
            const parts = token.split('.');
            console.log("🔑 Token parts:", parts.length);
          }
        }}
        style={{
          padding: "0.3rem 0.6rem",
          fontSize: "0.8rem",
          marginBottom: "1rem",
          background: "#f0f0f0",
          border: "1px solid #ddd",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        Debug Auth
      </button>
      
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: "500" }}>
            Username
          </label>
          <input
            required
            placeholder="Enter username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
            style={{ width: "100%" }}
          />
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: "500" }}>
            Password
          </label>
          <input
            required
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
            style={{ width: "100%" }}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
      <div style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        <p>
          <Link to="/forgot-password" style={{ color: "#2e7d32" }}>
            Forgot password?
          </Link>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          New here? <Link to="/register" style={{ color: "#2e7d32", fontWeight: "500" }}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;