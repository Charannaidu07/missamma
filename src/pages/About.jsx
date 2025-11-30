import React from 'react';

const About = () => {
  return (
    <div className="card">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1>About Missamma Beauty & Jewelry</h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem', 
          marginTop: '2rem' 
        }}>
          <div>
            <h2 style={{ color: '#e84393', marginBottom: '1rem' }}>Our Story</h2>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
              Missamma Beauty & Jewelry has been a trusted name in beauty and elegance since our establishment. 
              We started with a simple vision: to provide premium beauty services and exquisite jewelry 
              that make every customer feel special and confident.
            </p>
            <p style={{ lineHeight: '1.6' }}>
              Over the years, we've grown from a small beauty parlor to a comprehensive beauty and jewelry 
              destination, serving thousands of satisfied customers with our professional services and 
              quality products.
            </p>
          </div>
          
          <div>
            <h2 style={{ color: '#e84393', marginBottom: '1rem' }}>Our Mission</h2>
            <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
              To enhance your natural beauty through our expert services and elegant jewelry collections, 
              providing an unforgettable experience that leaves you feeling radiant and confident.
            </p>
            
            <h2 style={{ color: '#e84393', marginBottom: '1rem' }}>Why Choose Us?</h2>
            <ul style={{ lineHeight: '1.6', paddingLeft: '1.5rem' }}>
              <li>Professional and certified beauty experts</li>
              <li>Premium quality jewelry collections</li>
              <li>Hygienic and safe environment</li>
              <li>Affordable pricing</li>
              <li>Customer satisfaction guarantee</li>
            </ul>
          </div>
        </div>

        {/* Team Section */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ color: '#e84393', textAlign: 'center', marginBottom: '2rem' }}>Our Services</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              {
                title: 'Beauty Services',
                description: 'Professional facials, makeup, hair styling, and spa treatments',
                icon: '💄'
              },
              {
                title: 'Jewelry Collection',
                description: 'Exquisite jewelry pieces for every occasion',
                icon: '💎'
              },
              {
                title: 'Bridal Packages',
                description: 'Complete bridal makeup and jewelry solutions',
                icon: '👰'
              }
            ].map((service, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                textAlign: 'center',
                border: '1px solid #e9ecef',
                borderRadius: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(232, 67, 147, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{service.icon}</div>
                <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>{service.title}</h3>
                <p style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Visit Us Today</h3>
          <p style={{ marginBottom: '1.5rem', color: '#7f8c8d' }}>
            Experience the Missamma difference. Book your appointment or browse our jewelry collection today!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a 
              href="/booking" 
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: '#e84393',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
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
              Book Appointment
            </a>
            <a 
              href="/store" 
              style={{
                padding: '0.8rem 1.5rem',
                backgroundColor: 'transparent',
                color: '#e84393',
                border: '2px solid #e84393',
                textDecoration: 'none',
                borderRadius: '25px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e84393';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#e84393';
              }}
            >
              View Store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Make sure this export statement is at the end of the file
export default About;