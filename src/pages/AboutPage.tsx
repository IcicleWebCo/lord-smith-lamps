import React from 'react';
import { 
  Flame,
  Hammer,
  TreePine,
  Award,
  Shield,
  Truck
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soot-950 to-walnut-950">
      {/* Hero Section 
      <section className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/bg-workshop.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-soot-950/90 to-walnut-950/80"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-parchment-50 mb-6 font-display">
              Our Story
            </h1>
          </div>
        </div>
      </section> */}

      {/* Story Section */}
      <section className="relative py-20 bg-walnut-900 overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center opacity-5"
            style={{ backgroundImage: 'url(/bg.png)' }}
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Flame className="h-8 w-8 text-forge-500 mr-3" />
                <span className="text-ember-400 font-medium tracking-wide">EST. 2021</span>
              </div>
              
              <h2 className="text-4xl font-bold text-parchment-50 mb-6 font-display">
                Illuminating a Forgotten Past
              </h2>
              
              <div className="space-y-4 text-parchment-300 leading-relaxed">
                <p>
                  Every object holds a story, a whisper of a life once lived. At Lord Smith, we believe some stories deserve to shine a little brighter. Our journey began not in a workshop, but in a lifetime of memories, tucked away in boxes: a collection of vintage cameras that had faithfully documented adventures since the 1970s.
                </p>
                <p>
                  After carrying these cherished companions for over five decades, our founder, Lord Smith, felt a different calling for them. What started as a creative spark – transforming these iconic cameras into unique lamps as heartfelt Christmas gifts – quickly ignited into something much larger.
                </p>
                <p>
                  The true turning point came on a seemingly ordinary New Year's Day. A casual conversation at Inta Vintage in Sumner led to an unexpected offer: "You should sell these!" Lord Smith laughed it off, but the shop owner's persistence was a testament to the lamps' undeniable charm. After weeks of calls, a space was set up on March 15, 2021, and the rest, as they say, is history in the making.
                </p>
                <p>
Over 500 lamps later, the original vision remains: to discover beautiful, discarded objects that have outlived their original purpose and infuse them with new light and life. From antique cameras to forgotten industrial pieces, each Lord Smith lamp is a handcrafted statement, a unique conversation starter that beautifully bridges the past and the present.
                </p>
                <p>
                  Join us in celebrating the beauty of reimagined history.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <img
                src="/bg-store.jpg"
                alt="Master craftsman at work"
                className="rounded-xl shadow-craft"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-forge-600 to-ember-700 p-4 rounded-xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <Award className="h-8 w-8 text-parchment-50 relative z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-soot-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-parchment-50 mb-4 font-display">
              Our Commitment
            </h2>
            <p className="text-xl text-parchment-300 max-w-3xl mx-auto">
              Every piece we create is a testament to our unwavering commitment to quality, 
              sustainability, and craftsmanship
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="relative bg-gradient-to-br from-timber-600 to-walnut-700 p-6 rounded-xl mb-6 mx-auto w-20 h-20 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <TreePine className="h-10 w-10 text-parchment-50 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-parchment-50 mb-3">Sustainable</h3>
              <p className="text-parchment-300">
                Products are crafted exclusively from recycled, reclaimed, and repurposed materials
              </p>
            </div>

            <div className="text-center">
              <div className="relative bg-gradient-to-br from-forge-600 to-ember-700 p-6 rounded-xl mb-6 mx-auto w-20 h-20 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <Hammer className="h-10 w-10 text-parchment-50 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-parchment-50 mb-3">Handcrafted</h3>
              <p className="text-parchment-300">
                Every piece is individually crafted by a skilled artisan
              </p>
            </div>

            <div className="text-center">
              <div className="relative bg-gradient-to-br from-gold-600 to-copper-700 p-6 rounded-xl mb-6 mx-auto w-20 h-20 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <Shield className="h-10 w-10 text-parchment-50 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-parchment-50 mb-3">Guaranteed</h3>
              <p className="text-parchment-300">
                Lifetime craftsmanship guarantee on all our work
              </p>
            </div>

            <div className="text-center">
              <div className="relative bg-gradient-to-br from-iron-600 to-anvil-700 p-6 rounded-xl mb-6 mx-auto w-20 h-20 flex items-center justify-center overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: 'url(/bg.png)' }}
                />
                <Truck className="h-10 w-10 text-parchment-50 relative z-10" />
              </div>
              <h3 className="text-xl font-bold text-parchment-50 mb-3">Delivered</h3>
              <p className="text-parchment-300">
                Secure packaging and reliable shipping
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;