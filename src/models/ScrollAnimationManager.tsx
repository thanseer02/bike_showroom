import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationManagerProps {
  mt15Ref: React.RefObject<THREE.Group | null>;
  meteorRef: React.RefObject<THREE.Group | null>;
  isMobile?: boolean;
}

const ScrollAnimationManager: React.FC<ScrollAnimationManagerProps> = ({ mt15Ref, meteorRef, isMobile = false }) => {
  const { camera } = useThree();

  useEffect(() => {
    if (!mt15Ref.current || !meteorRef.current) return;

    const mt15 = mt15Ref.current;
    const meteor = meteorRef.current;

    // --- Initial Setup ---
    mt15.position.set(0, -0.2, 0);
    mt15.rotation.set(0, -Math.PI / 4, 0);
    mt15.scale.set(1, 1, 1);
    mt15.visible = true;

    meteor.position.set(0, -0.2, 0);
    meteor.rotation.set(0, Math.PI / 4, 0);
    meteor.scale.set(0, 0, 0);
    meteor.visible = false;
    
    camera.position.set(4, 1.5, 4);
    camera.lookAt(0, 0, 0);

    // --- Animation Timelines ---

    // 1. Hero -> MT-15
    gsap.timeline({
      scrollTrigger: {
        trigger: '#mt-15',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
    .to(mt15.rotation, { y: Math.PI / 6, ease: 'none' }, 0)
    .to(camera.position, { x: 3, y: 1.2, z: 3.5, ease: 'none' }, 0);


    // 2. MT-15 -> Meteor 350
    gsap.timeline({
      scrollTrigger: {
        trigger: '#meteor-350',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
    .to(mt15.position, { x: -4, ease: 'none' }, 0)
    .to(mt15.scale, { x: 0, y: 0, z: 0, ease: 'none' }, 0)
    .set(meteor, { visible: true }, 0)
    .to(meteor.scale, { x: 1, y: 1, z: 1, ease: 'none' }, 0)
    .to(meteor.rotation, { y: -Math.PI / 6, ease: 'none' }, 0)
    .to(camera.position, { x: -3, y: 1.5, z: 4, ease: 'none' }, 0);


    // 3. Meteor -> Comparison (Entrance)
    const mt15TargetX = isMobile ? -0.8 : -1.5;
    const meteorTargetX = isMobile ? 0.8 : 1.5;
    const cameraZ = isMobile ? 8 : 6;
    
    gsap.timeline({
      scrollTrigger: {
        trigger: '#compare',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
    .set(mt15, { visible: true }, 0)
    .to(mt15.scale, { x: 1, y: 1, z: 1, ease: 'none' }, 0)
    .to(mt15.position, { x: mt15TargetX, y: -0.2, z: 0, ease: 'none' }, 0)
    .to(mt15.rotation, { y: Math.PI / 8, ease: 'none' }, 0)
    .to(meteor.position, { x: meteorTargetX, y: -0.2, z: 0, ease: 'none' }, 0)
    .to(meteor.rotation, { y: -Math.PI / 8, ease: 'none' }, 0)
    .to(camera.position, { x: 0, y: 1.5, z: cameraZ, ease: 'none' }, 0);


    // 4. Comparison Performance Block Rotation
    gsap.timeline({
      scrollTrigger: {
        trigger: '#compare-performance',
        start: 'top bottom',
        end: 'bottom top', // spans the whole height of the performance block
        scrub: 1,
      }
    })
    .to(mt15.rotation, { y: Math.PI / 2, ease: 'none' }, 0)
    .to(meteor.rotation, { y: -Math.PI / 2, ease: 'none' }, 0);

    // 5. Comparison Build Block Rotation
    gsap.timeline({
      scrollTrigger: {
        trigger: '#compare-build',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    })
    .to(mt15.rotation, { y: Math.PI / 8, ease: 'none' }, 0)
    .to(meteor.rotation, { y: -Math.PI / 8, ease: 'none' }, 0);

    // 6. Transition to CTA (Final section)
    // Camera tilts up to sky and models fade out backwards
    gsap.timeline({
      scrollTrigger: {
        trigger: '#cta',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    })
    .to(camera.position, { y: 6, z: 2, ease: 'power2.inOut' }, 0) // Look down/up
    .to(mt15.position, { y: -5, ease: 'power2.in' }, 0) // drop away
    .to(meteor.position, { y: -5, ease: 'power2.in' }, 0); // drop away


    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera, mt15Ref, meteorRef, isMobile]);

  return null;
};

export default ScrollAnimationManager;
