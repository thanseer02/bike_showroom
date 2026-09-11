import React, { forwardRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface MT15ModelProps {
  modelUrl?: string;
  color?: string;
}

const MT15Model = forwardRef<THREE.Group, MT15ModelProps>(({
  modelUrl = '/models/mt15.glb',
  color = '#0025a8',
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
    // In a production app, you would target specific material names, e.g. mat.name === 'BodyPaint'
    const targetColor = new THREE.Color(color);
    
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((mat) => {
            // Apply color to standard materials that might represent paint
            // This is a robust placeholder architecture
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              // We could filter by name if we knew it: if (mat.name.toLowerCase().includes('paint'))
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

MT15Model.displayName = 'MT15Model';

// useGLTF.preload('/models/mt15.glb');

export default MT15Model;
