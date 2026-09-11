import React from 'react';
import Button from '../components/Button';

const HeroSection: React.FC = () => {
  const heroStyle: React.CSSProperties = {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  };

  const contentStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 10,
    maxWidth: '600px',
  };

  return (
    <section id="home" style={heroStyle}>
      <div className="container" style={{ width: '100%' }}>
        <div style={contentStyle}>
          <h1 className="heading-xl" style={{ marginBottom: '1rem' }}>
            Pure<br />Adrenaline.
          </h1>
          <p className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '400px' }}>
            Experience the raw power of the Yamaha MT-15 and the timeless cruise of the Meteor 350 in full 3D.
          </p>
          <Button variant="primary">Explore Models</Button>
        </div>
      </div>
      
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: 0.5,
      }}>
        <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Scroll</span>
        <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--color-text)' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
