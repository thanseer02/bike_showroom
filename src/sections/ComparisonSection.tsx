import React from 'react';
import { motorcycles } from '../data/motorcycles';

const ComparisonSection: React.FC = () => {
  const mt15 = motorcycles.find(m => m.id === 'mt-15');
  const meteor = motorcycles.find(m => m.id === 'meteor-350');

  if (!mt15 || !meteor) return null;

  const getCardStyle = (alignment: 'left' | 'right'): React.CSSProperties => ({
    background: 'rgba(10, 10, 10, 0.65)',
    backdropFilter: 'blur(12px)',
    padding: '2rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '400px',
    textAlign: alignment,
  });

  const getRowStyle = (marginTop: string = '0'): React.CSSProperties => ({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
    width: '100%',
    marginTop,
    padding: '0 2rem',
  });

  const SpecItem: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-text-muted)' }}>{label}</div>
      <div style={{ fontSize: '1.125rem', fontWeight: 600, color }}>{value}</div>
    </div>
  );

  return (
    <section id="compare" style={{ position: 'relative', zIndex: 10 }}>
      {/* Introduction Block - 100vh */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="gsap-reveal" style={{ textAlign: 'center', background: 'rgba(5, 5, 5, 0.5)', padding: '2rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
          <h2 className="heading-lg" style={{ marginBottom: '1rem' }}>Head to Head</h2>
          <p className="text-muted">Scroll to compare specifications.</p>
        </div>
      </div>

      {/* Performance Block - 100vh */}
      <div id="compare-performance" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={getRowStyle()}>
          <div className="gsap-reveal" style={getCardStyle('left')}>
            <h3 className="heading-md" style={{ color: 'var(--color-accent)', marginBottom: '1.5rem' }}>MT-15</h3>
            <SpecItem label="Category" value={mt15.category} color="#fff" />
            <SpecItem label="Engine" value={mt15.specs.engine} color="#fff" />
            <SpecItem label="Displacement" value={mt15.specs.displacement} color="#fff" />
            <SpecItem label="Power" value={mt15.specs.power} color="#fff" />
            <SpecItem label="Torque" value={mt15.specs.torque} color="#fff" />
          </div>
          <div className="gsap-reveal" style={getCardStyle('right')}>
            <h3 className="heading-md" style={{ color: '#f59e0b', marginBottom: '1.5rem' }}>Meteor 350</h3>
            <SpecItem label="Category" value={meteor.category} color="#fff" />
            <SpecItem label="Engine" value={meteor.specs.engine} color="#fff" />
            <SpecItem label="Displacement" value={meteor.specs.displacement} color="#fff" />
            <SpecItem label="Power" value={meteor.specs.power} color="#fff" />
            <SpecItem label="Torque" value={meteor.specs.torque} color="#fff" />
          </div>
        </div>
      </div>

      {/* Build & Utility Block - 100vh */}
      <div id="compare-build" style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={getRowStyle()}>
          <div className="gsap-reveal" style={getCardStyle('left')}>
            <SpecItem label="Transmission" value={mt15.specs.transmission} color="#fff" />
            <SpecItem label="Weight" value={mt15.specs.weight} color="#fff" />
            <SpecItem label="Fuel Capacity" value={mt15.specs.fuelCapacity} color="#fff" />
            <SpecItem label="Mileage" value={mt15.specs.mileage} color="#fff" />
            <SpecItem label="Seat Height" value={mt15.specs.seatHeight} color="#fff" />
          </div>
          <div className="gsap-reveal" style={getCardStyle('right')}>
            <SpecItem label="Transmission" value={meteor.specs.transmission} color="#fff" />
            <SpecItem label="Weight" value={meteor.specs.weight} color="#fff" />
            <SpecItem label="Fuel Capacity" value={meteor.specs.fuelCapacity} color="#fff" />
            <SpecItem label="Mileage" value={meteor.specs.mileage} color="#fff" />
            <SpecItem label="Seat Height" value={meteor.specs.seatHeight} color="#fff" />
          </div>
        </div>
      </div>
      
      {/* Spacer to allow reading the last block before moving to Specs/CTA */}
      <div style={{ height: '50vh' }}></div>
    </section>
  );
};

export default ComparisonSection;
