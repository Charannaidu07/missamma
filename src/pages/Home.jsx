import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const featuredServices = [
    {
      id: 1,
      title: "Bridal Makeup",
      description: "Complete bridal makeup package with professional artists for your special day",
      price: "$299",
      image: "/images/bridal-makeup.jpg",
      category: "beauty",
      duration: "3-4 hours",
      alt: "Bridal Makeup Service"
    },
    {
      id: 2,
      title: "Gold Necklace Set",
      description: "Elegant gold necklace with matching earrings, perfect for weddings and special occasions",
      price: "$199",
      image: "/images/gold-necklace.jpg",
      category: "jewelry",
      material: "1 GramGold",
      alt: "Gold Necklace Set"
    },
    {
      id: 3,
      title: "Facial & Skincare",
      description: "Professional facial treatment for glowing, rejuvenated skin",
      price: "$89",
      image: "/images/facial-treatment.jpg",
      category: "beauty",
      duration: "1 hour",
      alt: "Facial Treatment"
    },
    {
      id: 4,
      title: "Ear Rings",
      description: "Sparkling studs that add elegance to any outfit",
      price: "$159",
      image: "/images/diamond-earrings.jpg",
      category: "jewelry",
      material: "1 Gram Gold",
      alt: "Ear Rings"
    }
  ];

  const styles = {
    container: {
      display: "grid",
      gap: "1.8rem",
      '@media (max-width: 768px)': {
        gap: "1rem",
      }
    },
    heroSection: {
      display: "grid",
      gridTemplateColumns: "minmax(0,2fr) minmax(0,1.4fr)",
      gap: "2rem",
      alignItems: "center",
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr",
        gap: "1.5rem",
      }
    },
    heroImage: {
      height: 250,
      borderRadius: 25,
      background: "radial-gradient(circle at top, rgba(255,204,230,0.9), rgba(129,199,132,0.7))",
      position: "relative",
      overflow: "hidden",
      '@media (max-width: 768px)': {
        height: 200,
        order: -1,
      }
    },
    ctaButtons: {
      display: "flex",
      gap: "0.8rem",
      marginTop: "1.2rem",
      '@media (max-width: 768px)': {
        flexDirection: "column",
        gap: "0.5rem",
      }
    },
    featuredGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "2rem",
      marginBottom: "3rem",
      '@media (max-width: 768px)': {
        gridTemplateColumns: "1fr",
        gap: "1rem",
      }
    },
    viewMoreButtons: {
      display: "flex", 
      gap: "1rem", 
      justifyContent: "center",
      flexWrap: "wrap",
      '@media (max-width: 768px)': {
        flexDirection: "column",
        alignItems: "center",
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section className="card" style={styles.heroSection}>
        <div>
          <span className="badge-soft">Premium Beauty & Bespoke Jewelry</span>
          <h1 style={{ 
            fontSize: "2.4rem", 
            marginTop: "1rem", 
            marginBottom: "0.6rem",
            '@media (max-width: 768px)': {
              fontSize: "2rem",
            },
            '@media (max-width: 480px)': {
              fontSize: "1.7rem",
            }
          }}>
            24/7 Online Booking & Jewelry Shopping
          </h1>
          <p style={{ 
            fontSize: "0.95rem", 
            opacity: 0.9,
            '@media (max-width: 480px)': {
              fontSize: "0.9rem",
            }
          }}>
            Book your beauty appointments in seconds and explore handpicked,
            bespoke jewelry from Missamma Beauty Parlour. No calls, no waiting — just
            smooth, stylish self-care.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/booking" style={{ flex: 1, '@media (max-width: 768px)': { width: '100%' } }}>
              <button className="btn-primary" style={{ width: '100%' }}>
                Book an Appointment
              </button>
            </Link>
            <Link to="/store" style={{ flex: 1, '@media (max-width: 768px)': { width: '100%' } }}>
              <button
                style={{
                  padding: "0.7rem 1.4rem",
                  borderRadius: 999,
                  border: "1px solid var(--primary-green)",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  width: '100%',
                  transition: "all 0.2s ease",
                  ':hover': {
                    background: "var(--primary-green)",
                    color: "white",
                  }
                }}
              >
                Shop Jewelry →
              </button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div style={styles.heroImage}>
          <div
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              background: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: "0.7rem 1rem",
              fontSize: "0.8rem",
              '@media (max-width: 480px)': {
                padding: "0.5rem 0.8rem",
                fontSize: "0.7rem",
                bottom: 10,
                left: 10,
              }
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
              '@media (max-width: 480px)': {
                padding: "0.5rem 0.8rem",
                fontSize: "0.7rem",
                top: 10,
                right: 10,
              }
            }}
          >
            💳 Secure Razorpay checkout
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="card">
        <div style={{ 
          textAlign: "center", 
          marginBottom: "2rem",
          '@media (max-width: 768px)': {
            marginBottom: "1.5rem",
          }
        }}>
          <h2 style={{ 
            fontSize: "2rem", 
            marginBottom: "0.5rem",
            '@media (max-width: 768px)': {
              fontSize: "1.7rem",
            },
            '@media (max-width: 480px)': {
              fontSize: "1.5rem",
            }
          }}>
            Featured Services & Products
          </h2>
          <p style={{ 
            fontSize: "1rem", 
            opacity: 0.8, 
            maxWidth: "600px", 
            margin: "0 auto",
            '@media (max-width: 768px)': {
              fontSize: "0.9rem",
              padding: "0 1rem",
            }
          }}>
            Discover our most popular beauty services and exquisite jewelry collections
          </p>
        </div>

        {/* Services Grid */}
        <div style={styles.featuredGrid}>
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
                  '@media (max-width: 768px)': {
                    height: "180px",
                  }
                }}
              >
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
              <div style={{ 
                padding: "1.5rem", 
                flex: 1, 
                display: "flex", 
                flexDirection: "column",
                '@media (max-width: 768px)': {
                  padding: "1rem",
                }
              }}>
                <h3 style={{ 
                  fontSize: "1.4rem", 
                  marginBottom: "0.8rem", 
                  color: "#333",
                  fontWeight: "600",
                  '@media (max-width: 768px)': {
                    fontSize: "1.2rem",
                  }
                }}>
                  {service.title}
                </h3>
                
                <p style={{ 
                  fontSize: "0.95rem", 
                  color: "#666", 
                  marginBottom: "1.2rem", 
                  flex: 1,
                  lineHeight: "1.5",
                  '@media (max-width: 768px)': {
                    fontSize: "0.9rem",
                  }
                }}>
                  {service.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "1rem",
                  '@media (max-width: 480px)': {
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                  }
                }}>
                  <span
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "var(--primary-green)",
                      '@media (max-width: 768px)': {
                        fontSize: "1.2rem",
                      }
                    }}
                  >
                    {service.price}
                  </span>
                  
                  {service.duration && (
                    <div style={{ 
                      fontSize: "0.85rem", 
                      color: "#666", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.3rem" 
                    }}>
                      ⏱️ {service.duration}
                    </div>
                  )}
                  {service.material && (
                    <div style={{ 
                      fontSize: "0.85rem", 
                      color: "#666", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.3rem" 
                    }}>
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
        <div style={styles.viewMoreButtons}>
          <Link to="/services" style={{ textDecoration: "none", width: '100%', maxWidth: '300px' }}>
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
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                '@media (max-width: 768px)': {
                  padding: "0.8rem 1.5rem",
                  fontSize: "0.9rem",
                }
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
          
          <Link to="/store" style={{ textDecoration: "none", width: '100%', maxWidth: '300px' }}>
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
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                '@media (max-width: 768px)': {
                  padding: "0.8rem 1.5rem",
                  fontSize: "0.9rem",
                }
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