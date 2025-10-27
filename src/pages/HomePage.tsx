import React from 'react';
import NewsletterSection from '../components/NewsletterSection';
import FeaturedProductsSection from '../components/FeaturedProductsSection';
import HeroSection from '../components/HeroSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-walnut-950 to-soot-950">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <FeaturedProductsSection />

      {/* Newsletter Section with Features */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;