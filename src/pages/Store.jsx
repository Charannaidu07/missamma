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
    <div className="card" style={{ padding: "1rem" }}>
      <h2>Bespoke Jewelry Store</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1.2rem"
        }}
      >
        {products.map((p) => (
          <div key={p.id} className="card" style={{ padding: "1rem", position: "relative" }}>

            <img
              src={p.image}
              alt={p.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "0.5rem"
              }}
            />

            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontWeight: 600 }}>₹ {p.price}</div>

            {/* Quantity Controls */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "6px", gap: "6px" }}>
              <button
                onClick={() => decrease(p)}
                style={{
                  border: "none",
                  background: "white",
                  color: "green",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >−</button>

              <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {quantities[p.id] || 0}
              </span>

              <button
                onClick={() => increase(p)}
                style={{
                  border: "none",
                  background: "white",
                  color: "green",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >+</button>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setOpenDetailsId(p.id)}
              style={{
                marginTop: "6px",
                padding: "6px 10px",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%"
              }}
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
              background: "white",
              padding: "2rem",
              borderRadius: "10px",
              maxWidth: "400px",
              width: "90%",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{products.find(p => p.id === openDetailsId)?.name}</h3>
            <p>{products.find(p => p.id === openDetailsId)?.shortNote}</p>
            <button
              onClick={() => setOpenDetailsId(null)}
              style={{
                background: "red",
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
