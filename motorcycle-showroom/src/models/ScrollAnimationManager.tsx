import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationManagerProps {
  mt15Ref: React.RefObject<THREE.Group>;
  meteorRef: React.RefObject<THREE.Group>;
}

const ScrollAnimationManager: React.FC<ScrollAnimationManagerProps> = ({ mt15Ref, meteorRef }) => {
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
    meteor.scale.set(0, 0, 0); // Hide initially via scale
    meteor.visible = false;
    
    // Initial camera position for Hero
    camera.position.set(4, 1.5, 4);
    camera.lookAt(0, 0, 0);

    // --- Animation Timelines ---

    // 1. Hero -> MT-15 Section
    // Subtle rotation and camera push as user scrolls down the first section
    gsap.timeline({
      scrollTrigger: {
        trigger: '#mt-15',
        start: 'top bottom', // Trigger when MT-15 section top enters bottom of viewport
        end: 'top center',   // End when it reaches the center
        scrub: 1,            // Smooth scrubbing
      }
    })
    .to(mt15.rotation, { y: Math.PI / 6, ease: 'none' }, 0)
    .to(camera.position, { x: 3, y: 1.2, z: 3.5, ease: 'none' }, 0);


    // 2. MT-15 -> Meteor 350 Section
    // Smooth transition from MT-15 to Meteor
    gsap.timeline({
      scrollTrigger: {
        trigger: '#meteor-350',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
    // MT-15 exits left and scales down
    .to(mt15.position, { x: -4, ease: 'none' }, 0)
    .to(mt15.scale, { x: 0, y: 0, z: 0, ease: 'none' }, 0)
    // Meteor enters and scales up
    .set(meteor, { visible: true }, 0)
    .to(meteor.scale, { x: 1, y: 1, z: 1, ease: 'none' }, 0)
    .to(meteor.rotation, { y: -Math.PI / 6, ease: 'none' }, 0)
    // Camera swings around slightly for a cinematic feel
    .to(camera.position, { x: -3, y: 1.5, z: 4, ease: 'none' }, 0);


    // 3. Meteor -> Comparison Section
    // Pull back and show both bikes side-by-side
    gsap.timeline({
      scrollTrigger: {
        trigger: '#compare',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      }
    })
    // Bring MT-15 back in on the left
    .set(mt15, { visible: true }, 0)
    .to(mt15.scale, { x: 1, y: 1, z: 1, ease: 'none' }, 0)
    .to(mt15.position, { x: -1.5, y: -0.2, z: 0, ease: 'none' }, 0)
    .to(mt15.rotation, { y: 0, ease: 'none' }, 0)
    // Move Meteor to the right
    .to(meteor.position, { x: 1.5, y: -0.2, z: 0, ease: 'none' }, 0)
    .to(meteor.rotation, { y: 0, ease: 'none' }, 0)
    // Camera pulls way back and centers
    .to(camera.position, { x: 0, y: 2, z: 6, ease: 'none' }, 0);

    return () => {
      // Cleanup all ScrollTriggers on unmount
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [camera, mt15Ref, meteorRef]);

  return null;
};

export default ScrollAnimationManager;
