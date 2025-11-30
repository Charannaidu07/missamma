import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

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
        setProducts(response.data);

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

  const getPlaceholderSvg = (productName = "Product") => {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ff9a9e"/>
        <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">${productName}</text>
        <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle">No Image Available</text>
      </svg>
    `)}`;
  };

  const getImageUrl = (product) => {
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.loadingState}>
            <div style={styles.loadingIcon}>💎</div>
            <h3 style={styles.loadingTitle}>Loading Beautiful Jewelry...</h3>
            <p style={styles.loadingText}>Fetching our exquisite collection</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedProduct = products.find((p) => p.id === openDetailsId);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <span className="badge-soft" style={styles.badge}>
              Exquisite Jewelry Collection
            </span>
            <h1 style={styles.title}>💎 Jewelry Store</h1>
            <p style={styles.subtitle}>
              Discover our handpicked collection of premium jewelry pieces
            </p>
          </div>
          
          {/* Cart Preview */}
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <button style={styles.cartButton}>
              🛒 View Cart ({Object.keys(quantities).reduce((sum, key) => sum + quantities[key], 0)})
            </button>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>💎</div>
            <h3 style={styles.emptyTitle}>No Products Available</h3>
            <p style={styles.emptyText}>
              We're updating our jewelry collection. Please check back soon!
            </p>
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {products.map((product) => (
              <div
                key={product.id}
                style={styles.productCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
                }}
              >
                {/* Product Image */}
                <div style={styles.imageContainer}>
                  <img
                    src={getImageUrl(product)}
                    alt={product.name}
                    style={styles.productImage}
                    onError={(e) => {
                      e.target.src = getPlaceholderSvg(product.name);
                    }}
                  />
                  <div style={styles.stockBadge}>
                    {product.stock} available
                  </div>
                </div>

                {/* Product Info */}
                <div style={styles.productInfo}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDescription}>
                    {product.description || "Beautiful jewelry piece crafted with precision"}
                  </p>
                  
                  <div style={styles.productMeta}>
                    <div style={styles.price}>₹{product.price}</div>
                    {product.material && (
                      <div style={styles.material}>{product.material}</div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div style={styles.controlsSection}>
                    <div style={styles.quantityControls}>
                      <button
                        onClick={() => decrease(product)}
                        disabled={!quantities[product.id]}
                        style={{
                          ...styles.quantityButton,
                          ...(!quantities[product.id] && styles.disabledButton)
                        }}
                      >
                        −
                      </button>
                      <span style={styles.quantityDisplay}>
                        {quantities[product.id] || 0}
                      </span>
                      <button
                        onClick={() => increase(product)}
                        disabled={product.stock <= (quantities[product.id] || 0)}
                        style={{
                          ...styles.quantityButton,
                          ...(product.stock <= (quantities[product.id] || 0) && styles.disabledButton)
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => setOpenDetailsId(product.id)}
                      style={styles.detailsButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = "linear-gradient(135deg, #e84393, #fd79a8)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "linear-gradient(135deg, #FFD700, #FFA500)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div
            style={styles.modalOverlay}
            onClick={() => setOpenDetailsId(null)}
          >
            <div
              style={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpenDetailsId(null)}
                style={styles.closeButton}
              >
                ×
              </button>

              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>{selectedProduct.name}</h2>
                <div style={styles.modalPrice}>₹{selectedProduct.price}</div>
              </div>

              <div style={styles.modalImageContainer}>
                <img
                  src={getImageUrl(selectedProduct)}
                  alt={selectedProduct.name}
                  style={styles.modalImage}
                  onError={(e) => (e.target.src = getPlaceholderSvg(selectedProduct.name))}
                />
              </div>

              <div style={styles.modalBody}>
                <p style={styles.modalDescription}>
                  {selectedProduct.description || "Exquisite jewelry piece crafted with premium materials and exceptional attention to detail."}
                </p>

                <div style={styles.specifications}>
                  <h4 style={styles.specsTitle}>Specifications</h4>
                  <div style={styles.specsGrid}>
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Material:</span>
                      <span style={styles.specValue}>{selectedProduct.material || "Premium Gold"}</span>
                    </div>
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Weight:</span>
                      <span style={styles.specValue}>{selectedProduct.weight || "5-15g"}</span>
                    </div>
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Size:</span>
                      <span style={styles.specValue}>{selectedProduct.size || "Adjustable"}</span>
                    </div>
                    <div style={styles.specItem}>
                      <span style={styles.specLabel}>Stock:</span>
                      <span style={styles.specValue}>{selectedProduct.stock} available</span>
                    </div>
                  </div>
                </div>

                <div style={styles.beautySection}>
                  <h4 style={styles.beautyTitle}>✨ The Beauty of This Piece</h4>
                  <p style={styles.beautyText}>
                    This exquisite jewelry piece enhances your elegance and adds a touch of sophistication to every outfit. 
                    It reflects your unique style, boosts confidence, and captures admiration with its timeless beauty. 
                    Perfect for special occasions or everyday luxury.
                  </p>
                </div>

                {/* Modal Quantity Controls */}
                <div style={styles.modalControls}>
                  <div style={styles.modalQuantitySection}>
                    <span style={styles.quantityLabel}>Quantity:</span>
                    <div style={styles.modalQuantityControls}>
                      <button
                        onClick={() => decrease(selectedProduct)}
                        disabled={!quantities[openDetailsId]}
                        style={{
                          ...styles.modalQuantityButton,
                          ...(!quantities[openDetailsId] && styles.disabledButton)
                        }}
                      >
                        −
                      </button>
                      <span style={styles.modalQuantityDisplay}>
                        {quantities[openDetailsId] || 0}
                      </span>
                      <button
                        onClick={() => increase(selectedProduct)}
                        disabled={selectedProduct.stock <= (quantities[openDetailsId] || 0)}
                        style={{
                          ...styles.modalQuantityButton,
                          ...(selectedProduct.stock <= (quantities[openDetailsId] || 0) && styles.disabledButton)
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button
                    style={styles.addToCartButton}
                    onClick={() => increase(selectedProduct)}
                    disabled={selectedProduct.stock <= (quantities[openDetailsId] || 0)}
                  >
                    💎 Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    background: 'white',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '1200px',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    borderBottom: '2px solid #f8f9fa',
    paddingBottom: '1.5rem',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  badge: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'inline-block',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '2.2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#7f8c8d',
    margin: 0,
  },
  cartButton: {
    background: 'linear-gradient(135deg, #e84393, #fd79a8)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(232, 67, 147, 0.3)',
  },
  loadingState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#7f8c8d',
  },
  loadingIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  loadingTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    color: '#2c3e50',
  },
  loadingText: {
    margin: 0,
    fontSize: '1rem',
    color: '#7f8c8d',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#7f8c8d',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    color: '#2c3e50',
  },
  emptyText: {
    margin: '0 0 2.5rem 0',
    fontSize: '1.1rem',
    color: '#7f8c8d',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  productCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '0',
    border: '1px solid #e0e0e0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  imageContainer: {
    height: '200px',
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  stockBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.9)',
    color: '#2c3e50',
    fontSize: '0.75rem',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
  },
  productInfo: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  productName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
  },
  productDescription: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    lineHeight: '1.5',
    margin: 0,
    flex: 1,
  },
  productMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#FFD700',
  },
  material: {
    background: '#f8f9fa',
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#e84393',
  },
  controlsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    borderRadius: '15px',
    padding: '0.4rem',
    border: '2px solid #e9ecef',
  },
  quantityButton: {
    background: 'white',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.3rem',
    fontWeight: '600',
    color: '#e84393',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  },
  disabledButton: {
    opacity: 0.4,
    cursor: 'not-allowed',
    color: '#ccc',
  },
  quantityDisplay: {
    minWidth: '45px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.1rem',
    color: '#2c3e50',
  },
  detailsButton: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    color: 'white',
    border: 'none',
    padding: '0.8rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    background: 'white',
    padding: '2rem',
    borderRadius: '20px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflowY: 'auto',
    position: 'relative',
    border: '2px solid #FFD700',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
  },
  closeButton: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    background: '#e84393',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: 0,
    flex: 1,
  },
  modalPrice: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#FFD700',
  },
  modalImageContainer: {
    width: '100%',
    height: '250px',
    borderRadius: '15px',
    overflow: 'hidden',
    marginBottom: '1.5rem',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  modalDescription: {
    color: '#7f8c8d',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    margin: 0,
  },
  specifications: {
    background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
    padding: '1.5rem',
    borderRadius: '15px',
    border: '1px solid #e9ecef',
  },
  specsTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  specsGrid: {
    display: 'grid',
    gap: '0.8rem',
  },
  specItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specLabel: {
    fontWeight: '600',
    color: '#7f8c8d',
  },
  specValue: {
    fontWeight: '500',
    color: '#2c3e50',
  },
  beautySection: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '1.5rem',
    borderRadius: '15px',
    color: 'white',
  },
  beautyTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '0.8rem',
  },
  beautyText: {
    fontSize: '0.9rem',
    lineHeight: '1.5',
    opacity: 0.9,
    margin: 0,
  },
  modalControls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  modalQuantitySection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  modalQuantityControls: {
    display: 'flex',
    alignItems: 'center',
    background: '#f8f9fa',
    borderRadius: '15px',
    padding: '0.4rem',
    border: '2px solid #e9ecef',
  },
  modalQuantityButton: {
    background: 'white',
    border: 'none',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#e84393',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  modalQuantityDisplay: {
    minWidth: '40px',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1rem',
    color: '#2c3e50',
  },
  addToCartButton: {
    background: 'linear-gradient(135deg, #e84393, #fd79a8)',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
  },
};

export default Store;