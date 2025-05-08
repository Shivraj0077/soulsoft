"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, ShoppingCart, Search, Smartphone, Check, ChevronDown, ChevronUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, CheckCircle, HeartHandshake, Layers } from 'lucide-react';
import Footer from '../../../components/Footer';
import './style.css'
import PricingSection from '../../../components/PricingSection';

function Web() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

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
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      // Initialize animated background
      initParticleBackground();
      
      // Initialize text reveal animations
      initTextAnimations();
    }
  }, [hasMounted]);

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
      title: "Search Engine Optimization (SEO)",
      description: "Boost your website’s rankings and drive organic traffic with our expert SEO strategies"
    },
    {
      icon: <ShoppingCart className="icon icon-blue" />,
      title: "Social Media Marketing (SMM)",
      description: "Engage, attract, and convert followers with strategic social media marketing."
    },
    {
      icon: <Search className="icon icon-blue" />,
      title: "Pay-Per-Click (PPC) Advertising",
      description: "Maximize your ROI with targeted PPC advertising campaigns."
    },
    {
      icon: <Smartphone className="icon icon-blue" />,
      title: "Content Marketing & Branding",
      description: "Strengthen your brand with compelling content marketing strategies."
    }
  ];

  const features = [
    {
      title: "Tailored campaigns to match your business goals.",
      description: "10+ years of expertise."
    },
    {
      title: "Customized Strategies",
      description: "Tailored campaigns to match your business goals."
    },
    {
      title: "Data-Driven Approach",
      description: "Focused on ROI & measurable success."
    },
    {
      title: "Multi-Channel Marketing",
      description: "SEO, PPC, social media & more."


    }
  ];

  const tabContents = [
    {
      title: "Custom Website Development",
      description: "We build custom websites that are tailored specifically to your business objectives and brand identity, ensuring a unique online presence that stands out from the competition.",
      features: [
        "Custom UI/UX design based on your brand guidelines",
        "Front-end development with modern frameworks (React, Vue.js)",
        "Back-end development for complex functionality",
        "Database integration and API development",
        "Performance optimization for speed and efficiency"
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
      title: "Responsive Website Design",
      description: "Ensure your website looks and functions perfectly on all devices with our responsive design approach that adapts seamlessly to different screen sizes.",
      features: [
        "Mobile-first design approach",
        "Cross-browser compatibility testing",
        "Adaptive layouts for all screen sizes",
        "Touch-friendly navigation and elements",
        "Optimized media loading for mobile devices"
      ]
    },
    {
      title: "CMS Development",
      description: "Take control of your website content with our custom content management system solutions that make updating your website simple and efficient.",
      features: [
        "WordPress, Shopify, Magento implementations",
        "Custom CMS development",
        "User-friendly admin interfaces",
        "Content workflow and publishing controls",
        "Multi-user access levels and permissions"
      ]
    },
    {
      title: "SEO & Digital Marketing Integration",
      description: "Build a foundation for online success with websites that are optimized for search engines and integrate seamlessly with your digital marketing efforts.",
      features: [
        "SEO-optimized code and structure",
        "Schema markup implementation",
        "Analytics integration (Google Analytics, etc.)",
        "Social media integration",
        "Conversion tracking and optimization"
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
      question: "What are digital marketing services?",
      answer: "Digital marketing includes SEO, PPC, social media, and content marketing to help businesses grow online."
    },
    {
      question: "Why is digital marketing important for businesses?",
      answer: "Digital marketing increases brand visibility, lead generation, and sales through targeted strategies."
    },
    {
      question: "How long does it take to see results from SEO?",
      answer:"SEO typically takes 3-6 months for noticeable improvements, depending on competition and strategy."
    },
    {
      question: "Can Soulsoft Infotech manage my business’s social media?",
      answer:"Yes! We offer comprehensive social media management to increase engagement and brand awareness."
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
            <span className="animate-text word-effect delay-1">Digital{""}</span>
            <span className="highlight animate-text word-effect delay-2">marketing</span>
          </h1>
        
          <h2 className="sub-heading animate-text fade-up delay-3">
          Grow Your Business with Soulsoft Infotech
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
                transform:
                  typeof window !== 'undefined'
                    ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${
                        (mousePosition.y - window.innerHeight / 2) * 0.02
                      }px)`
                    : 'none',
              }}
            >
              <Code />
            </div>
            <div
              className="float-element shop-element"
              style={{
                transform:
                  typeof window !== 'undefined'
                    ? `translate(${(mousePosition.x - window.innerWidth / 2) * -0.01}px, ${
                        (mousePosition.y - window.innerHeight / 2) * -0.01
                      }px)`
                    : 'none',
              }}
            >
              <ShoppingCart />
            </div>
            <div
              className="float-element search-element"
              style={{
                transform:
                  typeof window !== 'undefined'
                    ? `translate(${(mousePosition.x - window.innerWidth / 2) * 0.03}px, ${
                        (mousePosition.y - window.innerHeight / 2) * 0.03
                      }px)`
                    : 'none',
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
          Grow Your Business with Soulsoft Infotech
          </h2>
          <p className="section-text animate-text fade-up delay-1">
          Looking for the best digital marketing services to boost your online presence? At Soulsoft Infotech, we specialize in SEO, social media marketing, PPC, content marketing, and branding to drive traffic, generate leads, and maximize business growth.

With a data-driven approach and customized strategies, we ensure your brand stands out in the competitive digital space. Whether you’re a startup or an established business, our expert marketing solutions deliver measurable results.
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
              Our comprehensive Digital Marketing services are designed to transform your online presence
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
              Experienced Digital Marketing Team
              </p>
              <div className="cta-link">
                <a href="#" className="primary-button animate-text hover-effect">
                10+ years of expertise.
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
      
          
        
          <PricingSection/>
          
     
        </div>
      </section>
   
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay animated-gradient"></div>
        <div className="content-container">
          <h2 className="cta-heading animate-text word-effect">
          Our Digital Marketing Services
          </h2>
          
          <div className="cta-features">
            <div className="cta-feature stagger-fade-in">
              <Check className="icon icon-blue" />
              <span>SEO & PPC experts for better search rankings & increased traffic.</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '200ms' }}>
              <Check className="icon icon-blue" />
              <span>Social media & branding specialists for business growth.</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '400ms' }}>
              <Check className="icon icon-blue" />
              <span>Top digital marketing agency delivering ROI-driven strategies.</span>
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