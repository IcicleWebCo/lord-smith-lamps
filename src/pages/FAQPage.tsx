import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const { setCurrentPage } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'About Our Lamps (Safety & Quality)',
      question: 'Are these lamps safe?',
      answer: 'Absolutely. While the lamps are built from vintage items, all electrical components are brand new and meet the highest safety standards. We exclusively use UL-listed wiring, sockets, and plugs to ensure your piece is perfectly safe and reliable.'
    },
    {
      category: 'About Our Lamps (Safety & Quality)',
      question: 'Is the lamp I see in the picture the exact one I will receive?',
      answer: 'Yes. Every piece we create is a one-of-a-kind work of art. The lamp you see photographed is the exact lamp you will be purchasing.'
    },
    {
      category: 'About Our Lamps (Safety & Quality)',
      question: 'Does the lamp come with a bulb?',
      answer: 'Yes, all our lamps ship with a new, vintage-style Edison bulb (or the specific bulb shown in the photos) so your lamp is ready to use right out of the box.'
    },
    {
      category: 'About Our Lamps (Safety & Quality)',
      question: 'How bright are the lamps? Are they for reading or just ambiance?',
      answer: 'It varies by piece! Most of our lamps, especially with the included Edison bulbs, are designed to provide warm, ambient light that creates a mood and serves as a conversation starter. They are typically not intended as primary reading or task lamps, though some larger pieces can be.'
    },
    {
      category: 'About Our Lamps (Safety & Quality)',
      question: 'How do I clean and care for my lamp?',
      answer: 'We recommend dusting gently with a dry microfiber cloth. Avoid all liquid cleaners or harsh chemicals, as they can damage the antique patina which gives the piece its unique character.'
    },
    {
      category: 'Custom Orders',
      question: 'Can you turn my own item into a lamp?',
      answer: "Yes! We love collaborating with customers to turn their family heirlooms or antique finds into functional art. Please visit our 'Custom Work' page and fill out the contact form to tell us about your piece."
    },
    {
      category: 'Custom Orders',
      question: 'What is the process for a custom order?',
      answer: "It starts with a conversation. You'll send us photos of your item, and we'll discuss the best way to adapt it into a lamp. Once we agree on a design, you'll ship us the item, and we'll begin the transformation."
    },
    {
      category: 'Custom Orders',
      question: 'Will my item be altered or damaged?',
      answer: "Our philosophy is to 'preserve, not restore.' We will carefully clean your item to bring out its beauty, but we will not strip away its history or patina. The adaptation process is done with the utmost care, but will involve non-reversible changes (like drilling for wiring) to turn it into a lamp."
    },
    {
      category: 'Custom Orders',
      question: 'How much does a custom lamp cost?',
      answer: "Because every piece is different, the price varies based on the complexity, size of the item, and the components required. Once we've consulted on your piece, we can provide a detailed quote."
    },
    {
      category: 'Shipping & Policies',
      question: 'How do you package the lamps? They seem delicate.',
      answer: 'We professionally package every lamp with extreme care, using custom-fit foam, bubble wrap, and sturdy boxes to ensure it arrives to you safely.'
    },
    {
      category: 'Shipping & Policies',
      question: 'What happens if my lamp arrives damaged?',
      answer: 'In the unlikely event your piece arrives damaged, please contact us immediately (within 48 hours) with photos of the damage and the packaging. We will work with you to find a solution.'
    },
    {
      category: 'Shipping & Policies',
      question: 'Do you offer a warranty or accept returns?',
      answer: 'Due to the one-of-a-kind, antique nature of our art, all sales are final. However, we stand by our craftsmanship. Our new electrical components are highly reliable, but if you have any issues, please contact us.'
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-soot-900 to-soot-950">
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: 'url(/bg.png)' }}
        />

        <div className="relative max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-parchment-50 mb-4 font-display">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-parchment-300 max-w-2xl mx-auto">
              Here are some common questions we get about our craft.
            </p>
          </div>

          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gold-400 mb-6 font-display">
                {category}
              </h2>

              <div className="space-y-4">
                {faqs
                  .map((faq, index) => ({ faq, originalIndex: index }))
                  .filter(({ faq }) => faq.category === category)
                  .map(({ faq, originalIndex }) => (
                    <div
                      key={originalIndex}
                      className="bg-walnut-900/30 backdrop-blur-sm border border-walnut-800 rounded-lg overflow-hidden transition-all duration-300 hover:border-ember-600/50"
                    >
                      <button
                        onClick={() => toggleFAQ(originalIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left group"
                      >
                        <span className="text-lg font-semibold text-parchment-50 pr-4 group-hover:text-ember-300 transition-colors duration-300">
                          {faq.question}
                        </span>
                        {openIndex === originalIndex ? (
                          <ChevronUp className="h-5 w-5 text-gold-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gold-400 flex-shrink-0" />
                        )}
                      </button>

                      {openIndex === originalIndex && (
                        <div className="px-6 pb-5">
                          <div className="pt-2 border-t border-walnut-800/50">
                            <p className="text-parchment-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="mt-16 text-center">
            <div className="bg-walnut-900/30 backdrop-blur-sm border border-walnut-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-parchment-50 mb-4 font-display">
                Still Have Questions?
              </h3>
              <p className="text-parchment-300 mb-6">
                We're here to help. Feel free to reach out to us directly.
              </p>
              <button
                onClick={() => setCurrentPage('contact')}
                className="inline-block bg-gradient-to-r from-ember-600 to-forge-500 text-parchment-50 px-8 py-3 rounded-lg font-semibold hover:from-ember-500 hover:to-forge-400 transition-all duration-300 shadow-lg hover:shadow-ember-600/50"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
