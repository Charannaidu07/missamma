import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const navStyle = {
    backdropFilter: "blur(10px)",
    background: "rgba(255, 247, 251, 0.8)",
    borderBottom: "1px solid rgba(255, 204, 230, 0.7)",
    position: "sticky",
    top: 0,
    zIndex: 20,
  };

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/services", label: "Services" },
    { to: "/booking", label: "Book Appointment" },
    { to: "/store", label: "Jewelry Store" },
    { to: "/cart", label: "Cart" },
    { to: "/my-orders", label: "My Orders" },
  ];

  return (
    <header style={navStyle}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.8rem 6vw",
        }}
      >
        <Link to="/" style={{ textDecoration: "none", color: "var(--text-dark)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-pink), #ffffff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.2rem",
              }}
            >
              M
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>Missamma Beauty</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                Parlour • Jewelry • Glow
              </div>
            </div>
          </div>
        </Link>
        <div style={{ display: "flex", gap: "1.6rem", fontSize: "0.9rem" }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                textDecoration: "none",
                fontWeight: location.pathname === item.to ? 700 : 500,
                color:
                  location.pathname === item.to
                    ? "var(--primary-green)"
                    : "var(--text-dark)",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                borderRadius: 999,
                padding: "0.4rem 1rem",
                border: "1px solid var(--primary-green)",
                background: "white",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button
                style={{
                  borderRadius: 999,
                  padding: "0.4rem 1rem",
                  border: "1px solid var(--primary-green)",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
