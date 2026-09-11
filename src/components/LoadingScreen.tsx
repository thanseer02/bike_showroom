import React, { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';

const LoadingScreen: React.FC = () => {
  const { progress, active } = useProgress();
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(true);

  // We want to ensure it shows for at least a minimum amount of time to avoid flash
  // but also smoothly transition out when progress is 100
  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.3,
        ease: 'power2.out',
      });
    }

    if (progress === 100 || (!active && progress === 0)) {
      // Small delay so users see 100%
      const tl = gsap.timeline({
        delay: 0.5,
        onComplete: () => setMounted(false),
      });

      tl.to(textRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.inOut' })
        .to(progressBarRef.current, { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, '<')
        .to(containerRef.current, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, '-=0.2');
    }
  }, [progress, active]);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div ref={textRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#ffffff', fontSize: '2rem', letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 300 }}>
          Showroom
        </h1>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', letterSpacing: '2px', marginBottom: '2rem' }}>
          {Math.round(progress)}%
        </div>
      </div>
      
      {/* Minimal Progress Bar */}
      <div style={{ width: '200px', height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
        <div
          ref={progressBarRef}
          style={{
            width: '0%',
            height: '100%',
            backgroundColor: 'var(--color-accent)',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
