import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/accounts/register/", form);
      alert("Account created. Please login.");
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="card" style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Create Account</h2>
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
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
