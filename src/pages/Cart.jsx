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

  // Handle button hover effects
  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 6px 20px rgba(129, 199, 132, 0.4)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 4px 15px rgba(129, 199, 132, 0.3)';
  };

  const handleRemoveHover = (e) => {
    e.target.style.background = 'linear-gradient(135deg, #feb2b2 0%, #fc8181 100%)';
    e.target.style.transform = 'translateY(-1px)';
  };

  const handleRemoveLeave = (e) => {
    e.target.style.background = 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)';
    e.target.style.transform = 'translateY(0)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header Section */}
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>🛒 Your Shopping Cart</h1>
            {totalItems > 0 && (
              <span style={styles.itemCount}>
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button 
              onClick={clearCart} 
              style={styles.clearButton}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              🗑️ Clear Cart
            </button>
          )}
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🛒</div>
            <h3 style={styles.emptyTitle}>Your cart feels lonely</h3>
            <p style={styles.emptyText}>Add some beautiful items to get started!</p>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button 
                style={styles.continueButton}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                🏠 Continue Shopping
              </button>
            </Link>
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
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    <p style={styles.itemPrice}>₹ {item.price} each</p>
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
                        onMouseEnter={(e) => {
                          if (item.quantity > 1) {
                            e.target.style.background = '#81C784';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (item.quantity > 1) {
                            e.target.style.background = 'white';
                            e.target.style.color = '#81C784';
                          }
                        }}
                      >
                        −
                      </button>
                      <span style={styles.quantityDisplay}>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(idx, item.quantity + 1)}
                        style={styles.quantityButton}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#81C784';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#81C784';
                        }}
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
                      onMouseEnter={handleRemoveHover}
                      onMouseLeave={handleRemoveLeave}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div style={styles.footer}>
              <div style={styles.totalSection}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Subtotal</span>
                  <span style={styles.totalAmount}>₹ {total.toFixed(2)}</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Shipping</span>
                  <span style={styles.shippingText}>FREE</span>
                </div>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Tax</span>
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
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonLeave}
                  >
                    🚀 Proceed to Checkout
                  </button>
                </Link>
                <Link to="/" style={{ textDecoration: 'none', flex: 1 }}>
                  <button 
                    style={styles.continueShoppingButton}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#81C784';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'white';
                      e.target.style.color = '#81C784';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    ← Continue Shopping
                  </button>
                </Link>
              </div>

              {/* Security Badge */}
              <div style={styles.securityBadge}>
                <div style={styles.securityIcon}>🔒</div>
                <span style={styles.securityText}>Secure & Encrypted Checkout</span>
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
    background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #FF9A9E 100%)',
    padding: '2rem 1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '800px',
    minHeight: '500px',
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
  title: {
    margin: 0,
    color: '#2d3748',
    fontSize: '2rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  itemCount: {
    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    color: 'white',
    padding: '0.4rem 1rem',
    borderRadius: '25px',
    fontSize: '0.9rem',
    fontWeight: '600',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 15px rgba(129, 199, 132, 0.3)',
  },
  clearButton: {
    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(129, 199, 132, 0.3)',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#718096',
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.7,
    color: '#81C784',
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    color: '#4a5568',
  },
  emptyText: {
    margin: '0 0 2.5rem 0',
    fontSize: '1.1rem',
    color: '#718096',
  },
  continueButton: {
    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    color: 'white',
    border: 'none',
    padding: '1.2rem 2.5rem',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(129, 199, 132, 0.3)',
  },
  itemsContainer: {
    marginBottom: '2.5rem',
    maxHeight: '400px',
    overflowY: 'auto',
    paddingRight: '0.5rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    border: '2px solid #f7fafc',
    borderRadius: '15px',
    marginBottom: '1rem',
    background: 'white',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  cartItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(129, 199, 132, 0.15)',
    borderColor: '#81C784',
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#2d3748',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemPrice: {
    margin: 0,
    fontSize: '1rem',
    color: '#718096',
    fontWeight: '500',
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    margin: '0 1.5rem',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    background: '#f7fafc',
    borderRadius: '15px',
    padding: '0.4rem',
    border: '2px solid #e2e8f0',
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
    color: '#81C784',
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
    color: '#2d3748',
  },
  itemTotal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.8rem',
    minWidth: '120px',
  },
  totalPrice: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#2d3748',
  },
  removeButton: {
    background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
    border: 'none',
    color: '#c53030',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  footer: {
    borderTop: '3px solid #f8f9fa',
    paddingTop: '2.5rem',
  },
  totalSection: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '2rem',
    borderRadius: '15px',
    marginBottom: '2rem',
    border: '2px solid #e9ecef',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    fontSize: '1.1rem',
  },
  totalLabel: {
    color: '#718096',
    fontSize: '1rem',
    fontWeight: '500',
  },
  totalAmount: {
    fontWeight: '600',
    color: '#4a5568',
  },
  shippingText: {
    color: '#81C784',
    fontWeight: '700',
    fontSize: '1rem',
  },
  divider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, #81C784 50%, transparent 100%)',
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
    color: '#2d3748',
  },
  grandTotalAmount: {
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#81C784',
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  checkoutButton: {
    flex: 1,
    background: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)',
    color: 'white',
    border: 'none',
    padding: '1.5rem 2rem',
    borderRadius: '15px',
    fontSize: '1.2rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(129, 199, 132, 0.3)',
    minWidth: '250px',
  },
  continueShoppingButton: {
    flex: 1,
    background: 'white',
    border: '3px solid #81C784',
    color: '#81C784',
    padding: '1.5rem 2rem',
    borderRadius: '15px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '250px',
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: '#f0fff4',
    borderRadius: '10px',
    border: '2px solid #c6f6d5',
  },
  securityIcon: {
    fontSize: '1.2rem',
  },
  securityText: {
    color: '#81C784',
    fontWeight: '600',
    fontSize: '0.9rem',
  },
};

export default Cart;