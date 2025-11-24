import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ display: "grid", gap: "1.8rem" }}>
      <section
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0,2fr) minmax(0,1.4fr)",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <div>
          <span className="badge-soft">Premium Beauty & Bespoke Jewelry</span>
          <h1 style={{ fontSize: "2.4rem", marginTop: "1rem", marginBottom: "0.6rem" }}>
            24/7 Online Booking & Jewelry Shopping
          </h1>
          <p style={{ fontSize: "0.95rem", opacity: 0.9 }}>
            Book your beauty appointments in seconds and explore handpicked,
            bespoke jewelry from Missamma Beauty Parlour. No calls, no waiting — just
            smooth, stylish self-care.
          </p>
          <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.2rem" }}>
            <Link to="/booking">
              <button className="btn-primary">Book an Appointment</button>
            </Link>
            <Link to="/store">
              <button
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: 999,
                  border: "1px solid var(--primary-green)",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Shop Jewelry →
              </button>
            </Link>
          </div>
        </div>
        <div
          style={{
            height: 250,
            borderRadius: 25,
            background:
              "radial-gradient(circle at top, rgba(255,204,230,0.9), rgba(129,199,132,0.7))",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: "0.7rem 1rem",
              fontSize: "0.8rem",
            }}
          >
            ✅ Live slots, instant confirmation
          </div>
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: "0.7rem 1rem",
              fontSize: "0.8rem",
            }}
          >
            💳 Secure Razorpay checkout
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
