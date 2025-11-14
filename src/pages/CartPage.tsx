import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, MapPin, AlertCircle, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import AuthModal from '../components/AuthModal';
import { ShippingAddress } from '../types';

interface ProductImage {
  product_id: string;
  image_url: string;
}

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getSubtotal, getShippingTotal, getTaxAmount, getTotalPrice, setCurrentPage, setRedirectAfterAuth } = useApp();
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<ShippingAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
    special_instructions: '',
    is_default: false,
  });

  useEffect(() => {
    loadDefaultImages();
  }, [cart]);

  useEffect(() => {
    loadShippingAddresses();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        loadShippingAddresses();
      } else if (event === 'SIGNED_OUT') {
        setShippingAddresses([]);
        setSelectedAddressId(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadShippingAddresses = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading shipping addresses:', error);
      return;
    }

    setShippingAddresses(data || []);
    const defaultAddress = data?.find(addr => addr.is_default);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    } else if (data && data.length > 0) {
      setSelectedAddressId(data[0].id);
    }
  };

  const loadDefaultImages = async () => {
    if (cart.length === 0) return;

    const productIds = cart.map(item => item.id);
    const { data, error } = await supabase
      .from('product_images')
      .select('product_id, image_url, thumbnail_url')
      .in('product_id', productIds)
      .eq('seq', 1);

    if (error) {
      console.error('Error loading product images:', error);
      return;
    }

    const imageMap: Record<string, string> = {};
    data?.forEach((img: ProductImage) => {
      imageMap[img.product_id] = img.thumbnail_url || img.image_url;
    });
    setProductImages(imageMap);
  };

  const getProductImage = (productId: string, fallbackUrl: string) => {
    return productImages[productId] || fallbackUrl;
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('Please sign in to save addresses.');
      return;
    }

    if (!addressForm.full_name || !addressForm.address_line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      if (addressForm.is_default) {
        await supabase
          .from('shipping_addresses')
          .update({ is_default: false })
          .eq('user_id', session.user.id);
      }

      const { data, error } = await supabase
        .from('shipping_addresses')
        .insert([{
          ...addressForm,
          user_id: session.user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error saving address:', error);
        alert(`Failed to save address: ${error.message}`);
        return;
      }

      setShippingAddresses([data, ...shippingAddresses]);
      setSelectedAddressId(data.id);
      setShowAddressForm(false);
      setAddressForm({
        full_name: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US',
        phone: '',
        special_instructions: '',
        is_default: false,
      });
    } catch (err) {
      console.error('Unexpected error saving address:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setShowAuthModal(true);
      return;
    }

    if (!selectedAddressId) {
      alert('Please select or add a shipping address before checkout.');
      return;
    }

    setLoading(true);

    try {
      const cartItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.cartQuantity,
      }));

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          cart_items: cartItems,
          shipping_address_id: selectedAddressId,
        },
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

          <div className="bg-gradient-to-r from-ember-900/50 to-forge-900/50 border-2 border-ember-600 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-ember-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-parchment-50 mb-2 font-display">
                  Checkout Temporarily Unavailable
                </h2>
                <p className="text-parchment-300 mb-4">
                  We apologize for the inconvenience. We are currently updating our payment system and will be able to accept payments soon. Your items will remain in your cart.
                </p>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ember-600 hover:bg-ember-700 text-parchment-50 rounded-lg font-semibold transition-all duration-300"
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Us for Assistance
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-walnut-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-parchment-50 mb-4">Cart Items</h2>
              <div className="space-y-4">
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
                  <div className="flex items-center gap-2">
                    <p className="text-ember-400 font-bold">${item.price.toFixed(2)}</p>
                    {item.shipping_price > 0 && (
                      <p className="text-parchment-400 text-sm">+ ${item.shipping_price.toFixed(2)} shipping</p>
                    )}
                  </div>
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
            </div>

            <div className="bg-walnut-900 rounded-xl p-6 opacity-50 pointer-events-none">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-ember-400" />
                  <h2 className="text-xl font-semibold text-parchment-50">Shipping Address</h2>
                </div>
                <button
                  onClick={async () => {
                    if (!showAddressForm) {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) {
                        setShowAuthModal(true);
                        return;
                      }
                    }
                    setShowAddressForm(!showAddressForm);
                  }}
                  className="text-ember-400 hover:text-ember-300 text-sm font-medium"
                >
                  {showAddressForm ? 'Cancel' : '+ Add New Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="mb-6 p-4 bg-walnut-800 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-parchment-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={addressForm.full_name}
                        onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                        className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-parchment-300 mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line1}
                      onChange={(e) => setAddressForm({ ...addressForm, address_line1: e.target.value })}
                      className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-parchment-300 mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={addressForm.address_line2}
                      onChange={(e) => setAddressForm({ ...addressForm, address_line2: e.target.value })}
                      className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-parchment-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-parchment-300 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={addressForm.postal_code}
                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                        className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-parchment-300 mb-1">
                      Special Delivery Instructions
                    </label>
                    <textarea
                      value={addressForm.special_instructions}
                      onChange={(e) => setAddressForm({ ...addressForm, special_instructions: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-walnut-700 border border-walnut-600 rounded-lg text-parchment-50 focus:outline-none focus:ring-2 focus:ring-ember-500 resize-none"
                      placeholder="e.g., Leave package at side door, Ring doorbell twice, etc."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_default"
                      checked={addressForm.is_default}
                      onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                      className="h-4 w-4 text-ember-500 focus:ring-ember-500 border-walnut-600 rounded bg-walnut-700"
                    />
                    <label htmlFor="is_default" className="ml-2 text-sm text-parchment-300">
                      Set as default address
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!addressForm.full_name || !addressForm.address_line1 || !addressForm.city || !addressForm.state || !addressForm.postal_code}
                    className="w-full py-2 bg-gradient-to-r from-ember-600 to-ember-500 text-parchment-50 rounded-lg font-semibold hover:from-ember-700 hover:to-ember-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {shippingAddresses.length > 0 ? (
                <div className="space-y-3">
                  {shippingAddresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedAddressId === address.id
                          ? 'border-ember-500 bg-walnut-800'
                          : 'border-walnut-700 bg-walnut-800/50 hover:bg-walnut-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-parchment-50">{address.full_name}</h3>
                            {address.is_default && (
                              <span className="text-xs px-2 py-0.5 bg-ember-600 text-parchment-50 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-parchment-300">{address.address_line1}</p>
                          {address.address_line2 && (
                            <p className="text-sm text-parchment-300">{address.address_line2}</p>
                          )}
                          <p className="text-sm text-parchment-300">
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          {address.phone && (
                            <p className="text-sm text-parchment-300 mt-1">Phone: {address.phone}</p>
                          )}
                          {address.special_instructions && (
                            <p className="text-sm text-ember-400 mt-2 italic">
                              Note: {address.special_instructions}
                            </p>
                          )}
                        </div>
                        <input
                          type="radio"
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                          className="h-5 w-5 text-ember-500 focus:ring-ember-500 border-walnut-600"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : !showAddressForm && (
                <div className="text-center py-8">
                  <p className="text-parchment-400 mb-4">No shipping addresses saved</p>
                  <button
                    onClick={async () => {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (!session) {
                        setShowAuthModal(true);
                        return;
                      }
                      setShowAddressForm(true);
                    }}
                    className="text-ember-400 hover:text-ember-300 font-medium"
                  >
                    Add your first address
                  </button>
                </div>
              )}
            </div>

            <div className="bg-walnut-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-parchment-50 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-parchment-300">Subtotal:</span>
                <span className="text-parchment-50 font-medium">
                  ${getSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-parchment-300">Shipping:</span>
                <span className="text-parchment-50 font-medium">
                  ${getShippingTotal().toFixed(2)}
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
                disabled
                className="flex-1 py-3 bg-walnut-700 text-parchment-400 rounded-lg font-semibold cursor-not-allowed opacity-50"
              >
                Checkout Temporarily Unavailable
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