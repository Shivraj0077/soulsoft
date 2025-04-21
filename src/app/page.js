"use client";
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import { register } from 'swiper/element/bundle';
import dynamic from 'next/dynamic';
import '../style.css';
// Import swiper styles
import 'swiper/css';
import 'swiper/css/bundle';



// Import locomotive scroll dynamically with no SSR
const LocomotiveScrollProvider = dynamic(
  () => import('../../components/LocomotiveScrollProvider'),
  { ssr: false }
);

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [fixedImage, setFixedImage] = useState(null);
  const elemContainerRef = useRef(null);

  useEffect(() => {
    // Register Swiper web components
    register();

    // Simulate loader
    const loaderTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Setup event listeners for the elements with data-image
    const setupElementHoverEffects = () => {
      if (typeof window !== 'undefined') {
        const elems = document.querySelectorAll('.elem');
        
        elems.forEach((elem) => {
          elem.addEventListener('mouseenter', () => {
            const image = elem.getAttribute('data-image');
            setFixedImage(image);
            const fixedImageEl = document.querySelector('#fixed-image');
            if (fixedImageEl) {
              fixedImageEl.style.backgroundImage = `url(${image})`;
              fixedImageEl.style.opacity = 1;
            }
          });
          
          elem.addEventListener('mouseleave', () => {
            const fixedImageEl = document.querySelector('#fixed-image');
            if (fixedImageEl) {
              fixedImageEl.style.opacity = 0;
            }
          });
        });
      }
    };

    // Initialize everything after the component mounts
    if (!isLoading) {
      setupElementHoverEffects();
      
      // Configure Swiper
      const swiperEl = document.querySelector('swiper-container');
      if (swiperEl) {
        const swiperParams = {
          slidesPerView: 4,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 2500,
            disableOnInteraction: false,
          },
          breakpoints: {
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          },
        };
        
        // Assign parameters to Swiper element
        Object.assign(swiperEl, swiperParams);
        
        // Initialize Swiper
        swiperEl.initialize();
      }
    }

    return () => {
      clearTimeout(loaderTimeout);
    };
  }, [isLoading]);

  return (
    <>
      <Head>
        <title>Sundown Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>

      {isLoading && (
        <div id="loader">
          <h1>ENVIRONMENTS</h1>
          <h1>EXPERIENCES</h1>
          <h1>CONTENT</h1>
        </div>
      )}

      <div id="fixed-image" style={{ backgroundImage: fixedImage ? `url(${fixedImage})` : 'none' }}></div>

      <div id="main">
        <div id="page1">
          <nav>
            <Image 
              src="https://uploads-ssl.webflow.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15c2_Sundown%20logo.svg"
              alt="Sundown Logo"
              width={150}
              height={50}
            />
            <div id="nav-part2">
              <h4><a href="#">Work</a></h4>
              <h4><a href="#">Studio</a></h4>
              <h4><a href="#">Contact</a></h4>
            </div>
            <h3>Menu</h3>
          </nav>
          
          <div id="center">
            <div id="left">
              <h3>Soulsoft Infotech: Innovative, tailored solutions that simplify, streamline, and scale your business.

.</h3>
            </div>
            <div id="right">
  <h1>
    SOUL SOFT <br />
    INFOTECH <br />
    <span id="customized"></span>
  </h1>
  <h2 className="subtitle">customized software solutions</h2>
</div>
          </div>
          
          <div id="hero-shape">
            <div id="hero-1"></div>
            <div id="hero-2"></div>
            <div id="hero-3"></div>
          </div>
          
          <video autoPlay loop muted src="/video.mp4"></video>
        </div>

        <div id="page2">
          <div id="moving-text">
            {[1, 2, 3].map((i) => (
              <div className="con" key={i}>
                <h1>EXPERIENCES</h1>
                <div id="gola"></div>
                <h1>CONTENT</h1>
                <div id="gola"></div>
                <h1>ENVIRONMENTS</h1>
                <div id="gola"></div>
              </div>
            ))}
          </div>
          
          <div id="page2-bottom">
            <h1>We are a group of design-driven, goal-focused creators, producers, and designers who believe that the details make all the difference.</h1>
            <div id="bottom-part2">
              <Image 
                src="https://uploads-ssl.webflow.com/64d3dd9edfb41666c35b15b7/64d3dd9edfb41666c35b15d1_Holding_thumb-p-500.jpg"
                alt="Team"
                width={500}
                height={300}
              />
              <p>We love to create, we love to solve, we love to collaborate, and we love to turn amazing ideas into reality. We&apos;re here to partner with you through every step of the process and know that relationships are the most important things we build.</p>
            </div>
          </div>
          
          <div id="gooey"></div>
        </div>

        <div id="page3">
          <div id="elem-container" ref={elemContainerRef}>
            <div 
              id="elem1" 
              className="elem"
              data-image="https://images.unsplash.com/photo-1701001308648-7b731a52b8d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>Makers Studio HOI</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1700975928909-da4a46227a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
            >
              <div className="overlay"></div>
              <h2>50th Anniversary</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1701077137611-9be394bf62f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>NYFW Popup</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1701014159309-4a8b84faadfe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>Air Force 1 2021</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1700924546093-f914fd5b8814?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyOHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>SOHO NYC</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1700601437860-e66da79cf6d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1OXx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>SOHO 2023</h2>
            </div>
            
            <div 
              className="elem"
              data-image="https://images.unsplash.com/photo-1700769025506-6c3dcb9ec9b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw2OXx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2>Play New Kidvision</h2>
            </div>
          </div>
        </div>

        <div id="page4">
          <swiper-container init="false">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
            <swiper-slide>Slide 4</swiper-slide>
            <swiper-slide>Slide 5</swiper-slide>
            <swiper-slide>Slide 6</swiper-slide>
            <swiper-slide>Slide 7</swiper-slide>
          </swiper-container>
        </div>

        <div id="page5"></div>

        <div id="full-scr">
          <div id="full-div1"></div>
        </div>
      </div>

      <div id="footer">
        <div id="footer-div"></div>
        <h1>Sundown</h1>
        <div id="footer-bottom"></div>
      </div>
      
      

      {/* Load locomotive-scroll from CDN (necessary for client-side) */}
      <Script 
        src="https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.js"
        strategy="lazyOnload"
      />
    </>
  );
}