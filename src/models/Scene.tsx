import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import MT15Model from './MT15Model';
import Meteor350Model from './Meteor350Model';
import ScrollAnimationManager from './ScrollAnimationManager';

interface SceneProps {
  className?: string;
  style?: React.CSSProperties;
  colors: Record<string, string>;
}

const Scene: React.FC<SceneProps> = ({ className, style, colors }) => {
  const mt15Ref = useRef<THREE.Group>(null);
  const meteorRef = useRef<THREE.Group>(null);

  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[4, 1.5, 4]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
          shadow-bias={-0.0001}
        />
        <spotLight 
          position={[-5, 5, -2]} 
          intensity={2} 
          penumbra={1} 
          angle={0.6}
          castShadow 
          color="#ffffff" 
        />
        <spotLight 
          position={[0, 5, 5]} 
          intensity={1} 
          penumbra={0.5} 
          color="#ff3333" 
        />

        {/* Environment for realistic reflections */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <MT15Model ref={mt15Ref} color={colors['mt-15']} />
          <Meteor350Model ref={meteorRef} color={colors['meteor-350']} />
        </Suspense>

        {/* Ground & Shadows */}
        <ContactShadows 
          position={[0, 0, 0]} 
          opacity={0.8} 
          scale={10} 
          blur={2.5} 
          far={4} 
          color="#000000"
          resolution={512}
        />
        
        {/* GSAP Scroll Logic */}
        <ScrollAnimationManager mt15Ref={mt15Ref} meteorRef={meteorRef} />
      </Canvas>
    </div>
  );
};

export default Scene;
