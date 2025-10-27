import React from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Hammer,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Header: React.FC = () => {
  const {
    user,
    currentPage,
    isMenuOpen,
    setCurrentPage,
    setIsMenuOpen,
    getTotalItems
  } = useApp();

  return (
    <header className="bg-soot-950 border-b border-walnut-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center cursor-pointer group"
            onClick={() => setCurrentPage('home')}
          >
            <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-2 rounded-lg mr-3 group-hover:shadow-forge transition-all duration-300 overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: 'url(/bg.png)' }}
              />
              <Hammer className="h-6 w-6 text-parchment-50 relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-parchment-50 font-display">
                Lord Smith
              </h1>
              <p className="text-xs text-gold-400">Creative Designed Lamps</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => setCurrentPage('home')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'home'
                  ? 'text-ember-400 border-b-2 border-ember-400 pb-1'
                  : 'text-parchment-300 hover:text-ember-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentPage('products')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'products'
                  ? 'text-ember-400 border-b-2 border-ember-400 pb-1'
                  : 'text-parchment-300 hover:text-ember-300'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => setCurrentPage('custom-work')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'custom-work'
                  ? 'text-ember-400 border-b-2 border-ember-400 pb-1'
                  : 'text-parchment-300 hover:text-ember-300'
              }`}
            >
              Custom Work
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'about'
                  ? 'text-ember-400 border-b-2 border-ember-400 pb-1'
                  : 'text-parchment-300 hover:text-ember-300'
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setCurrentPage('contact')}
              className={`text-sm font-medium transition-colors duration-200 ${
                currentPage === 'contact'
                  ? 'text-ember-400 border-b-2 border-ember-400 pb-1'
                  : 'text-parchment-300 hover:text-ember-300'
              }`}
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-forge-500 text-parchment-50 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {getTotalItems()}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentPage(user ? 'profile' : 'auth')}
              className="p-2 text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              <User className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-walnut-900 border-t border-walnut-800">
          <nav className="px-4 py-3 space-y-3">
            <button
              onClick={() => {
                setCurrentPage('home');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                setCurrentPage('products');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              Shop
            </button>
            <button
              onClick={() => {
                setCurrentPage('custom-work');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              Custom Work
            </button>
            <button
              onClick={() => {
                setCurrentPage('about');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              Our Story
            </button>
            <button
              onClick={() => {
                setCurrentPage('contact');
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-parchment-300 hover:text-ember-300 transition-colors duration-200"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
