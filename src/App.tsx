import React, { useState, useEffect } from 'react';
import { AppContext } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import { User, Product, CartItem, AppContextType } from './types';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import CustomWorkPage from './pages/CustomWorkPage';
import FAQPage from './pages/FAQPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

// Main App Component
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null);

  // Check for existing auth session on app load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
          created_at: session.user.created_at,
        });
      }
    };

    getSession();

    const params = new URLSearchParams(window.location.search);
    if (params.get('session_id')) {
      setCurrentPage('success');
    } else if (params.get('canceled')) {
      setCurrentPage('cancel');
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
            created_at: session.user.created_at,
          });
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Scroll to top when page changes
  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        const newQuantity = existingItem.cartQuantity + 1;
        if (newQuantity > product.quantity) {
          return prev;
        }
        return prev.map(item =>
          item.id === product.id
            ? { ...item, cartQuantity: newQuantity }
            : item
        );
      }
      if (product.quantity < 1) {
        return prev;
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, cartQuantity: number) => {
    if (cartQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const maxQuantity = item.quantity;
          const safeQuantity = Math.min(cartQuantity, maxQuantity);
          return { ...item, cartQuantity: safeQuantity };
        }
        return item;
      })
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.cartQuantity, 0);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const contextValue: AppContextType = {
    user,
    cart,
    favorites,
    currentPage,
    isMenuOpen,
    searchQuery,
    selectedCategory,
    redirectAfterAuth,
    setUser,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleFavorite,
    setCurrentPage: handlePageChange,
    setIsMenuOpen,
    setSearchQuery,
    setSelectedCategory,
    setRedirectAfterAuth,
    getTotalPrice,
    getTotalItems,
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'cart':
        return <CartPage />;
      case 'auth':
        return <AuthPage />;
      case 'profile':
        return <ProfilePage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'custom-work':
        return <CustomWorkPage />;
      case 'faq':
        return <FAQPage />;
      case 'success':
        return <SuccessPage />;
      case 'cancel':
        return <CancelPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <AdminProvider>
        <div className="min-h-screen bg-soot-950">
          {currentPage !== 'admin' && <Header />}
          <main>
            {renderCurrentPage()}
          </main>
          {currentPage !== 'admin' && <Footer />}
        </div>
      </AdminProvider>
    </AppContext.Provider>
  );
};

export default App;