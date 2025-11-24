import React, { useEffect, useState } from "react";
import { api } from "../api";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/booking/services/").then((res) => setServices(res.data));
  }, []);

  return (
    <div className="card">
      <h2>Beauty Services</h2>
      <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
        Explore our curated service menu. Book your glow slot any time.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1rem",
          marginTop: "1.2rem",
        }}
      >
        {services.map((s) => (
          <div key={s.id} className="card" style={{ padding: "1rem" }}>
            <div style={{ fontWeight: 600 }}>{s.name}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "0.4rem" }}>
              {s.description}
            </div>
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
              }}
            >
              <span>₹ {s.price}</span>
              <span>{s.duration_minutes} mins</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
