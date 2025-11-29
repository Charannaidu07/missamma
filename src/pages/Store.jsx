import React, { useEffect, useState } from "react";
import { api } from "../api";

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE || "https://missammabackend.onrender.com";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/store/products/");
        console.log("Products data:", response.data);

        setProducts(response.data);

        // Load quantities from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        let q = {};
        cart.forEach((item) => {
          q[item.product_id] = item.quantity;
        });
        setQuantities(q);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Simple SVG placeholder
  const getPlaceholderSvg = (productName = "Product") => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#81C784"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">${productName}</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">No Image Available</text>
      </svg>
    `)}`;
  };

  const getImageUrl = (product) => {
    // 1) Prefer image_url if present
    if (product.image_url) {
      return product.image_url.startsWith("http")
        ? product.image_url
        : `${BACKEND_BASE}${product.image_url}`;
    }

    // 2) Fallback to image field from DRF
    if (product.image) {
      return product.image.startsWith("http")
        ? product.image
        : `${BACKEND_BASE}${product.image}`;
    }

    // 3) Final fallback: placeholder
    return getPlaceholderSvg(product.name);
  };

  const updateLocalStorage = (newQuantities) => {
    let cart = [];
    Object.keys(newQuantities).forEach((id) => {
      if (newQuantities[id] > 0) {
        const p = products.find((prod) => prod.id === parseInt(id));
        if (p) {
          cart.push({
            product_id: p.id,
            name: p.name,
            price: p.price,
            quantity: newQuantities[id],
          });
        }
      }
    });
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const increase = (product) => {
    const newQuantities = {
      ...quantities,
      [product.id]: (quantities[product.id] || 0) + 1,
    };
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

  if (loading) {
    return (
      <div
        style={{
          background: "#ffd6eb",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2>Loading products...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#ffd6eb",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#81C784",
          marginBottom: "2rem",
          fontFamily: "sans-serif",
        }}
      >
        Bespoke Jewelry Store
      </h2>

      {products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#81C784",
            fontSize: "1.2rem",
          }}
        >
          No products available at the moment.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
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
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* Product Image */}
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "12px",
                  marginBottom: "0.5rem",
                  border: "2px solid #e73fb8ff",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={getImageUrl(p)}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.log(`Image failed for ${p.name}, using placeholder`);
                    e.target.src = getPlaceholderSvg(p.name);
                  }}
                />
              </div>

              <div
                style={{
                  fontWeight: 600,
                  color: "#e73fb8ff",
                  fontSize: "1.1rem",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontWeight: 600,
                  color: "#e73fb8ff",
                  marginTop: "4px",
                }}
              >
                ₹ {p.price}
              </div>

              {/* Stock Information */}
              <div
                style={{
                  fontSize: "0.9rem",
                  color: "white",
                  marginTop: "4px",
                }}
              >
                Stock: {p.stock} available
              </div>

              {/* Quantity Controls */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "10px",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => decrease(p)}
                  disabled={!quantities[p.id]}
                  style={{
                    border: "none",
                    background: quantities[p.id] ? "#00cc66" : "#cccccc",
                    color: "white",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    cursor: quantities[p.id] ? "pointer" : "not-allowed",
                  }}
                >
                  −
                </button>

                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {quantities[p.id] || 0}
                </span>

                <button
                  onClick={() => increase(p)}
                  disabled={p.stock <= (quantities[p.id] || 0)}
                  style={{
                    border: "none",
                    background:
                      p.stock > (quantities[p.id] || 0)
                        ? "#00cc66"
                        : "#cccccc",
                    color: "white",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    cursor:
                      p.stock > (quantities[p.id] || 0)
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  +
                </button>
              </div>

              {/* View Details Button */}
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
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#00994d")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#00cc66")
                }
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup for Product Details */}
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
            zIndex: 9999,
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
              border: "3px solid #00cc66",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenDetailsId(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            <h3
              style={{
                color: "#00cc66",
                marginBottom: "1rem",
              }}
            >
              {products.find((p) => p.id === openDetailsId)?.name}
            </h3>

            <div
              style={{
                width: "100%",
                height: "200px",
                borderRadius: "8px",
                marginBottom: "1rem",
                border: "2px solid #00cc66",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src={getImageUrl(
                  products.find((p) => p.id === openDetailsId)
                )}
                alt={products.find((p) => p.id === openDetailsId)?.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = getPlaceholderSvg(
                    products.find((p) => p.id === openDetailsId)?.name
                  );
                }}
              />
            </div>

            <p
              style={{
                color: "#00994d",
                lineHeight: "1.5",
                marginBottom: "1rem",
              }}
            >
              {products.find((p) => p.id === openDetailsId)?.description ||
                "No description available"}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  color: "#c2185b",
                  fontSize: "1.2rem",
                }}
              >
                Price: ₹{" "}
                {products.find((p) => p.id === openDetailsId)?.price}
              </div>
              <div
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                Stock:{" "}
                {products.find((p) => p.id === openDetailsId)?.stock} available
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1.5rem",
                gap: "10px",
              }}
            >
              <button
                onClick={() =>
                  decrease(products.find((p) => p.id === openDetailsId))
                }
                disabled={!quantities[openDetailsId]}
                style={{
                  background: quantities[openDetailsId]
                    ? "#00cc66"
                    : "#cccccc",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: quantities[openDetailsId]
                    ? "pointer"
                    : "not-allowed",
                  fontWeight: "bold",
                }}
              >
                −
              </button>

              <span
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#c2185b",
                  padding: "0 16px",
                }}
              >
                {quantities[openDetailsId] || 0}
              </span>

              <button
                onClick={() =>
                  increase(products.find((p) => p.id === openDetailsId))
                }
                disabled={
                  products.find((p) => p.id === openDetailsId)?.stock <=
                  (quantities[openDetailsId] || 0)
                }
                style={{
                  background:
                    products.find((p) => p.id === openDetailsId)?.stock >
                    (quantities[openDetailsId] || 0)
                      ? "#00cc66"
                      : "#cccccc",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor:
                    products.find((p) => p.id === openDetailsId)?.stock >
                    (quantities[openDetailsId] || 0)
                      ? "pointer"
                      : "not-allowed",
                  fontWeight: "bold",
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
