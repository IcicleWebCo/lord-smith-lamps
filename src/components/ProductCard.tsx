import React, { useState, useEffect } from 'react';
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  seq: number;
  alt_text: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, favorites, toggleFavorite } = useApp();
  const [images, setImages] = useState<ProductImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const isFavorited = favorites.includes(product.id);

  useEffect(() => {
    loadImages();
  }, [product.id]);

  const loadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', product.id)
      .order('seq');

    if (error) {
      console.error('Error loading product images:', error);
      setImages([]);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images.length > 0 ? images[currentImageIndex].image_url : product.image_url;
  const hasMultipleImages = images.length > 1;
  const isOutOfStock = product.quantity === 0;

  return (
    <div className="bg-walnut-900 rounded-xl overflow-hidden shadow-craft hover:shadow-forge transition-all duration-300 group">
      <div className="relative">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-soot-900/80 text-parchment-50 rounded-full hover:bg-soot-900 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-soot-900/80 text-parchment-50 rounded-full hover:bg-soot-900 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-6 bg-ember-400'
                      : 'w-2 bg-parchment-300/50 hover:bg-parchment-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-soot-950/80 flex items-center justify-center">
            <span className="text-parchment-300 font-semibold bg-soot-900 px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}
        {product.original_price && product.on_sale && (
          <div className="absolute top-4 left-4 bg-forge-600 text-parchment-50 px-3 py-1 rounded-full text-sm font-semibold">
            Sale
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-ember-400 text-sm font-medium">{product.category_name || 'Uncategorized'}</span>
        </div>

        <h3 className="text-xl font-bold text-parchment-50 mb-2 group-hover:text-ember-300 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-parchment-300 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-ember-400">
              ${product.price.toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-parchment-400 line-through">
                ${product.original_price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <span className="text-parchment-400 text-sm">
            {isOutOfStock ? (
              <span className="text-forge-400">Out of stock</span>
            ) : product.quantity <= 5 ? (
              <span className="text-ember-400">Only {product.quantity} left!</span>
            ) : (
              <span>{product.quantity} available</span>
            )}
          </span>
        </div>

        <button
          onClick={() => !isOutOfStock && addToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            !isOutOfStock
              ? 'bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 hover:from-forge-700 hover:to-forge-600 shadow-forge'
              : 'bg-iron-700 text-iron-400 cursor-not-allowed'
          }`}
        >
          {!isOutOfStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;