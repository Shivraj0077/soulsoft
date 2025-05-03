import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
        <p className="text-gray-300 mb-6">
          Have questions or need assistance? Our team is here to help you. Feel free to reach out using the contact details below.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <MapPin className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-base font-medium text-white">Location</h4>
            <p className="text-gray-300 mt-1">1234 Design Avenue, Suite 567<br />San Francisco, CA 94103</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Phone className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-base font-medium text-white">Phone</h4>
            <p className="text-gray-300 mt-1">+1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Mail className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-base font-medium text-white">Email</h4>
            <p className="text-gray-300 mt-1">contact@company.com<br />support@company.com</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <Clock className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="ml-4">
            <h4 className="text-base font-medium text-white">Business Hours</h4>
            <p className="text-gray-300 mt-1">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-6">
        <h3 className="text-xl font-semibold text-white mb-4">Connect With Us</h3>
        <div className="flex space-x-4">
          {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
            <a
              key={social}
              href={`#${social}`}
              className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 hover:bg-gray-700 hover:border-gray-600 transition-all duration-300 ease-in-out group"
            >
              <span className="sr-only">{social}</span>
              <div className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300">
                {/* Using placeholders for social icons */}
                {social === 'facebook' && <span className="text-lg">f</span>}
                {social === 'twitter' && <span className="text-lg">t</span>}
                {social === 'instagram' && <span className="text-lg">i</span>}
                {social === 'linkedin' && <span className="text-lg">in</span>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;