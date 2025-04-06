import React, { useEffect, useRef } from 'react';
import styles from './Logo3FS.module.css';

const Logo3FS = () => {
  const logoRef = useRef(null);
  const rippleRef = useRef(null);

  useEffect(() => {
    const logo = logoRef.current;

    const createRipple = (e) => {
      if (rippleRef.current) {
        rippleRef.current.remove();
      }

      const ripple = document.createElement('span');
      ripple.className = styles.ripple;
      rippleRef.current = ripple;

      const rect = logo.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      logo.appendChild(ripple);

      // Xóa ripple sau khi animation hoàn thành
      ripple.addEventListener('animationend', () => {
        ripple.remove();
      });
    };

    const handleMouseEnter = () => {
      logo.classList.add(styles.animate);
    };

    const handleMouseLeave = () => {
      logo.classList.remove(styles.animate);
    };

    const handleMouseMove = (e) => {
      const rect = logo.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      logo.style.setProperty('--mouse-x', `${x}px`);
      logo.style.setProperty('--mouse-y', `${y}px`);
    };

    if (logo) {
      logo.addEventListener('mouseenter', handleMouseEnter);
      logo.addEventListener('mouseleave', handleMouseLeave);
      logo.addEventListener('mousemove', handleMouseMove);
      logo.addEventListener('click', createRipple);
    }

    return () => {
      if (logo) {
        logo.removeEventListener('mouseenter', handleMouseEnter);
        logo.removeEventListener('mouseleave', handleMouseLeave);
        logo.removeEventListener('mousemove', handleMouseMove);
        logo.removeEventListener('click', createRipple);
      }
      if (rippleRef.current) {
        rippleRef.current.remove();
      }
    };
  }, []);

  return (
    <div className={styles.logoContainer}>
      <div ref={logoRef} className={styles.logo}>
        <span className={styles.number}>3</span>
        <div className={styles.text}>
          <span className={styles.f}>F</span>
          <span className={styles.s}>S</span>
        </div>
      </div>
    </div>
  );
};

export default Logo3FS;