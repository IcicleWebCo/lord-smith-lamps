import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import { useApp } from '../context/AppContext';

const ContactPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setMessage('Please fill in all fields.');
      return;
    }

    if (!formData.email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      });

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const emailResponse = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim()
        })
      });

      if (!emailResponse.ok) {
        console.error('Failed to send email notification');
      }

      setStatus('success');
      setMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-4 rounded-xl overflow-hidden"
                 >

              <MessageSquare className="h-8 w-8 text-parchment-50 relative z-10" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-parchment-50 mb-4 font-display">
            Get in Touch
          </h1>
          
          <p className="text-xl text-parchment-300 max-w-2xl mx-auto leading-relaxed">
            Have a question about our crafts, need a custom piece, or want to share feedback? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-walnut-900 rounded-xl p-8 shadow-craft">
            <h2 className="text-2xl font-bold text-parchment-50 mb-6 font-display">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-2" />
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  rows={10}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  placeholder="Tell us about your question, custom request, or feedback..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 font-semibold rounded-lg hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-parchment-50 mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center text-patina-400 bg-patina-950 p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center text-forge-400 bg-forge-950 p-4 rounded-lg">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="text-sm">{message}</span>
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Workshop Info */}
            <div className="bg-walnut-900 rounded-xl p-8 shadow-craft">
              <h3 className="text-2xl font-bold text-parchment-50 mb-6 font-display">
                Visit Our Store
              </h3>
              
              <div className="space-y-4 text-parchment-300">
                <div>
                  <h4 className="font-semibold text-parchment-100 mb-2">Address</h4>
                  <p><a href="https://www.intavintage.com/" target="_blank">Inta Vintage</a><br /> 1109 Main Street<br />Sumner, WA 98390</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-parchment-100 mb-2">Hours</h4>
                  <p>Monday - Saturday: 10:00 AM - 5:00 PM<br />Sunday: 10:00 AM - 4:00 PM</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-parchment-100 mb-2">Contact</h4>
                  <p>Phone: <a href="tel:1-253-204-0509">(253) 204-0509</a><br />Email: <a href="mailto:info@lordsmithlamps.com">info@lordsmithlamps.com</a></p>
                </div>
              </div>
            </div>

            {/* Custom Orders */}
            <div className="bg-gradient-to-br from-forge-900 to-ember-900 rounded-xl p-8 shadow-craft">
              <h3 className="text-2xl font-bold text-parchment-50 mb-4 font-display">
                Custom Orders
              </h3>

              <p className="text-parchment-200 mb-6">
                Looking for something unique? We specialize in custom pieces tailored to your specific needs and vision.
              </p>

              <button
                onClick={() => setCurrentPage('custom-work')}
                className="inline-flex items-center px-6 py-3 bg-parchment-50 text-forge-900 font-semibold rounded-lg hover:bg-parchment-100 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 transform"
              >
                View More Info
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>

            {/* Response Time */}
            <div className="bg-walnut-800 rounded-xl p-6 border border-walnut-700">
              <h4 className="font-semibold text-parchment-100 mb-2">Response Time</h4>
              <p className="text-parchment-300 text-sm">
                We typically respond to all inquiries within 24 hours during business days. 
                For urgent custom orders, please call us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;