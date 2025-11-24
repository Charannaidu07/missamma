import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="card">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item, idx) => (
              <li
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                }}
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹ {item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1rem", fontWeight: 600 }}>Total: ₹ {total}</div>
          <Link to="/checkout">
            <button className="btn-primary" style={{ marginTop: "1rem" }}>
              Proceed to Checkout
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
