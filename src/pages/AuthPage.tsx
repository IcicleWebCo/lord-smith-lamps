import React, { useState } from 'react';
import { User, CheckCircle, AlertCircle, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signUp, signIn } from '../lib/supabase';
import OptimizedImage from '../components/OptimizedImage';

const AuthPage: React.FC = () => {
  const { setUser, setCurrentPage, redirectAfterAuth, setRedirectAfterAuth } = useApp();
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

          // Redirect to the stored page or default to profile
          setTimeout(() => {
            const targetPage = redirectAfterAuth || 'profile';
            setRedirectAfterAuth(null);
            setCurrentPage(targetPage);
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
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8 flex items-center justify-center relative overflow-hidden">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
        alt="Background texture"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        priority={false}
      />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <Flame className="h-12 w-12 text-forge-500 animate-flicker" />
          </div>
          <h1 className="text-4xl font-bold text-parchment-50 mb-2 font-display">
            Lord Smith Lamps
          </h1>
          <p className="text-ember-400 font-medium tracking-wide text-sm">
            HANDCRAFTED UPCYCLED LAMPS
          </p>
        </div>

        <div className="bg-walnut-900 rounded-xl p-8 shadow-craft border border-walnut-800">
          <div className="text-center mb-8">
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-3 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4 overflow-hidden shadow-forge">
              <OptimizedImage
                src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
                alt="Pattern"
                className="absolute inset-0 w-full h-full object-cover opacity-20"
                priority={false}
              />
              <User className="h-8 w-8 text-parchment-50 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-parchment-50 font-display">
              {isLogin ? 'Welcome Back' : 'Join Our Community'}
            </h2>
            <p className="text-parchment-300 mt-2">
              {isLogin ? 'Sign in to continue your journey' : 'Create your account to get started'}
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
              className="text-ember-400 hover:text-ember-300 transition-colors duration-300 font-medium"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-parchment-400 text-sm">
            Illuminate your space with handcrafted vintage treasures
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;