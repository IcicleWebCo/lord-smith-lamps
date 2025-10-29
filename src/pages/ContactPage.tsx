import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle, ArrowRight, Flame, MapPin, Clock, Phone } from 'lucide-react';
import { submitContactForm } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import OptimizedImage from '../components/OptimizedImage';

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
    <div className="min-h-screen bg-gradient-to-br from-soot-950 via-walnut-950 to-soot-950 relative overflow-hidden">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
        alt="Background texture"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        priority={false}
      />

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-forge-950/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-4 rounded-xl shadow-forge overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-forge-400/20 to-ember-500/20 animate-pulse"></div>
              <MessageSquare className="h-10 w-10 text-parchment-50 relative z-10" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-ember-500"></div>
            <p className="text-ember-400 font-semibold text-sm tracking-wide uppercase">Contact Us</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-ember-500"></div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-parchment-50 mb-6 font-display">
            Let's Connect
          </h1>

          <p className="text-xl text-parchment-300 max-w-2xl mx-auto leading-relaxed">
            Have questions about our handcrafted lamps? Need a custom piece? We're here to help bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-walnut-900 rounded-xl p-6 border-2 border-walnut-800 hover:border-forge-600 transition-all duration-300 shadow-craft">
            <div className="bg-gradient-to-br from-forge-900 to-ember-900 p-3 rounded-lg w-fit mb-4">
              <MapPin className="h-6 w-6 text-ember-400" />
            </div>
            <h3 className="text-xl font-bold text-parchment-50 mb-2 font-display">Visit Our Workshop</h3>
            <p className="text-parchment-300 text-sm leading-relaxed">
              <a href="https://www.intavintage.com/" target="_blank" rel="noopener noreferrer" className="text-forge-400 hover:text-forge-300 transition-colors">Inta Vintage</a>
              <br />1109 Main Street
              <br />Sumner, WA 98390
            </p>
          </div>

          <div className="bg-walnut-900 rounded-xl p-6 border-2 border-walnut-800 hover:border-forge-600 transition-all duration-300 shadow-craft">
            <div className="bg-gradient-to-br from-forge-900 to-ember-900 p-3 rounded-lg w-fit mb-4">
              <Clock className="h-6 w-6 text-ember-400" />
            </div>
            <h3 className="text-xl font-bold text-parchment-50 mb-2 font-display">Store Hours</h3>
            <p className="text-parchment-300 text-sm leading-relaxed">
              Mon - Sat: 10:00 AM - 5:00 PM
              <br />Sunday: 10:00 AM - 4:00 PM
              <br />
              <span className="text-parchment-400 text-xs italic mt-2 block">We respond within 24 hours</span>
            </p>
          </div>

          <div className="bg-walnut-900 rounded-xl p-6 border-2 border-walnut-800 hover:border-forge-600 transition-all duration-300 shadow-craft">
            <div className="bg-gradient-to-br from-forge-900 to-ember-900 p-3 rounded-lg w-fit mb-4">
              <Phone className="h-6 w-6 text-ember-400" />
            </div>
            <h3 className="text-xl font-bold text-parchment-50 mb-2 font-display">Direct Contact</h3>
            <p className="text-parchment-300 text-sm leading-relaxed">
              <a href="tel:1-253-204-0509" className="text-forge-400 hover:text-forge-300 transition-colors">(253) 204-0509</a>
              <br />
              <a href="mailto:info@lordsmithlamps.com" className="text-forge-400 hover:text-forge-300 transition-colors">info@lordsmithlamps.com</a>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 overflow-hidden shadow-craft">
              <div className="bg-gradient-to-br from-forge-900 to-walnut-900 p-6 border-b-2 border-walnut-800">
                <div className="flex items-center gap-3">
                  <div className="bg-forge-800 p-2 rounded-lg">
                    <Send className="h-5 w-5 text-ember-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-parchment-50 font-display">Send a Message</h2>
                    <p className="text-parchment-400 text-sm">Fill out the form and we'll get back to you soon</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-parchment-300 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-ember-400" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-walnut-800 border-2 border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-500 focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-parchment-300 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-ember-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-walnut-800 border-2 border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-500 focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-parchment-300 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-ember-400" />
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      rows={8}
                      className="w-full px-4 py-3 bg-walnut-800 border-2 border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-500 focus:outline-none focus:border-forge-500 focus:ring-2 focus:ring-forge-500/20 disabled:opacity-50 disabled:cursor-not-allowed resize-none transition-all duration-300"
                      placeholder="Tell us about your inquiry, custom request, or feedback..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 font-bold rounded-lg hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-parchment-50 mr-3"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>

                  {status === 'success' && (
                    <div className="flex items-start gap-3 text-patina-400 bg-patina-950/50 border-2 border-patina-600 p-4 rounded-lg">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{message}</span>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="flex items-start gap-3 text-red-400 bg-red-950/50 border-2 border-red-600 p-4 rounded-lg">
                      <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{message}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-forge-900 via-ember-900 to-forge-950 rounded-xl border-2 border-forge-700 p-8 shadow-forge relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ember-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-forge-500/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="bg-ember-800 p-3 rounded-lg w-fit mb-4">
                  <Flame className="h-6 w-6 text-ember-400" />
                </div>

                <h3 className="text-2xl font-bold text-parchment-50 mb-3 font-display">
                  Custom Creations
                </h3>

                <p className="text-parchment-200 mb-6 leading-relaxed">
                  Each lamp is a unique masterpiece, handcrafted in our workshop. Looking for something truly special? We specialize in custom pieces tailored to your vision.
                </p>

                <button
                  onClick={() => setCurrentPage('custom-work')}
                  className="inline-flex items-center px-6 py-3 bg-parchment-50 text-forge-900 font-bold rounded-lg hover:bg-parchment-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Learn About Custom Work
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 p-6 shadow-craft">
              <h4 className="font-bold text-parchment-50 mb-3 font-display flex items-center gap-2">
                <Clock className="h-5 w-5 text-ember-400" />
                Quick Response Guaranteed
              </h4>
              <p className="text-parchment-300 text-sm leading-relaxed">
                We value your time and typically respond to all inquiries within 24 hours during business days. For urgent custom orders or questions, don't hesitate to call us directly.
              </p>
            </div>

            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 p-6 shadow-craft">
              <h4 className="font-bold text-parchment-50 mb-3 font-display">Why Choose Lordsmith Lamps?</h4>
              <ul className="space-y-2 text-parchment-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-ember-400 mt-0.5">•</span>
                  <span>Handcrafted with premium materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember-400 mt-0.5">•</span>
                  <span>Custom designs tailored to your space</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember-400 mt-0.5">•</span>
                  <span>Local artisan craftsmanship</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ember-400 mt-0.5">•</span>
                  <span>Sustainable and built to last</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
