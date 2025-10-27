import React from 'react';
import { Lightbulb, MessageCircle, Sparkles, Wrench, Star, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CustomWorkPage: React.FC = () => {
  const { setCurrentPage } = useApp();

  const steps = [
    {
      number: 1,
      title: 'Your Treasure',
      description: 'The process begins with the customer\'s own item—a cherished heirloom, an antique find, or a meaningful object.',
      icon: Star,
      color: 'from-gold-600 to-copper-700',
    },
    {
      number: 2,
      title: 'The Consultation',
      description: 'The customer provides the piece, and we provide the vision. We\'ll collaborate to design the perfect way to transform the item into a stunning, functional lamp.',
      icon: MessageCircle,
      color: 'from-timber-600 to-walnut-700',
    },
    {
      number: 3,
      title: 'Careful Preservation',
      description: 'We honor the item\'s journey. This step involves a careful and respectful cleaning to reveal its hidden beauty. Emphasize that this is not a restoration—we preserve the unique character and patina.',
      icon: Sparkles,
      color: 'from-patina-600 to-patina-700',
    },
    {
      number: 4,
      title: 'The Transformation',
      description: 'This is where the magic happens. We artfully integrate high-quality lighting components, turning a personal memory into a masterpiece.',
      icon: Wrench,
      color: 'from-forge-600 to-ember-700',
    },
    {
      number: 5,
      title: 'Your Story, Illuminated',
      description: 'The final result is a one-of-a-kind, bespoke piece of art—a collaboration between your history and our craft, 100% unique to you.',
      icon: Lightbulb,
      color: 'from-mahogany-600 to-mahogany-700',
    },
  ];

  return (
    <div className="min-h-screen bg-parchment-50">

      <section className="relative py-20 bg-gradient-to-br from-walnut-900 via-soot-900 to-walnut-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-workshop.png')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-walnut-900/50 to-walnut-950" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-parchment-50 mb-6 font-display">
            Custom Work
          </h1>
          <p className="text-xl md:text-2xl text-parchment-200 max-w-3xl mx-auto leading-relaxed">
            Repurposed. Reimagined. Re-illuminated.
          </p>
          <p className="text-xl md:text-2xl text-parchment-200 max-w-3xl mx-auto leading-relaxed">
            Transform your cherished treasures into bespoke, illuminated works of art
          </p>
        </div>
      </section>

      <section className="py-20 bg-parchment-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-walnut-900 mb-4 font-display">
              The Journey from Treasure to Lamp
            </h2>
            <p className="text-lg text-soot-700 max-w-2xl mx-auto">
              Every piece tells a story. Let us help you illuminate yours through our meticulous five-step process.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold-400 via-timber-500 to-mahogany-600 hidden lg:block" />

            <div className="space-y-16">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={step.number}
                    className={`relative flex items-center ${
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    } flex-col gap-8`}
                  >
                    <div className={`flex-1 ${isEven ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                      <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-walnut-200 hover:border-walnut-400 transition-all duration-300 hover:shadow-xl">
                        <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                          <div className={`p-3 bg-gradient-to-br ${step.color} rounded-lg`}>
                            <Icon className="h-6 w-6 text-parchment-50" />
                          </div>
                          <h3 className="text-2xl font-bold text-walnut-900 font-display">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-soot-700 leading-relaxed text-center lg:text-left">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-parchment-50 to-parchment-100 border-4 border-walnut-600 flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-walnut-900 font-display">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 hidden lg:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-walnut-900 via-soot-900 to-walnut-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/bg-workshop.png')] bg-cover bg-center opacity-5" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Lightbulb className="h-16 w-16 text-gold-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold text-parchment-50 mb-6 font-display">
              Ready to Illuminate Your Story?
            </h2>
            <p className="text-xl text-parchment-200 mb-8 leading-relaxed max-w-2xl mx-auto">
              Let's collaborate to transform your cherished treasure into a one-of-a-kind masterpiece.
              Every custom lamp is a unique blend of your history and our craftsmanship.
            </p>
          </div>

          <button
            onClick={() => setCurrentPage('contact')}
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-ember-600 to-ember-500 text-parchment-50 text-lg font-bold rounded-lg hover:from-ember-700 hover:to-ember-600 transition-all duration-300 shadow-ember hover:shadow-2xl hover:scale-105 transform"
          >
            Start Your Custom Project
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>

          <p className="mt-6 text-parchment-300 text-sm">
            Contact us today to begin the journey from treasure to illuminated art
          </p>
        </div>
      </section>

      <section className="py-16 bg-parchment-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-walnut-200">
            <h3 className="text-2xl font-bold text-walnut-900 mb-4 font-display text-center">
              What Makes Our Custom Work Special?
            </h3>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-copper-700 flex items-center justify-center">
                    <Star className="h-6 w-6 text-parchment-50" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-walnut-900 mb-1">100% Unique</h4>
                  <p className="text-soot-700 text-sm">Every piece is one-of-a-kind, tailored to your vision and story</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-patina-600 to-patina-700 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-parchment-50" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-walnut-900 mb-1">Character Preserved</h4>
                  <p className="text-soot-700 text-sm">We honor the item's history, preserving its unique patina and character</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forge-600 to-ember-700 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-parchment-50" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-walnut-900 mb-1">Expert Craftsmanship</h4>
                  <p className="text-soot-700 text-sm">High-quality components and meticulous attention to detail</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-timber-600 to-walnut-700 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-parchment-50" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-walnut-900 mb-1">Collaborative Process</h4>
                  <p className="text-soot-700 text-sm">We work closely with you to bring your vision to life</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomWorkPage;
