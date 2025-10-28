import React, { useEffect, useState } from 'react';
import { Flame, ShoppingBag, Settings, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
import { signOut, supabase } from '../lib/supabase';
import OrderHistory from '../components/profile/OrderHistory';
import AccountSettings from '../components/profile/AccountSettings';
import OptimizedImage from '../components/OptimizedImage';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  product_image?: string;
}

interface Order {
  id: string;
  order_date: string;
  total_amount: number;
  status: string;
  order_items: OrderItem[];
}

type TabType = 'orders' | 'settings';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCurrentPage } = useApp();
  const { isAdmin } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('orders');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_date,
          total_amount,
          status,
          order_items (
            id,
            product_id,
            product_name,
            product_price,
            quantity,
            subtotal
          )
        `)
        .order('order_date', { ascending: false });

      if (error) throw error;

      if (ordersData && ordersData.length > 0) {
        const productIds = ordersData.flatMap(order =>
          order.order_items.map((item: OrderItem) => item.product_id)
        );

        const { data: imagesData } = await supabase
          .from('product_images')
          .select('product_id, image_url')
          .in('product_id', productIds)
          .eq('seq', 1);

        const imageMap = new Map(
          imagesData?.map(img => [img.product_id, img.image_url]) || []
        );

        const ordersWithImages = ordersData.map(order => ({
          ...order,
          order_items: order.order_items.map((item: OrderItem) => ({
            ...item,
            product_image: imageMap.get(item.product_id)
          }))
        }));

        setOrders(ordersWithImages);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
      setUser(null);
      setCurrentPage('home');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 via-walnut-950 to-soot-950 relative overflow-hidden">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
        alt="Background texture"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        priority={false}
      />

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-forge-950/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-forge-500 to-ember-600 p-3 rounded-lg shadow-forge">
              <Flame className="h-6 w-6 text-parchment-50" />
            </div>
            <div>
              <p className="text-ember-400 font-medium text-sm tracking-wide">MEMBER DASHBOARD</p>
              <h1 className="text-4xl md:text-5xl font-bold text-parchment-50 font-display">
                Welcome back, {user.name}
              </h1>
            </div>
          </div>
          <p className="text-parchment-300 text-lg ml-16">
            Manage your orders and account settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-br from-forge-900 to-walnut-900 p-6 border-b-2 border-walnut-800">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-forge-500 to-ember-600 rounded-full flex items-center justify-center shadow-forge">
                      <OptimizedImage
                        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
                        alt="Pattern"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 rounded-full"
                        priority={false}
                      />
                      <span className="text-3xl font-bold text-parchment-50 relative z-10">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-patina-500 rounded-full p-1.5">
                      <Sparkles className="h-3 w-3 text-parchment-50" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-parchment-50 font-display">
                      {user.name}
                    </h2>
                    <p className="text-parchment-400 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 mb-1 ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 shadow-forge'
                      : 'text-parchment-300 hover:bg-walnut-800 hover:text-parchment-50'
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                  {activeTab === 'settings' && <ArrowRight className="h-4 w-4 ml-auto" />}
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 mb-1 ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 shadow-forge'
                      : 'text-parchment-300 hover:bg-walnut-800 hover:text-parchment-50'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>My Orders</span>
                  {activeTab === 'orders' && <ArrowRight className="h-4 w-4 ml-auto" />}
                </button>
              </nav>

              <div className="p-4 border-t-2 border-walnut-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-walnut-800 text-parchment-300 rounded-lg font-medium hover:bg-forge-900 hover:text-parchment-50 border-2 border-walnut-700 hover:border-forge-600 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>

          <main className="lg:col-span-2">
            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 p-8">
              {activeTab === 'orders' ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-parchment-50 mb-2 font-display flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-ember-400" />
                        Order History
                      </h2>
                      <p className="text-parchment-400">
                        Track and review your past purchases
                      </p>
                    </div>
                  </div>
                  <OrderHistory orders={orders} loading={loading} />

                  {orders.length > 0 && (
                    <div className="mt-8 pt-8 border-t-2 border-walnut-800">
                      <div className="bg-gradient-to-r from-walnut-800 to-walnut-900 rounded-xl p-6 border-2 border-walnut-700">
                        <div className="flex items-start gap-4">
                          <div className="bg-ember-900 p-3 rounded-lg">
                            <Flame className="h-6 w-6 text-ember-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-parchment-50 mb-2 font-display">
                              Looking for something unique?
                            </h3>
                            <p className="text-parchment-300 text-sm mb-4">
                              Explore our collection of handcrafted lamps or commission a custom piece.
                            </p>
                            <button
                              onClick={() => setCurrentPage('products')}
                              className="px-5 py-2.5 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge text-sm"
                            >
                              Browse Collection
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-parchment-50 mb-2 font-display flex items-center gap-2">
                      <Settings className="h-6 w-6 text-ember-400" />
                      Account Settings
                    </h2>
                    <p className="text-parchment-400">
                      View and manage your account information
                    </p>
                  </div>
                  <AccountSettings
                    user={user}
                    isAdmin={isAdmin}
                    onNavigateToAdmin={() => setCurrentPage('admin')}
                  />
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
