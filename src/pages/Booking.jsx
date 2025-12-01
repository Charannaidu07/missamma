import React, { useEffect, useState } from "react";
import { api } from "../api";
// Add this at the top of your Booking component

const Booking = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    service_id: "",
    date: "",
    start_time: "",
    name: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    api.get("/booking/services/").then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/booking/appointments/", form);
      alert("Appointment requested! Status: " + res.data.status);
      // Reset form
      setForm({
        service_id: "",
        date: "",
        start_time: "",
        name: "",
        phone: "",
        email: ""
      });
    } catch (err) {
      alert("Please login first and try again.");
    }
  };

  // Get tomorrow's date for min date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div style={{ display: "grid", gap: "1.8rem" }}>
      <section
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
          gap: "3rem",
          alignItems: "center",
          minHeight: "500px"
        }}
      >
        {/* Booking Form Section */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge-soft" style={{ 
              background: "linear-gradient(135deg, #e84393, #fd79a8)",
              color: "white",
              padding: "0.4rem 1rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "600"
            }}>
              Quick & Easy Booking
            </span>
            <h1 style={{ fontSize: "2.2rem", marginTop: "1rem", marginBottom: "0.6rem", color: "#2c3e50" }}>
              Book Your Beauty Session
            </h1>
            <p style={{ fontSize: "1rem", opacity: 0.8, color: "#666", lineHeight: "1.6" }}>
              Choose your service, pick your preferred date and time, and we'll get you glowing in no time. 
              Instant confirmation and flexible scheduling available.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ 
              display: "grid", 
              gap: "1.2rem",
              marginTop: "1.5rem"
            }}
          >
            {/* Personal Information */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#e84393";
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                  Phone Number *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Your phone number"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#e84393";
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your.email@example.com"
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e84393";
                  e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Service Selection */}
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                Select Service *
              </label>
              <select
                required
                value={form.service_id}
                onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.8rem 1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  fontSize: "0.95rem",
                  background: "white",
                  transition: "all 0.3s ease",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23333' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "0.65rem"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e84393";
                  e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e0e0e0";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Choose a beauty service...</option>
                {loading ? (
                  <option disabled>Loading services...</option>
                ) : (
                  services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} - ₹{s.price} ({s.duration_minutes} mins)
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date and Time */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                  Preferred Date *
                </label>
                <input
                  required
                  type="date"
                  min={getTomorrowDate()}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#e84393";
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#2c3e50", fontSize: "0.9rem" }}>
                  Preferred Time *
                </label>
                <input
                  required
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#e84393";
                    e.target.style.boxShadow = "0 0 0 3px rgba(232, 67, 147, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e0e0e0";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              style={{
                padding: "1rem 2rem",
                borderRadius: "50px",
                border: "none",
                background: "linear-gradient(135deg, #e84393, #fd79a8)",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                marginTop: "0.5rem"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(232, 67, 147, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              📅 Book Appointment Now
            </button>
          </form>

          {/* Additional Info */}
          <div style={{ 
            marginTop: "1.5rem", 
            padding: "1rem", 
            background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
            borderRadius: "12px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>✅</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>Instant confirmation</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "1.2rem" }}>🔄</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "500" }}>Free rescheduling</span>
            </div>
          </div>
        </div>

        {/* AI Generated Image Section */}
        <div
          style={{
            height: "100%",
            minHeight: "500px",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white"
          }}
        >
          {/* Beauty-themed decorative elements */}
          <div style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            fontSize: "4rem",
            opacity: 0.1,
            transform: "rotate(-15deg)"
          }}>
            💄
          </div>
          <div style={{
            position: "absolute",
            bottom: "15%",
            right: "10%",
            fontSize: "3rem",
            opacity: 0.1,
            transform: "rotate(15deg)"
          }}>
            ✨
          </div>
          <div style={{
            position: "absolute",
            top: "40%",
            right: "15%",
            fontSize: "2.5rem",
            opacity: 0.1
          }}>
            💎
          </div>
          
          {/* Main content */}
          <div style={{ 
            textAlign: "center", 
            zIndex: 2,
            padding: "2rem",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              🌸
            </div>
            <h3 style={{ 
              fontSize: "1.8rem", 
              marginBottom: "1rem",
              fontWeight: "700"
            }}>
              Your Beauty Journey Starts Here
            </h3>
            <p style={{ 
              fontSize: "1rem", 
              opacity: 0.9,
              marginBottom: "1.5rem",
              lineHeight: "1.5"
            }}>
              Experience premium beauty services in our luxurious parlour. 
              Professional artists, hygienic environment, and stunning results guaranteed.
            </p>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.8rem 1.5rem",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "25px",
              fontSize: "0.9rem",
              fontWeight: "600",
              backdropFilter: "blur(10px)"
            }}>
              ⭐ 4.9/5 Rating from 500+ Clients
            </div>
          </div>

          {/* Floating elements */}
          <div style={{
            position: "absolute",
            bottom: "30%",
            left: "20%",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "0.7rem 1rem",
            borderRadius: "15px",
            fontSize: "0.8rem",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            Professional Artists
          </div>
          <div style={{
            position: "absolute",
            top: "25%",
            right: "25%",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "0.7rem 1rem",
            borderRadius: "15px",
            fontSize: "0.8rem",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}>
            Premium Products
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;