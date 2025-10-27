import React, { useState } from 'react';
import { User, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signUp, signIn } from '../lib/supabase';

const AuthPage: React.FC = () => {
  const { setUser, setCurrentPage } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email.trim() || !formData.password.trim()) {
      setStatus('error');
      setMessage('Please fill in all required fields.');
      return;
    }

    if (!isLogin && !formData.name.trim()) {
      setStatus('error');
      setMessage('Please enter your full name.');
      return;
    }

    if (formData.password.length < 6) {
      setStatus('error');
      setMessage('Password must be at least 6 characters long.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      if (isLogin) {
        // Sign in existing user
        const { user } = await signIn(formData.email.trim(), formData.password);
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || user.email!.split('@')[0],
          });
          setStatus('success');
          setMessage('Successfully signed in!');

          // Redirect to profile page after successful login
          setTimeout(() => {
            setCurrentPage('profile');
          }, 1500);
        }
      } else {
        // Sign up new user
        const { user } = await signUp(formData.email.trim(), formData.password, formData.name.trim());
        
        if (user) {
          setStatus('success');
          setMessage('Account created successfully! Please check your email to verify your account, then sign in.');
          
          // Switch to login form after successful signup
          setTimeout(() => {
            setIsLogin(true);
            setFormData({ name: '', email: formData.email, password: '' });
            setStatus('idle');
            setMessage('');
          }, 3000);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear any existing error messages when user starts typing
    if (status === 'error') {
      setStatus('idle');
      setMessage('');
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-walnut-900 rounded-xl p-8 shadow-craft">
          <div className="text-center mb-8">
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-3 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: 'url(/bg.png)' }}
              />
              <User className="h-8 w-8 text-parchment-50 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-parchment-50 font-display">
              {isLogin ? 'Welcome Back' : 'Register'}
            </h2>
            <p className="text-parchment-300 mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 font-semibold rounded-lg hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge"
            >
              {status === 'loading' 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mt-6 flex items-center justify-center text-patina-400 bg-patina-950 p-4 rounded-lg">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm text-center">{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6 flex items-center justify-center text-forge-400 bg-forge-950 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="text-sm text-center">{message}</span>
            </div>
          )}

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={status === 'loading'}
              className="text-ember-400 hover:text-ember-300 transition-colors duration-300"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;