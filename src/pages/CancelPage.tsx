import React from 'react';
import { XCircle, ShoppingCart, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CancelPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-walnut-900 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-500/20 p-4 rounded-full">
              <XCircle className="h-16 w-16 text-amber-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-parchment-50 mb-4 font-display">
            Order Canceled
          </h1>

          <p className="text-parchment-300 text-lg mb-8">
            Your order was canceled. You have not been charged.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('cart')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
              Return to Cart
            </button>

            <button
              onClick={() => setCurrentPage('home')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-walnut-700 text-parchment-100 rounded-lg font-semibold hover:bg-walnut-600 transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
