import React from 'react';
import { User, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { signOut } from '../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCurrentPage } = useApp();
  const { isAdmin } = useAdmin();

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
      // Still clear the user state even if there's an error
      setUser(null);
      setCurrentPage('home');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-walnut-900 rounded-xl p-8">
          <div className="flex items-center mb-8">
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-4 rounded-full mr-6 overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: 'url(/bg.png)' }}
              />
              <User className="h-12 w-12 text-parchment-50 relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-parchment-50 font-display">
                {user.name}
              </h1>
              <p className="text-parchment-300">{user.email}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-walnut-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-parchment-50 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-parchment-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-ember-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-parchment-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-100 focus:outline-none focus:ring-2 focus:ring-ember-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-walnut-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-parchment-50 mb-4">Account Actions</h3>
              <div className="space-y-3">
                {isAdmin && (
                  <button
                    onClick={() => setCurrentPage('admin')}
                    className="w-full text-left px-4 py-3 bg-gold-600 text-parchment-50 rounded-lg hover:bg-gold-700 transition-colors duration-300 flex items-center gap-2"
                  >
                    <Shield className="h-5 w-5" />
                    Admin Panel
                  </button>
                )}
                <button className="w-full text-left px-4 py-3 bg-walnut-700 text-parchment-100 rounded-lg hover:bg-walnut-600 transition-colors duration-300">
                  Order History
                </button>
                <button className="w-full text-left px-4 py-3 bg-walnut-700 text-parchment-100 rounded-lg hover:bg-walnut-600 transition-colors duration-300">
                  Wishlist
                </button>
                <button className="w-full text-left px-4 py-3 bg-walnut-700 text-parchment-100 rounded-lg hover:bg-walnut-600 transition-colors duration-300">
                  Shipping Addresses
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors duration-300"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;