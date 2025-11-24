import React, { useState } from "react";
import { api } from "../api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/accounts/login/", form);
      console.log("Login response:", res.data);

      // SimpleJWT: { access, refresh }
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;

      alert("Logged in");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.8rem", marginTop: "1rem" }}
      >
        <input
          required
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>
      <p style={{ fontSize: "0.8rem", marginTop: "0.8rem" }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
