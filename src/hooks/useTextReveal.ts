import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useTextReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.gsap-reveal');
    
    elements.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none', // Only play once
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1,
      });
    });

    return () => {
      // We don't necessarily kill all ScrollTriggers here because it might kill 3D ones if used generically,
      // but we can let ScrollTrigger handle cleanup natively or scope it if needed.
    };
  }, []);
};
