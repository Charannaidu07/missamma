import React, { useEffect, useState } from "react";
import { api } from "../api";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get("/booking/services/").then((res) => setServices(res.data));
  }, []);

  const styles = {
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.2rem",
      marginTop: "1.2rem",
      '@media (max-width: 768px)': {
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem",
      },
      '@media (max-width: 480px)': {
        gridTemplateColumns: "1fr",
        gap: "0.8rem",
      }
    },
    serviceCard: {
      padding: "1rem",
      transition: "all 0.3s ease",
      ':hover': {
        transform: "translateY(-5px)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      },
      '@media (max-width: 480px)': {
        padding: "0.8rem",
      }
    }
  };

  return (
    <div className="card">
      <h2 style={{
        fontSize: "1.8rem",
        marginBottom: "0.5rem",
        '@media (max-width: 768px)': {
          fontSize: "1.5rem",
        }
      }}>
        Beauty Services
      </h2>
      <p style={{ 
        fontSize: "0.9rem", 
        opacity: 0.8,
        '@media (max-width: 768px)': {
          fontSize: "0.85rem",
        }
      }}>
        Explore our curated service menu. Book your glow slot any time.
      </p>
      <div style={styles.servicesGrid}>
        {services.map((s) => (
          <div key={s.id} className="card" style={styles.serviceCard}>
            <div style={{ 
              fontWeight: 600,
              fontSize: "1.1rem",
              '@media (max-width: 768px)': {
                fontSize: "1rem",
              }
            }}>
              {s.name}
            </div>
            <div style={{ 
              fontSize: "0.8rem", 
              opacity: 0.8, 
              marginTop: "0.4rem",
              lineHeight: "1.4",
              '@media (max-width: 768px)': {
                fontSize: "0.75rem",
              }
            }}>
              {s.description}
            </div>
            <div
              style={{
                marginTop: "0.8rem",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.85rem",
                '@media (max-width: 768px)': {
                  fontSize: "0.8rem",
                }
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