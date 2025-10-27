import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useApp } from '../context/AppContext';
import AdminLayout from '../components/admin/AdminLayout';
import DashboardPage from './admin/DashboardPage';
import ProductsPage from './admin/ProductsPage';
import CategoriesPage from './admin/CategoriesPage';
import SubscriptionsPage from './admin/SubscriptionsPage';

const AdminPage: React.FC = () => {
  const { isAdmin, loading } = useAdmin();
  const { user, setCurrentPage } = useApp();
  const [currentSection, setCurrentSection] = useState<'dashboard' | 'products' | 'categories' | 'subscriptions'>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-walnut-950 flex items-center justify-center">
        <div className="text-parchment-300 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-walnut-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-parchment-50 mb-4">Access Denied</h1>
          <p className="text-parchment-300 mb-6">You must be logged in to access the admin panel.</p>
          <button
            onClick={() => setCurrentPage('auth')}
            className="px-6 py-3 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-walnut-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-parchment-50 mb-4">Access Denied</h1>
          <p className="text-parchment-300 mb-6">You do not have permission to access the admin panel.</p>
          <button
            onClick={() => setCurrentPage('home')}
            className="px-6 py-3 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentSection={currentSection} onNavigate={setCurrentSection}>
      {currentSection === 'dashboard' && <DashboardPage />}
      {currentSection === 'products' && <ProductsPage />}
      {currentSection === 'categories' && <CategoriesPage />}
      {currentSection === 'subscriptions' && <SubscriptionsPage />}
    </AdminLayout>
  );
};

export default AdminPage;
