"use client";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import Script from "next/script";
import { register } from "swiper/element/bundle";
import dynamic from "next/dynamic";
import { HeroScrollDemo } from "./globe/page";
import ScrollToHash from "./ScrollToHash";
import { Menu, X } from 'lucide-react';
import "../style.css";
// Import swiper styles
import "swiper/css";
import "swiper/css/bundle";
import CustomCursor from "../../components/CustomCursor";
import ModernSwiper from "../../components/MordernSwiper";
import LineSlides from "../../components/LineSlide";
import Footer from "../../components/Footer";
import WorldMap from "@/components/ui/world-map";
import { NavbarDemo } from "../../components/Navbar";
import Link from "next/link";

import { BentoGridDemo } from "../../components/globe";
import { CompareDemo } from "../../components/Before";
import { WobbleCardDemo } from "../../components/card";
import InlineNavbar from "../../components/Navbar";
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
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <InlineNavbar />
      <Head>
        <title>soulsoft</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/icon.png" />
      </Head>
    
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

          <video
           
            autoPlay
            loop
            muted
        
            src="/SOLO.mp4"
            
            
          ></video>

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

          <div id="gooey">
          
          </div>
        </div>
        
        <ScrollToHash />
          
        <div id="page3">
        <div id="page3">
        <div id="page3">
        <div id="page3">
        <div style={{ textAlign: "center", marginBottom: "150px", marginTop: "-150px" }}>
  <h2  className="services"style={{ 
    fontSize: "3rem", 
    fontWeight: "600", 
    color: "white"
  }}>
    Our Services
  </h2>
</div>
<section id="services">   
  <div
    id="elem-container"
    ref={elemContainerRef}
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "30px",
      padding: "30px",
      justifyContent: "space-between",
      marginTop: "-150px",
      position: "relative",
      zIndex: "10",
    }}
  >
    {[
      { label: "E-commerce", link: "/dp/ecomerce" },
      { label: "Digital Marketing", link: "/dp" },
      { label: "Web Design and Development", link: "/webdev" },
      { label: "Learning Management System", link: "/lms" },
      { label: "Windows Billing Software", link: "/billlingsoftware" },
      { label: "Software Development", link: "/software" },
      { label: "Customer Relationship Management", link: "/crm" },
      { label: "Mobile App Development", link: "/android" },
    ].map((item, index) => (
      <a
        key={index}
        href={item.link}
        className="group"
        style={{
          flex: "2 2 auto",
          minWidth: "200px",
          padding: "30px",
          backgroundColor: "#EFEAE3",
          borderRadius: "15px",
          textDecoration: "none",
          color: "black",
          fontSize: "2rem",
          fontWeight: "400",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "all 0.3s ease",
          transform: "translateY(0px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.querySelector(".arrow").style.transform = "translateX(5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.querySelector(".arrow").style.transform = "translateX(0px)";
        }}
      >
        <span>{item.label}</span>
        <span
          className="arrow"
          style={{
            fontSize: "1.5rem",
            transition: "transform 0.3s ease",
          }}
        >
          →
        </span>
      </a>
    ))}

 <CompareDemo/>
 

</div>
</section>


</div>

</div>

</div>



<div className="w-full overflow-hidden">
      <style>
        {`
          .full-width-video-container {
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
            overflow: hidden;
            border-radius: 50px;
            padding: 0 20px;
          }
          
          .full-width-video-container video {
            width: 100%;
            height: auto;
            display: block;
             border-radius: 30px;
          }
        `}
      </style>
      
      <div className="full-width-video-container">
        <video 
          autoPlay
          muted
          loop
          src="/fotter.mp4"
        ></video>
      </div>
    </div>










</div>
      </div>
      {/* Replace your current page5 div with this */}
    


  
    
  
      



      

     
      
          <Footer />
       
  
 
     

      {/* Load locomotive-scroll from CDN (necessary for client-side) */}
      <Script
        src="https://cdn.jsdelivr.net/npm/locomotive-scroll@3.5.4/dist/locomotive-scroll.js"
        strategy="lazyOnload"
      />

    </>
  );
}
