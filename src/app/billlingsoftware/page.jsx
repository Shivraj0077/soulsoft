"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Receipt, Cloud, Smartphone, Check, ChevronDown, ChevronUp, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, CheckCircle, HeartHandshake, Layers } from 'lucide-react';
import Footer from '../../../components/Footer';
import './style.css';
import Newsletter from '../../../components/NewsLetter';

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
      icon: <Receipt className="icon icon-blue" />,
      title: "Retail & POS Billing Software",
      description: "Fast checkout with barcode scanning, automated tax calculations, and real-time reporting."
    },
    {
      icon: <Smartphone className="icon icon-blue" />,
      title: "Service Business Billing",
      description: "Professional invoice templates, recurring billing, and time-based invoicing for service providers."
    },
    {
      icon: <Layers className="icon icon-blue" />,
      title: "Wholesale & Distribution Billing",
      description: "Bulk invoicing, stock transfers, and customer/supplier account management for wholesalers."
    },
    {
      icon: <Cloud className="icon icon-blue" />,
      title: "Cloud-Based Billing Software",
      description: "Access invoices and reports from any device with secure cloud storage and multi-user access."
    }
  ];

  const features = [
    {
      title: "User-Friendly Interface",
      description: "No technical expertise required to manage your billing operations efficiently."
    },
    {
      title: "Cloud-Based & Secure",
      description: "Access your billing data from anywhere with automatic backups and secure storage."
    },
    {
      title: "Barcode & POS Integration",
      description: "Streamline checkouts and operations with seamless barcode and POS integration."
    },
    {
      title: "Customizable Features",
      description: "Tailored billing solutions to meet the specific needs of your business."
    }
  ];

  const tabContents = [
    {
      title: "Retail & POS Billing Software",
      description: "Our retail and POS billing software ensures fast checkouts and streamlined operations with barcode scanning, automated tax calculations, and real-time reporting.",
      features: [
        "Barcode scanning and POS integration",
        "Automated GST and tax calculations",
        "Multiple payment modes",
        "Real-time sales and inventory reports",
        "Discount and offer management"
      ]
    },
    {
      title: "Service Business Billing",
      description: "Designed for service providers, our billing software offers professional invoice templates, recurring billing, and time-based invoicing for seamless financial management.",
      features: [
        "Customizable invoice templates with branding",
        "Recurring billing and subscription management",
        "Time-based and project-based invoicing",
        "Client payment tracking",
        "Automated payment reminders"
      ]
    },
    {
      title: "Wholesale & Distribution Billing",
      description: "Manage bulk invoicing, stock transfers, and customer/supplier accounts with our billing software tailored for wholesalers and distributors.",
      features: [
        "Bulk invoicing and credit/debit management",
        "Stock transfer tracking",
        "Purchase order management",
        "Customer and supplier account management",
        "Multi-warehouse support"
      ]
    },
    {
      title: "Cloud-Based Billing Software",
      description: "Access your billing data from any device with our secure cloud-based software, featuring automatic backups and role-based multi-user access.",
      features: [
        "Access from any device",
        "Secure cloud storage with backups",
        "Multi-user access with permissions",
        "Real-time data synchronization",
        "Scalable cloud infrastructure"
      ]
    }
  ];

  const faqs = [
    {
      question: "Is your billing software GST-compliant?",
      answer: "Yes, our billing software is fully GST-compliant, automatically calculating GST, VAT, and other taxes to ensure compliance with regulatory requirements."
    },
    {
      question: "Can I use this software for multiple branches?",
      answer: "Absolutely! Our software supports multi-branch operations with centralized control, allowing you to manage all branches seamlessly."
    },
    {
      question: "Does it support online payments?",
      answer: "Yes, our billing software supports multiple online payment methods, including UPI, credit/debit cards, net banking, and digital wallets."
    },
    {
      question: "Is customer support available?",
      answer: "Yes, we provide 24/7 customer support to assist with any issues or queries, ensuring smooth operation of your billing software."
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
            <span className="animate-text word-effect delay-1">Billing Software {""}</span>
            <span className="highlight animate-text word-effect delay-2"> Services</span>
          </h1>
        
          <h2 className="sub-heading animate-text fade-up Stewardship delay-3">
            Simplify Invoicing & Accelerate Your Business Growth
          </h2>
          <div className="button-group">
             <button 
                        className="primary-button hover-effect"
                        onClick={() => window.location.href = '/contactus'}
                      >
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
              <Receipt />
            </div>
            <div
              className="float-element shop-element"
              style={{
                transform: isClient
                  ? `translate(${(mousePosition.x - window.innerWidth / 2) * -0.01}px, ${(mousePosition.y - window.innerHeight / 2) * -0.01}px)`
                  : 'none'
              }}
            >
              <Cloud />
            </div>
            <div
              className="float-element search-element"
              style={{
                transform: isClient
                  ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.03}px, ${(mousePosition.y - window.innerHeight / 2) * 0.03}px)`
                  : 'none'
              }}
            >
              <Smartphone />
            </div>
          </div>
        </div>
      </header>

      {/* Intro Section */}
      <section className="intro-section">
        <div className="content-container">
          <h2 className="section-heading animate-text word-effect">
            Smart, Fast & Secure Billing Solutions
          </h2>
          <p className="section-text animate-text fade-up delay-1">
            Managing finances shouldn’t be a hassle! With SoulSoft Infotech’s Billing Software, you can automate invoicing, track payments, and manage accounts effortlessly. Our feature-rich billing software is designed for retail stores, wholesalers, service providers, and enterprises to streamline billing operations and ensure accuracy.
          </p>
          <div className="divider animate-width"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="content-container-wide">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Our Billing Solutions</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Comprehensive billing software services for all business types
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
                Our billing software is designed to simplify financial management with user-friendly, secure, and customizable solutions that drive business efficiency.
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
              Explore our tailored billing software solutions for your business
            </p>
          </div>
          
          <div className="tabs animate-fade-in">
            {tabContents.map((content, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`tab-button ${activeTab === index ? 'tab-active' : ''}`}
              >
                {index === 0 && <Receipt className="tab-icon" />}
                {index === 1 && <Smartphone className="tab-icon" />}
                {index === 2 && <Layers className="tab-icon" />}
                {index === 3 && <Cloud className="tab-icon" />}
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
            Get Started with Soulsoft Infotech Billing Software!
          </h2>
          
          <div className="cta-features">
            <div className="cta-feature stagger-fade-in">
              <Check className="icon icon-blue" />
              <span>GST-compliant billing solutions</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '200ms' }}>
              <Check className="icon icon-blue" />
              <span>Fast and secure invoicing</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '400ms' }}>
              <Check className="icon icon-blue" />
              <span>Cloud-based accessibility</span>
            </div>
          </div>
          
          <button className="cta-button hover-glow">
            Get a Free Consultation
            <ArrowRight className="button-icon" />
          </button>
          
          <p className="cta-subtext animate-text fade-up">
            No commitments. Let's discuss your billing needs.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Frequently Asked Questions</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Find answers to common questions about our billing software services
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

export default Web