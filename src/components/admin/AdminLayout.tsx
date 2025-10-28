import React from 'react';
import { LayoutDashboard, Package, FolderTree, LogOut, Mail, ShoppingCart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: 'dashboard' | 'products' | 'categories' | 'subscriptions' | 'orders';
  onNavigate: (section: 'dashboard' | 'products' | 'categories' | 'subscriptions' | 'orders') => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentSection, onNavigate }) => {
  const { setUser, setCurrentPage } = useApp();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('home');
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as const, label: 'Products', icon: Package },
    { id: 'categories' as const, label: 'Categories', icon: FolderTree },
    { id: 'orders' as const, label: 'Orders', icon: ShoppingCart },
    { id: 'subscriptions' as const, label: 'Subscriptions', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-walnut-950 flex">
      <aside className="w-64 bg-walnut-900 border-r border-walnut-800">
        <div className="p-6 border-b border-walnut-800">
          <h1 className="text-2xl font-bold text-parchment-50 font-display">Admin Panel</h1>
          <p className="text-sm text-parchment-400 mt-1">Manage your store</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-forge-600 text-parchment-50 shadow-forge'
                    : 'text-parchment-300 hover:bg-walnut-800 hover:text-parchment-50'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-walnut-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-parchment-300 hover:bg-walnut-800 hover:text-parchment-50 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
