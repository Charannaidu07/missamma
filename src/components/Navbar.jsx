import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    zIndex: 1000,
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
          padding: "0.8rem 1rem",
          maxWidth: "1200px",
          margin: "0 auto",
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
              <div style={{ 
                fontSize: "0.75rem", 
                opacity: 0.7,
                display: window.innerWidth < 480 ? "none" : "block"
              }}>
                Parlour • Jewelry • Glow
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div style={{ 
          gap: "1.6rem", 
          fontSize: "0.9rem",
          display: window.innerWidth < 768 ? "none" : "flex"  // Fixed: removed duplicate display property
        }}>
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
                padding: "0.5rem 0.8rem",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 204, 230, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
            color: "var(--text-dark)",
            display: window.innerWidth < 768 ? "block" : "none",
            padding: "0.5rem",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 204, 230, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
          }}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        {/* Desktop Login/Logout */}
        <div style={{ display: window.innerWidth < 768 ? "none" : "block" }}>
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
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--primary-green)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "var(--text-dark)";
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
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--primary-green)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "var(--text-dark)";
                }}
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "rgba(255, 247, 251, 0.95)",
          backdropFilter: "blur(10px)",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          borderBottom: "1px solid rgba(255, 204, 230, 0.7)",
          zIndex: 999,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              style={{
                textDecoration: "none",
                padding: "0.8rem 1rem",
                color: location.pathname === item.to 
                  ? "var(--primary-green)" 
                  : "var(--text-dark)",
                fontWeight: location.pathname === item.to ? 700 : 500,
                borderRadius: "8px",
                background: location.pathname === item.to 
                  ? "rgba(129, 199, 132, 0.1)" 
                  : "transparent",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.to) {
                  e.target.style.background = "rgba(255, 204, 230, 0.3)";
                  e.target.style.transform = "translateX(5px)";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.to) {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateX(0)";
                }
              }}
            >
              {item.label}
            </Link>
          ))}
          
          {/* Mobile Login/Logout */}
          <div style={{ 
            marginTop: "1rem", 
            paddingTop: "1rem", 
            borderTop: "1px solid #eee",
            display: "flex",
            justifyContent: "center"
          }}>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                style={{
                  borderRadius: 999,
                  padding: "0.6rem 1.5rem",
                  border: "1px solid var(--primary-green)",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  width: "100%",
                  maxWidth: "200px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "var(--primary-green)";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "white";
                  e.target.style.color = "var(--text-dark)";
                }}
              >
                Logout
              </button>
            ) : (
              <Link to="/login" style={{ width: "100%", maxWidth: "200px", textDecoration: "none" }}>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    borderRadius: 999,
                    padding: "0.6rem 1.5rem",
                    border: "1px solid var(--primary-green)",
                    background: "white",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    width: "100%",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--primary-green)";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "white";
                    e.target.style.color = "var(--text-dark)";
                  }}
                >
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;