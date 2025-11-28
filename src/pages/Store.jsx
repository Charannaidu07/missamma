import React, { useEffect, useState } from "react";
import MeImage from "../assets/Meeeeeeee.jpg"; // Replace with your image

const Store = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [openDetailsId, setOpenDetailsId] = useState(null);

  const dummyProducts = [
    { id: 1, name: "Bespoke Ring", price: 500, shortNote: "Handcrafted with love.", image: MeImage },
    { id: 2, name: "Bespoke Ring", price: 600, shortNote: "Perfect for special occasions.", image: MeImage },
    { id: 3, name: "Bespoke Ring", price: 800, shortNote: "Premium quality design.", image: MeImage },
    { id: 4, name: "Bespoke Ring", price: 1000, shortNote: "Top-tier craftsmanship.", image: MeImage }
  ];

  useEffect(() => {
    setProducts(dummyProducts);

    // Load quantities from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let q = {};
    cart.forEach(item => {
      q[item.product_id] = item.quantity;
    });
    setQuantities(q);
  }, []);

  const updateLocalStorage = (newQuantities) => {
    let cart = [];
    Object.keys(newQuantities).forEach(id => {
      if (newQuantities[id] > 0) {
        const p = products.find(prod => prod.id === parseInt(id));
        cart.push({
          product_id: p.id,
          name: p.name,
          price: p.price,
          quantity: newQuantities[id]
        });
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const increase = (product) => {
    const newQuantities = { ...quantities, [product.id]: (quantities[product.id] || 0) + 1 };
    setQuantities(newQuantities);
    updateLocalStorage(newQuantities);
  };

  const decrease = (product) => {
    const newQuantities = { ...quantities };
    if (!newQuantities[product.id]) return;
    newQuantities[product.id] -= 1;
    if (newQuantities[product.id] <= 0) delete newQuantities[product.id];
    setQuantities(newQuantities);
    updateLocalStorage(newQuantities);
  };

  return (
    <div style={{ background: "#ffd6eb", minHeight: "100vh", padding: "2rem" }}>
      <h2 style={{ textAlign: "center", color: "#81C784", marginBottom: "2rem", fontFamily: "sans-serif" }}>
        Bespoke Jewelry Store
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem"
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "1rem",
              background: "#81C784",
              borderRadius: "15px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
              textAlign: "center",
              position: "relative",
              transition: "transform 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "0.5rem"
              }}
            />

            <div style={{ fontWeight: 600, color: "#e73fb8ff", fontSize: "1.1rem" }}>{p.name}</div>
            <div style={{ fontWeight: 600, color: "#e73fb8ff", marginTop: "4px" }}>₹ {p.price}</div>

            {/* Quantity Controls - GREEN */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px", gap: "8px" }}>
              <button
                onClick={() => decrease(p)}
                style={{
                  border: "none",
                  background: "#00cc66",

                  color: "white",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >−</button>

              <span style={{ fontSize: "1rem", fontWeight: "bold", color: "white" }}>
                {quantities[p.id] || 0}
              </span>

              <button
                onClick={() => increase(p)}
                style={{
                  border: "none",
                  background: "#00cc66",
                  color: "white",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >+</button>
            </div>

            {/* View Details Button - GREEN */}
            <button
              onClick={() => setOpenDetailsId(p.id)}
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#00cc66",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                width: "100%",
                fontWeight: "bold",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#00994d"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#00cc66"}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal Popup for Short Note */}
      {openDetailsId && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
          onClick={() => setOpenDetailsId(null)}
        >
          <div
            style={{
              background: "#ffe6f0",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "90%",
              position: "relative",
              border: "3px solid #00cc66"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#00cc66" }}>{products.find(p => p.id === openDetailsId)?.name}</h3>
            <p style={{ color: "#00994d" }}>{products.find(p => p.id === openDetailsId)?.shortNote}</p>
            <button
              onClick={() => setOpenDetailsId(null)}
              style={{
                background: "#00cc66",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
