import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MotorcycleModelProps {
  modelUrl?: string; // Will be used later to load actual GLB models
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const MotorcycleModel: React.FC<MotorcycleModelProps> = ({
  modelUrl,
  color = '#ff3333',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Future integration:
  // const { scene } = useGLTF(modelUrl);
  
  // Subtle hovering animation for the placeholder
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.05 + position[1];
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Main Body Placeholder */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.8, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Front Wheel Placeholder */}
      <mesh castShadow receiveShadow position={[0, 0.3, 1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>

      {/* Rear Wheel Placeholder */}
      <mesh castShadow receiveShadow position={[0, 0.3, -1.1]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 32]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    </group>
  );
};

export default MotorcycleModel;
