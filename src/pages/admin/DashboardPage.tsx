import React, { useState, useEffect } from 'react';
import { Package, FolderTree, Star, Mail, Truck, DollarSign } from 'lucide-react';
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
      title: 'Featured Products',
      value: stats.featuredProducts,
      icon: Star,
      color: 'from-gold-600 to-copper-700',
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

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-patina-600 to-patina-700 rounded-lg">
            <DollarSign className="h-6 w-6 text-parchment-50" />
          </div>
          <h2 className="text-2xl font-bold text-parchment-50 font-display">Sales Revenue</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-walnut-800 rounded-lg">
              <span className="text-parchment-300 font-medium">Product Sales</span>
              <span className="text-2xl font-bold text-parchment-50">
                ${(stats.totalSubtotal ?? 0.00).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-walnut-800 rounded-lg">
              <span className="text-parchment-300 font-medium">Tax Collected</span>
              <span className="text-xl font-semibold text-ember-400">
                ${(stats.totalTax ?? 0.00).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-walnut-800 rounded-lg">
              <span className="text-parchment-300 font-medium">Shipping Revenue</span>
              <span className="text-xl font-semibold text-patina-400">
                ${(stats.totalShipping ?? 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full p-8 bg-gradient-to-br from-walnut-800 to-walnut-700 rounded-lg border-2 border-patina-600">
              <p className="text-sm text-parchment-400 mb-2 text-center">Total Revenue</p>
              <p className="text-4xl font-bold text-patina-400 text-center">
                ${(stats.totalSales ?? 0.00).toFixed(2)}
              </p>
              <div className="mt-4 pt-4 border-t border-walnut-600 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Subtotal:</span>
                  <span className="text-parchment-300">${(stats.totalSubtotal ?? 0.00).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Tax:</span>
                  <span className="text-parchment-300">${(stats.totalTax ?? 0.00).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Shipping:</span>
                  <span className="text-parchment-300">${(stats.totalShipping ?? 0.00).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
