import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';

interface ProductImage {
  product_id: string;
  image_url: string;
}

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getSubtotal, getTaxAmount, getTotalPrice, setCurrentPage, setRedirectAfterAuth } = useApp();
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    loadDefaultImages();
  }, [cart]);

  const loadDefaultImages = async () => {
    if (cart.length === 0) return;

    const productIds = cart.map(item => item.id);
    const { data, error } = await supabase
      .from('product_images')
      .select('product_id, image_url')
      .in('product_id', productIds)
      .eq('seq', 1);

    if (error) {
      console.error('Error loading product images:', error);
      return;
    }

    const imageMap: Record<string, string> = {};
    data?.forEach((img: ProductImage) => {
      imageMap[img.product_id] = img.image_url;
    });
    setProductImages(imageMap);
  };

  const getProductImage = (productId: string, fallbackUrl: string) => {
    return productImages[productId] || fallbackUrl;
  };

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setShowAuthModal(true);
      return;
    }

    setLoading(true);

    try {
      const cartItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.cartQuantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { cart_items: cartItems },
      });

      if (error) {
        console.error('Checkout error:', error);
        alert('Failed to create checkout session. Please try again.');
        setLoading(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="bg-walnut-900 rounded-xl p-8 max-w-md mx-auto">
              <ShoppingCart className="h-16 w-16 text-parchment-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-parchment-50 mb-2">Your cart is empty</h3>
              <p className="text-parchment-300 mb-6">
                Start shopping to add items to your cart
              </p>
              <button
                onClick={() => setCurrentPage('products')}
                className="bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 px-6 py-3 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={() => {
          setShowAuthModal(false);
          setRedirectAfterAuth('cart');
          setCurrentPage('auth');
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-parchment-50 mb-8 font-display">
            Shopping Cart
          </h1>

          <div className="bg-walnut-900 rounded-xl p-6">
            <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-walnut-800 rounded-lg">
                <img
                  src={getProductImage(item.id, item.image_url)}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-parchment-50">{item.name}</h3>
                  <p className="text-parchment-300 text-sm">{item.category_name || 'Uncategorized'}</p>
                  <p className="text-ember-400 font-bold">${item.price.toFixed(2)}</p>
                  {item.cartQuantity > item.quantity && (
                    <p className="text-forge-400 text-xs mt-1">Only {item.quantity} available</p>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, Math.max(0, item.cartQuantity - 1))}
                      className="p-1 bg-walnut-700 text-parchment-300 rounded hover:bg-walnut-600 transition-colors duration-300"
                    >
                      <Minus className="h-4 w-4" />
                    </button>

                    <span className="text-parchment-50 font-medium w-8 text-center">
                      {item.cartQuantity}
                    </span>

                    <button
                      onClick={() => {
                        if (item.cartQuantity < item.quantity) {
                          updateQuantity(item.id, item.cartQuantity + 1);
                        }
                      }}
                      disabled={item.cartQuantity >= item.quantity}
                      className={`p-1 rounded transition-colors duration-300 ${
                        item.cartQuantity >= item.quantity
                          ? 'bg-walnut-700 text-parchment-500 cursor-not-allowed'
                          : 'bg-walnut-700 text-parchment-300 hover:bg-walnut-600'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-parchment-400 text-xs">
                    {item.quantity} in stock
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-forge-400 hover:text-forge-300 transition-colors duration-300"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-walnut-700 mt-8 pt-8">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-parchment-300">Subtotal:</span>
                <span className="text-parchment-50 font-medium">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-parchment-300">Sales Tax (9.5%):</span>
                <span className="text-parchment-50 font-medium">
                  ${getTaxAmount().toFixed(2)}
                </span>
              </div>
              <div className="border-t border-walnut-700 pt-3 flex justify-between items-center">
                <span className="text-xl font-semibold text-parchment-50">Total:</span>
                <span className="text-2xl font-bold text-ember-400">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('products')}
                className="flex-1 py-3 bg-walnut-700 text-parchment-100 rounded-lg font-semibold hover:bg-walnut-600 transition-all duration-300"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;