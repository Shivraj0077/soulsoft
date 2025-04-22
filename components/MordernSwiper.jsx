'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSwipeable } from 'react-swipeable';

export default function ModernSwiper() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const scrollRef = useRef(null);
  const slidesRef = useRef(null);
  const slideRefs = useRef([]);
  
  // Sample client data - replace with your actual data
  const clients = [
    {
      id: 1,
      logo: '/arcteryx-logo.svg',
      name: 'Arc\'teryx',
      description: 'Production and design along with install oversight and execution support for the SoHo store opening on Broadway St, New York. Also working on creative and production work for a new store opening in Glendale, California.'
    },
    {
      id: 2,
      logo: '/hunter-logo.svg',
      name: 'Hunter',
      description: 'Design and Production partner for Hunter Holiday 2022 Pop-in at Nordstrom 57th St, New York, including activations in Women\'s, Men\'s and Kid\'s zones. Thirty-five (35) additional smaller take-downs in Nordstrom stores across the US.'
    },
    {
      id: 3,
      logo: '/medialink-logo.svg',
      name: 'Medialink',
      description: 'Creative, Design, and Production Partner for 2023 CES. Scope included creation of Branding Identity, Assets, and Digital Content, Design, Production design, Production oversight and Installation of client activations for IBM, Delta, Instacart, and more.'
    },
    {
      id: 4,
      logo: '/after-logo.svg',
      name: 'After',
      description: 'Creative, Design, and Production Partner for 2023 store installations and activations. In-Part product development and creative direction for customized retail displays at Rende, Nordstrom, Saks, and additional Production oversight of a two-month pop-up with clients including Lululemon, The North Face Store, and more.'
    },
  ];

  // Initialize slide refs
  useEffect(() => {
    if (slidesRef.current) {
      slideRefs.current = Array(clients.length)
        .fill()
        .map((_, i) => slideRefs.current[i] || React.createRef());
    }
  }, [clients.length]);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isSwiping || !slidesRef.current) return;
      
      const container = slidesRef.current;
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.clientWidth * 0.85; // 85% of the container width
      
      const newActiveSlide = Math.round(scrollLeft / slideWidth);
      if (newActiveSlide !== activeSlide && newActiveSlide >= 0 && newActiveSlide < clients.length) {
        setActiveSlide(newActiveSlide);
      }
    };

    const slidesContainer = slidesRef.current;
    if (slidesContainer) {
      slidesContainer.addEventListener('scroll', handleScroll);
      return () => slidesContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeSlide, isSwiping, clients.length]);

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipeStart: () => setIsSwiping(true),
    onSwipeEnd: () => {
      setTimeout(() => setIsSwiping(false), 100);
    },
    onSwipedLeft: () => {
      if (activeSlide < clients.length - 1) {
        goToSlide(activeSlide + 1);
      }
    },
    onSwipedRight: () => {
      if (activeSlide > 0) {
        goToSlide(activeSlide - 1);
      }
    },
    trackMouse: true
  });

  // Navigate to a specific slide
  const goToSlide = (index) => {
    if (slidesRef.current && index >= 0 && index < clients.length) {
      setActiveSlide(index);
      const slideWidth = slidesRef.current.clientWidth * 0.85;
      slidesRef.current.scrollTo({
        left: index * slideWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full bg-black text-white">
      <div className="section-title px-5 py-10 relative">
        <h2 className="text-lg font-normal uppercase tracking-wider pl-6 relative">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></span>
          Who We Work With
        </h2>
      </div>
      
      <div 
        className="w-full overflow-x-auto hide-scrollbar pb-16" 
        ref={slidesRef}
        {...handlers}
        style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
      >
        <div className="flex">
          {clients.map((client, index) => (
            <div 
              key={client.id}
              ref={el => slideRefs.current[index] = el}
              className="min-w-[85%] max-w-lg px-8 py-8 border-t border-white/20 scroll-snap-align-start"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="h-12 mb-8 relative">
                <Image 
                  src={client.logo} 
                  alt={`${client.name} logo`}
                  width={160}
                  height={48}
                  className="object-contain object-left h-full"
                />
              </div>
              <p className="text-base leading-relaxed opacity-80 mb-5">
                {client.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-4 left-5 flex gap-2">
        {clients.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-10 h-0.5 transition-all duration-300 ${
              activeSlide === index ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}