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
    maxWidth: '650px',
  };

  return (
    <section id="home" style={heroStyle}>
      {/* Premium Radial Glow behind text */}
      <div className="radial-glow" style={{
        top: '20%',
        left: '-10%',
        width: '600px',
        height: '600px',
        background: 'var(--color-glow)',
      }}></div>

      <div className="container" style={{ width: '100%' }}>
        <div style={contentStyle}>
          <h1 className="heading-xl gsap-reveal" style={{ marginBottom: '1.5rem', textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            Pure<br />Adrenaline.
          </h1>
          <p className="text-muted gsap-reveal" style={{ fontSize: '1.35rem', marginBottom: '3rem', maxWidth: '450px', lineHeight: 1.8 }}>
            Experience the raw power of the Yamaha MT-15 and the timeless cruise of the Meteor 350 in full immersive 3D.
          </p>
          <div className="gsap-reveal" style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="primary">Explore Models</Button>
            <Button variant="outline">Watch Video</Button>
          </div>
        </div>
      </div>
      
      {/* Refined Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        opacity: 0.6,
      }}>
        <span style={{ fontFamily: 'Outfit', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700 }}>Scroll</span>
        <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, var(--color-text), transparent)' }}></div>
      </div>
    </section>
  );
};

export default HeroSection;
