import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Sparkles, Bell, Gift } from 'lucide-react';
import { subscribeToNewsletter } from '../lib/supabase';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await subscribeToNewsletter(email.trim());
      setStatus('success');
      setMessage('Thank you for subscribing! You\'ll receive our latest updates.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-timber-50 via-parchment-100 to-timber-100">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url(/bg.png)', backgroundSize: 'cover' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Mailbox Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-ember-500/20 to-forge-500/20 blur-3xl rounded-full" />
            <div className="relative">
              <img
                src="/mailbox.png"
                alt="Mailbox"
                className="w-full h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-8 -right-4 bg-parchment-50 rounded-full p-4 shadow-craft animate-bounce">
                <Mail className="h-8 w-8 text-forge-600" />
              </div>
            </div>
          </div>

          {/* Right: Newsletter Form */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember-100 text-ember-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Join Our Community
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-walnut-900 mb-4 leading-tight font-display">
              Never Miss a <span className="text-forge-600">Masterpiece</span>
            </h2>

            <p className="text-lg text-walnut-700 mb-8">
              Get exclusive updates on new arrivals, special offers, and handcrafted collections delivered straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-timber-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={status === 'loading'}
                    className="w-full pl-12 pr-4 py-4 bg-parchment-50 border-2 border-timber-200 rounded-xl text-walnut-900 placeholder-timber-400 focus:outline-none focus:ring-2 focus:ring-forge-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-8 py-4 bg-gradient-to-r from-forge-600 to-ember-600 text-parchment-50 font-semibold rounded-xl hover:from-forge-700 hover:to-ember-700 transition-all duration-300 shadow-forge hover:shadow-ember disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transform hover:-translate-y-0.5"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>

              {status === 'success' && (
                <div className="mt-4 flex items-center gap-2 text-patina-700 bg-patina-50 p-4 rounded-lg border border-patina-200">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-mahogany-700 bg-mahogany-50 p-4 rounded-lg border border-mahogany-200">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{message}</span>
                </div>
              )}
            </form>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 bg-parchment-50 rounded-xl shadow-sm border border-timber-200 hover:shadow-md transition-shadow">
                <div className="p-2 bg-ember-100 rounded-lg mb-2">
                  <Bell className="h-5 w-5 text-ember-600" />
                </div>
                <span className="text-xs font-medium text-walnut-700">Early Access</span>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-parchment-50 rounded-xl shadow-sm border border-timber-200 hover:shadow-md transition-shadow">
                <div className="p-2 bg-copper-100 rounded-lg mb-2">
                  <Gift className="h-5 w-5 text-copper-600" />
                </div>
                <span className="text-xs font-medium text-walnut-700">Special Offers</span>
              </div>

              <div className="flex flex-col items-center text-center p-4 bg-parchment-50 rounded-xl shadow-sm border border-timber-200 hover:shadow-md transition-shadow">
                <div className="p-2 bg-gold-100 rounded-lg mb-2">
                  <Sparkles className="h-5 w-5 text-gold-600" />
                </div>
                <span className="text-xs font-medium text-walnut-700">New Arrivals</span>
              </div>
            </div>

            <p className="text-xs text-timber-500 mt-6">
              We respect your privacy. Unsubscribe anytime with one click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;