"use client"
import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, MapPin, Phone, Mail, Clock, Menu, X, LogIn, ArrowRight } from 'lucide-react';
import './animation.css'
import Footer from '../../../components/Footer';

function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const validate = (values) => {
    const errors = {};
    
    if (!values.name.trim()) errors.name = 'Name is required';
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.subject.trim()) errors.subject = 'Subject is required';
    if (!values.message.trim()) errors.message = 'Message is required';
    
    return errors;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: undefined });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setValues({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 5000);
      }, 1500);
    }
  };

  const ContactForm = () => {
    if (isSubmitted) {
      return (
        <div className="w-full space-y-6 py-8 px-4 sm:px-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 animate-fadeIn">
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <CheckCircle className="w-16 h-16 text-green-500 animate-scaleIn" />
            <h3 className="text-2xl font-semibold text-white mt-4">Message Sent!</h3>
            <p className="text-gray-300 text-center max-w-md">
              Thank you for contacting us. We've received your message and will get back to you soon.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="mt-6 px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300 ease-in-out"
            >
              Send Another Message
            </button>
          </div>
        </div>
      );
    }

    return (
      <form 
        onSubmit={handleSubmit} 
        className="w-full space-y-6 py-8 px-4 sm:px-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800"
      >
        <div className="space-y-4">
          {[
            { label: 'Name', name: 'name', type: 'text', placeholder: 'Your name' },
            { label: 'Email', name: 'email', type: 'email', placeholder: 'your.email@example.com' },
            { label: 'Subject', name: 'subject', type: 'text', placeholder: 'How can we help?' }
          ].map((field) => (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${
                  errors[field.name] ? 'border-red-500' : 'border-gray-700'
                } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
                placeholder={field.placeholder}
              />
              {errors[field.name] && <p className="mt-1 text-sm text-red-500">{errors[field.name]}</p>}
            </div>
          ))}
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={values.message}
              onChange={handleChange}
              className={`w-full bg-gray-800 border ${
                errors.message ? 'border-red-500' : 'border-gray-700'
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300`}
              placeholder="Tell us more details about your inquiry..."
            />
            {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center px-8 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transform hover:scale-[1.02] transition-all duration-300 ease-in-out ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 opacity-50"></div>
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600 rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-600 rounded-full filter blur-[120px] opacity-10"></div>
        <div className="absolute -bottom-40 left-1/4 w-80 h-80 bg-blue-600 rounded-full filter blur-[120px] opacity-10"></div>
      </div>
      
      <div className="relative z-10">
        <header 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
            isScrolled ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 md:py-6">
              <a href="/" className="text-white font-bold text-xl flex items-center">
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg w-8 h-8 flex items-center justify-center mr-2">
                  C
                </span>
                Company
              </a>
              
              <nav className="hidden md:flex space-x-8">
                {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`text-sm font-medium ${
                      item === 'Contact' 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white transition-colors duration-300'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
              
              <div className="hidden md:flex items-center">
                <button 
                  type="button"
                  className="ml-6 inline-flex items-center px-4 py-2 border border-indigo-500 text-sm font-medium rounded-lg text-white bg-transparent hover:bg-indigo-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
          <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 backdrop-blur-md border-b border-gray-800">
              {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item === 'Contact'
                      ? 'text-white bg-gray-800'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 pb-1">
                <button 
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-2 border border-indigo-500 text-base font-medium rounded-lg text-white bg-transparent hover:bg-indigo-600 transition-colors duration-300"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200 animate-fadeIn">
              Get in Touch
            </h1>
            <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto animate-fadeInUp">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="animate-fadeInLeft space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
                <p className="text-gray-300 mb-6">
                  Have questions or need assistance? Our team is here to help you. Feel free to reach out using the contact details below.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    title: 'Location',
                    content: '10-B,2nd Floor,Top Ten Imperial Sangamner-422605, Ahmednagar'

                  },
                  {
                    icon: Phone,
                    title: 'Phone',
                    content: '+91 8530798679 ,+91 7276498679'
                  },
                  {
                    icon: Mail,
                    title: 'Email',
                    content: 'soulsoftinfotech@gmail.com'
                  },
                  {
                    icon: Clock,
                    title: 'Business Hours',
                    content: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <item.icon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-base font-medium text-white">{item.title}</h4>
                      <p className="text-gray-300 mt-1 whitespace-pre-line">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
            
            </div>
            
            <div className="animate-fadeInRight">
              <ContactForm />
            </div>
          </div>
          
          <div className="mt-20 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 sm:p-8 lg:p-10 animate-fadeInUp">
            <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {[
                {
                  question: "What are your business hours?",
                  answer: "We're open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 4:00 PM. We're closed on Sundays."
                },
                {
                  question: "How quickly will I get a response?",
                  answer: "We aim to respond to all inquiries within 24 hours during business days."
                },
                {
                  question: "Do you offer support via live chat?",
                  answer: "Yes, our live chat is available during business hours for immediate assistance."
                },
                {
                  question: "How can I schedule a consultation?",
                  answer: "You can schedule a consultation by filling out the contact form or calling our office directly."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-all duration-300">
                  <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                  <p className="mt-2 text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <a 
                href="#support" 
                className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
              >
                Visit our support center
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </main>
        
     <Footer/>
      </div>
    </div>
  );
}

export default ContactForm;