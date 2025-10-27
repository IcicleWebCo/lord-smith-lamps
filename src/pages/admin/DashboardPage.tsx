import React, { useState, useEffect } from 'react';
import { Package, FolderTree, Star, Mail } from 'lucide-react';
import { getProducts, getCategories, getSubscriptionCount } from '../../lib/admin';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const [products, categories, subscriptionCount] = await Promise.all([
      getProducts(),
      getCategories(),
      getSubscriptionCount()
    ]);

    setStats({
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      totalCategories: categories.length,
      activeSubscriptions: subscriptionCount,
    });
    setLoading(false);
  };

  const statCards = [
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
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: Mail,
      color: 'from-patina-600 to-patina-700',
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

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-parchment-50 mb-4">Quick Actions</h2>
        <p className="text-parchment-300 mb-4">
          Use the navigation menu on the left to manage your products and categories.
        </p>
        <div className="flex gap-3">
          <div className="flex-1 p-4 bg-walnut-800 rounded-lg border border-walnut-700">
            <Package className="h-8 w-8 text-forge-400 mb-2" />
            <h3 className="text-lg font-semibold text-parchment-50 mb-1">Products</h3>
            <p className="text-sm text-parchment-400">
              Add, edit, or remove products from your catalog
            </p>
          </div>
          <div className="flex-1 p-4 bg-walnut-800 rounded-lg border border-walnut-700">
            <FolderTree className="h-8 w-8 text-timber-400 mb-2" />
            <h3 className="text-lg font-semibold text-parchment-50 mb-1">Categories</h3>
            <p className="text-sm text-parchment-400">
              Organize products into categories
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
