import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const OurSpacePage = () => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOurSpace = async () => {
      try {
        const res = await api.get('/content/our-space');
        if (res.data.success) {
          setContent(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching our space content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOurSpace();
  }, []);

  const sections = content?.sections || [
    {
      id: 'exterior',
      title: 'Building & Exterior',
      tag: 'Welcome to Carmel View',
      description:
        'Located at Carmel View along the Curtorim main road with convenient parking, clear modern signage, and a glass-fronted entrance welcoming you into our air-conditioned haven.',
      image: '/uploads/village_exterior.jpg',
    },
    {
      id: 'interior',
      title: 'Comfortable Dining & Seating',
      tag: 'Relax & Unwind',
      description:
        'Thoughtfully arranged with plush cushioned dining chairs, warm yellow and green bistro tables, contemporary vertical wood accents, and soothing ambient lighting.',
      image: '/uploads/village_seating.jpg',
    },
    {
      id: 'bakery-counter',
      title: 'Bakery & Dessert Showcase',
      tag: 'Fresh From The Oven',
      description:
        'Our refrigerated display counter and display cases feature daily savoury rolls, hot dogs, pastries, chilled desserts, and our partner Amul ice cream parlour parlour scoops.',
      image: '/uploads/village_counter.jpg',
    },
    {
      id: 'bakery-shelves',
      title: 'Artisan Bakery Shelves',
      tag: 'Take Freshness Home',
      description:
        'Neatly organized display shelves filled with packaged tea-time treats, crunchy rusks, butter cookies, packaged cakes, and bakery specialties perfect for gifts and home enjoyment.',
      image: '/uploads/village_bakery_shelves.jpg',
    },
    {
      id: 'beverage-corner',
      title: 'Pastry & Savoury Counter',
      tag: 'Signature Sips & Bites',
      description:
        'Flaky golden egg puffs, spiced veggie patties, rolls, and beverages freshly served in front of you.',
      image: '/uploads/village_shake.jpg',
    },
  ];

  return (
    <div className="pt-24 pb-20">
      
      {/* Banner */}
      <section className="bg-charcoal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curtorim Sanctuary</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            {content?.title || 'Our Space'}
          </h1>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            {content?.subtitle || 'Take an architectural and visual tour through Village Cafe Curtorim.'}
          </p>
        </div>
      </section>

      {/* Intro Narrative */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed font-serif italic">
          "{content?.intro ||
            'Step inside our welcoming space at Carmel View. Whether you are grabbing a quick takeaway treat from our bakery counter or relaxing over milkshakes with friends, we have created an inviting environment for everyone.'}"
        </p>
      </section>

      {/* Alternating Image-Text Architectural Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 mt-6">
        {sections.map((sec, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={sec.id || idx}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Frame */}
              <div className={`lg:col-span-7 ${!isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="group relative rounded-3xl overflow-hidden shadow-warm-xl border border-coffee-200 bg-white aspect-[4/3]">
                  <img
                    src={sec.image}
                    alt={sec.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/uploads/village_counter.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-charcoal-950/75 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    0{idx + 1}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className={`lg:col-span-5 space-y-4 ${!isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
                  {sec.tag}
                </span>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 leading-tight">
                  {sec.title}
                </h2>

                <p className="text-charcoal-700 text-sm sm:text-base leading-relaxed">
                  {sec.description}
                </p>

                <div className="pt-2">
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-700 hover:text-burgundy-800 transition-colors"
                  >
                    <span>View in Photo Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Bottom Visit & Reserve Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-charcoal-950 text-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-cafeYellow-400 mb-2">
            Carmel View • Curtorim, Goa
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            We Would Love To Welcome You
          </h2>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
            Drop in for a quick afternoon treat, or reserve a table for your family and friends.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-warm transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve a Table</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
            >
              <MapPin className="w-4 h-4 text-cafeYellow-400" />
              <span>Location & Hours</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
