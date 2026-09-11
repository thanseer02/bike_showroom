import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import MotorcycleSection from './sections/MotorcycleSection';
import ComparisonSection from './sections/ComparisonSection';
import SpecsSection from './sections/SpecsSection';
import Scene from './models/Scene';
import { motorcycles } from './data/motorcycles';
import { useState } from 'react';
import './index.css';

const App: React.FC = () => {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({
    'mt-15': motorcycles.find(m => m.id === 'mt-15')?.colors[0].hex || '#000',
    'meteor-350': motorcycles.find(m => m.id === 'meteor-350')?.colors[0].hex || '#000',
  });

  const handleColorChange = (id: string, hex: string) => {
    setSelectedColors(prev => ({ ...prev, [id]: hex }));
  };
  return (
    <div className="app-container">
      {/* Global 3D Canvas fixed in the background */}
      <div id="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Scene colors={selectedColors} />
      </div>

      <Header />
      
      {/* Main content overlays the canvas */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        
        <div id="models">
          {motorcycles.map((moto, index) => (
            <MotorcycleSection 
              key={moto.id}
              id={moto.id}
              name={moto.name}
              tagline={moto.tagline}
              description={moto.description}
              reversed={index % 2 !== 0}
              colors={moto.colors}
              selectedColor={selectedColors[moto.id]}
              onColorChange={(hex) => handleColorChange(moto.id, hex)}
            />
          ))}
        </div>

        <ComparisonSection />
        
        <SpecsSection />
        
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
