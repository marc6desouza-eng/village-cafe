import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Croissant,
  Coffee,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';

export const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.get('/content/about');
        if (res.data.success) {
          setContent(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching about content:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const story = content?.story || {
    title: 'Our Story in Curtorim',
    subtitle: 'A Passion for Everyday Freshness',
    paragraphs: [
      'Village Cafe was created to bring warm bakery traditions and welcoming café culture together in the scenic village of Curtorim, Goa. Situated in the Carmel View building, we set out to craft a relaxed neighborhood sanctuary where friends, families, and travelers could gather over steaming mugs of artisan coffee, freshly baked savouries, and sweet afternoon treats.',
      'Our team believes that genuine hospitality starts with genuine ingredients. From our traditional oven-crisped puffs and flaky patties to our chilled ice-cream delights, every creation is prepared with attention to quality and honest village warmth.',
    ],
    imageUrl: '/uploads/village_seating.jpg',
  };

  const philosophy = content?.philosophy || {
    title: 'Our Philosophy',
    subtitle: 'Simplicity, Purity, and Warmth',
    text: 'We honor classic baking practices while serving contemporary café beverages. We reject shortcuts, prioritizing freshness, honest recipes, and a cozy environment where you can unwind at your own pace.',
    points: [
      'Locally grounded with authentic village warmth',
      'Daily freshly baked savouries and pastries',
      'Handcrafted coffee, shakes, and tea-time companions',
      'Clean, comfortable air-conditioned seating',
    ],
  };

  const freshness = content?.freshness || {
    title: 'Freshness Every Morning',
    text: 'Our ovens fire up early every day so that when our doors open, our display cases are stocked with hot, golden-brown puffs, aromatic buns, and freshly wrapped cookies. We believe baked goods taste best on the day they are made.',
    imageUrl: '/uploads/village_bakery_shelves.jpg',
  };

  const bakery = content?.bakery || {
    title: 'The Bakery Counter',
    text: 'A feast for the eyes and senses. Our signature glass display counters showcase an enticing selection of egg puffs, veg patties, warm rolls, chocolate pastries, and tea-time sponge cakes.',
    imageUrl: '/uploads/village_shake.jpg',
  };

  const experience = content?.experience || {
    title: 'The Café Experience',
    text: 'Whether you choose a quiet corner with a book, a lively table with friends sharing ice cream sundaes, or simply stop by to pick up your evening tea snacks, Village Cafe is designed to feel like a comfortable extension of home.',
    imageUrl: '/uploads/village_counter.jpg',
  };

  return (
    <div className="pt-24 pb-20">
      
      {/* Hero Banner */}
      <section className="bg-charcoal-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/uploads/village_exterior.jpg"
            alt="Village Cafe Curtorim"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curtorim, Goa</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
            OUR STORY
          </h1>
          <p className="text-base sm:text-lg text-cream-200 max-w-2xl mx-auto leading-relaxed">
            Discover the heart, passion, and daily baking craftsmanship behind Village Cafe.
          </p>
        </div>
      </section>

      {/* 1. Our Story Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-bold tracking-wider text-burgundy-700 uppercase bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block mb-3">
              {story.subtitle || 'Village Tradition'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mb-6 leading-tight">
              {story.title}
            </h2>
            <div className="space-y-4 text-charcoal-700 text-sm sm:text-base leading-relaxed">
              {(story.paragraphs || []).map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-burgundy-700 hover:bg-burgundy-800 text-white shadow-warm transition-all"
              >
                <span>Explore What We Bake</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-warm-xl border border-coffee-200 bg-white">
              <img
                src={story.imageUrl || '/uploads/village_seating.jpg'}
                alt="Village Cafe Interior"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Philosophy & Freshness Grid */}
      <section className="py-20 bg-cream-100/70 border-y border-coffee-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-wider text-burgundy-700 uppercase bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 inline-block">
                Values
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                {philosophy.title}
              </h2>
              <p className="text-charcoal-700 text-sm sm:text-base leading-relaxed">
                {philosophy.text}
              </p>

              <div className="space-y-3 pt-2">
                {(philosophy.points || []).map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-coffee-200">
                    <CheckCircle2 className="w-5 h-5 text-burgundy-700 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-medium text-charcoal-800">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-coffee-200 shadow-warm">
                <div className="w-12 h-12 rounded-2xl bg-burgundy-50 border border-burgundy-200 flex items-center justify-center text-burgundy-700 mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">
                  {freshness.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed mb-6">
                  {freshness.text}
                </p>
                <div className="rounded-2xl overflow-hidden aspect-video border border-coffee-100">
                  <img
                    src={freshness.imageUrl || '/uploads/village_bakery_shelves.jpg'}
                    alt="Freshness in Bakery"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. The Bakery & Cafe Experience Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Bakery Column */}
          <div className="bg-white rounded-3xl overflow-hidden border border-coffee-200 shadow-warm flex flex-col">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={bakery.imageUrl || '/uploads/village_shake.jpg'}
                alt="Bakery Counter"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider mb-2 block">
                  Craftsmanship
                </span>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">
                  {bakery.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  {bakery.text}
                </p>
              </div>
              <div className="pt-6">
                <Link to="/menu" className="text-xs font-bold text-burgundy-700 hover:underline">
                  Browse Bakery Items →
                </Link>
              </div>
            </div>
          </div>

          {/* Cafe Experience Column */}
          <div className="bg-white rounded-3xl overflow-hidden border border-coffee-200 shadow-warm flex flex-col">
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={experience.imageUrl || '/uploads/village_counter.jpg'}
                alt="Cafe Experience"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-burgundy-700 uppercase tracking-wider mb-2 block">
                  Atmosphere
                </span>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-3">
                  {experience.title}
                </h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  {experience.text}
                </p>
              </div>
              <div className="pt-6">
                <Link to="/our-space" className="text-xs font-bold text-burgundy-700 hover:underline">
                  Tour Our Space →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Reservation CTA Bottom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="bg-charcoal-950 text-white rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Experience Village Cafe in Person
          </h2>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mb-8 leading-relaxed">
            Join us for coffee, crispy bakery savouries, and desserts in Curtorim, Goa.
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
              <span>Get Directions</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
