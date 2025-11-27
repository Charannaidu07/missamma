import React, { useState } from "react";
import { Link } from "react-router-dom";

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

  // Handle legal link hover
  const handleLegalHover = (e) => {
    e.target.style.color = '#e84393';
  };

  const handleLegalLeave = (e) => {
    e.target.style.color = '#bdc3c7';
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.mainContent}>
          {/* Brand Section */}
          <div style={styles.brandSection}>
            <h3 style={styles.brandTitle}>Miss Amma</h3>
            <p style={styles.brandDescription}>
              Your one-stop destination for premium beauty services, exquisite jewelry, 
              and professional beauty consultations. Experience the perfect blend of 
              elegance and wellness.
            </p>
            <div style={styles.socialLinks}>
              {['📘', '📷', '🐦', '💼'].map((icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  style={{
                    ...styles.socialLink,
                    ...(hoveredSocial === index && styles.socialLinkHover)
                  }}
                  onMouseEnter={() => handleSocialHover(index)}
                  onMouseLeave={handleSocialLeave}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={styles.linksSection}>
            <h4 style={styles.sectionTitle}>Quick Links</h4>
            <ul style={styles.linksList}>
              {[
                { name: 'Home', path: '/' },
                { name: 'Beauty Services', path: '/services' },
                { name: 'Jewelry Shop', path: '/jewelry' },
                { name: 'Book Appointment', path: '/appointments' },
                { name: 'About Us', path: '/about' },
                { name: 'Contact', path: '/contact' }
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
                { icon: '📍', text: '123 Beauty Street, City, State 12345' },
                { icon: '📞', text: '+1 (555) 123-4567' },
                { icon: '✉️', text: 'info@missamma.com' },
                { icon: '🕒', text: 'Mon-Sat: 9AM-8PM, Sun: 10AM-6PM' }
              ].map((item, index) => (
                <div key={index} style={styles.contactItem}>
                  <span style={styles.contactIcon}>{item.icon}</span>
                  <span style={styles.contactText}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div style={styles.newsletterSection}>
          <div style={styles.newsletterContent}>
            <h4 style={styles.newsletterTitle}>Stay Beautiful & Updated</h4>
            <p style={styles.newsletterText}>
              Subscribe to our newsletter for exclusive offers, beauty tips, and new jewelry collections.
            </p>
            <div style={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                style={styles.newsletterInput}
              />
              <button 
                style={styles.newsletterButton}
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.bottomContent}>
            <div style={styles.copyright}>
              © {new Date().getFullYear()} Miss Amma Beauty & Jewelry. All rights reserved.
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
                    onMouseEnter={handleLegalHover}
                    onMouseLeave={handleLegalLeave}
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

// Styles object with proper syntax
const styles = {
  footer: {
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    color: '#ecf0f1',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
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
  newsletterSection: {
    padding: '2.5rem 0',
    borderBottom: '1px solid #4a6278',
  },
  newsletterContent: {
    textAlign: 'center',
    maxWidth: '500px',
    margin: '0 auto',
  },
  newsletterTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#ecf0f1',
  },
  newsletterText: {
    color: '#bdc3c7',
    marginBottom: '1.5rem',
    lineHeight: '1.6',
  },
  newsletterForm: {
    display: 'flex',
    gap: '0.5rem',
    maxWidth: '400px',
    margin: '0 auto',
  },
  newsletterInput: {
    flex: 1,
    padding: '0.8rem 1rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '0.9rem',
    background: '#34495e',
    color: '#ecf0f1',
    outline: 'none',
  },
  newsletterButton: {
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '25px',
    background: 'linear-gradient(135deg, #e84393 0%, #fd79a8 100%)',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem',
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