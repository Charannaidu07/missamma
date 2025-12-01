import React from 'react';

const Contact = () => {
  return (
    <div className="card">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1>Contact Us</h1>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d', marginBottom: '2rem' }}>
          Get in touch with us for any inquiries or to book an appointment
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem'
        }}>
          {/* Contact Information - Full Width Now */}
          <div>
            <h2 style={{ color: '#e84393', marginBottom: '1.5rem' }}>Get in Touch</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Visit Our Store</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {[
                  { 
                    icon: '📍', 
                    text: 'Lalitha theatre, Near, beside hp gas, Peddapuram, Andhra Pradesh 533437',
                    description: 'Easy to find location near Lalitha theatre'
                  },
                  { 
                    icon: '📞', 
                    text: '+91 88979 78545',
                    description: 'Call us for appointments or inquiries'
                  },
                  { 
                    icon: '✉️', 
                    text: 'missammabeautyparlour@gmail.com',
                    description: 'Send us an email anytime'
                  },
                  { 
                    icon: '🕒', 
                    text: 'Mon-Sun: 9AM-10PM',
                    description: 'We are open 7 days a week'
                  }
                ].map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid #f0f0f0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#e84393';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#f0f0f0';
                  }}
                  >
                    <span style={{ 
                      fontSize: '1.5rem', 
                      minWidth: '40px',
                      color: '#e84393'
                    }}>{item.icon}</span>
                    <div>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600',
                        color: '#2c3e50',
                        marginBottom: '0.3rem'
                      }}>
                        {item.text}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#7f8c8d',
                        lineHeight: '1.4'
                      }}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ 
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
              borderRadius: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  onClick={() => window.open('tel:+918897978545')}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: '#e84393',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#d63031';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e84393';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📞 Call Us Now
                </button>
                
                <button
                  onClick={() => window.location.href = '/booking'}
                  style={{
                    padding: '1rem 1.5rem',
                    backgroundColor: 'transparent',
                    color: '#e84393',
                    border: '2px solid #e84393',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e84393';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#e84393';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  📅 Book Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div>
            <h2 style={{ color: '#e84393', marginBottom: '1.5rem' }}>Our Location</h2>
            <div style={{
              height: '400px',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              marginBottom: '1.5rem'
            }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3813.838998813802!2d82.1295977736812!3d17.080526211575656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37811020790d2d%3A0x7e28cd70965c4cf3!2sMissamma%20beauty%20parlour!5e0!3m2!1sen!2sin!4v1764507929056!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Missamma Beauty Parlour Location"
              ></iframe>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.open('https://maps.app.goo.gl/daGh3PYeU8cWZZ7k6', '_blank')}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#e84393',
                  border: '2px solid #e84393',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e84393';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#e84393';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🗺️ Open in Google Maps
              </button>
              
              <button
                onClick={() => window.open('https://www.instagram.com/missamma_beautyparlour', '_blank')}
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#E1306C',
                  border: '2px solid #E1306C',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#E1306C';
                  e.target.style.color = 'white';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#E1306C';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📸 Follow on Instagram
              </button>
            </div>

            {/* Additional Info */}
            <div style={{ 
              marginTop: '2rem',
              padding: '1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Why Choose Missamma?</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {[
                  '✅ Professional and certified beauty experts',
                  '✅ Premium quality products and services',
                  '✅ Hygienic and safe environment',
                  '✅ Affordable pricing with great results',
                  '✅ Customer satisfaction guarantee'
                ].map((item, index) => (
                  <div key={index} style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;