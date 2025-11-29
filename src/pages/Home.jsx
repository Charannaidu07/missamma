import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Featured services data with images
  const featuredServices = [
    {
      id: 1,
      title: "Bridal Makeup",
      description: "Complete bridal makeup package with professional artists for your special day",
      price: "$299",
      image: "/images/bridal-makeup.jpg", // Replace with your actual image path
      category: "beauty",
      duration: "3-4 hours",
      alt: "Bridal Makeup Service"
    },
    {
      id: 2,
      title: "Gold Necklace Set",
      description: "Elegant gold necklace with matching earrings, perfect for weddings and special occasions",
      price: "$199",
      image: "/images/gold-necklace.jpg", // Replace with your actual image path
      category: "jewelry",
      material: "1 GramGold",
      alt: "Gold Necklace Set"
    },
    {
      id: 3,
      title: "Facial & Skincare",
      description: "Professional facial treatment for glowing, rejuvenated skin",
      price: "$89",
      image: "/images/facial-treatment.jpg", // Replace with your actual image path
      category: "beauty",
      duration: "1 hour",
      alt: "Facial Treatment"
    },
    {
      id: 4,
      title: "Ear Rings",
      description: "Sparkling studs that add elegance to any outfit",
      price: "$159",
      image: "/images/diamond-earrings.jpg", // Replace with your actual image path
      category: "jewelry",
      material: "1 Gram Gold",
      alt: "Ear Rings"
    }
  ];

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

      {/* Featured Services Section */}
      <section className="card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
            Featured Services & Products
          </h2>
          <p style={{ fontSize: "1rem", opacity: 0.8, maxWidth: "600px", margin: "0 auto" }}>
            Discover our most popular beauty services and exquisite jewelry collections
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {featuredServices.map((service) => (
            <div
              key={service.id}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "0",
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Service Image */}
              <div
                style={{
                  height: "200px",
                  width: "100%",
                  background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "4rem",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Replace this div with actual img tag when you have images */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: `linear-gradient(135deg, ${
                      service.category === "beauty" ? "#ffd6e7" : "#ffecb3"
                    } 0%, ${
                      service.category === "beauty" ? "#ffafcc" : "#ffd54f"
                    } 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3.5rem",
                  }}
                >
                  {service.category === "beauty" ? "💄" : "💎"}
                </div>
                
                {/* If you have actual images, use this instead: */}
                {/* <img 
                  src={service.image} 
                  alt={service.alt}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // Fallback to gradient background if image fails to load
                    e.target.style.display = "none";
                    e.target.parentNode.style.background = `linear-gradient(135deg, ${
                      service.category === "beauty" ? "#ffd6e7" : "#ffecb3"
                    } 0%, ${
                      service.category === "beauty" ? "#ffafcc" : "#ffd54f"
                    } 100%)`;
                  }}
                /> */}
                
                {/* Category Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    background: service.category === "beauty" ? "rgba(232, 67, 147, 0.9)" : "rgba(255, 193, 7, 0.9)",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {service.category === "beauty" ? "Beauty" : "Jewelry"}
                </div>
              </div>

              {/* Service Content */}
              <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ 
                  fontSize: "1.4rem", 
                  marginBottom: "0.8rem", 
                  color: "#333",
                  fontWeight: "600"
                }}>
                  {service.title}
                </h3>
                
                <p style={{ 
                  fontSize: "0.95rem", 
                  color: "#666", 
                  marginBottom: "1.2rem", 
                  flex: 1,
                  lineHeight: "1.5"
                }}>
                  {service.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "var(--primary-green)",
                    }}
                  >
                    {service.price}
                  </span>
                  
                  {service.duration && (
                    <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      ⏱️ {service.duration}
                    </div>
                  )}
                  {service.material && (
                    <div style={{ fontSize: "0.85rem", color: "#666", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      💎 {service.material}
                    </div>
                  )}
                </div>

                <Link 
                  to={service.category === "beauty" ? "/services" : "/store"}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "12px",
                      border: "none",
                      background: service.category === "beauty" ? 
                        "linear-gradient(135deg, #e84393, #fd79a8)" : 
                        "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: "0.9rem",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {service.category === "beauty" ? "View Service" : "View Product"}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View More Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "1rem", 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Link to="/services" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "1rem 2rem",
                borderRadius: "50px",
                border: "2px solid #e84393",
                background: "white",
                color: "#e84393",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#e84393";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#e84393";
                e.target.style.transform = "translateY(0)";
              }}
            >
              View All Beauty Services →
            </button>
          </Link>
          
          <Link to="/store" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: "1rem 2rem",
                borderRadius: "50px",
                border: "2px solid #FFD700",
                background: "white",
                color: "#FF8C00",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "linear-gradient(135deg, #FFD700, #FF8C00)";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "white";
                e.target.style.color = "#FF8C00";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Explore Jewelry Collection →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;