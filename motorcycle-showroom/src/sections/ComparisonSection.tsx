import React from 'react';

const ComparisonSection: React.FC = () => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '10rem', // Push specs down so 3D models are visible above
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(17, 17, 17, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: '3rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  };

  const featureListStyle: React.CSSProperties = {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    color: 'var(--color-text-muted)',
  };

  return (
    <section id="compare" className="section" style={{ minHeight: '150vh', position: 'relative' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', background: 'rgba(5, 5, 5, 0.5)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
          <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Choose Your Ride</h2>
          <p className="text-muted">Compare the aggressive streetfighter stance against the classic cruiser comfort.</p>
        </div>

        {/* 3D Models will be displayed here in the background by GSAP */}

        <div style={gridStyle}>
          <div style={cardStyle}>
            <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>MT-15</h3>
            <p style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>Dark Warrior</p>
            
            <ul style={featureListStyle}>
              <li>155cc Liquid-Cooled Engine</li>
              <li>Aggressive Streetfighter Design</li>
              <li>Delta Box Frame</li>
              <li>Traction Control System</li>
            </ul>
          </div>

          <div style={cardStyle}>
            <h3 className="heading-md" style={{ marginBottom: '0.5rem' }}>Meteor 350</h3>
            <p style={{ color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.875rem' }}>Cruise Easy</p>
            
            <ul style={featureListStyle}>
              <li>349cc Air-Oil Cooled Engine</li>
              <li>Classic Cruiser Ergonomics</li>
              <li>Twin Downtube Spine Frame</li>
              <li>Tripper Navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
