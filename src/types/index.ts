export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  shipping_price: number;
  description: string;
  image_url: string;
  category_id: string;
  category_name?: string;
  rating: number;
  reviews: number;
  in_stock: boolean;
  quantity: number;
  featured?: boolean;
  on_sale?: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at?: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  special_instructions?: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AppContextType {
  user: User | null;
  cart: CartItem[];
  favorites: string[];
  currentPage: string;
  isMenuOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  redirectAfterAuth: string | null;
  setUser: (user: User | null) => void;
  setCart: (cart: CartItem[]) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleFavorite: (productId: string) => void;
  setCurrentPage: (page: string) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setRedirectAfterAuth: (page: string | null) => void;
  getSubtotal: () => number;
  getShippingTotal: () => number;
  getTaxAmount: () => number;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}