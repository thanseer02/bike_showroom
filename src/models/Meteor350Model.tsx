import React, { forwardRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Meteor350ModelProps {
  modelUrl?: string;
  color?: string;
}

const Meteor350Model = forwardRef<THREE.Group, Meteor350ModelProps>(({
  modelUrl = '/models/meteor350.glb',
  color = '#facc15',
}, ref) => {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!scene || !color) return;
    
    // Generic logic to find paint materials and animate them.
    const targetColor = new THREE.Color(color);
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            // Apply color to standard materials that might represent paint
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // Animate color transition smoothly
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
});

Meteor350Model.displayName = 'Meteor350Model';

// useGLTF.preload('/models/meteor350.glb');

export default Meteor350Model;
