"use client";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { register } from "swiper/element/bundle";
import dynamic from "next/dynamic";
import "../style.css";
// Import swiper styles
import "swiper/css";
import "swiper/css/bundle";
import CustomCursor from "../../components/CustomCursor";
import ModernSwiper from "../../components/MordernSwiper";
import LineSlides from "../../components/LineSlide";
import Footer from "../../components/Footer";

// Import locomotive scroll dynamically with no SSR
const LocomotiveScrollProvider = dynamic(
  () => import("../../components/LocomotiveScrollProvider"),
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
      if (typeof window !== "undefined") {
        const elems = document.querySelectorAll(".elem");

        elems.forEach((elem) => {
          elem.addEventListener("mouseenter", () => {
            const image = elem.getAttribute("data-image");
            setFixedImage(image);
            const fixedImageEl = document.querySelector("#fixed-image");
            if (fixedImageEl) {
              fixedImageEl.style.backgroundImage = `url(${image})`;
              fixedImageEl.style.opacity = 1;
            }
          });

          elem.addEventListener("mouseleave", () => {
            const fixedImageEl = document.querySelector("#fixed-image");
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
      const swiperEl = document.querySelector("swiper-container");
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

  useEffect(() => {
    const swiperEl = document.querySelector("swiper-container");
    if (swiperEl) {
      const swiperParams = {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 100,
      };

      Object.assign(swiperEl, swiperParams);
      swiperEl.initialize();
    }
  }, []);

  return (
    <>
      <Head>
        <title>soulsoft</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <div className="custom-cursor">
        <span>Soulsoft</span>
      </div>
      <CustomCursor />

      {isLoading && (
        <div id="loader">
          <h1>SOULSOFT</h1>
          <h1>INFOTECH</h1>
          <h1>SOFTWARE SOLUTIONS</h1>
        </div>
      )}

      <div
        id="fixed-image"
        style={{ backgroundImage: fixedImage ? `url(${fixedImage})` : "none" }}
      ></div>

      <div id="main">
        <div id="page1">
          <nav>
            <Image src="/so.png" alt="soulsoft Logo" width={200} height={60} />
            <div id="nav-part2">
              <h4>
                <a href="#">product</a>
              </h4>
              <h4>
                <a href="#">about</a>
              </h4>
              <h4>
                <a href="#">Contact</a>
              </h4>
              <h4>
                <a href="#">review</a>
              </h4>
              <h4>
                <a href="#">jobs</a>
              </h4>
            </div>
            <h3>Menu</h3>
          </nav>

          <div id="center">
            <div id="left">
              <h3>
                Soulsoft Infotech: Innovative, tailored solutions that simplify,
                streamline, and scale your business. .
              </h3>
            </div>
            <div id="right">
              <h1>
                SOULSOFT <br />
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

          <div
            id="arrow-container"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            <span style={{ fontSize: "24px", display: "inline-block" }}></span>
          </div>
        </div>

        <div id="page2">
          <div id="moving-text">
            {[1, 2, 3].map((i) => (
              <div className="con" key={i}>
                <h1>EXPERTISE</h1>
                <div id="gola"></div>
                <h1>SOLUTION</h1>
                <div id="gola"></div>
                <h1>TRUSTWORTHY</h1>
                <div id="gola"></div>
              </div>
            ))}
          </div>

          <div id="page2-bottom">
            <h1 style={{ color: "white" }}>
              We deliver smart, modern solutions to help your business grow.
              Explore our services below to see how{" "}
              <span style={{ color: "black" }}>we can tailor</span> to meet your{" "}
              <span style={{ color: "black" }}> unique needs.</span>
            </h1>

            <div id="bottom-part2">
              <Image
                src="/pexels-fauxels-3183188.jpg"
                alt="metting"
                width={600}
                height={360}
              />
              <p>
                With 14+ years of experience, our expert team understands what
                your business needs to succeed. We work closely with you to
                deliver modern, reliable, and customized solutions. From
                planning to launch, we&apos;re committed to turning your vision into
                reality.
              </p>
            </div>
          </div>

          <div id="gooey"></div>
        </div>
        
       
          
        <div id="page3" >
          <div id="elem-container" ref={elemContainerRef}>
            <div
              id="elem1"
              className="elem"
              data-image="https://images.unsplash.com/photo-1701001308648-7b731a52b8d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              
              <h2 className="flex items-center gap-[1cm]">E-commerce</h2>
              <h2 className="flex items-center gap-[1cm]">Digital Marketing</h2>
            </div>
            <div
              id="elem1"
              className="elem"
              data-image="https://images.unsplash.com/photo-1701001308648-7b731a52b8d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2 className="flex items-center gap-[1cm]">
                Web Design and Development
              </h2>
              <h2 className="flex items-center gap-[1cm]">
                Learning Management System
              </h2>
            </div>
            <div
              id="elem1"
              className="elem"
              data-image="https://images.unsplash.com/photo-1701001308648-7b731a52b8d7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHx8fA%3D%3D"
            >
              <div className="overlay"></div>
              <h2 className="flex items-center gap-[1cm]">
                Windows Billing Software
              </h2>
              <h2 className="flex items-center gap-[1cm]">
                Software Development
              </h2>
            </div>

            <div
              className="elem"
              data-image="https://images.unsplash.com/photo-1700975928909-da4a46227a47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw0fHx8ZW58MHx8fHx8"
            >
              <div className="overlay"></div>
              <h2 className="flex items-center gap-4">
                Customer Relationship Management
              </h2>
              <h2 className="flex items-center gap-[1cm]">
                Mobile App Development
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* Replace your current page5 div with this */}
<div id="page5" style={{
  height: "50vh",
  width: "100%",
  backgroundColor: "#EFEAE3",
  display: "flex",
  position: "relative",
  zIndex: "20"
}}>
  <div style={{
    flex: "1",
    borderRight: "3px solid #ddd",
    padding: "30px",
    display: "flex",
    flexDirection: "column"
  }}>
  
    <h1 style={{fontWeight: "350", color:"black", fontSize:"20"}}> we ensure uninterrupted assistance with our round-the-clock customer support. Whether you need technical help or quick answers, our team is just a call or click away.</h1>
  </div>
  
  <div style={{
    flex: "1",
    borderRight: "3px solid #ddd",
    padding: "30px",
    display: "flex",
    flexDirection: "column"
  }}>
   
    <h1 style={{fontWeight: "350", color:"black",fontSize:"20"}}>Our skilled professionals bring years of experience to deliver innovative solutions. With technical expertise and a client-focused approach, we ensure your business achieves its goals seamlessly.</h1>
  </div>
  
  <div style={{
    flex: "1",
    padding: "30px",
    display: "flex",
    flexDirection: "column"
  }}>
  
    <h1 style={{fontWeight: "350" ,color:"black",fontSize:"20"}}>We provide tailored solutions to simplify processes, enhance efficiency, and drive growth. At Soulsoft Infotech, we combine creativity and technology to empower your business for success.</h1>
  </div>
</div>
  
      <div id="page6">
  <div className="slides-container" style={{ 
    display: "flex", 
    width: "100%", 
    height: "100vh",
    backgroundColor: "#EFEAE3",
    borderTop: "1px solid #ddd"
  }}>
    <div className="slide" style={{ 
      flex: "1", 
      padding: "2rem", 
      position: "relative",
      borderRight: "1px solid #ddd" 
    }}>
      <h3 style={{ fontWeight: "500", fontSize: "1.5rem", fontFamily: "neu" }}>Slide 2</h3>
      <div className="slide-content" style={{ marginTop: "2rem" }}>
        <p style={{ fontWeight: "100", lineHeight: "1.6" }}>Your content for slide 2 goes here. Match the minimal aesthetic with clean typography.</p>
      </div>
    </div>
    
    <div className="slide" style={{ 
      flex: "1", 
      padding: "2rem", 
      position: "relative",
      borderRight: "1px solid #ddd" 
    }}>
      <h3 style={{ fontWeight: "500", fontSize: "1.5rem", fontFamily: "neu" }}>Slide 3</h3>
      <div className="slide-content" style={{ marginTop: "2rem" }}>
        <p style={{ fontWeight: "100", lineHeight: "1.6" }}>Your content for slide 3 goes here. Use the &apos;neu&apos; font with lighter weight for body text.</p>
      </div>
    </div>
    
    <div className="slide" style={{ 
      flex: "1", 
      padding: "2rem", 
      position: "relative"
    }}>
      <h3 style={{ fontWeight: "500", fontSize: "1.5rem", fontFamily: "neu" }}>Slide 4</h3>
      <div className="slide-content" style={{ marginTop: "2rem" }}>
        <p style={{ fontWeight: "100", lineHeight: "1.6" }}>Your content for slide 4 goes here. Keep the design clean and minimal like the rest of your site.</p>
      </div>
    </div>
  </div>
</div>


      

      <div id="footer">
        <div id="footer-div"></div>
        <h1>
          <Footer />
       </h1>
      </div>
      
     

      {/* Load locomotive-scroll from CDN (necessary for client-side) */}
      <Script
        src="https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.js"
        strategy="lazyOnload"
      />

    </>
  );
}
