import React, { useEffect, useState } from "react";
import { api } from "../api";

const Booking = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    service_id: "",
    date: "",
    start_time: "",
  });

  useEffect(() => {
    api.get("/booking/services/").then((res) => setServices(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/booking/appointments/", form);
      alert("Appointment requested! Status: " + res.data.status);
    } catch (err) {
      alert("Please login first and try again.");
    }
  };

  return (
    <div className="card">
      <h2>Book an Appointment</h2>
      <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
        Choose your service, date, and preferred time. We’ll confirm availability.
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.8rem", marginTop: "1rem", maxWidth: 400 }}
      >
        <select
          required
          value={form.service_id}
          onChange={(e) => setForm({ ...form, service_id: e.target.value })}
        >
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} (₹{s.price})
            </option>
          ))}
        </select>
        <input
          required
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <input
          required
          type="time"
          value={form.start_time}
          onChange={(e) => setForm({ ...form, start_time: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          Request Appointment
        </button>
      </form>
    </div>
  );
};

export default Booking;
