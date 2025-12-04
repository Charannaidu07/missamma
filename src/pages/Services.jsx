
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";

const Services = ({ category: propCategory }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get category from URL params or props
  const params = useParams();
  const urlCategory = params.category ? 
    params.category.replace(/-/g, ' ').replace(/ and /g, ' & ') : null;
  
  const activeCategory = propCategory || urlCategory;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log("Fetching services from API...");
        const response = await api.get("/booking/services/");
        
        // Debug: Log what we receive from API
        console.log("API Response:", response.data);
        
        // Ensure we have an array
        if (Array.isArray(response.data)) {
          setServices(response.data);
          console.log("Services set successfully:", response.data.length);
        } else {
          console.error("API did not return an array:", response.data);
          setServices([]);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services by category if provided
  const filteredServices = activeCategory 
    ? services.filter(service => {
        // Handle null/undefined category
        if (!service.category) return false;
        
        // Normalize strings for comparison
        const serviceCategory = service.category.toLowerCase().trim();
        const targetCategory = activeCategory.toLowerCase().trim();
        
        return serviceCategory === targetCategory;
      })
    : services;

  // Debug: Log filtered services
  useEffect(() => {
    console.log("Filtered services:", filteredServices);
    console.log("Active category:", activeCategory);
  }, [filteredServices, activeCategory]);

  // Service categories mapping (dynamic based on available services)
  const [serviceCategories, setServiceCategories] = useState([]);

  useEffect(() => {
    // Extract unique categories from services
    const categories = {};
    services.forEach(service => {
      if (service.category && !categories[service.category]) {
        // Create slug from category name
        const slug = service.category
          .toLowerCase()
          .replace(/ & /g, ' and ')
          .replace(/ /g, '-');
        
        categories[service.category] = {
          slug: slug,
          name: service.category
        };
      }
    });
    
    setServiceCategories(Object.values(categories));
  }, [services]);

  if (loading) {
    return (
      <div className="card">
        <h2>{activeCategory || 'Beauty Services'}</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="spinner"></div>
          <div>Loading services...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h2>{activeCategory || 'Beauty Services'}</h2>
        <div style={{ color: '#e74c3c', textAlign: 'center', padding: '2rem' }}>
          <h3>Error Loading Services</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#e84393',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      {/* Dynamic title based on category */}
      {activeCategory ? (
        <div>
          <h2 style={{
            fontSize: "1.8rem",
            marginBottom: "0.5rem"
          }}>
            {activeCategory}
          </h2>
          <p style={{ 
            fontSize: "0.9rem", 
            opacity: 0.8,
            marginBottom: "1rem"
          }}>
            Specialized services in {activeCategory.toLowerCase()}
          </p>
          <Link 
            to="/services" 
            style={{
              display: 'inline-block',
              marginBottom: '1rem',
              color: '#e84393',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            ← Back to All Services
          </Link>
        </div>
      ) : (
        <div>
          <h2 style={{
            fontSize: "1.8rem",
            marginBottom: "0.5rem"
          }}>
            Beauty Services
          </h2>
          <p style={{ 
            fontSize: "0.9rem", 
            opacity: 0.8,
            marginBottom: "1rem"
          }}>
            Explore our curated service menu. Book your glow slot any time.
          </p>
        </div>
      )}

      {/* Service Categories Navigation */}
      {!activeCategory && serviceCategories.length > 0 && (
        <div style={{ margin: '1.5rem 0' }}>
          <h3 style={{ 
            fontSize: '1.1rem', 
            marginBottom: '0.8rem',
            color: '#2c3e50'
          }}>
            Service Categories
          </h3>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            {serviceCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/services/${category.slug}`}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '25px',
                  textDecoration: 'none',
                  color: '#495057',
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e84393';
                  e.target.style.color = 'white';
                  e.target.style.borderColor = '#e84393';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f8f9fa';
                  e.target.style.color = '#495057';
                  e.target.style.borderColor = '#e9ecef';
                }}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.2rem",
        }}
      >
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="card" 
              style={{ 
                padding: window.innerWidth < 768 ? "1rem" : "1.5rem",
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = `/booking?service=${service.id}`}
              onMouseEnter={(e) => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ 
                fontWeight: 600, 
                fontSize: window.innerWidth < 768 ? "1rem" : "1.1rem",
                color: '#2c3e50',
                marginBottom: '0.5rem'
              }}>
                {service.name}
                {service.service_type === 'AT_HOME' && (
                  <span style={{
                    fontSize: '0.7rem',
                    backgroundColor: '#e84393',
                    color: 'white',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '3px',
                    marginLeft: '0.5rem'
                  }}>
                    🏠 Home Service
                  </span>
                )}
              </div>
              
              {service.category && (
                <div style={{
                  fontSize: "0.75rem",
                  color: '#e84393',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '0.5rem'
                }}>
                  {service.category}
                </div>
              )}
              
              <div style={{ 
                fontSize: window.innerWidth < 768 ? "0.8rem" : "0.85rem", 
                opacity: 0.8, 
                marginTop: "0.4rem",
                lineHeight: '1.5',
                minHeight: window.innerWidth < 768 ? 'auto' : '3rem'
              }}>
                {service.description}
              </div>
              
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: window.innerWidth < 768 ? "0.8rem" : "0.85rem",
                }}
              >
                <span style={{ fontWeight: '600', color: '#e84393' }}>₹ {service.price}</span>
                <span style={{ opacity: 0.7 }}>{service.duration_minutes} mins</span>
              </div>

              {/* Book Now Button */}
              <Link 
                to={`/booking?service=${service.id}`}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  padding: window.innerWidth < 768 ? '0.6rem' : '0.7rem',
                  marginTop: '1rem',
                  backgroundColor: '#e84393',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontSize: window.innerWidth < 768 ? '0.85rem' : '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#d63031';
                  if (window.innerWidth > 768) {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#e84393';
                  if (window.innerWidth > 768) {
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Book Now
              </Link>
            </div>
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '3rem',
            color: '#7f8c8d'
          }}>
            {activeCategory ? (
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>No services found in "{activeCategory}"</h3>
                <p style={{ marginBottom: '1rem' }}>Please check back later or browse our other service categories.</p>
                <Link 
                  to="/services" 
                  style={{
                    color: '#e84393',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  View All Services
                </Link>
              </div>
            ) : (
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>No services available at the moment</h3>
                <p style={{ marginBottom: '1rem' }}>Please check back later for our service offerings.</p>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#e84393',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Booking CTA */}
      {!activeCategory && filteredServices.length > 0 && (
        <div style={{
          marginTop: '3rem',
          padding: window.innerWidth < 768 ? '1.5rem' : '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ 
            marginBottom: '0.5rem',
            fontSize: window.innerWidth < 768 ? '1.2rem' : '1.4rem'
          }}>
            Ready to Book?
          </h3>
          <p style={{ 
            opacity: 0.8, 
            marginBottom: '1.5rem',
            fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
          }}>
            Choose from our wide range of beauty services and book your appointment today.
          </p>
          <Link 
            to="/booking"
            style={{
              padding: window.innerWidth < 768 ? '0.7rem 1.5rem' : '0.8rem 2rem',
              backgroundColor: '#e84393',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '25px',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d63031';
              if (window.innerWidth > 768) {
                e.target.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#e84393';
              if (window.innerWidth > 768) {
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            Book Appointment Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default Services;