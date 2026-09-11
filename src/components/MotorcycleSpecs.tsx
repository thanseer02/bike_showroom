import React from 'react';
import type { MotorcycleData } from '../data/motorcycles';

interface MotorcycleSpecsProps {
  data: MotorcycleData;
  accentColor?: string;
}

const MotorcycleSpecs: React.FC<MotorcycleSpecsProps> = ({ data, accentColor = 'var(--color-primary)' }) => {
  const specRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.25rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  };

  const specLabelStyle: React.CSSProperties = {
    color: 'var(--color-text-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.875rem',
  };

  const specValueStyle: React.CSSProperties = {
    fontWeight: 600,
    textAlign: 'right',
  };

  const specItems = [
    { label: 'Category', value: data.category },
    { label: 'Engine', value: data.specs.engine },
    { label: 'Displacement', value: data.specs.displacement },
    { label: 'Max Power', value: data.specs.power },
    { label: 'Max Torque', value: data.specs.torque },
    { label: 'Transmission', value: data.specs.transmission },
    { label: 'Weight', value: data.specs.weight },
    { label: 'Fuel Capacity', value: data.specs.fuelCapacity },
    { label: 'Mileage', value: data.specs.mileage },
    { label: 'Seat Height', value: data.specs.seatHeight },
  ];

  return (
    <div>
      <h3 className="heading-md" style={{ marginBottom: '2rem', color: accentColor }}>
        {data.name}
      </h3>
      <div>
        {specItems.map((spec, index) => (
          <div key={index} style={specRowStyle}>
            <span style={specLabelStyle}>{spec.label}</span>
            <span style={specValueStyle}>{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MotorcycleSpecs;
