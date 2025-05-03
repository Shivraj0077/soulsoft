"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, ShoppingCart, Search, Smartphone, Check, ChevronDown, ChevronUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, CheckCircle, HeartHandshake, Layers } from 'lucide-react';
import Footer from '../../../../components/Footer';
import './style.css';

function Web() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [isClient, setIsClient] = useState(false); // Track client-side rendering

  // Mark as client-side after mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position for interactive elements
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    
    // Initialize animated background
    initParticleBackground();
    
    // Initialize text reveal animations
    initTextAnimations();
  }, []);

  // Particle background animation
  const initParticleBackground = () => {
    if (typeof window !== 'undefined') {
      const canvas = document.getElementById('particle-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: '#3b82f6',
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
          });
        }

        function animate() {
          requestAnimationFrame(animate);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          for (let i = 0; i < particleCount; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = 0.3;
            ctx.fill();
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // Connect particles with lines if they're close enough
            for (let j = i + 1; j < particleCount; j++) {
              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = p.color;
                ctx.globalAlpha = 0.1;
                ctx.lineWidth = 0.5;
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }
            }
          }
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        });
      }
    }
  };

  // Text animations using Intersection Observer
  const initTextAnimations = () => {
    const textElements = document.querySelectorAll('.animate-text');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    textElements.forEach(el => observer.observe(el));
  };

  const useInView = (options = { threshold: 0.1, triggerOnce: true }) => {
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting && options.triggerOnce && ref.current) {
            observer.unobserve(ref.current);
          }
        },
        { threshold: options.threshold }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [options.threshold, options.triggerOnce]);

    return { ref, inView };
  };

  const services = [
    {
      icon: <Code className="icon icon-blue" />,
      title: "Stunning & Responsive Designs",
      description: "Mobile-friendly & visually appealing layouts"
    },
    {
      icon: <ShoppingCart className="icon icon-blue" />,
      title: "Fast & Secure Online Stores",
      description: "Optimized for speed, performance & security"
    },
    {
      icon: <Search className="icon icon-blue" />,
      title: "SEO-Friendly Development",
      description: "Higher search rankings for better visibility"
    },
    {
      icon: <Smartphone className="icon icon-blue" />,
      title: "Multi-Payment & Shipping Integration",
      description: "Offer a seamless checkout experience"
    }
  ];

  const features = [
    {
      title: "Custom eCommerce Development",
      description: "Designed to boost sales & engagement"
    },
    {
      title: "Conversion-Optimized Storefronts",
      description: "Tailored features to match your unique business needs and help you stand out from competitors."
    },
    {
      title: "Fast Loading Speed",
      description: "Optimized performance for better customer retention and improved search engine rankings."
    },
    {
      title: "24/7 Support & Maintenance",
      description: "Ensuring smooth operations for your business with dedicated technical assistance whenever you need it."
    }
  ];

  const tabContents = [
    {
      title: "Custom eCommerce Website Design",
      description: "We build custom websites that are tailored specifically to your business objectives and brand identity, ensuring a unique online presence that stands out from the competition.",
      features: [
        "Beautiful, modern, and responsive designs tailored to your brand",
        "User-friendly UI/UX for a better customer experience & higher conversions"
      ]
    },
    {
      title: "E-Commerce Web Development",
      description: "Transform your business with our e-commerce solutions that are designed to maximize conversions and provide a seamless shopping experience for your customers.",
      features: [
        "Custom online store development",
        "Shopping cart and checkout optimization",
        "Payment gateway integration",
        "Inventory management systems",
        "Customer account portals and order tracking"
      ]
    },
    {
      title: "Multi-Payment & Shipping Integration",
      description: "Offer your customers a variety of payment options and shipping methods to enhance their shopping experience and increase conversion rates.",
      features: [
        "Support for UPI, PayPal, Stripe, Razorpay, & other payment gateways",
        "Automated shipping & tracking systems for hassle-free deliveries"
      ]
    },
    {
      title: "SEO & Digital Marketing for eCommerce",
      description: "On-page & off-page SEO optimization for better Google rankings PPC, social media & email marketing strategies to drive traffic & sales",
      features: [
        "SEO-optimized code and structure",
        "Schema markup implementation",
        "Analytics integration (Google Analytics, etc.)",
        "Social media integration",
        "Conversion tracking and optimization"
      ]
    },
    {
      title: "eCommerce Website Maintenance & Support",
      description: "Keep your eCommerce store running smoothly with our comprehensive maintenance and support services, ensuring security and performance.",
      features: [
        "Regular updates, bug fixes & security enhancements",
        "24/7 technical support to keep your store running smoothly"
      ]
    },
    {
      title: "Support & Maintenance",
      description: "Keep your website performing at its best with our comprehensive support and maintenance services that ensure your online presence remains secure and up-to-date.",
      features: [
        "24/7 technical support",
        "Regular security updates",
        "Performance monitoring and optimization",
        "Content updates and modifications",
        "Backup and recovery solutions"
      ]
    }
  ];

  const faqs = [
    {
      question: "Which eCommerce platforms do you work with?",
      answer: "We build online stores using Shopify, WooCommerce, Magento, PrestaShop, & custom platforms."
    },
    {
      question: "Do you offer SEO-friendly web design?",
      answer: "Yes! We follow SEO best practices to ensure higher search rankings & organic traffic growth."
    },
    {
      question: "How long does it take to build a website?",
      answer: "Depending on your requirements, it takes 2-6 weeks to build a fully functional eCommerce site."
    },
    {
      question: "Can I accept international payments on my store?",
      answer: "Yes! We integrate multi-currency & international payment gateways for global reach."
    }
  ];

  return (
    <div className="container">
      {/* Particle background canvas */}
      <canvas id="particle-canvas" className="particle-canvas"></canvas>
      
      {/* Header Section */}
      <header className="header" ref={heroRef}>
        <div className="animated-bg"></div>
        <div 
          className={`content-container ${isVisible ? 'fade-in' : 'fade-out'}`}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            position: 'relative',
            zIndex: 2
          }}
        >
          <div className="glowing-circle"></div>
          <p className="subheading animate-text char-effect">SOULSOFT INFOTECH</p>
          <h1 className="main-heading">
            <span className="animate-text word-effect delay-1">eCommerce</span>
            <span className="highlight animate-text word-effect delay-2"></span>
          </h1>
        
          <h2 className="sub-heading animate-text fade-up delay-3">
            Build, Scale & Grow Your Online Store with a Stunning eCommerce Website
          </h2>
          <div className="button-group">
            <button className="primary-button hover-effect">
              Contact us
              <ArrowRight className="button-icon" />
            </button>
          </div>
          
          <div className="hero-float-elements">
            <div
              className="float-element code-element"
              style={{
                transform: isClient
                  ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
                  : 'none'
              }}
            >
              <Code />
            </div>
            <div
              className="float-element shop-element"
              style={{
                transform: isClient
                  ? `translate(${(mousePosition.x - window.innerWidth / 2) * -0.01}px, ${(mousePosition.y - window.innerHeight / 2) * -0.01}px)`
                  : 'none'
              }}
            >
              <ShoppingCart />
            </div>
            <div
              className="float-element search-element"
              style={{
                transform: isClient
                  ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.03}px, ${(mousePosition.y - window.innerHeight / 2) * 0.03}px)`
                  : 'none'
              }}
            >
              <Search />
            </div>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="content-container">
          <h2 className="section-heading animate-text word-effect">
            Sell Online with a High-Performance eCommerce Website
          </h2>
          <p className="section-text animate-text fade-up delay-1">
            In today’s digital world, having a professional, user-friendly, and scalable eCommerce website is essential for success. At Soulsoft Infotech, we specialize in custom eCommerce development to help businesses of all sizes launch, grow, and succeed online.
          </p>
          <div className="divider animate-width"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="content-container-wide">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Key Services</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Our comprehensive web development services are designed to transform your online presence
            </p>
          </div>
          
          <div className="services-grid">
            {services.map((service, index) => {
              const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
              return (
                <div 
                  key={index}
                  ref={ref}
                  className={`service-card ${inView ? 'slide-in' : 'slide-out'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="service-icon pulsate">
                    {service.icon}
                    <div className="service-icon-glow"></div>
                  </div>
                  <h3 className="service-title animate-text char-effect">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-choose-section">
        <div className="gradient-blob"></div>
        <div className="content-container-wide">
          <div className="why-choose-grid">
            <div className="why-choose-text">
              <h2 className="section-heading animate-text word-effect">
                Why Choose <span className="highlight">Soulsoft</span>
              </h2>
              <p className="section-text animate-text fade-up delay-1">
                We're committed to delivering exceptional web solutions that help your business thrive online.
                Our expertise, combined with our client-centered approach, ensures results that exceed expectations.
              </p>
              <div className="cta-link">
                <a href="#" className="primary-button animate-text hover-effect">
                  Learn more about our approach
                </a>
              </div>
            </div>
            <div className="features-list">
              {features.map((feature, index) => {
                const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
                return (
                  <div 
                    key={index}
                    ref={ref}
                    className={`feature-item ${inView ? 'slide-in' : 'slide-out'}`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="feature-icon grow-effect">
                      <CheckCircle className="icon icon-blue" />
                    </div>
                    <div className="feature-content">
                      <h3 className="feature-title animate-text char-effect">{feature.title}</h3>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Service Details Section */}
      <section className="service-details-section">
        <div className="content-container-wide">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Detailed Service Highlights</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Explore our comprehensive web development services designed to meet all your digital needs
            </p>
          </div>
          
          <div className="tabs animate-fade-in">
            {tabContents.map((content, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`tab-button ${activeTab === index ? 'tab-active' : ''}`}
              >
                {index === 0 && <Code className="tab-icon" />}
                {index === 1 && <ShoppingCart className="tab-icon" />}
                {index === 2 && <Smartphone className="tab-icon" />}
                {index === 3 && <Layers className="tab-icon" />}
                {index === 4 && <Search className="tab-icon" />}
                {index === 5 && <HeartHandshake className="tab-icon" />}
                <span className="tab-text">{content.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>
          
          <div className="tab-content">
            {tabContents.map((content, index) => {
              const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
              return (
                <div 
                  key={index}
                  ref={ref}
                  className={`tab-panel ${activeTab === index ? 'tab-visible' : 'tab-hidden'}`}
                >
                  <div className={`tab-card ${inView && activeTab === index ? 'slide-in' : 'slide-out'}`}>
                    <h3 className="tab-title animate-text word-effect">{content.title}</h3>
                    <p className="tab-description">{content.description}</p>
                    
                    <ul className="tab-features">
                      {content.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="tab-feature-item stagger-fade-in" style={{ animationDelay: `${featureIndex * 100}ms` }}>
                          <div className="tab-feature-icon">
                            <div className="tab-feature-dot"></div>
                          </div>
                          <p className="tab-feature-text">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay animated-gradient"></div>
        <div className="content-container">
          <h2 className="cta-heading animate-text word-effect">
            Elevate Your Business with a High-Performing Website!
          </h2>
          
          <div className="cta-features">
            <div className="cta-feature stagger-fade-in">
              <Check className="icon icon-blue" />
              <span>Top-rated eCommerce website design services for online businesses</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '200ms' }}>
              <Check className="icon icon-blue" />
              <span>SEO-friendly online store development for maximum visibility</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '400ms' }}>
              <Check className="icon icon-blue" />
              <span>Secure, scalable & fast eCommerce solutions to boost sales</span>
            </div>
          </div>
          
          <button className="cta-button hover-glow">
            Get a Free Consultation
            <ArrowRight className="button-icon" />
          </button>
          
          <p className="cta-subtext animate-text fade-up">
            No commitments. Let's discuss your project needs.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Frequently Asked Questions</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Find answers to common questions about our web development services
            </p>
          </div>
          
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
              return (
                <div 
                  key={index}
                  ref={ref}
                  className={`faq-item ${inView ? 'slide-in' : 'slide-out'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <button
                    className="faq-question"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <h3 className="faq-question-text">{faq.question}</h3>
                    {openFAQ === index ? (
                      <ChevronUp className="icon" />
                    ) : (
                      <ChevronDown className="icon" />
                    )}
                  </button>
                  <div className={`faq-answer ${openFAQ === index ? 'faq-answer-open' : 'faq-answer-closed'}`}>
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="faq-cta">
            <p className="faq-cta-text">
              Didn't find what you're looking for?
            </p>
            <a href="#" className="faq-cta-link hover-effect">
              Contact our support team <ArrowRight className="icon-small" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Web;