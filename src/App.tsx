import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './sections/HeroSection';
import MotorcycleSection from './sections/MotorcycleSection';
import ComparisonSection from './sections/ComparisonSection';
import SpecsSection from './sections/SpecsSection';
import Scene from './models/Scene';
import { motorcycles } from './data/motorcycles';
import { useTextReveal } from './hooks/useTextReveal';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

const App: React.FC = () => {
  useTextReveal();
  
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(() => {
    return motorcycles.reduce((acc, moto) => {
      acc[moto.id] = moto.colors[0]?.hex || '#000';
      return acc;
    }, {} as Record<string, string>);
  });

  const [shouldLoadMeteor, setShouldLoadMeteor] = useState(false);
  const meteorSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoadMeteor(true);
          observer.disconnect(); // only need to trigger once
        }
      },
      { rootMargin: '500px' } // pre-load before it comes into view
    );

    if (meteorSectionRef.current) {
      observer.observe(meteorSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleColorChange = useCallback((id: string, hex: string) => {
    setSelectedColors(prev => ({ ...prev, [id]: hex }));
  }, []);
  
  return (
    <div className="app-container">
      <LoadingScreen />
      
      {/* Global 3D Canvas fixed in the background */}
      <div id="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        <Scene colors={selectedColors} shouldLoadMeteor={shouldLoadMeteor} />
      </div>

      <Header />
      
      {/* Main content overlays the canvas */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        
        <div id="models">
          {motorcycles.map((moto, index) => (
            <div key={moto.id} ref={moto.id === 'meteor-350' ? meteorSectionRef : null}>
              <MotorcycleSection 
                id={moto.id}
                name={moto.name}
                tagline={moto.tagline}
                description={moto.description}
                reversed={index % 2 !== 0}
                colors={moto.colors}
                selectedColor={selectedColors[moto.id]}
                onColorChange={(hex) => handleColorChange(moto.id, hex)}
              />
            </div>
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
