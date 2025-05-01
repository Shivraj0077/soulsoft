'use client';

import { useState } from 'react';
import ImageUploader from '../shared/ImageUploader';

export default function TicketForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    problem_type: 'product', // Matches schema constraint
    product_service_name: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!['product', 'service'].includes(formData.problem_type)) {
      setError('Invalid problem type');
      return false;
    }
    if (!formData.product_service_name.trim()) {
      setError('Product/Service name is required');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user makes changes
  };

  const handleImageChange = (file) => {
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }
    setImage(file);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append('image', image);
    }

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create ticket');
      }

      setSuccess('Ticket created successfully! Ticket ID: ' + result.ticketId);
      setFormData({
        title: '',
        description: '',
        problem_type: 'product',
        product_service_name: '',
      });
      setImage(null);
      if (onSubmit) onSubmit();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Success</p>
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={255}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Brief title for your issue"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Detailed description of your issue"
          ></textarea>
        </div>

        <div>
          <label htmlFor="problem_type" className="block text-gray-700 font-medium mb-2">
            Problem Type <span className="text-red-500">*</span>
          </label>
          <select
            id="problem_type"
            name="problem_type"
            value={formData.problem_type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="product">Product</option>
            <option value="service">Service</option>
          </select>
        </div>

        <div>
          <label htmlFor="product_service_name" className="block text-gray-700 font-medium mb-2">
            Product/Service Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="product_service_name"
            name="product_service_name"
            value={formData.product_service_name}
            onChange={handleChange}
            required
            maxLength={255}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Name of the product or service"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Image (Optional)
          </label>
          <ImageUploader 
            onImageChange={handleImageChange} 
            maxSize={5 * 1024 * 1024} 
            acceptedTypes={['image/jpeg', 'image/png', 'image/gif']}
          />
          <p className="text-sm text-gray-500 mt-1">Maximum file size: 5MB</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors
            ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Create Ticket'
          )}
        </button>
      </div>
    </form>
  );
}