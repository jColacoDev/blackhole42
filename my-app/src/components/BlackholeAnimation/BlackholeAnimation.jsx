import React, { useEffect, useRef, useState } from 'react';
import './BlackholeAnimation.css';

const BlackholeAnimation = ({message}) => {
  const containerRef = useRef(null);
  const message_dp = "DON'T PANIC!"

  useEffect(() => {
    const container = containerRef.current;

    const handleAnimationStart = () => {
      container.style.overflow = 'hidden';
    };

    const handleAnimationEnd = () => {
      container.style.overflow = 'auto';
    };

    return () => {
      container.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className='BlackholeAnimation' ref={containerRef}>
      <bh-container onAnimationStart={() => handleAnimationStart()} onAnimationEnd={() => handleAnimationEnd()}>
        <bh-42>
          <spa className="dp">{message_dp}</spa>
          <span className="message">{message}</span>
        </bh-42>
        <bh-doppler></bh-doppler>
        <bh-photon-ring></bh-photon-ring>
        <bh-accretion></bh-accretion>
        <bh-backdrop></bh-backdrop>
        <bh-shadow></bh-shadow>
      </bh-container>
    </div>
  );
};

export default BlackholeAnimation;
