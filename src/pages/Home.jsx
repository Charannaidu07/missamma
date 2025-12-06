import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Import images from assets folder
import bridalMakeupImg from "../assets/bridal-makeup.png";
import goldNecklaceImg from "../assets/gold-necklace.jpg";
import facialTreatmentImg from "../assets/facial-treatment.jpg";
import EarringsImg from "../assets/ear-rings.jpg";
import workstationImg from "../assets/work-station.jpg";
import receptionImg from "../assets/reception.png";
import jewelleryGalleryImg from "../assets/jewellery-gallery.jpg";
import necklaceSetImg from "../assets/necklace-set.jpg";
import realearringImg from "../assets/real-Ear-rings.png";
import hairtransformationImg from "../assets/hair-transformation.jpeg";
import makeuptransformationImg from "../assets/makeup-transformation.png";

const Home = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to get responsive values
  const getResponsiveValue = (values) => {
    if (windowWidth < 480) return values.xs || values.sm || values.md || values.lg;
    if (windowWidth < 768) return values.sm || values.md || values.lg;
    if (windowWidth < 1024) return values.md || values.lg;
    return values.lg;
  };

  const featuredServices = [
    {
      id: 1,
      title: "Bridal Makeup",
      description: "Complete bridal makeup package with professional artists for your special day",
      price: "Starting From ₹2999",
      image: bridalMakeupImg,
      category: "beauty",
      duration: "3-4 hours",
      alt: "Bridal Makeup Service"
    },
    {
      id: 2,
      title: "Gold Necklace Set",
      description: "Elegant gold necklace with matching earrings, perfect for weddings and special occasions",
      price: "Starting From ₹599",
      image: goldNecklaceImg, 
      category: "jewelry",
      alt: "Gold Necklace Set"
    },
    {
      id: 3,
      title: "Facial & Skincare",
      description: "Professional facial treatment for glowing, rejuvenated skin",
      price: "Starting From ₹399",
      image: facialTreatmentImg,
      category: "beauty",
      duration: "1 hour",
      alt: "Facial Treatment"
    },
    {
      id: 4,
      title: "Ear Rings",
      description: "Sparkling studs that add elegance to any outfit",
      price: "Starting From ₹149",
      image: EarringsImg,
      category: "jewelry",
      alt: "Ear Rings"
    }
  ];

  const interiorImages = [
    {
      id: 1,
      title: "Modern Workstations",
      description: "State-of-the-art beauty stations equipped with premium tools and equipment",
      area: "Beauty Station",
      image: workstationImg
    },
    {
      id: 2,
      title: "Bridal Suite",
      description: "Specialized area for bridal makeup and pre-wedding services",
      area: "Bridal Room",
      image: null
    },
    {
      id: 3,
      title: "Jewelry Gallery",
      description: "Elegant display of our exclusive jewelry collections",
      area: "Jewelry Section",
      image: jewelleryGalleryImg 
    },
    {
      id: 4,
      title: "Reception",
      description: "Comfortable waiting area with premium amenities for our clients",
      area: "Reception",
      image: receptionImg
    }
  ];

  const bestWorks = [
    {
      id: 1,
      title: "Bridal Makeup Transformation",
      description: "Complete bridal look with traditional jewelry",
      category: "Bridal",
      beforeAfter: true,
      image: makeuptransformationImg
    },
    {
      id: 2,
      title: "Evening Party Makeup",
      description: "Glamorous look for special occasions",
      category: "Party Makeup",
      beforeAfter: false,
      image: null
    },
    {
      id: 3,
      title: "Gold Necklace Set",
      description: "Traditional gold jewelry for weddings",
      category: "Jewelry",
      beforeAfter: false,
      image: necklaceSetImg
    },
    {
      id: 4,
      title: "Facial Glow Up",
      description: "Skin transformation with premium facial",
      category: "Skincare",
      beforeAfter: true,
      image: null
    },
    {
      id: 5,
      title: "Hair Styling Makeover",
      description: "Professional hair styling for events",
      category: "Hair",
      beforeAfter: true,
      image: hairtransformationImg
    },
    {
      id: 6,
      title: "Ear Rings Collection",
      description: "Beautiful ear jewelry designs",
      category: "Jewelry",
      beforeAfter: false,
      image: realearringImg
    }
  ];

  // Helper function to render images with fallback
  const renderImage = (imageSrc, alt, category, isBeforeAfter = false) => {
    if (imageSrc) {
      return (
        <img 
          src={imageSrc} 
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            parent.innerHTML = renderPlaceholder(category, isBeforeAfter);
          }}
        />
      );
    }
    return renderPlaceholder(category, isBeforeAfter);
  };

  const renderPlaceholder = (category, isBeforeAfter = false) => {
    const placeholderSize = getResponsiveValue({
      xs: "2rem",
      sm: "2.5rem",
      md: "3rem",
      lg: "3.5rem"
    });

    const placeholderStyle = {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: placeholderSize,
      color: "#333",
      flexDirection: "column",
      gap: "0.5rem",
    };

    if (category === "beauty" || category === "Bridal" || category === "Party Makeup" || category === "Skincare" || category === "Hair") {
      if (isBeforeAfter) {
        return (
          <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ffd6e7 0%, #ffafcc 100%)"}}>
            <div style={{ fontSize: "0.9rem" }}>Before</div>
            <div style={{ fontSize: "1.2rem" }}>→</div>
            <div style={{ fontSize: "0.9rem" }}>After</div>
          </div>
        );
      }
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ffd6e7 0%, #ffafcc 100%)"}}>
          💄
        </div>
      );
    } else if (category === "jewelry" || category === "Jewelry") {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ffecb3 0%, #ffd54f 100%)"}}>
          💎
        </div>
      );
    } else {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"}}>
          ✨
        </div>
      );
    }
  };

  // Get responsive image height
  const getImageHeight = () => {
    if (windowWidth < 480) return "220px";
    if (windowWidth < 768) return "250px";
    if (windowWidth < 1024) return "280px";
    return "300px";
  };

  // Get responsive grid columns
  const getGridColumns = () => {
    if (windowWidth < 768) return "1fr";
    if (windowWidth < 1024) return "repeat(2, 1fr)";
    return "repeat(4, 1fr)";
  };

  const getInteriorGridColumns = () => {
    if (windowWidth < 768) return "1fr";
    if (windowWidth < 1024) return "repeat(2, 1fr)";
    return "repeat(4, 1fr)";
  };

  const getBestWorksGridColumns = () => {
    if (windowWidth < 768) return "1fr";
    if (windowWidth < 1024) return "repeat(2, 1fr)";
    return "repeat(3, 1fr)";
  };

  return (
    <div style={{ display: "grid", gap: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" }) }}>
      {/* Hero Section */}
      <section
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: windowWidth < 768 ? "1fr" : "minmax(0,2fr) minmax(0,1.4fr)",
          gap: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" }),
          alignItems: "center",
          padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }),
        }}
      >
        <div>
          <span className="badge-soft">Premium Beauty & Bespoke Jewelry</span>
          <h1 style={{ 
            fontSize: getResponsiveValue({ xs: "1.5rem", sm: "1.8rem", md: "2rem", lg: "2.4rem" }), 
            marginTop: "1rem", 
            marginBottom: "0.6rem",
            lineHeight: 1.2
          }}>
            24/7 Online Booking & Jewelry Shopping
          </h1>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" }), 
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Book your beauty appointments in seconds and explore handpicked,
            bespoke jewelry from Missamma Beauty Parlour. No calls, no waiting — just
            smooth, stylish self-care.
          </p>
          <div style={{ 
            display: "flex", 
            gap: "0.8rem", 
            marginTop: "1.2rem",
            flexDirection: windowWidth < 768 ? "column" : "row"
          }}>
            <Link to="/booking" style={{ flex: windowWidth < 768 ? "none" : 1, width: windowWidth < 768 ? "100%" : "auto" }}>
              <button 
                className="btn-primary" 
                style={{ 
                  width: windowWidth < 768 ? "100%" : "auto",
                  padding: getResponsiveValue({ xs: "0.7rem 1rem", sm: "0.8rem 1.2rem", md: "0.9rem 1.4rem", lg: "1rem 1.5rem" }),
                  fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" })
                }}
              >
                Book an Appointment
              </button>
            </Link>
            <Link to="/store" style={{ flex: windowWidth < 768 ? "none" : 1, width: windowWidth < 768 ? "100%" : "auto" }}>
              <button
                style={{
                  padding: getResponsiveValue({ xs: "0.7rem 1rem", sm: "0.8rem 1.2rem", md: "0.9rem 1.4rem", lg: "1rem 1.5rem" }),
                  borderRadius: 999,
                  border: "1px solid var(--primary-green)",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  width: windowWidth < 768 ? "100%" : "auto",
                  transition: "all 0.2s ease",
                  fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" })
                }}
                onMouseEnter={(e) => {
                  if (windowWidth > 768) {
                    e.target.style.background = "var(--primary-green)";
                    e.target.style.color = "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (windowWidth > 768) {
                    e.target.style.background = "white";
                    e.target.style.color = "var(--text-dark)";
                  }
                }}
              >
                Shop Jewelry →
              </button>
            </Link>
          </div>
        </div>
        
        {/* Hero Image */}
        <div style={{
          height: getResponsiveValue({ xs: "180px", sm: "200px", md: "230px", lg: "250px" }),
          borderRadius: 25,
          background: "radial-gradient(circle at top, rgba(255,204,230,0.9), rgba(129,199,132,0.7))",
          position: "relative",
          overflow: "hidden",
          order: windowWidth < 768 ? -1 : "unset"
        }}>
          <div
            style={{
              position: "absolute",
              bottom: getResponsiveValue({ xs: "8px", sm: "12px", md: "14px", lg: "16px" }),
              left: getResponsiveValue({ xs: "8px", sm: "12px", md: "14px", lg: "16px" }),
              background: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: getResponsiveValue({ xs: "0.4rem 0.6rem", sm: "0.5rem 0.8rem", md: "0.6rem 1rem", lg: "0.7rem 1rem" }),
              fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
            }}
          >
            ✅ Live slots, instant confirmation
          </div>
          <div
            style={{
              position: "absolute",
              top: getResponsiveValue({ xs: "8px", sm: "12px", md: "14px", lg: "16px" }),
              right: getResponsiveValue({ xs: "8px", sm: "12px", md: "14px", lg: "16px" }),
              background: "rgba(255,255,255,0.9)",
              borderRadius: 20,
              padding: getResponsiveValue({ xs: "0.4rem 0.6rem", sm: "0.5rem 0.8rem", md: "0.6rem 1rem", lg: "0.7rem 1rem" }),
              fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
            }}
          >
            💳 Secure Razorpay checkout
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="card" style={{ padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }) }}>
        <div style={{ 
          textAlign: "center", 
          marginBottom: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" })
        }}>
          <h2 style={{ 
            fontSize: getResponsiveValue({ xs: "1.4rem", sm: "1.6rem", md: "1.8rem", lg: "2rem" }), 
            marginBottom: "0.5rem"
          }}>
            Featured Services & Products
          </h2>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" }), 
            opacity: 0.8, 
            maxWidth: "600px", 
            margin: "0 auto",
            padding: windowWidth < 768 ? "0 1rem" : "0"
          }}>
            Discover our most popular beauty services and exquisite jewelry collections
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getGridColumns(),
            gap: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }),
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
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {/* Service Image */}
              <div
                style={{
                  height: getImageHeight(),
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: '#f0f0f0',
                }}
              >
                {renderImage(service.image, service.alt, service.category)}
                
                {/* Category Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    padding: getResponsiveValue({ xs: "0.3rem 0.6rem", sm: "0.35rem 0.7rem", md: "0.4rem 0.8rem", lg: "0.4rem 0.8rem" }),
                    borderRadius: "20px",
                    background: service.category === "beauty" ? "rgba(232, 67, 147, 0.9)" : "rgba(255, 193, 7, 0.9)",
                    color: "white",
                    fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                    zIndex: 2,
                  }}
                >
                  {service.category === "beauty" ? "Beauty" : "Jewelry"}
                </div>
              </div>

              {/* Service Content */}
              <div style={{ 
                padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "1.8rem" }), 
                flex: 1, 
                display: "flex", 
                flexDirection: "column" 
              }}>
                <h3 style={{ 
                  fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  marginBottom: "0.8rem", 
                  color: "#333",
                  fontWeight: "600",
                  lineHeight: 1.3
                }}>
                  {service.title}
                </h3>
                
                <p style={{ 
                  fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" }), 
                  color: "#666", 
                  marginBottom: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  flex: 1,
                  lineHeight: 1.6
                }}>
                  {service.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: windowWidth < 480 ? "flex-start" : "center", // FIXED: Removed duplicate alignItems
                  marginBottom: getResponsiveValue({ xs: "0.8rem", sm: "1rem", md: "1.1rem", lg: "1.2rem" }),
                  flexDirection: windowWidth < 480 ? "column" : "row",
                  gap: windowWidth < 480 ? "0.5rem" : "0"
                }}>
                  <span
                    style={{
                      fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.4rem" }),
                      fontWeight: "bold",
                      color: "var(--primary-green)",
                    }}
                  >
                    {service.price}
                  </span>
                  
                  {service.duration && (
                    <div style={{ 
                      fontSize: getResponsiveValue({ xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" }), 
                      color: "#666", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.4rem" 
                    }}>
                      ⏱️ {service.duration}
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
                      padding: getResponsiveValue({ xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" }),
                      borderRadius: "12px",
                      border: "none",
                      background: service.category === "beauty" ? 
                        "linear-gradient(135deg, #e84393, #fd79a8)" : 
                        "linear-gradient(135deg, #FFD700, #FFA500)",
                      color: "white",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" }),
                    }}
                    onMouseEnter={(e) => {
                      if (windowWidth > 768) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (windowWidth > 768) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }
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
          gap: getResponsiveValue({ xs: "0.8rem", sm: "0.9rem", md: "1rem", lg: "1rem" }), 
          justifyContent: "center",
          flexWrap: "wrap",
          flexDirection: windowWidth < 768 ? "column" : "row",
          alignItems: windowWidth < 768 ? "center" : "stretch"
        }}>
          <Link to="/services" style={{ textDecoration: "none", width: windowWidth < 768 ? "100%" : "auto", maxWidth: "300px" }}>
            <button
              style={{
                padding: getResponsiveValue({ xs: "0.8rem 1.5rem", sm: "0.9rem 1.8rem", md: "1rem 2rem", lg: "1.2rem 2.5rem" }),
                borderRadius: "50px",
                border: "2px solid #e84393",
                background: "white",
                color: "#e84393",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (windowWidth > 768) {
                  e.target.style.background = "#e84393";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.target.style.background = "white";
                  e.target.style.color = "#e84393";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              View All Beauty Services →
            </button>
          </Link>
          
          <Link to="/store" style={{ textDecoration: "none", width: windowWidth < 768 ? "100%" : "auto", maxWidth: "300px" }}>
            <button
              style={{
                padding: getResponsiveValue({ xs: "0.8rem 1.5rem", sm: "0.9rem 1.8rem", md: "1rem 2rem", lg: "1.2rem 2.5rem" }),
                borderRadius: "50px",
                border: "2px solid #FFD700",
                background: "white",
                color: "#FF8C00",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (windowWidth > 768) {
                  e.target.style.background = "linear-gradient(135deg, #FFD700, #FF8C00)";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.target.style.background = "white";
                  e.target.style.color = "#FF8C00";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              Explore Jewelry Collection →
            </button>
          </Link>
        </div>
      </section>

      {/* Beauty Parlour Interior Section */}
      <section className="card" style={{ padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }) }}>
        <div style={{ textAlign: "center", marginBottom: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" }) }}>
          <h2 style={{ 
            fontSize: getResponsiveValue({ xs: "1.4rem", sm: "1.6rem", md: "1.8rem", lg: "2rem" }), 
            marginBottom: "0.5rem" 
          }}>
            Our Beautiful Parlour Interior
          </h2>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" }), 
            opacity: 0.8, 
            maxWidth: "600px", 
            margin: "0 auto" 
          }}>
            Step into our luxurious and hygienic beauty parlour designed for your comfort and relaxation
          </p>
        </div>

        {/* Interior Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getInteriorGridColumns(),
            gap: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }),
            marginBottom: "3rem",
          }}
        >
          {interiorImages.map((interior) => (
            <div
              key={interior.id}
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
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {/* Interior Image */}
              <div
                style={{
                  height: getResponsiveValue({ xs: "200px", sm: "220px", md: "240px", lg: "250px" }),
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: '#f0f0f0',
                }}
              >
                {renderImage(interior.image, interior.title, interior.area)}
                
                {/* Area Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: getResponsiveValue({ xs: "0.3rem 0.6rem", sm: "0.35rem 0.7rem", md: "0.4rem 0.8rem", lg: "0.4rem 0.8rem" }),
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                    zIndex: 2,
                  }}
                >
                  {interior.area}
                </div>
              </div>

              {/* Interior Content */}
              <div style={{ 
                padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "1.8rem" }), 
                flex: 1, 
                display: "flex", 
                flexDirection: "column" 
              }}>
                <h3 style={{ 
                  fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  marginBottom: "0.8rem", 
                  color: "#333",
                  fontWeight: "600"
                }}>
                  {interior.title}
                </h3>
                
                <p style={{ 
                  fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" }), 
                  color: "#666", 
                  marginBottom: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  flex: 1,
                  lineHeight: 1.6
                }}>
                  {interior.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginTop: "auto"
                }}>
                  <div style={{ 
                    fontSize: getResponsiveValue({ xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" }), 
                    color: "#666", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.3rem" 
                  }}>
                    🏢 Premium Facility
                  </div>
                  <div style={{ 
                    fontSize: getResponsiveValue({ xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" }), 
                    color: "#666", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.3rem" 
                  }}>
                    ✨ Hygienic & Clean
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visit Us CTA */}
        <div style={{ 
          textAlign: "center",
          padding: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2.5rem" }),
          background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
          borderRadius: "20px",
          border: "1px solid #e0e0e0"
        }}>
          <h3 style={{ 
            fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.6rem" }), 
            marginBottom: "1rem", 
            color: "#333" 
          }}>
            Ready to Experience Our Beautiful Space?
          </h3>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }), 
            color: "#666", 
            marginBottom: "1.5rem", 
            maxWidth: "500px", 
            margin: "0 auto" 
          }}>
            Visit us today and experience the perfect blend of luxury, comfort, and professional beauty services
          </p>
          <Link to="/booking" style={{ textDecoration: "none" }}>
            <button
              style={{
                padding: getResponsiveValue({ xs: "0.8rem 1.8rem", sm: "0.9rem 2rem", md: "1rem 2.2rem", lg: "1.2rem 3rem" }),
                borderRadius: "50px",
                border: "none",
                background: "linear-gradient(135deg, #e84393, #fd79a8)",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }),
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
              onMouseEnter={(e) => {
                if (windowWidth > 768) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(232, 67, 147, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }
              }}
            >
              Book Your Visit Today ✅
            </button>
          </Link>
        </div>
      </section>

      {/* Best Works Section */}
      <section className="card" style={{ padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }) }}>
        <div style={{ textAlign: "center", marginBottom: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2rem" }) }}>
          <h2 style={{ 
            fontSize: getResponsiveValue({ xs: "1.4rem", sm: "1.6rem", md: "1.8rem", lg: "2rem" }), 
            marginBottom: "0.5rem" 
          }}>
            Our Best Works
          </h2>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.8rem", sm: "0.85rem", md: "0.9rem", lg: "1rem" }), 
            opacity: 0.8, 
            maxWidth: "600px", 
            margin: "0 auto" 
          }}>
            Showcasing our finest beauty transformations and exquisite jewelry creations
          </p>
        </div>

        {/* Best Works Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: getBestWorksGridColumns(),
            gap: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem" }),
            marginBottom: "3rem",
          }}
        >
          {bestWorks.map((work) => (
            <div
              key={work.id}
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
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (windowWidth > 768) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {/* Work Image */}
              <div
                style={{
                  height: getResponsiveValue({ xs: "220px", sm: "240px", md: "260px", lg: "280px" }),
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  backgroundColor: '#f0f0f0',
                }}
              >
                {renderImage(work.image, work.title, work.category, work.beforeAfter)}
                
                {/* Category Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    padding: getResponsiveValue({ xs: "0.3rem 0.6rem", sm: "0.35rem 0.7rem", md: "0.4rem 0.8rem", lg: "0.4rem 0.8rem" }),
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "#333",
                    fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
                    fontWeight: "600",
                    backdropFilter: "blur(10px)",
                    zIndex: 2,
                  }}
                >
                  {work.category}
                </div>

                {/* Before/After Badge */}
                {work.beforeAfter && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      padding: getResponsiveValue({ xs: "0.3rem 0.6rem", sm: "0.35rem 0.7rem", md: "0.4rem 0.8rem", lg: "0.4rem 0.8rem" }),
                      borderRadius: "20px",
                      background: "rgba(232, 67, 147, 0.9)",
                      color: "white",
                      fontSize: getResponsiveValue({ xs: "0.65rem", sm: "0.7rem", md: "0.75rem", lg: "0.8rem" }),
                      fontWeight: "600",
                      backdropFilter: "blur(10px)",
                      zIndex: 2,
                    }}
                  >
                    Transformation
                  </div>
                )}
              </div>

              {/* Work Content */}
              <div style={{ 
                padding: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "1.8rem" }), 
                flex: 1, 
                display: "flex", 
                flexDirection: "column" 
              }}>
                <h3 style={{ 
                  fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  marginBottom: "0.8rem", 
                  color: "#333",
                  fontWeight: "600"
                }}>
                  {work.title}
                </h3>
                
                <p style={{ 
                  fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1rem" }), 
                  color: "#666", 
                  marginBottom: getResponsiveValue({ xs: "1rem", sm: "1.2rem", md: "1.3rem", lg: "1.5rem" }), 
                  flex: 1,
                  lineHeight: 1.6
                }}>
                  {work.description}
                </p>
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginTop: "auto"
                }}>
                  <div style={{ 
                    fontSize: getResponsiveValue({ xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" }), 
                    color: "#666", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.3rem" 
                  }}>
                    ⭐ Client Favorite
                  </div>
                  <div style={{ 
                    fontSize: getResponsiveValue({ xs: "0.75rem", sm: "0.8rem", md: "0.85rem", lg: "0.9rem" }), 
                    color: "#666", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.3rem" 
                  }}>
                    {work.beforeAfter ? "🔄 Transformation" : "💫 Best Seller"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio CTA */}
        <div style={{ 
          textAlign: "center",
          padding: getResponsiveValue({ xs: "1.2rem", sm: "1.5rem", md: "1.8rem", lg: "2.5rem" }),
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "20px",
          color: "white"
        }}>
          <h3 style={{ 
            fontSize: getResponsiveValue({ xs: "1.1rem", sm: "1.2rem", md: "1.3rem", lg: "1.6rem" }), 
            marginBottom: "1rem" 
          }}>
            Want to See More of Our Work?
          </h3>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }), 
            marginBottom: "1.5rem", 
            maxWidth: "500px", 
            margin: "0 auto", 
            opacity: 0.9 
          }}>
            Follow us on Instagram for daily updates on our latest beauty transformations and jewelry designs
          </p>
          <button
            onClick={() => window.open('https://www.instagram.com/missamma_beautyparlour', '_blank')}
            style={{
              padding: getResponsiveValue({ xs: "0.8rem 1.8rem", sm: "0.9rem 2rem", md: "1rem 2.2rem", lg: "1.2rem 3rem" }),
              borderRadius: "50px",
              border: "2px solid white",
              background: "transparent",
              color: "white",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontSize: getResponsiveValue({ xs: "0.85rem", sm: "0.9rem", md: "0.95rem", lg: "1.1rem" }),
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            onMouseEnter={(e) => {
              if (windowWidth > 768) {
                e.target.style.background = "white";
                e.target.style.color = "#667eea";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (windowWidth > 768) {
                e.target.style.background = "transparent";
                e.target.style.color = "white";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            📸 Follow on Instagram
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;