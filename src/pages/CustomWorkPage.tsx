import React from 'react';
import { Lightbulb, MessageCircle, Sparkles, Wrench, Star, ArrowRight, Flame, Heart, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OptimizedImage from '../components/OptimizedImage';

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
    <div className="min-h-screen bg-gradient-to-br from-soot-950 via-walnut-950 to-soot-950 relative overflow-hidden">
      <OptimizedImage
        src="https://qknudtdodpkwamafbnnz.supabase.co/storage/v1/object/public/site/bg.png"
        alt="Background texture"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        priority={false}
      />

      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-forge-950/20 to-transparent pointer-events-none"></div>

      <div className="relative z-10">
        <section className="py-20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-6">
                <div className="relative bg-gradient-to-br from-forge-500 to-ember-600 p-4 rounded-xl shadow-forge overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-forge-400/20 to-ember-500/20 animate-pulse"></div>
                  <Flame className="h-10 w-10 text-parchment-50 relative z-10" />
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-ember-500"></div>
                <p className="text-ember-400 font-semibold text-sm tracking-wide uppercase">Custom Creations</p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-ember-500"></div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-parchment-50 mb-6 font-display">
                Repurposed. Reimagined. Re-illuminated.
              </h1>

              <p className="text-xl text-parchment-300 max-w-3xl mx-auto leading-relaxed mb-4">
                Transform your cherished treasures into bespoke, illuminated works of art
              </p>

              <div className="flex items-center justify-center gap-6 mt-8">
                <div className="flex items-center gap-2 text-parchment-400">
                  <Heart className="h-5 w-5 text-ember-400" />
                  <span className="text-sm">Preserving History</span>
                </div>
                <div className="h-4 w-px bg-walnut-700"></div>
                <div className="flex items-center gap-2 text-parchment-400">
                  <Sparkles className="h-5 w-5 text-ember-400" />
                  <span className="text-sm">100% Unique</span>
                </div>
                <div className="h-4 w-px bg-walnut-700"></div>
                <div className="flex items-center gap-2 text-parchment-400">
                  <CheckCircle className="h-5 w-5 text-ember-400" />
                  <span className="text-sm">Expert Craftsmanship</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-parchment-50 mb-4 font-display">
                The Journey from Treasure to Lamp
              </h2>
              <p className="text-lg text-parchment-300 max-w-2xl mx-auto leading-relaxed">
                Every piece tells a story. Let us help you illuminate yours through our meticulous five-step process.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-gold-500 via-timber-500 to-mahogany-600 hidden lg:block opacity-50" />

              <div className="space-y-12">
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
                        <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 hover:border-forge-600 transition-all duration-300 p-8 shadow-craft group">
                          <div className={`flex items-center gap-4 mb-4 ${isEven ? 'lg:flex-row-reverse' : ''} flex-row justify-center lg:justify-start`}>
                            <div className={`p-3 bg-gradient-to-br ${step.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="h-6 w-6 text-parchment-50" />
                            </div>
                            <h3 className="text-2xl font-bold text-parchment-50 font-display">
                              {step.title}
                            </h3>
                          </div>
                          <p className={`text-parchment-300 leading-relaxed ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center`}>
                            {step.description}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-forge-600 to-ember-700 border-4 border-walnut-800 flex items-center justify-center shadow-forge">
                          <span className="text-2xl font-bold text-parchment-50 font-display">
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

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-walnut-900 rounded-xl border-2 border-walnut-800 overflow-hidden shadow-craft">
              <div className="bg-gradient-to-br from-forge-900 to-walnut-900 p-8 border-b-2 border-walnut-800">
                <div className="text-center">
                  <div className="inline-block bg-ember-900 p-3 rounded-lg mb-4">
                    <Sparkles className="h-8 w-8 text-ember-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-parchment-50 mb-3 font-display">
                    What Makes Our Custom Work Special?
                  </h3>
                  <p className="text-parchment-300 max-w-2xl mx-auto">
                    Every custom lamp is a collaboration between your story and our craftsmanship
                  </p>
                </div>
              </div>

              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-walnut-800 rounded-xl p-6 border-2 border-walnut-700 hover:border-forge-600 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-copper-700 flex items-center justify-center shadow-lg">
                          <Star className="h-6 w-6 text-parchment-50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-parchment-50 mb-2 text-lg font-display">100% Unique</h4>
                        <p className="text-parchment-300 text-sm leading-relaxed">
                          Every piece is one-of-a-kind, tailored to your vision and story
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-walnut-800 rounded-xl p-6 border-2 border-walnut-700 hover:border-forge-600 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-patina-600 to-patina-700 flex items-center justify-center shadow-lg">
                          <Sparkles className="h-6 w-6 text-parchment-50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-parchment-50 mb-2 text-lg font-display">Character Preserved</h4>
                        <p className="text-parchment-300 text-sm leading-relaxed">
                          We honor the item's history, preserving its unique patina and character
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-walnut-800 rounded-xl p-6 border-2 border-walnut-700 hover:border-forge-600 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forge-600 to-ember-700 flex items-center justify-center shadow-lg">
                          <Wrench className="h-6 w-6 text-parchment-50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-parchment-50 mb-2 text-lg font-display">Expert Craftsmanship</h4>
                        <p className="text-parchment-300 text-sm leading-relaxed">
                          High-quality components and meticulous attention to detail
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-walnut-800 rounded-xl p-6 border-2 border-walnut-700 hover:border-forge-600 transition-all duration-300">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-timber-600 to-walnut-700 flex items-center justify-center shadow-lg">
                          <MessageCircle className="h-6 w-6 text-parchment-50" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-parchment-50 mb-2 text-lg font-display">Collaborative Process</h4>
                        <p className="text-parchment-300 text-sm leading-relaxed">
                          We work closely with you to bring your vision to life
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-br from-forge-900 via-ember-900 to-forge-950 rounded-xl border-2 border-forge-700 p-12 shadow-forge relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-ember-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-forge-500/10 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <div className="inline-block bg-ember-800 p-4 rounded-xl mb-6">
                  <Lightbulb className="h-12 w-12 text-ember-400" />
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-parchment-50 mb-6 font-display">
                  Ready to Illuminate Your Story?
                </h2>

                <p className="text-xl text-parchment-200 mb-8 leading-relaxed max-w-2xl mx-auto">
                  Let's collaborate to transform your cherished treasure into a one-of-a-kind masterpiece.
                  Every custom lamp is a unique blend of your history and our craftsmanship.
                </p>

                <button
                  onClick={() => setCurrentPage('contact')}
                  className="inline-flex items-center px-10 py-5 bg-parchment-50 text-forge-900 text-lg font-bold rounded-lg hover:bg-parchment-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Start Your Custom Project
                  <ArrowRight className="ml-3 h-6 w-6" />
                </button>

                <p className="mt-6 text-parchment-300 text-sm">
                  Contact us today to begin the journey from treasure to illuminated art
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomWorkPage;
