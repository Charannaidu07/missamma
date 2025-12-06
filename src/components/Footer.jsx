import React, { useState } from "react";
import { Link } from "react-router-dom";
import goldpearlsetImg from "../assets/gold-pearl-set.jpg";
import diamondearringsImg from "../assets/diamond-earrings.jpg";
import braceletsetImg from "../assets/bracelet-set.jpg";
import hairstylingImg from "../assets/hair-styling.jpg";
import bridalmakeupImg from "../assets/bridal-makeup.jpg";
import hairspaImg from "../assets/hair-spa.jpg";



const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  // Handle link hover effects
  const handleLinkHover = (linkId) => {
    setHoveredLink(linkId);
  };

  const handleLinkLeave = () => {
    setHoveredLink(null);
  };

  // Handle social icon hover effects
  const handleSocialHover = (index) => {
    setHoveredSocial(index);
  };

  const handleSocialLeave = () => {
    setHoveredSocial(null);
  };

  // Handle button hover effects
  const handleButtonHover = (e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 5px 15px rgba(232, 67, 147, 0.4)';
  };

  const handleButtonLeave = (e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = 'none';
  };

  // Handle Google Maps redirect with the provided share link
  const handleOpenMaps = () => {
    const mapsUrl = "https://maps.app.goo.gl/daGh3PYeU8cWZZ7k6";
    window.open(mapsUrl, '_blank');
  };

  // Handle Instagram redirect
  const handleOpenInstagram = () => {
    const instagramUrl = "https://www.instagram.com/missamma_beautyparlour?igsh=MXUxOTI2NzBsMTM1dg==";
    window.open(instagramUrl, '_blank');
  };

  // Sample products data with imported images
  const featuredProducts = [
    {
      id: 1,
      name: "Gold Pearl Necklace",
      price: "Starting From ₹199",
      image: goldpearlsetImg, // Use imported image
      category: "Jewelry",
      alt: "Gold Pearl Necklace Set"
    },
    {
      id: 2,
      name: "Bridal Makeup",
      price: "Starting From ₹299",
      image: bridalmakeupImg, // Use imported image
      category: "Beauty",
      alt: "Bridal Makeup Service"
    },
    {
      id: 3,
      name: "Diamond Earrings",
      price: "Starting From ₹159",
      image: diamondearringsImg, // Use imported image or placeholder
      category: "Jewelry",
      alt: "Diamond Earrings"
    },
    {
      id: 4,
      name: "Hair Spa",
      price: "Starting From ₹179",
      image: hairspaImg, // Use imported image or placeholder
      category: "Wellness",
      alt: "Spa Day Package"
    },
    {
      id: 5,
      name: "Silver Bracelet Set",
      price: "Starting From ₹129",
      image: braceletsetImg, // Use imported image or placeholder
      category: "Jewelry",
      alt: "Silver Bracelet Set"
    },
    {
      id: 6,
      name: "Hair Styling Session",
      price: "Starting From ₹89",
      image: hairstylingImg, // Use imported image or placeholder
      category: "Beauty",
      alt: "Hair Styling Service"
    }
  ];

  // Helper function to render images with fallback
  const renderProductImage = (imageSrc, alt, category) => {
    if (imageSrc) {
      return (
        <img 
          src={imageSrc} 
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            borderRadius: "8px",
          }}
          onError={(e) => {
            // If image fails to load, replace with placeholder
            e.target.style.display = 'none';
            const parent = e.target.parentElement;
            parent.innerHTML = renderProductPlaceholder(category);
          }}
        />
      );
    }
    return renderProductPlaceholder(category);
  };

  // Helper function to render placeholder
  const renderProductPlaceholder = (category) => {
    const placeholderStyle = {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.5rem", // Increased font size
      borderRadius: "8px",
    };

    if (category === "Jewelry") {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ffecb3 0%, #ffd54f 100%)"}}>
          💎
        </div>
      );
    } else if (category === "Beauty") {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #ffd6e7 0%, #ffafcc 100%)"}}>
          💄
        </div>
      );
    } else if (category === "Wellness") {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #c9f7ff 0%, #81deea 100%)"}}>
          🛁
        </div>
      );
    } else {
      return (
        <div style={{...placeholderStyle, background: "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)"}}>
          ✨
        </div>
      );
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Banner Section - Replacing Newsletter */}
        <div style={styles.bannerSection}>
          <div style={styles.bannerHeader}>
            <h4 style={styles.bannerTitle}>Featured Products & Services</h4>
          </div>
          
          <div style={styles.bannerContainer}>
            {/* Book Appointment Banner */}
            <div style={styles.appointmentBanner}>
              <div style={styles.appointmentContent}>
                <h5 style={styles.appointmentTitle}>Book Your Appointment</h5>
                <p style={styles.appointmentText}>
                  Ready for a transformation? Book your beauty session today!
                </p>
                <Link 
                  to="/booking" 
                  style={styles.appointmentButton}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.color = '#e84393';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ffffff';
                    e.target.style.color = '#e84393';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Book Now
                </Link>
              </div>
              <div style={styles.appointmentIcon}>📅</div>
            </div>

            {/* Featured Products */}
            {featuredProducts.map((product) => (
              <div 
                key={product.id} 
                style={styles.productCard}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div style={styles.productImage}>
                  {renderProductImage(product.image, product.alt, product.category)}
                </div>
                <div style={styles.productInfo}>
                  <span style={{
                    ...styles.productCategory,
                    background: product.category === "Jewelry" 
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                      : product.category === "Beauty"
                      ? 'linear-gradient(135deg, #e84393, #fd79a8)'
                      : 'linear-gradient(135deg, #00b4db, #0083b0)'
                  }}>
                    {product.category}
                  </span>
                  <h6 style={styles.productName}>{product.name}</h6>
                  <div style={styles.productPrice}>{product.price}</div>
                  <Link 
                    to="/store" 
                    style={styles.viewProductButton}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e84393';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = '#e84393';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#bdc3c7';
                      e.target.style.borderColor = '#4a6278';
                    }}
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <h3 style={styles.brandTitle}>Missamma</h3>
            <p style={styles.brandDescription}>
              Your one-stop destination for premium beauty services, exquisite jewelry, 
              and professional beauty consultations. Experience the perfect blend of 
              elegance and wellness.
            </p>
            
            {/* Instagram Button */}
            <div style={styles.instagramSection}>
              <button 
                style={styles.instagramButton}
                onClick={handleOpenInstagram}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                <span style={styles.instagramIcon}>📷</span>
                Follow us on Instagram
              </button>
              <p style={styles.instagramText}>
                Follow for beauty tips, new arrivals, and exclusive offers!
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Quick Links</h4>
            <ul style={styles.linksList}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Beauty Services', path: '/services' },
                { name: 'Jewelry Store', path: '/store' },
                { name: 'Book Appointment', path: '/booking' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link, index) => (
                <li key={index} style={styles.listItem}>
                  <Link 
                    to={link.path}
                    style={{
                      ...styles.link,
                      ...(hoveredLink === `quick-${index}` && styles.linkHover)
                    }}
                    onMouseEnter={() => handleLinkHover(`quick-${index}`)}
                    onMouseLeave={handleLinkLeave}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Our Services</h4>
            <ul style={styles.linksList}>
              {[
                'Facials & Skincare',
                'Hair Styling', 
                'Bridal Makeup',
                'Spa Treatments',
                'Waxing',
                'Manicure & Pedicure'
              ].map((service, index) => (
                <li key={index} style={styles.listItem}>
                  <Link 
                    to={`/services/${service.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    style={{
                      ...styles.link,
                      ...(hoveredLink === `service-${index}` && styles.linkHover)
                    }}
                    onMouseEnter={() => handleLinkHover(`service-${index}`)}
                    onMouseLeave={handleLinkLeave}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div style={styles.contactSection}>
            <h4 style={styles.sectionTitle}>Contact Info</h4>
            <div style={styles.contactInfo}>
              {[
                { icon: '📍', text: 'Lalitha theatre, Near, beside hp gas, Peddapuram, Andhra Pradesh 533437' },
                { icon: '📞', text: '+91 88979 78545' },
                { icon: '✉️', text: 'missammabeautyparlour@gmail.com' },
                { icon: '🕒', text: 'Mon-Sun: 9AM-10PM' }
              ].map((item, index) => (
                <div key={index} style={styles.contactItem}>
                  <span style={styles.contactIcon}>{item.icon}</span>
                  <span style={styles.contactText}>{item.text}</span>
                </div>
              ))}
              
              {/* Google Maps Button */}
              <div style={styles.mapsButtonContainer}>
                <button 
                  style={styles.mapsButton}
                  onClick={handleOpenMaps}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonLeave}
                >
                  <span style={styles.mapsIcon}>🗺️</span>
                  Find Us on Google Maps
                </button>
                <p style={styles.mapsNote}>
                  Click to open our location in Google Maps
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.bottomContent}>
            <div style={styles.copyright}>
              © {new Date().getFullYear()} Missamma Beauty & Jewelry. All rights reserved.
            </div>
            <div style={styles.legalLinks}>
              {[
                { name: 'Privacy Policy', path: '/privacy' },
                { name: 'Terms of Service', path: '/terms' },
                { name: 'Refund Policy', path: '/refund' }
              ].map((legal, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span style={styles.separator}>|</span>}
                  <Link 
                    to={legal.path}
                    style={styles.legalLink}
                    onMouseEnter={(e) => e.target.style.color = '#e84393'}
                    onMouseLeave={(e) => e.target.style.color = '#bdc3c7'}
                  >
                    {legal.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Styles
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: '#ecf0f1',
    marginTop: 'auto',
    width: '100%',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  // Banner Section Styles
  bannerSection: {
    padding: '2.5rem 0',
    borderBottom: '1px solid #4a6278',
  },
  bannerHeader: {
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  bannerTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ecf0f1',
    margin: 0,
  },
  bannerContainer: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '1rem 0.5rem',
    // Hide scrollbar for cleaner look
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  'bannerContainer::-webkit-scrollbar': {
    display: 'none',
  },
  // Appointment Banner
  appointmentBanner: {
    minWidth: '300px',
    background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
    borderRadius: '15px',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: 'white',
    flexShrink: 0,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
  },
  appointmentText: {
    fontSize: '0.9rem',
    margin: '0 0 1rem 0',
    opacity: 0.9,
  },
  appointmentButton: {
    background: 'white',
    color: '#e84393',
    padding: '0.7rem 1.5rem',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'inline-block',
    transition: 'all 0.3s ease',
  },
  appointmentIcon: {
    fontSize: '3rem',
    marginLeft: '1rem',
  },
  // Product Card - UPDATED WITH LARGER IMAGES
  productCard: {
    minWidth: '280px', // Increased from 250px
    background: '#34495e',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '180px', // Increased from 120px - LARGER IMAGE
    height: '180px', // Increased from 120px - LARGER IMAGE
    marginBottom: '1.5rem', // Increased margin
    borderRadius: '12px', // Slightly larger radius
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#2c3e50',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)', // Added shadow for depth
  },
  productInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem', // Increased gap
    width: '100%',
  },
  productCategory: {
    fontSize: '0.8rem', // Slightly larger
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase',
    padding: '0.35rem 0.9rem', // Slightly larger padding
    borderRadius: '15px', // Larger radius
    display: 'inline-block',
    marginBottom: '0.5rem',
    alignSelf: 'center', // Center align
    textAlign: 'center',
    minWidth: '80px',
  },
  productName: {
    fontSize: '1.1rem', // Increased from 1rem
    fontWeight: '600',
    margin: '0.5rem 0',
    color: '#ecf0f1',
    height: '2.8rem', // Slightly taller
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4', // Better line height
  },
  productPrice: {
    fontSize: '1.2rem', // Increased from 1.1rem
    fontWeight: '700',
    color: '#e84393',
    margin: '0.5rem 0',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  viewProductButton: {
    background: 'transparent',
    color: '#bdc3c7',
    border: '1px solid #4a6278',
    padding: '0.6rem 1.2rem', // Slightly larger
    borderRadius: '25px', // Larger radius
    textDecoration: 'none',
    fontSize: '0.85rem', // Slightly larger
    transition: 'all 0.3s ease',
    marginTop: 'auto',
    width: '100%',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Instagram Button Styles
  instagramSection: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #4a6278',
  },
  instagramButton: {
    background: 'linear-gradient(45deg, #405DE6, #833AB4, #E1306C, #F56040, #FCAF45)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    width: '100%',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(225, 48, 108, 0.3)',
    marginBottom: '0.5rem',
  },
  instagramIcon: {
    fontSize: '1.2rem',
  },
  instagramText: {
    fontSize: '0.75rem',
    color: '#95a5a6',
    margin: 0,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Google Maps Button Styles
  mapsButtonContainer: {
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #4a6278',
    textAlign: 'center',
  },
  mapsButton: {
    background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
    color: 'white',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    width: '100%',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(232, 67, 147, 0.3)',
    marginBottom: '0.5rem',
  },
  mapsIcon: {
    fontSize: '1.2rem',
  },
  mapsNote: {
    fontSize: '0.75rem',
    color: '#95a5a6',
    margin: 0,
    fontStyle: 'italic',
  },
  // Rest of the styles remain the same
  mainContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    padding: '3rem 0 2rem',
    borderBottom: '1px solid #4a6278',
  },
  brandSection: {
    paddingRight: '1rem',
  },
  brandTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 1rem 0',
    background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandDescription: {
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    color: '#bdc3c7',
    fontSize: '0.95rem',
  },
  socialLinks: {
    display: 'flex',
    gap: '1rem',
  },
  socialLink: {
    display: 'inline-block',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#34495e',
    textAlign: 'center',
    lineHeight: '40px',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    color: 'white',
  },
  socialLinkHover: {
    background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
    transform: 'translateY(-2px)',
  },
  linksSection: {
    padding: '0 1rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '1.5rem',
    color: '#ecf0f1',
  },
  linksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  listItem: {
    marginBottom: '0.7rem',
  },
  link: {
    color: '#bdc3c7',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
    display: 'inline-block',
  },
  linkHover: {
    color: '#e84393',
    paddingLeft: '5px',
  },
  contactSection: {
    padding: '0 1rem',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
    fontSize: '0.9rem',
  },
  contactIcon: {
    fontSize: '1.1rem',
    minWidth: '20px',
  },
  contactText: {
    color: '#bdc3c7',
  },
  bottomBar: {
    padding: '1.5rem 0',
  },
  bottomContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  copyright: {
    color: '#95a5a6',
    fontSize: '0.9rem',
  },
  legalLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  legalLink: {
    color: '#bdc3c7',
    textDecoration: 'none',
    fontSize: '0.85rem',
    transition: 'all 0.3s ease',
  },
  separator: {
    color: '#7f8c8d',
    fontSize: '0.8rem',
  },
};

export default Footer;