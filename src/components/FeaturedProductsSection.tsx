import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import OptimizedImage from './OptimizedImage';

const FeaturedProductsSection: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('featured', true)
      .gt('quantity', 0)
      .order('created_at', { ascending: false })
      .limit(6);

    if (error) {
      console.error('Error loading featured products:', error);
      setFeaturedProducts([]);
    } else {
      const products: Product[] = (data || []).map((p) => ({
        ...p,
        category_name: p.category?.name || 'Featured',
        price: parseFloat(p.price),
        original_price: p.original_price ? parseFloat(p.original_price) : undefined,
        rating: parseFloat(p.rating),
      }));
      setFeaturedProducts(products);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-soot-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-parchment-300">Loading featured products...</div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <section className="py-20 bg-soot-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-parchment-300">No featured products available</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-soot-950">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
        alt="Background texture"
        className="absolute inset-0 w-full h-full object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-soot-950/95"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-parchment-50 mb-4 font-display">
            Featured Items
          </h2>
          <p className="text-xl text-parchment-300">
            Discover our favorite pieces
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentPage('products')}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-ember-600 to-ember-500 text-parchment-50 font-semibold rounded-lg hover:from-ember-700 hover:to-ember-600 transition-all duration-300 shadow-ember"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
