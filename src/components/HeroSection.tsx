import React from 'react';
import { ArrowRight, Hammer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OptimizedImage from './OptimizedImage';

const HeroSection: React.FC = () => {
  const { setCurrentPage } = useApp();

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg-workshop.png"
        alt="Workshop background"
        className="absolute inset-0 w-full h-full object-cover"
        priority={true}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-soot-950/60"></div>
      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <Hammer className="h-8 w-8 text-forge-500 mr-3 animate-flicker" />
              <span className="text-ember-400 font-medium tracking-wide">HANDCRAFTED UPCYCLED LAMPS</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-parchment-50 mb-6 font-display leading-tight">
              Illuminate
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forge-400 to-ember-500 block">
                The Past
              </span>
            </h1>

            <p className="text-xl text-parchment-200 mb-8 leading-relaxed max-w-2xl">
              Discover one-of-a-kind lamps, handcrafted from vintage cameras, classic hardware, and other forgotten treasures.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('products')}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 font-semibold rounded-lg hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge hover:shadow-lg group"
              >
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <button
                onClick={() => setCurrentPage('about')}
                className="inline-flex items-center px-8 py-4 border-2 border-ember-500 text-ember-400 font-semibold rounded-lg hover:bg-ember-500 hover:text-parchment-50 transition-all duration-300"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
