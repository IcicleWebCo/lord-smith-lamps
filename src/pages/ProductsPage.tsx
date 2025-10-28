import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const { searchQuery, selectedCategory, setSelectedCategory } = useApp();
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts = (data || []).map(product => ({
        ...product,
        category_name: product.category?.name || 'Uncategorized',
        price: parseFloat(product.price),
        original_price: product.original_price ? parseFloat(product.original_price) : undefined,
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category_name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const categoryOptions = ['All', ...categories.map(cat => cat.name)];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-ember-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-parchment-50 mb-4 font-display">
            Our Collection
          </h1>
          <p className="text-xl text-parchment-300">
            Discover authentic handcrafted pieces
          </p>
        </div>

        <div className="bg-walnut-900 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-forge-600 text-parchment-50'
                      : 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-parchment-300 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-walnut-800 text-parchment-100 border border-walnut-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ember-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-parchment-300">
            Showing {filteredProducts.length} of {products.length} products
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-walnut-900 rounded-xl p-8 max-w-md mx-auto">
              <Search className="h-16 w-16 text-parchment-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-parchment-50 mb-2">No products found</h3>
              <p className="text-parchment-300">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
