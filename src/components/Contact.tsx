import React, { useState } from 'react';
import { Mail, Clock, MapPin } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="lg:pl-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-green-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-700 mt-2">
                    Hyderabad, Telangana<br />
                    India
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-green-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Email</h3>
                  <a 
                    href="mailto:contact@talqs.ai"
                    className="text-green-600 hover:text-green-700 mt-2 inline-block"
                  >
                    contact@talqs.ai
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-green-600 mt-1" />
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900">Working Hours</h3>
                  <p className="text-gray-700 mt-2">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 1:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;