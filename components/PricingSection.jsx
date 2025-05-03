import React from 'react';

const PricingCard = ({ title, price, description, features, buttonText }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col h-full transition-transform hover:scale-105">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">Plan</p>
      </div>
      
      <div className="text-center mb-8">
        <span className="text-gray-400 text-lg">₹</span>
        <span className="text-5xl font-bold text-white">{price}</span>
      </div>
      
      <p className="text-gray-300 mb-6 text-center">{description}</p>
      
      <div className="flex-grow">
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 text-emerald-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button className="w-full bg-blue-600 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200">
        {buttonText}
      </button>
    </div>
  );
};

const PricingSection = () => {
  const pricingOptions = [
    {
      title: "Startup Plan",
      price: "10,000",
      description: "Perfect for small businesses & local brands.",
      features: [
        "Basic SEO & keyword optimization",
        "Social media setup & strategy",
        "Google My Business optimization"
      ],
      buttonText: "Buy Now"
    },
    {
      title: "Growth Plan",
      price: "20,000",
      description: "Ideal for growing businesses.",
      features: [
        "Advanced SEO & backlinking",
        "Paid ad campaigns (Google & Facebook Ads)",
        "Social media engagement & content marketing"
      ],
      buttonText: "Buy Now"
    },
    {
      title: "Enterprise Plan",
      price: "30,000",
      description: "Best for large-scale businesses.",
      features: [
        "Full-scale digital marketing solutions",
        "AI-driven analytics & conversion optimization",
        "Custom social media & branding strategies"
      ],
      buttonText: "Buy Now"
    }
  ];

  return (
    <div className=" py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Our Pricing Plans</h2>
          <p className="text-xl text-gray-300">
            We offer <span className="text-blue-400 font-medium">cost-effective digital marketing solutions</span> for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard key={index} {...option} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;