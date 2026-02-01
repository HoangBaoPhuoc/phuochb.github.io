import React, { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (spotlightRef.current) {
        const x = e.clientX;
        const y = e.clientY;
        spotlightRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(56, 189, 248, 0.15), transparent 80%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="pointer-events-none fixed inset-0 z-30 opacity-80"
      style={{
        background: 'transparent',
      }}
    />
  );
}
