import React from 'react';
import { MotorcycleColor } from '../data/motorcycles';

interface ColorSelectorProps {
  colors: MotorcycleColor[];
  selectedColorHex: string;
  onSelectColor: (hex: string) => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ colors, selectedColorHex, onSelectColor }) => {
  return (
    <div style={{ marginTop: '2rem' }}>
      <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
        Select Color
      </p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onSelectColor(color.hex)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: color.hex,
              border: selectedColorHex === color.hex ? '2px solid white' : '2px solid transparent',
              outline: selectedColorHex === color.hex ? `2px solid ${color.hex}` : 'none',
              outlineOffset: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          />
        ))}
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text)', fontWeight: 500 }}>
        {colors.find(c => c.hex === selectedColorHex)?.name}
      </p>
    </div>
  );
};

export default ColorSelector;
