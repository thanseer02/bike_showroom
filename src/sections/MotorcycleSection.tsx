import React from 'react';
import Button from '../components/Button';
import ColorSelector from '../components/ColorSelector';
import { MotorcycleColor } from '../data/motorcycles';

interface MotorcycleSectionProps {
  id: string;
  name: string;
  tagline: string;
  description: string;
  reversed?: boolean;
  colors?: MotorcycleColor[];
  selectedColor?: string;
  onColorChange?: (hex: string) => void;
}

const MotorcycleSection: React.FC<MotorcycleSectionProps> = ({ 
  id, 
  name, 
  tagline, 
  description, 
  reversed = false,
  colors,
  selectedColor,
  onColorChange
}) => {
  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: reversed ? 'row-reverse' : 'row',
    alignItems: 'center',
    gap: '4rem',
    flexWrap: 'wrap',
  };

  const textStyle: React.CSSProperties = {
    flex: '1 1 400px',
    background: 'rgba(5, 5, 5, 0.5)',
    padding: '2rem',
    borderRadius: '1rem',
    backdropFilter: 'blur(10px)',
  };

  const visualStyle: React.CSSProperties = {
    flex: '1 1 100%',
    minHeight: '50vh', // Adjust height based on viewport for mobile
    pointerEvents: 'none',
  };

  return (
    <section id={id} className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ width: '100%' }}>
        <div style={layoutStyle}>
          <div style={textStyle}>
            <h3 className="gsap-reveal" style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {tagline}
            </h3>
            <h2 className="heading-lg gsap-reveal" style={{ marginBottom: '1.5rem' }}>{name}</h2>
            <p className="text-muted gsap-reveal" style={{ marginBottom: '2.5rem', fontSize: '1.125rem' }}>
              {description}
            </p>
            <div className="gsap-reveal">
              <Button variant="outline">View Specifications</Button>
            </div>
            
            {colors && selectedColor && onColorChange && (
              <ColorSelector 
                colors={colors}
                selectedColorHex={selectedColor}
                onSelectColor={onColorChange}
              />
            )}
          </div>
          
          {/* Spacer block for the 3D model */}
          <div style={visualStyle}></div>
        </div>
      </div>
    </section>
  );
};

export default MotorcycleSection;
