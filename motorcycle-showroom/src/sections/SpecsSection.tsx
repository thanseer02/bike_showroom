import React from 'react';
import MotorcycleSpecs from '../components/MotorcycleSpecs';
import { motorcycles } from '../data/motorcycles';

const SpecsSection: React.FC = () => {
  return (
    <section id="specs" className="section" style={{ background: 'var(--color-bg)', position: 'relative', zIndex: 10 }}>
      <div className="container">
        <h2 className="heading-lg" style={{ marginBottom: '4rem', textAlign: 'center' }}>Technical Specifications</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
          {motorcycles.map((moto) => (
            <MotorcycleSpecs 
              key={moto.id} 
              data={moto} 
              accentColor={moto.id === 'mt-15' ? 'var(--color-accent)' : '#f59e0b'} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecsSection;
