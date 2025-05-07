"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Cloud, Smartphone, Check, ChevronDown, ChevronUp, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube, CheckCircle, HeartHandshake, Layers } from 'lucide-react';
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
    const [inView, setInView] = useState(false); // Fixed typo: 'atta' to 'inView'
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
      title: "Enterprise Software Development",
      description: "Custom ERP, CRM, and workflow automation solutions. Secure, scalable, and AI-powered business applications."
    },
    {
      icon: <Smartphone className="icon icon-blue" />,
      title: "Web & Mobile Application Development",
      description: "Custom web applications and Progressive Web Apps (PWAs) for enhanced business operations and seamless user experience."
    },
    {
      icon: <Cloud className="icon icon-blue" />,
      title: "SaaS & Cloud-Based Solutions",
      description: "Multi-tenant SaaS applications and cloud computing solutions using AWS, Azure, and Google Cloud."
    },
    {
      icon: <Layers className="icon icon-blue" />,
      title: "AI & Automation Software Development",
      description: "AI-powered analytics, machine learning, and deep learning applications for data-driven decision-making."
    }
  ];

  const features = [
    {
      title: "Industry-Specific Expertise",
      description: "Tailored solutions for diverse industries to meet unique business needs."
    },
    {
      title: "Agile Development Process",
      description: "Faster delivery with high-quality standards through iterative development."
    },
    {
      title: "User-Centric Approach",
      description: "Intuitive UI/UX design for seamless and engaging user experiences."
    },
    {
      title: "24/7 Support & Maintenance",
      description: "Dedicated support to ensure smooth operations post-launch."
    }
  ];

  const tabContents = [
    {
      title: "Enterprise Software Development",
      description: "We deliver custom ERP, CRM, and workflow automation solutions that are secure, scalable, and powered by AI to streamline your business operations.",
      features: [
        "Custom ERP and CRM systems",
        "Workflow automation tools",
        "Secure and scalable architecture",
        "AI-powered business applications",
        "Seamless integration with existing systems"
      ]
    },
    {
      title: "Web & Mobile Application Development",
      description: "Our custom web and mobile applications enhance business operations with intuitive designs and seamless user experiences, including Progressive Web Apps (PWAs).",
      features: [
        "Custom web application development",
        "Progressive Web Apps (PWAs)",
        "Mobile-first design approach",
        "Cross-platform compatibility",
        "Performance optimization"
      ]
    },
    {
      title: "SaaS & Cloud-Based Solutions",
      description: "We build scalable multi-tenant SaaS applications and cloud-based solutions using leading platforms like AWS, Azure, and Google Cloud.",
      features: [
        "Multi-tenant SaaS application development",
        "Cloud computing solutions",
        "Scalable infrastructure",
        "Data security and compliance",
        "Seamless cloud integrations"
      ]
    },
    {
      title: "AI & Automation Software Development",
      description: "Leverage AI and automation with our analytics and data-driven tools, including machine learning and deep learning application development.",
      features: [
        "AI-powered analytics",
        "Machine learning applications",
        "Deep learning solutions",
        "Automation for repetitive tasks",
        "Data-driven decision-making tools"
      ]
    },
    {
      title: "Legacy Software Modernization",
      description: "Upgrade outdated systems with modern technologies and migrate on-premise software to cloud-based platforms for enhanced performance.",
      features: [
        "Legacy system upgrades",
        "Cloud migration services",
        "Modern technology integration",
        "Performance optimization",
        "Security enhancements"
      ]
    },
    {
      title: "Support & Maintenance",
      description: "Our comprehensive support and maintenance services ensure your software remains secure, up-to-date, and performs optimally.",
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
      question: "How much does custom software development cost?",
      answer: "The cost of custom software development varies based on project complexity, features, and specific requirements. We provide detailed quotes after a thorough analysis of your needs."
    },
    {
      question: "How long does it take to develop a custom software solution?",
      answer: "Development timelines depend on the project's scope and complexity. Simple solutions may take 2-3 months, while complex systems can take 6-12 months. We provide clear timelines during the planning phase."
    },
    {
      question: "Can you integrate custom software with our existing systems?",
      answer: "Yes, we specialize in seamless integrations, ensuring your custom software connects effortlessly with your existing systems and third-party tools."
    },
    {
      question: "Do you provide post-launch support?",
      answer: "Absolutely! We offer ongoing maintenance, updates, and 24/7 technical support to ensure your software runs smoothly."
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
            <span className="animate-text word-effect delay-1">Custom Software {""}</span>
            <span className="highlight animate-text word-effect delay-2"> Development</span>
          </h1>
        
          <h2 className="sub-heading animate-text fade-up Stewardship delay-3">
            Tailored Software Solutions to Drive Business Success
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
            Innovate & Scale with Custom Software Development
          </h2>
          <p className="section-text animate-text fade-up delay-1">
            At Soulsoft Infotech, we specialize in custom software development, delivering scalable, secure, and high-performance solutions tailored to your specific needs. Whether you’re a startup, SME, or enterprise, we create cutting-edge software that enhances productivity and drives growth.
          </p>
          <div className="divider animate-width"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="content-container-wide">
          <div className="section-header">
            <h2 className="section-heading animate-text word-effect">Our Services</h2>
            <p className="section-subtext animate-text fade-up delay-1">
              Comprehensive software development services to transform your business
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
                We deliver exceptional software solutions that empower your business to thrive in a competitive landscape with our expertise and client-centric approach.
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
              Explore our comprehensive software development services designed to meet your business needs
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
                {index === 1 && <Smartphone className="tab-icon" />}
                {index === 2 && <Cloud className="tab-icon" />}
                {index === 3 && <Layers className="tab-icon" />}
                {index === 4 && <HeartHandshake className="tab-icon" />}
                {index === 5 && <CheckCircle className="tab-icon" />}
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
            Transform Your Business with Custom Software!
          </h2>
          
          <div className="cta-features">
            <div className="cta-feature stagger-fade-in">
              <Check className="icon icon-blue" />
              <span>Top-rated software development</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '200ms' }}>
              <Check className="icon icon-blue" />
              <span>AI-powered and cloud-based</span>
            </div>
            <div className="cta-feature stagger-fade-in" style={{ animationDelay: '400ms' }}>
              <Check className="icon icon-blue" />
              <span>Secure and scalable solutions</span>
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
              Find answers to common questions about our software development services
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