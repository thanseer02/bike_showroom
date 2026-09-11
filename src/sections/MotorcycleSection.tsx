import React from 'react';
import Button from '../components/Button';
import ColorSelector from '../components/ColorSelector';
import type { MotorcycleColor } from '../data/motorcycles';

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

  return (
    <section id={id} className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={layoutStyle}>
          {/* 3D Model visual space */}
          <div style={{ flex: '1 1 100%', minHeight: '50vh', pointerEvents: 'none' }} />

          {/* Text Content in Glass Panel */}
          <div className="glass-panel" style={{ flex: '1 1 100%', maxWidth: '600px', position: 'relative' }}>
             {/* Radial glow for the panel */}
             <div className="radial-glow" style={{
                top: '-20%',
                right: '-20%',
                width: '300px',
                height: '300px',
                background: 'var(--color-glow)',
              }}></div>

            <h3 className="text-muted" style={{ fontFamily: 'Outfit', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700 }}>
              {tagline}
            </h3>
            <h2 className="heading-lg" style={{ marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              {name}
            </h2>
            <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.8 }}>
              {description}
            </p>

            <div style={{ marginBottom: '2.5rem' }}>
              {colors && selectedColor && onColorChange && (
                <ColorSelector colors={colors} selectedColorHex={selectedColor} onSelectColor={onColorChange} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button variant="primary">Build & Price</Button>
              <Button variant="secondary">View Specs</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MotorcycleSection;
