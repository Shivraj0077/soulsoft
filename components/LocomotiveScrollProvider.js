// components/LocomotiveScrollProvider.js
import { useEffect, useRef } from 'react';

const LocomotiveScrollProvider = ({ children }) => {
  const containerRef = useRef(null);
  const locomotiveScrollRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initLocomotiveScroll = async () => {
      try {
        // Dynamically import locomotive-scroll
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        
        // Initialize locomotive-scroll
        locomotiveScrollRef.current = new LocomotiveScroll({
          el: document.querySelector('#main'),
          smooth: true,
          lerp: 0.1,
          tablet: {
            smooth: true,
          },
          smartphone: {
            smooth: true,
          },
        });

        // Update scroll on window resize
        window.addEventListener('resize', () => {
          locomotiveScrollRef.current.update();
        });

        // Cleanup locomotive-scroll instance
        return () => {
          if (locomotiveScrollRef.current) {
            locomotiveScrollRef.current.destroy();
            locomotiveScrollRef.current = null;
          }
        };
      } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
      }
    };

    // Add a small delay before initializing locomotive-scroll
    const timeout = setTimeout(() => {
      initLocomotiveScroll();
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default LocomotiveScrollProvider;