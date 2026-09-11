import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ScrollAnimationManager from './ScrollAnimationManager';
import { useIsMobile } from '../hooks/useIsMobile';
import ModelErrorBoundary from '../components/ModelErrorBoundary';

const GenericMotorcycleModel = React.lazy(() => import('./GenericMotorcycleModel'));

interface SceneProps {
  className?: string;
  style?: React.CSSProperties;
  colors: Record<string, string>;
  shouldLoadMeteor?: boolean;
}

const Scene: React.FC<SceneProps> = ({ className, style, colors, shouldLoadMeteor = false }) => {
  const mt15Ref = useRef<THREE.Group>(null);
  const meteorRef = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas shadows={!isMobile} dpr={isMobile ? [1, 1] : [1, 2]}>
        <PerspectiveCamera makeDefault position={[4, 1.5, 4]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow={!isMobile} 
          shadow-mapSize-width={isMobile ? 512 : 2048} 
          shadow-mapSize-height={isMobile ? 512 : 2048} 
          shadow-bias={-0.0001}
        />
        <spotLight 
          position={[-5, 5, -2]} 
          intensity={2} 
          penumbra={1} 
          angle={0.6}
          castShadow={!isMobile} 
          color="#ffffff" 
        />
        <spotLight 
          position={[0, 5, 5]} 
          intensity={1} 
          penumbra={0.5} 
          color="#ff3333" 
        />

        {/* Environment for realistic reflections */}
        {!isMobile && <Environment preset="city" />}

        <Suspense fallback={null}>
          <ModelErrorBoundary>
            <group ref={mt15Ref}>
              <GenericMotorcycleModel modelUrl="/models/mt15.glb" color={colors['mt-15']} isMobile={isMobile} />
            </group>
          </ModelErrorBoundary>
          
          <ModelErrorBoundary>
            <group ref={meteorRef}>
              {shouldLoadMeteor && (
                <GenericMotorcycleModel modelUrl="/models/meteor350.glb" color={colors['meteor-350']} isMobile={isMobile} />
              )}
            </group>
          </ModelErrorBoundary>
        </Suspense>

        {/* Ground & Shadows */}
        {!isMobile && (
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.8} 
            scale={10} 
            blur={2.5} 
            far={4} 
            color="#000000"
            resolution={512}
          />
        )}
        
        {/* GSAP Scroll Logic */}
        <ScrollAnimationManager mt15Ref={mt15Ref} meteorRef={meteorRef} isMobile={isMobile} />
      </Canvas>
    </div>
  );
};

export default Scene;
