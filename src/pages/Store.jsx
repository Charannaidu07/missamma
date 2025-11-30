import React, { useEffect, useState } from "react";
import { api } from "../api";

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE || "https://missammabackend.onrender.com";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [openDetailsId, setOpenDetailsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState("carousel"); // carousel, sideBySide, grid

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/store/products/");
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

  // Placeholder SVG
  const getPlaceholderSvg = (productName = "Product") => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#81C784"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">${productName}</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">No Image Available</text>
      </svg>
    `)}`;
  };

  const getImageUrl = (product, index = 0) => {
    if (product.images && product.images.length > index) {
      const imgUrl = product.images[index];
      return imgUrl.startsWith("http") ? imgUrl : `${BACKEND_BASE}${imgUrl}`;
    }
    if (product.image_url) {
      return product.image_url.startsWith("http")
        ? product.image_url
        : `${BACKEND_BASE}${product.image_url}`;
    }
    if (product.image) {
      return product.image.startsWith("http")
        ? product.image
        : `${BACKEND_BASE}${product.image}`;
    }
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

  // Render images according to layout
  const renderImages = (product) => {
    switch (layout) {
      case "sideBySide":
        return (
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "0.5rem",
              borderRadius: "12px",
              overflow: "hidden",
              border: "2px solid #e73fb8ff",
            }}
          >
            {[0, 1, 2].map((idx) => (
              <img
                key={idx}
                src={getImageUrl(product, idx)}
                alt={`${product.name} ${idx + 1}`}
                style={{ width: "33%", height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = getPlaceholderSvg(product.name);
                }}
              />
            ))}
          </div>
        );

      case "grid":
        return (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "4px",
              marginBottom: "0.5rem",
              borderRadius: "12px",
              overflow: "hidden",
              border: "2px solid #e73fb8ff",
              height: "200px",
            }}
          >
            {[0, 1, 2, 3].map(
              (idx) =>
                product.images &&
                product.images[idx] && (
                  <img
                    key={idx}
                    src={getImageUrl(product, idx)}
                    alt={`${product.name} ${idx + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = getPlaceholderSvg(product.name);
                    }}
                  />
                )
            )}
          </div>
        );

      default:
        // Carousel
        return (
          <div
            style={{
              width: "100%",
              height: "200px",
              borderRadius: "12px",
              marginBottom: "0.5rem",
              border: "2px solid #e73fb8ff",
              backgroundColor: "#f0f0f0",
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
            }}
          >
            {[0, 1, 2].map((idx) => (
              <img
                key={idx}
                src={getImageUrl(product, idx)}
                alt={`${product.name} ${idx + 1}`}
                style={{
                  minWidth: "100%",
                  height: "100%",
                  objectFit: "cover",
                  scrollSnapAlign: "start",
                }}
                onError={(e) => {
                  e.target.src = getPlaceholderSvg(product.name);
                }}
              />
            ))}
          </div>
        );
    }
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
          marginBottom: "1rem",
          fontFamily: "sans-serif",
        }}
      >
        Bespoke Jewelry Store
      </h2>

      {/* Layout Toggle */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={() => setLayout("carousel")}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            background: layout === "carousel" ? "#00cc66" : "#81C784",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Carousel
        </button>
        <button
          onClick={() => setLayout("sideBySide")}
          style={{
            marginRight: "8px",
            padding: "6px 12px",
            background: layout === "sideBySide" ? "#00cc66" : "#81C784",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Side By Side
        </button>
        <button
          onClick={() => setLayout("grid")}
          style={{
            padding: "6px 12px",
            background: layout === "grid" ? "#00cc66" : "#81C784",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Grid
        </button>
      </div>

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
              {renderImages(p)}

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

              <div
                style={{
                  fontSize: "0.9rem",
                  color: "white",
                  marginTop: "4px",
                }}
              >
                Stock: {p.stock} available
              </div>

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
    </div>
  );
};

export default Store;
