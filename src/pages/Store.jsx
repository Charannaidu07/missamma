import React, { useEffect, useState } from "react";
import { api } from "../api";

const Store = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/store/products/").then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.product_id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ product_id: product.id, name: product.name, price: product.price, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div className="card">
      <h2>Bespoke Jewelry Store</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "1rem",
          marginTop: "1.2rem",
        }}
      >
        {products.map((p) => (
          <div key={p.id} className="card" style={{ padding: "1rem" }}>
            <div style={{ fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: "0.8rem", opacity: 0.8, margin: "0.4rem 0" }}>
              {p.description}
            </div>
            <div style={{ fontWeight: 600 }}>₹ {p.price}</div>
            <button
              className="btn-primary"
              style={{ marginTop: "0.8rem" }}
              onClick={() => addToCart(p)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
