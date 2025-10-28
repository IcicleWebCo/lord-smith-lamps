import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

const SuccessPage: React.FC = () => {
  const { setCurrentPage, setCart } = useApp();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const session = params.get('session_id');
    setSessionId(session);

    setCart([]);

    if (session) {
      fetchOrderDetails();
    }
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && orders && orders.length > 0) {
        setOrderDetails(orders[0]);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-walnut-900 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-500/20 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-parchment-50 mb-4 font-display">
            Payment Successful!
          </h1>

          <p className="text-parchment-300 text-lg mb-8">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {orderDetails && (
            <div className="bg-walnut-800 rounded-lg p-6 mb-8 text-left">
              <div className="flex items-center mb-4">
                <Package className="h-5 w-5 text-ember-400 mr-2" />
                <h2 className="text-xl font-semibold text-parchment-50">Order Details</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-parchment-300">
                  <span>Order ID:</span>
                  <span className="text-parchment-100 font-mono text-sm">
                    {orderDetails.id}
                  </span>
                </div>

                <div className="flex justify-between text-parchment-300">
                  <span>Order Date:</span>
                  <span className="text-parchment-100">
                    {new Date(orderDetails.order_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between text-parchment-300">
                  <span>Items:</span>
                  <span className="text-parchment-100">
                    {orderDetails.order_items?.length || 0}
                  </span>
                </div>

                <div className="border-t border-walnut-700 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-parchment-50">Total:</span>
                    <span className="text-ember-400">
                      ${Number(orderDetails.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {sessionId && (
            <div className="bg-walnut-800/50 rounded-lg p-4 mb-8">
              <p className="text-parchment-400 text-sm">
                Session ID: <span className="text-parchment-300 font-mono">{sessionId.slice(0, 24)}...</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-parchment-400 text-sm">
              A confirmation email has been sent to your email address.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('profile')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-walnut-700 text-parchment-100 rounded-lg font-semibold hover:bg-walnut-600 transition-all duration-300"
              >
                View Orders
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setCurrentPage('products')}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300"
              >
                Continue Shopping
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
