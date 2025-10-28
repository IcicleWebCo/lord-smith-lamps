import React, { useState, useEffect } from 'react';
import { User, CheckCircle, AlertCircle, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signUp, signIn, resetPassword, updatePassword } from '../lib/supabase';
import OptimizedImage from '../components/OptimizedImage';

const AuthPage: React.FC = () => {
  const { setUser, setCurrentPage, redirectAfterAuth, setRedirectAfterAuth } = useApp();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get('mode');
    if (urlMode === 'reset') {
      setMode('reset');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('loading');
    setMessage('');

    try {
      if (mode === 'forgot') {
        if (!formData.email.trim()) {
          setStatus('error');
          setMessage('Please enter your email address.');
          return;
        }

        await resetPassword(formData.email.trim());
        setStatus('success');
        setMessage('Password reset email sent! Please check your inbox and follow the instructions.');

        setTimeout(() => {
          setMode('login');
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else if (mode === 'reset') {
        if (!formData.password.trim() || !formData.confirmPassword.trim()) {
          setStatus('error');
          setMessage('Please fill in all password fields.');
          return;
        }

        if (formData.password.length < 6) {
          setStatus('error');
          setMessage('Password must be at least 6 characters long.');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setStatus('error');
          setMessage('Passwords do not match.');
          return;
        }

        await updatePassword(formData.password);
        setStatus('success');
        setMessage('Password updated successfully! You can now sign in with your new password.');

        setTimeout(() => {
          setMode('login');
          setFormData({ name: '', email: '', password: '', confirmPassword: '' });
          setStatus('idle');
          setMessage('');
        }, 3000);
      } else {
        // Validation for login/signup
        if (!formData.email.trim() || !formData.password.trim()) {
          setStatus('error');
          setMessage('Please fill in all required fields.');
          return;
        }

        if (mode === 'signup' && !formData.name.trim()) {
          setStatus('error');
          setMessage('Please enter your full name.');
          return;
        }

        if (formData.password.length < 6) {
          setStatus('error');
          setMessage('Password must be at least 6 characters long.');
          return;
        }

        if (mode === 'login') {
          const { user } = await signIn(formData.email.trim(), formData.password);

          if (user) {
            setUser({
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.name || user.email!.split('@')[0],
            });
            setStatus('success');
            setMessage('Successfully signed in!');

            setTimeout(() => {
              const targetPage = redirectAfterAuth || 'profile';
              setRedirectAfterAuth(null);
              setCurrentPage(targetPage);
            }, 1500);
          }
        } else if (mode === 'signup') {
          const { user } = await signUp(formData.email.trim(), formData.password, formData.name.trim());

          if (user) {
            setStatus('success');
            setMessage('Account created successfully! Please check your email to verify your account, then sign in.');

            setTimeout(() => {
              setMode('login');
              setFormData({ name: '', email: formData.email, password: '', confirmPassword: '' });
              setStatus('idle');
              setMessage('');
            }, 3000);
          }
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
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Join Our Community'}
              {mode === 'forgot' && 'Reset Password'}
              {mode === 'reset' && 'Create New Password'}
            </h2>
            <p className="text-parchment-300 mt-2">
              {mode === 'login' && 'Sign in to continue your journey'}
              {mode === 'signup' && 'Create your account to get started'}
              {mode === 'forgot' && 'Enter your email to receive a password reset link'}
              {mode === 'reset' && 'Enter your new password below'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
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
                  required
                />
              </div>
            )}

            {mode !== 'reset' && (
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
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  {mode === 'reset' ? 'New Password' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent"
                  placeholder={mode === 'reset' ? 'Enter your new password' : 'Enter your password'}
                  required
                />
              </div>
            )}

            {mode === 'reset' && (
              <div>
                <label className="block text-sm font-medium text-parchment-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-ember-500 focus:border-transparent"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  disabled={status === 'loading'}
                  className="text-sm text-ember-400 hover:text-ember-300 transition-colors duration-300"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 font-semibold rounded-lg hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge"
            >
              {status === 'loading' && mode === 'login' && 'Signing In...'}
              {status === 'loading' && mode === 'signup' && 'Creating Account...'}
              {status === 'loading' && mode === 'forgot' && 'Sending Reset Link...'}
              {status === 'loading' && mode === 'reset' && 'Updating Password...'}
              {status !== 'loading' && mode === 'login' && 'Sign In'}
              {status !== 'loading' && mode === 'signup' && 'Create Account'}
              {status !== 'loading' && mode === 'forgot' && 'Send Reset Link'}
              {status !== 'loading' && mode === 'reset' && 'Update Password'}
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
            {mode === 'login' && (
              <button
                onClick={() => {
                  setMode('signup');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  setStatus('idle');
                  setMessage('');
                }}
                disabled={status === 'loading'}
                className="text-ember-400 hover:text-ember-300 transition-colors duration-300 font-medium"
              >
                Don't have an account? Sign up
              </button>
            )}
            {mode === 'signup' && (
              <button
                onClick={() => {
                  setMode('login');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  setStatus('idle');
                  setMessage('');
                }}
                disabled={status === 'loading'}
                className="text-ember-400 hover:text-ember-300 transition-colors duration-300 font-medium"
              >
                Already have an account? Sign in
              </button>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => {
                  setMode('login');
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                  setStatus('idle');
                  setMessage('');
                }}
                disabled={status === 'loading'}
                className="text-ember-400 hover:text-ember-300 transition-colors duration-300 font-medium"
              >
                Back to sign in
              </button>
            )}
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