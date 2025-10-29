import React, { useState, useEffect } from 'react';
import { Package, FolderTree, Star, Mail, Truck } from 'lucide-react';
import { getProducts, getCategories, getSubscriptionCount, getOrders } from '../../lib/admin';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    activeSubscriptions: 0,
    unshippedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const [products, categories, subscriptionCount, orders] = await Promise.all([
      getProducts(),
      getCategories(),
      getSubscriptionCount(),
      getOrders()
    ]);

    setStats({
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      totalCategories: categories.length,
      activeSubscriptions: subscriptionCount,
      unshippedOrders: orders.filter(o => !o.shipped).length,
    });
    setLoading(false);
  };

  const statCards = [
    {
      title: 'Unshipped Orders',
      value: stats.unshippedOrders,
      icon: Truck,
      color: 'from-ember-600 to-forge-700',
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Mail,
      color: 'from-patina-600 to-patina-700',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-forge-600 to-ember-700',
    },
    {
      title: 'Featured Products',
      value: stats.featuredProducts,
      icon: Star,
      color: 'from-gold-600 to-copper-700',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'from-timber-600 to-walnut-700',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-parchment-300">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-parchment-50 font-display">Dashboard</h1>
        <p className="text-parchment-300 mt-2">Overview of your store</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="p-6 bg-walnut-900 border border-walnut-800 rounded-lg hover:border-walnut-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${card.color} rounded-lg`}>
                  <Icon className="h-6 w-6 text-parchment-50" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-parchment-400 mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-parchment-50">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
