import React from 'react';
import { Hammer } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Footer: React.FC = () => {
  const { setCurrentPage } = useApp();
  return (
    <footer className="bg-soot-950 border-t border-walnut-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-2 rounded-lg mr-3 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <Hammer className="h-5 w-5 text-parchment-50 relative z-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-parchment-50 font-display">
                  Lord Smith
                </h3>
                <p className="text-xs text-gold-400">Creative Designed Lamps</p>
              </div>
            </div>
            <p className="text-parchment-300 text-sm">
              Handcrafted lamp pieces, forged with tradition and built to last generations. The second life of beautiful things.
            </p>
          </div>

          <div>
            <h4 className="text-parchment-50 font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage('products')} className="text-parchment-300 hover:text-ember-300 transition-colors duration-300">All Products</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-parchment-50 font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage('about')} className="text-parchment-300 hover:text-ember-300 transition-colors duration-300">Our Story</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="text-parchment-300 hover:text-ember-300 transition-colors duration-300">Contact</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-parchment-50 font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => setCurrentPage('faq')} className="text-parchment-300 hover:text-ember-300 transition-colors duration-300">FAQ</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-walnut-800 mt-8 pt-8 text-center">
          <p className="text-parchment-400 text-sm">
            © 2025 Lord Smith. All rights reserved. Handcrafted with ❤️ in the traditional way.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;