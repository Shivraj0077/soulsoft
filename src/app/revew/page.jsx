"use client";
import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Script from 'next/script';
import './stylee.css';
import './animate.min.css';
import './style.css';
import './owl.carousel.min.css';
import './jquery.fancybox.min.css';
import './bootstrap.min.css';
import './aos.css';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Client-side only code
    }
  }, []);

  return (
    <>
      <div
        className="unslate_co--site-wrap"
        style={{
          position: 'relative',
          overflowX: 'hidden',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          backgroundColor: '#000', // Ensure no white background
        }}
      >
        <div
          className="unslate_co--site-inner"
          style={{
            margin: 0,
            padding: 0,
            backgroundColor: '#000', // Match the main background
          }}
        >
          <div className="lines-wrap">
            <div className="lines-inner  lines-inner"></div>
          </div>
          {/* END lines */}

          <div
            className="cover-v1 jarallax"
            style={{
              position: 'relative',
              marginTop: '-2cm',
              overflow: 'hidden',
            }}
            id="home-section"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: -1,
              }}
            >
              <source src="/circle.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-9 mx-auto text-center">
                  <h1
                    className="heading gsap-reveal-hero"
                    style={{ fontSize: '100px' }}
                  >
                    SOULSOFT
                  </h1>
                  <h2
                    className="subheading gsap-reveal-hero"
                    style={{ fontSize: '30px' }}
                  >
                    Read about our work and our reviews
                  </h2>
                </div>
              </div>
            </div>

            <a
              href="#portfolio-section"
              className="mouse-wrap smoothscroll"
            >
              <span className="mouse">
                <span className="scroll"></span>
              </span>
              <span className="mouse-label">Scroll</span>
            </a>
          </div>
          {/* END .cover-v1 */}

          <div className="unslate_co--section" id="portfolio-section">
            <div className="container">
              <div className="relative">
               
              </div>
              <div id="portfolio-single-holder"></div>

              <div className="portfolio-wrapper">
                <div className="d-flex align-items-center mb-4 gsap-reveal gsap-reveal-filter">
                  <h2 className="mr-auto heading-h2">
                    <span className="gsap-reveal">Our youtube videos</span>
                  </h2>
                </div>

                <div id="posts" className="row gutter-isotope-item">
                  <div className="item web branding col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=OGsO4XIuxC0&t=1s"
                      className="portfolio-item isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-link2"></span>
                        <div className="portfolio-item-content">
                          <h3>Shetkari Krushi Software</h3>
                          <p>Track Sales, Purchases & Dues with Ease</p>
                        </div>
                      </div>
                      <img
                        src="images/shetkari.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item branding packaging illustration col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=cgPNFA8y_U0"
                      className="portfolio-item item-portrait isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-link2"></span>
                        <div className="portfolio-item-content">
                          <h3>K-Bazzar Billing Software</h3>
                          <p>solution to solve various problems in your grocery business</p>
                        </div>
                      </div>
                      <img
                        src="images/k-bazar.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item branding packaging col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=b-vLaye6f_I&t=3s"
                      className="portfolio-item isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-link2"></span>
                        <div className="portfolio-item-content">
                          <h3>Shopcare Billing Software</h3>
                          <p>easy billing software for every business!</p>
                        </div>
                      </div>
                      <img
                        src="images/shop.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item web packaging col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=CHP5k1No-RM"
                      className="portfolio-item isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-photo2"></span>
                        <div className="portfolio-item-content">
                          <h3>pharmacy billing software</h3>
                          <p>desktop billing software for pharmacies</p>
                        </div>
                      </div>
                      <img
                        src="images/pharma.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item illustration packaging col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=icBpP1T1Rpw"
                      className="portfolio-item isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-photo2"></span>
                        <div className="portfolio-item-content">
                          <h3>See our Office</h3>
                          <p>Our employees are ready to make your business grow</p>
                        </div>
                      </div>
                      <img
                        src="images/sir.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item web branding col-sm- col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=b-qQ-l1nDJ0"
                      className="portfolio-item item-portrait isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-link2"></span>
                        <div className="portfolio-item-content">
                          <h3>pc-vision</h3>
                          <p>Pharmacy billing software</p>
                        </div>
                      </div>
                      <img
                        src="images/pc.png"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>

                  <div className="item web illustration col-sm-6 col-md-6 col-lg-4 isotope-mb-2">
                    <a
                      href="https://www.youtube.com/watch?v=fRclaSRZ7eM&list=WL&index=4&t=5s"
                      className="portfolio-item isotope-item gsap-reveal-img"
                      target="_blank"
                      rel="noopener"
                    >
                      <div className="overlay">
                        <span className="wrap-icon icon-photo2"></span>
                        <div className="portfolio-item-content">
                          <h3>serveorder elite</h3>
                          <p>Hotel bar billing software</p>
                        </div>
                      </div>
                      <img
                        src="images/fRclaSRZ7eM-HD.jpg"
                        className="lazyload img-fluid"
                        alt="Images"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="unslate_co--section" id="about-section">
            <div className="container">
              <div className="section-heading-wrap text-center mb-5">
                <h2 className="heading-h2 text-center divider">
                  <span className="gsap-reveal">About Me</span>
                </h2>
                <span className="gsap-reveal">
                  <img src="images/divider.png" alt="divider" width="76" />
                </span>
              </div>

              <div className="row mt-5 justify-content-between">
                <div className="col-lg-7 mb-5 mb-lg-0">
                  <figure className="dotted-bg gsap-reveal-img">
                    <img
                      src="images/prasad.jpeg"
                      alt="Image"
                      className="img-fluid"
                    />
                  </figure>
                </div>
                <div className="col-lg-4 pr-lg-5">
                  <h3 className="mb-4 heading-h3">
                    <span className="gsap-reveal">We can build it together</span>
                  </h3>

                  <div
                    className="mb-4 gsap-reveal"
                    style={{ color: 'white' }}
                  >
                    Passionate software developer transforming ideas into digital reality. With expertise in React, CodeIgniter 4, C#.NET, and WordPress, I thrive in full-stack web development and Windows desktop applications. From crafting responsive interfaces with Bootstrap to streamlining retail operations and optimizing ERP solutions, my focus is on delivering innovative software for diverse industries.

                    A driving force in the Indian tech scene, I specialize in software solutions for Argo Shops, Supermarkets, Medical & Hospital, Hotels, Resorts and more. With a knack for blending creativity and efficiency, I bring 360° development prowess. Let's connect and amplify your digital presence with cutting-edge software solutions.
                  </div>
                  <p className="gsap-reveal">
                    <a
                      href="https://www.linkedin.com/in/prasad-godage-98739619/"
                      className="btn btn-outline-pill btn-custom-light"
                      target="_blank"
                    >
                      My LinkedIn
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="unslate_co--section" id="services-section">
            <div className="container">
              <div className="section-heading-wrap text-center mb-5">
                <h2 className="heading-h2 text-center divider">
                  <span className="gsap-reveal">My Services</span>
                </h2>
                <span className="gsap-reveal">
                  <img src="images/divider.png" alt="divider" width="76" />
                </span>
              </div>

              <div className="row gutter-v3">
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="0">
                    <div className="wrap-icon mb-3" style={{ color: 'white' }}>
                      <img
                        src="images/svg/001-options.svg"
                        alt="Image"
                        width="45"
                      />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      Digital <br /> Strategy
                    </h3>
                    <p style={{ color: 'white' }}>
                      We provide digital strategy for your business to grow.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="100">
                    <div className="wrap-icon mb-3">
                      <img src="images/svg/002-chat.svg" alt="Icon" width="45" />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      Web and app <br /> Design
                    </h3>
                    <p style={{ color: 'white' }}>
                      We provide web and app design for your business that fulfill your needs.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="200">
                    <div className="wrap-icon mb-3">
                      <img
                        src="images/svg/003-contact-book.svg"
                        alt="Image"
                        className="img-fluid"
                        width="45"
                      />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      User <br /> Experience
                    </h3>
                    <p style={{ color: 'white' }}>
                      We focus on SEO and user experience for your business.
                    </p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="0">
                    <div className="wrap-icon mb-3">
                      <img
                        src="images/svg/004-percentage.svg"
                        alt="Image"
                        width="45"
                      />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      Software <br /> Development
                    </h3>
                    <p style={{ color: 'white' }}>
                      Specialized software for your business.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="100">
                    <div className="wrap-icon mb-3">
                      <img src="images/svg/006-goal.svg" alt="Image" width="45" />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      WordPress <br /> Solutions
                    </h3>
                    <p style={{ color: 'white' }}>
                      We also provide WordPress solutions.
                    </p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="feature-v1" data-aos="fade-up" data-aos-delay="200">
                    <div className="wrap-icon mb-3">
                      <img
                        src="images/svg/005-line-chart.svg"
                        alt="Image"
                        width="45"
                      />
                    </div>
                    <h3 style={{ color: 'white' }}>
                      POS <br /> Products
                    </h3>
                    <p style={{ color: 'white' }}>
                      We have various products for your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="unslate_co--section section-counter" id="skills-section">
            <div className="container">
              <div className="section-heading-wrap text-center mb-5">
                <h2 className="heading-h2 text-center divider">
                  <span style={{ color: 'white' }} className="gsap-reveal">Served Over</span>
                </h2>
                <span className="gsap-reveal">
                  <img src="images/divider.png" alt="divider" width="76" />
                </span>
              </div>

              <div className="row pt-5 justify-content-center">
                <div
                  className="col-12 col-sm-8 col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  <div className="counter-v1 text-center">
                    <span className="number-wrap">
                      <span className="number number-counter" data-number="3000">
                        0
                      </span>
                    </span>
                    <span style={{ color: 'white' }} className="counter-label">Clients Served</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END .counter */}

          <div className="unslate_co--section" id="testimonial-section">
            <div className="container">
              <div className="section-heading-wrap text-center mb-5">
                <h2 className="heading-h2 text-center divider">
                  <span className="gsap-reveal">My Happy Clients</span>
                </h2>
                <span className="gsap-reveal">
                  <img src="images/divider.png" alt="divider" width="76" />
                </span>
              </div>
            </div>

            <div className="owl-carousel testimonial-slider" data-aos="fade-up">
              <div>
                <div className="testimonial-v1">
                  <div className="testimonial-inner-bg">
                    <span className="quote">“</span>
                    <blockquote style={{ color: 'white' }}>
                      I was consistently impressed by the team's passion and dedication to delivering high-quality results. The company's emphasis on innovation and creativity allowed me to think outside the box and develop novel solutions. One of my proudest accomplishments was leading a cross-functional team to launch a new product, which exceeded sales projections. While the fast-paced environment could be demanding at times, I appreciated the opportunities for growth and development. I highly recommend this company to anyone looking for a dynamic and entrepreneurial work environment.
                    </blockquote>
                  </div>

                  <div className="testimonial-author-info">
                    <img
                      src="images/surbhi.png"
                      alt="Image"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                      }}
                    />
                    <h3 style={{ color: 'white' }}>Surbhi Jain</h3>
                  </div>
                </div>
              </div>

              <div>
                <div className="testimonial-v1">
                  <div className="testimonial-inner-bg">
                    <span className="quote">“</span>
                    <blockquote style={{ color: 'white' }}>
                      I had a great experience with Soulsoft Infotech Pvt Ltd. Their team is highly professional, skilled, and dedicated to delivering quality software solutions. They understood our business requirements well and provided a customized solution that met our expectations. The project was delivered on time, and their customer support was responsive and helpful throughout the process. I appreciate their technical expertise and problem-solving approach. However, there is always room for improvement in terms of communication and post-deployment support. Overall, I would highly recommend Soulsoft Infotech Pvt Ltd to businesses looking for reliable IT solutions.
                    </blockquote>
                  </div>

                  <div className="testimonial-author-info">
                    <img
                      src="images/prattik.png"
                      alt="Image"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                      }}
                    />
                    <h3 style={{ color: 'white' }}>Aniket Sonawane</h3>
                  </div>
                </div>
              </div>

              <div>
                <div className="testimonial-v1">
                  <div className="testimonial-inner-bg">
                    <span className="quote">“</span>
                    <blockquote style={{ color: 'white' }}>
                      SoulSoft Infotech is a well-regarded IT solutions provider specializing in software development, POS systems, web and mobile app development, and digital marketing. Based on online reviews, the company has a strong reputation for quality service and customer satisfaction. Employee feedback highlights a positive work culture, job security, and a good work-life balance. As an outsider, it seems like a reliable firm for businesses looking for tailored IT solutions. However, firsthand client testimonials and project case studies would provide a clearer picture of their service quality.
                    </blockquote>
                  </div>

                  <div className="testimonial-author-info">
                    <img
                      src="images/aniket.png"
                      alt="Image"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #fff',
                      }}
                    />
                    <h3 style={{ color: 'white' }}>Rohit Deore</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END testimonial */}

          <div className="unslate_co--section" id="journal-section">
            <div className="container">
              <div className="section-heading-wrap text-center mb-5">
                <h2 className="heading-h2 text-center divider">
                  <span className="gsap-reveal">My Journal</span>
                </h2>
                <span className="gsap-reveal">
                  <img src="images/divider.png" alt="divider" width="76" />
                </span>
              </div>

              <div className="row gutter-v4 align-items-stretch">
                <div
                  className="col-sm-6 col-md-6 col-lg-8 blog-post-entry"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  <a
                    href="blog-single.html"
                    className="grid-item blog-item w-100 h-100"
                  >
                    <div className="overlay">
                      <div className="portfolio-item-content">
                        <h3>Soulsoft</h3>
                        <p className="post-meta">
                          <span className="small">•</span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="images/card.jpg"
                      className="lazyload"
                      alt="Image"
                    />
                  </a>
                </div>

                <div
                  className="col-sm-6 col-md-6 col-lg-4 blog-post-entry"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <a
                    href="blog-single.html"
                    className="grid-item blog-item w-100 h-100"
                  >
                    <div className="overlay">
                      <div className="portfolio-item-content">
                        <h3>Our office</h3>
                        <p className="post-meta">
                          <span className="small">•</span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="images/office2.jpg"
                      className="lazyload"
                      alt="Image"
                    />
                  </a>
                </div>

                <div
                  className="col-sm-6 col-md-6 col-lg-4 blog-post-entry"
                  data-aos="fade-up"
                  data-aos-delay="0"
                >
                  <a
                    href="blog-single.html"
                    className="grid-item blog-item w-100 h-100"
                  >
                    <div className="overlay">
                      <div className="portfolio-item-content">
                        <h3>Perfect team for your help</h3>
                        <p className="post-meta">
                          <span className="small"></span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="images/office.jpg"
                      className="lazyload"
                      alt="Image"
                    />
                  </a>
                </div>

                <div
                  className="col-sm-6 col-md-6 col-lg-4 blog-post-entry"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <a
                    href="blog-single.html"
                    className="grid-item blog-item w-100 h-100"
                  >
                    <div className="overlay">
                      <div className="portfolio-item-content">
                        <h3>Prasad Godage</h3>
                        <p className="post-meta">
                          CEO <span className="small">•</span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="images/prasadsir.jpg"
                      className="lazyload"
                      alt="Image"
                    />
                  </a>
                </div>

                <div
                  className="col-sm-6 col-md-6 col-lg-4 blog-post-entry"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <a
                    href="blog-single.html"
                    className="grid-item blog-item w-100 h-100"
                  >
                    <div className="overlay">
                      <div className="portfolio-item-content">
                        <h3>Dipali P. Godage</h3>
                        <p className="post-meta">
                          CTO <span className="small">•</span>
                        </p>
                      </div>
                    </div>
                    <img
                      src="images/maam.jpg"
                      className="lazyload"
                      alt="Image"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* END blog posts */}
        </div>
      </div>
      {/* Loader */}

      {/* Scripts */}
      <Script src="js/scripts-dist.js" strategy="beforeInteractive" />
      <Script src="js/main.js" strategy="afterInteractive" />
    </>
  );
}