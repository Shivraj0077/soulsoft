"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Users, Cloud, Smartphone, Check, ChevronDown, ChevronUp, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, CheckCircle, HeartHandshake, Layers } from 'lucide-react';
import Footer from '../../../components/Footer';
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
      icon: <Users className="icon icon-blue" />,
      title: "Lead & Contact Management",
      description: "Organize and track every customer interaction to nurture leads effectively."
    },
    {
      icon: <Smartphone className="icon icon-blue" />,
      title: "Sales Pipeline Management",
      description: "Monitor deals and sales progress in real-time for better forecasting."
    },
    {
      icon: <Cloud className="icon icon-blue" />,
      title: "Customer Support & Ticketing",
      description: "Provide seamless support with integrated ticketing and query management."
    },
    {
      icon: <Layers className="icon icon-blue" />,
      title: "Marketing Automation",
      description: "Automate email, SMS, and campaign management to boost engagement."
    }
  ];

  const features = [
    {
      title: "Customizable CRM",
      description: "Tailored to fit your unique business needs for optimal performance."
    },
    {
      title: "User-Friendly Dashboard",
      description: "Intuitive interface for easy navigation and efficient management."
    },
    {
      title: "Seamless Integrations",
      description: "Connect with third-party tools like WhatsApp, Slack, and Payment Gateways."
    },
    {
      title: "Data Security & Cloud Storage",
      description: "Secure access with robust cloud-based solutions."
    }
  ];

  const tabContents = [
    {
      title: "Lead & Contact Management",
      description: "Efficiently organize and track all customer interactions to nurture leads and build stronger relationships.",
      features: [
        "Centralized lead database",
        "Contact interaction history",
        "Lead scoring and prioritization",
        "Automated lead assignment",
        "Custom fields for contact details"
      ]
    },
    {
      title: "Sales Pipeline Management",
      description: "Monitor and manage your sales pipeline in real-time to improve forecasting and close deals faster.",
      features: [
        "Real-time pipeline tracking",
        "Deal stage management",
        "Sales forecasting tools",
        "Customizable pipeline views",
        "Automated deal reminders"
      ]
    },
    {
      title: "Customer Support & Ticketing",
      description: "Deliver exceptional customer support with integrated ticketing and query management features.",
      features: [
        "Ticket creation and tracking",
        "Automated ticket assignment",
        "Customer query resolution tracking",
        "Support performance analytics",
        "Multi-channel support integration"
      ]
    },
    {
      title: "Marketing Automation",
      description: "Boost engagement with automated email, SMS, and campaign management tools tailored to your audience.",
      features: [
        "Email campaign automation",
        "SMS marketing tools",
        "Campaign performance tracking",
        "Audience segmentation",
        "Personalized content delivery"
      ]
    },
    {
      title: "Advanced Reporting & Analytics",
      description: "Gain actionable insights into business performance with advanced reporting and analytics tools.",
      features: [
        "Customizable reports",
        "Real-time analytics dashboard",
        "Sales performance tracking",
        "Customer behavior insights",
        "Exportable data reports"
      ]
    },
    {
      title: "Support & Maintenance",
      description: "Ensure your CRM runs smoothly with 24/7 support and regular maintenance services.",
      features: [
        "24/7 technical support",
        "Regular software updates",
        "Performance monitoring",
        "Security patches",
        "Backup and recovery solutions"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is a CRM system?",
      answer: "A CRM (Customer Relationship Management) system helps businesses track leads, manage customer interactions, and automate workflows to improve efficiency."
    },
    {
      question: "Is your CRM suitable for small businesses?",
      answer: "Yes, our CRM is designed to be scalable and customizable, making it ideal for small businesses as well as enterprises."
    },
    {
      question: "Can I integrate your CRM with other tools?",
      answer: "Absolutely, our CRM seamlessly integrates with third-party tools like WhatsApp, Slack, Payment Gateways, and more."
    },
    {
      question: "How much does a CRM cost?",
      answer: "The cost of a CRM depends on the features, complexity, and customization required. We provide detailed quotes after analyzing your specific needs."
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
            <span className="animate-text word-effect delay-1">Customer Relationship {""}</span>
            <span className="highlight animate-text word-effect delay-2"> Management</span>
          </h1>
        
          <h2 className="sub-heading animate-text fade-up Stewardship delay-3">
            Simplify Lead Management & Supercharge Customer Relationships
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
              <Users />
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
            Streamline Your Business with a Powerful CRM
          </h2>
          <p className="section-text animate-text fade-up delay-1">
            In today’s competitive world, managing customer relationships effectively is the key to business success. At Soulsoft Infotech, we provide custom CRM solutions that help businesses automate sales, track customer interactions, and improve overall productivity.
          </p>
          <div className="divider animate-width"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="content-container-wide">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Our CRM Services</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Comprehensive CRM solutions to enhance customer relationships
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
                Why Choose <span className="highlight">Soulsoft</span> CRM
              </h2>
              <p className="section-text animate-text fade-up delay-1">
                Our CRM solutions are tailored to streamline sales, enhance customer support, and boost productivity with secure, cloud-based technology.
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
              Explore our tailored CRM solutions for your business needs
            </p>
          </div>
          
          <div className="tabs animate-fade-in">
            {tabContents.map((content, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`tab-button ${activeTab === index ? 'tab-active' : ''}`}
              >
                {index === 0 && <Users className="tab-icon" />}
                {index === 1 && <Smartphone className="tab-icon" />}
                {index === 2 && <Cloud className="tab-icon" />}
                {index === 3 && <Layers className="tab-icon" />}
                {index === 4 && <CheckCircle className="tab-icon" />}
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
            Take Your Business to the Next Level with Soulsoft CRM!
          </h2>
          
          <div className="cta-features">
            <div className="cta-feature stagger-fade-in">
              <Check className="icon icon-blue" />
              <span>Best CRM for small businesses & enterprises</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '200ms' }}>
              <Check className="icon icon-blue" />
              <span>Cloud-based accessibility</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '400ms' }}>
              <Check className="icon icon-blue" />
              <span>Automated sales & marketing tools</span>
            </div>
          </div>
          
          <button className="cta-button hover-glow">
            Get a Free Consultation
            <ArrowRight className="button-icon" />
          </button>
          
          <p className="cta-subtext animate-text fade-up">
            No commitments. Let's discuss your CRM needs.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="content-container">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Frequently Asked Questions</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Find answers to common questions about our CRM services
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