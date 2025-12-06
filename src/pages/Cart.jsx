import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Function to update quantity
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Function to remove item
  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Function to clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.setItem("cart", "[]");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <span className="badge-soft" style={styles.badge}>
              Your Shopping Cart
            </span>
            <h1 style={styles.title}>
              🛒 Shopping Cart
            </h1>
            {totalItems > 0 && (
              <span style={styles.itemCount}>
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart} 
              style={styles.clearButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 139, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 139, 0.3)';
              }}
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛒</div>
            <h3 style={styles.emptyTitle}>Your cart is empty</h3>
            <p style={styles.emptyText}>
              Discover our beautiful jewelry collection and premium beauty services
            </p>
            <div style={styles.emptyButtons}>
              <Link to="/store" style={{ textDecoration: 'none' }}>
                <button 
                  style={styles.primaryButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 139, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 139, 0.3)';
                  }}
                >
                  💎 Shop Jewelry
                </button>
              </Link>
              <Link to="/services" style={{ textDecoration: 'none' }}>
                <button 
                  style={styles.secondaryButton}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 139, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 139, 0.3)';
                  }}
                >
                  💄 Book Services
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={styles.itemsContainer}>
              {cart.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{
                    ...styles.cartItem,
                    ...(hoveredItem === idx && styles.cartItemHover)
                  }}
                  onMouseEnter={() => setHoveredItem(idx)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div style={styles.itemImage}>
                    <div style={styles.imagePlaceholder}>
                      {item.category === 'jewelry' ? '💎' : '💄'}
                    </div>
                  </div>
                  
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemDescription}>
                      {item.description || 'Premium quality product'}
                    </p>
                    <div style={styles.itemMeta}>
                      <span style={styles.itemCategory}>
                        {item.category === 'jewelry' ? 'Jewelry' : 'Beauty Service'}
                      </span>
                      <span style={styles.itemPrice}>₹{item.price} each</span>
                    </div>
                  </div>
                  
                  <div style={styles.quantitySection}>
                    <div style={styles.quantityControls}>
                      <button 
                        onClick={() => updateQuantity(idx, item.quantity - 1)}
                        style={{
                          ...styles.quantityButton,
                          ...(item.quantity <= 1 && styles.disabledButton)
                        }}
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span style={styles.quantityDisplay}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        style={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div style={styles.itemTotal}>
                    <div style={styles.totalPrice}>
                      ₹ {(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(idx)}
                      style={styles.removeButton}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, #FF6B8B, #FD79A8)';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.color = '#FF6B8B';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.footer}>
              <div style={styles.totalSection}>
                <h3 style={styles.summaryTitle}>Order Summary</h3>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Subtotal ({totalItems} items)</span>
                  <span style={styles.totalAmount}>₹ {total.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Shipping</span>
                  <span style={styles.shippingText}>FREE 🎉</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Tax (18%)</span>
                  <span style={styles.totalAmount}>₹ {(total * 0.18).toFixed(2)}</span>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.grandTotal}>
                  <span style={styles.grandTotalLabel}>Total Amount</span>
                  <span style={styles.grandTotalAmount}>
                    ₹ {(total * 1.18).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={styles.actionButtons}>
                <Link to="/checkout" style={{ textDecoration: 'none', flex: 1 }}>
                  <button 
                    style={styles.checkoutButton}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 139, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 139, 0.3)';
                    }}
                  >
                    🚀 Proceed to Checkout
                  </button>
                </Link>
                <Link to="/store" style={{ textDecoration: 'none', flex: 1 }}>
                  <button 
                    style={styles.continueShoppingButton}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#FF6B8B';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#FF6B8B';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ← Continue Shopping
                  </button>
                </Link>
              </div>

              {/* Security & Benefits */}
              <div style={styles.benefitsSection}>
                <div style={styles.benefitItem}>
                  <span style={styles.benefitIcon}>🔒</span>
                  <span style={styles.benefitText}>Secure & Encrypted Checkout</span>
                </div>
                <div style={styles.benefitItem}>
                  <span style={styles.benefitIcon}>🚚</span>
                  <span style={styles.benefitText}>Free Shipping & Returns</span>
                </div>
                <div style={styles.benefitItem}>
                  <span style={styles.benefitIcon}>💎</span>
                  <span style={styles.benefitText}>Premium Quality Guarantee</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
   
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    background: 'white',
    borderRadius: '25px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px rgba(255, 107, 139, 0.15)',
    width: '100%',
    maxWidth: '900px',
    minHeight: '600px',
    border: '1px solid rgba(255, 198, 224, 0.3)',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    borderBottom: '2px solid #FFE4E9',
    paddingBottom: '1.5rem',
  },
  badge: {
    background: 'linear-gradient(135deg, #FF6B8B, #FF8E9E)',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'inline-block',
    boxShadow: '0 4px 10px rgba(255, 107, 139, 0.2)',
  },
  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '2.2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #FF6B8B 0%, #FF8E9E 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  itemCount: {
    color: '#7f8c8d',
    fontSize: '1rem',
    fontWeight: '500',
  },
  clearButton: {
    background: 'linear-gradient(135deg, #FF6B8B, #FF8E9E)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 139, 0.3)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#7f8c8d',
  },
  emptyIcon: {
    fontSize: '6rem',
    marginBottom: '1.5rem',
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    color: '#FF6B8B',
  },
  emptyText: {
    margin: '0 0 2.5rem 0',
    fontSize: '1.1rem',
    color: '#666',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: '1.6',
  },
  emptyButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #FF6B8B, #FF8E9E)',
    color: 'white',
    border: 'none',
    padding: '1.2rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 139, 0.3)',
  },
  secondaryButton: {
    background: 'linear-gradient(135deg, #FFB6C1, #FFCAD4)',
    color: '#FF6B8B',
    border: '2px solid #FF6B8B',
    padding: '1.2rem 2rem',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 139, 0.1)',
  },
  itemsContainer: {
    marginBottom: '2.5rem',
    maxHeight: '500px',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  cartItem: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr auto auto',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '1.5rem',
    border: '2px solid #FFE4E9',
    borderRadius: '20px',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #FFF9FA 0%, #FFF5F6 100%)',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(255, 107, 139, 0.05)',
  },
  cartItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(255, 107, 139, 0.15)',
    borderColor: '#FF6B8B',
    background: 'linear-gradient(135deg, #FFF5F6 0%, #FFF0F3 100%)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '15px',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #FFCAD4 0%, #FFB6C1 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    borderRadius: '15px',
    color: '#FF6B8B',
  },
  itemInfo: {
    minWidth: 0,
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#333',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemDescription: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.4',
  },
  itemMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  itemCategory: {
    background: 'rgba(255, 107, 139, 0.1)',
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#FF6B8B',
  },
  itemPrice: {
    fontSize: '1rem',
    color: '#666',
    fontWeight: '500',
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    background: 'white',
    borderRadius: '15px',
    padding: '0.4rem',
    border: '2px solid #FFE4E9',
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
    color: '#FF6B8B',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.1)',
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
    color: '#333',
  },
  itemTotal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.8rem',
    minWidth: '120px',
  },
  totalPrice: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#FF6B8B',
  },
  removeButton: {
    background: 'transparent',
    border: '2px solid #FF6B8B',
    color: '#FF6B8B',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  footer: {
    borderTop: '3px solid #FFE4E9',
    paddingTop: '2.5rem',
  },
  totalSection: {
    background: 'linear-gradient(135deg, #FFF9FA 0%, #FFF5F6 100%)',
    padding: '2rem',
    borderRadius: '20px',
    marginBottom: '2rem',
    border: '2px solid #FFE4E9',
  },
  summaryTitle: {
    margin: '0 0 1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#FF6B8B',
    textAlign: 'center',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  totalLabel: {
    color: '#666',
    fontSize: '1rem',
    fontWeight: '500',
  },
  totalAmount: {
    fontWeight: '600',
    color: '#333',
  },
  shippingText: {
    color: '#FF6B8B',
    fontWeight: '700',
    fontSize: '1rem',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #FF6B8B 50%, transparent 100%)',
    margin: '1.5rem 0',
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '1rem',
  },
  grandTotalLabel: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#333',
  },
  grandTotalAmount: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#FF6B8B',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  checkoutButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #FF6B8B, #FF8E9E)',
    color: 'white',
    border: 'none',
    padding: '1.5rem 2rem',
    borderRadius: '15px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(255, 107, 139, 0.3)',
    minWidth: '250px',
  },
  continueShoppingButton: {
    flex: 1,
    background: 'transparent',
    border: '3px solid #FF6B8B',
    color: '#FF6B8B',
    padding: '1.5rem 2rem',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '250px',
  },
  benefitsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #FF6B8B 0%, #FF8E9E 100%)',
    borderRadius: '15px',
    color: 'white',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  benefitIcon: {
    fontSize: '1.2rem',
  },
  benefitText: {
    opacity: 0.9,
  },
};

export default Cart;