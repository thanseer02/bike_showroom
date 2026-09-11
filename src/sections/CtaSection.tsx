import React from 'react';
import Button from '../components/Button';

const CtaSection: React.FC = () => {
  const sectionStyle: React.CSSProperties = {
    padding: '12rem 0', // Increased padding for a more premium airy feel
    background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.9) 30%, #ffffff)',
    color: '#000',
    textAlign: 'center',
    position: 'relative',
    zIndex: 10,
  };

  return (
    <section id="cta" style={sectionStyle}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 className="heading-lg gsap-reveal" style={{ marginBottom: '1.5rem', color: '#000' }}>Ready to Ride?</h2>
          <p className="gsap-reveal" style={{ fontSize: '1.25rem', marginBottom: '3rem', color: '#333' }}>
            Book a test ride today and experience the thrill firsthand. Our experts are ready to help you find your perfect match.
          </p>
          <div className="gsap-reveal" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" style={{ backgroundColor: '#000', color: '#fff' }}>Book Test Ride</Button>
            <Button variant="outline" style={{ borderColor: '#000', color: '#000' }}>Locate Dealer</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
