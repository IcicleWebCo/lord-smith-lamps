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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

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
      // First sort by stock status (in stock first)
      if (a.in_stock && !b.in_stock) return -1;
      if (!a.in_stock && b.in_stock) return 1;

      // Then sort by selected criteria
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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
            Showing {filteredProducts.length === 0 ? 0 : indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((product) => (
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

        {filteredProducts.length > itemsPerPage && (
          <div className="mt-12 flex items-center justify-between">
            <div className="text-parchment-300 text-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-walnut-800 text-parchment-300 rounded-lg hover:bg-walnut-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-forge-600 text-parchment-50'
                          : 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-walnut-800 text-parchment-300 rounded-lg hover:bg-walnut-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
