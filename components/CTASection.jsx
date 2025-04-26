import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useInView } from '../src/hooks/useInView';

const CTASection = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section 
      ref={ref} 
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-10 z-0"></div>
      
      <div 
        className={`max-w-5xl mx-auto relative z-10 text-center transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          Elevate Your Business with a High-Performing Website!
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-10">
          <div className="flex items-center text-lg text-gray-200">
            <Check className="w-5 h-5 text-blue-500 mr-2" />
            <span>Top-rated web design & development</span>
          </div>
          <div className="flex items-center text-lg text-gray-200">
            <Check className="w-5 h-5 text-blue-500 mr-2" />
            <span>SEO-friendly & mobile-responsive</span>
          </div>
          <div className="flex items-center text-lg text-gray-200">
            <Check className="w-5 h-5 text-blue-500 mr-2" />
            <span>Powerful e-commerce features</span>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-4 px-8 rounded-md mt-4 inline-flex items-center transition-all duration-300 group shadow-lg shadow-blue-900/30">
          Get a Free Consultation
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="text-gray-400 mt-4">
          No commitments. Let's discuss your project needs.
        </p>
      </div>
    </section>
  );
};

export default CTASection;