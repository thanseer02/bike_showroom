import React, { forwardRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface GenericMotorcycleModelProps {
  modelUrl: string;
  color?: string;
  isMobile?: boolean;
}

const GenericMotorcycleModel = React.memo(forwardRef<THREE.Group, GenericMotorcycleModelProps>(({
  modelUrl,
  color = '#000000',
  isMobile = false,
}, ref) => {
  const { scene } = useGLTF(modelUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = !isMobile;
        child.receiveShadow = !isMobile;
      }
    });
  }, [scene, isMobile]);

  useEffect(() => {
    if (!scene || !color) return;
    
    const targetColor = new THREE.Color(color);
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              gsap.to(mat.color, {
                r: targetColor.r,
                g: targetColor.g,
                b: targetColor.b,
                duration: 0.6,
                ease: "power2.out"
              });
            }
          });
        }
      }
    });
  }, [scene, color]);

  return (
    <group ref={ref} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}));

GenericMotorcycleModel.displayName = 'GenericMotorcycleModel';

export default GenericMotorcycleModel;
