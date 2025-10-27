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
}

export interface AppContextType {
  user: User | null;
  cart: CartItem[];
  favorites: string[];
  currentPage: string;
  isMenuOpen: boolean;
  searchQuery: string;
  selectedCategory: string;
  setUser: (user: User | null) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleFavorite: (productId: string) => void;
  setCurrentPage: (page: string) => void;
  setIsMenuOpen: (isOpen: boolean) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}