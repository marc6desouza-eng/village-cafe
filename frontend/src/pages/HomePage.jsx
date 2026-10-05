import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  Calendar,
  Utensils,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Compass,
  CheckCircle,
  Coffee,
  Croissant,
  IceCream,
  Cake,
} from 'lucide-react';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { MenuItemCard } from '../components/menu/MenuItemCard';
import { OpenStatusBadge } from '../components/common/OpenStatusBadge';

export const HomePage = () => {
  const { contact, hours } = useSettings();
  const [content, setContent] = useState(null);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [signatureItems, setSignatureItems] = useState([]);
  const [galleryPreview, setGalleryPreview] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        const [contentRes, menuRes, galleryRes, catRes] = await Promise.all([
          api.get('/content/homepage'),
          api.get('/menu'),
          api.get('/gallery'),
          api.get('/categories'),
        ]);

        if (contentRes.data.success) {
          setContent(contentRes.data.data);
        }

        if (menuRes.data.success) {
          const allItems = menuRes.data.data || [];
          setFeaturedItems(allItems.filter((item) => item.isFeatured).slice(0, 4));
          setSignatureItems(allItems.filter((item) => item.isSignature).slice(0, 3));
        }

        if (galleryRes.data.success) {
          const allImages = galleryRes.data.data || [];
          setGalleryPreview(allImages.filter((img) => img.isFeatured).slice(0, 6));
        }

        if (catRes.data.success) {
          setCategories(catRes.data.data || []);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const hero = content?.hero || {
    title: 'Freshly Baked. Simply Delicious.',
    subtitle: 'VILLAGE CAFE • CURTORIM, GOA',
    description:
      'A neighbourhood café and bakery in Curtorim, Goa, serving freshly baked treats, desserts, beverages and everyday favourites.',
    imageUrl: '/uploads/village_exterior.jpg',
    primaryButtonText: 'EXPLORE MENU',
    secondaryButtonText: 'RESERVE A TABLE',
  };

  const intro = content?.intro || {
    title: 'Welcome to Village Cafe',
    description:
      'Nestled at Carmel View in Curtorim, Village Cafe brings together warm village hospitality with the tempting aroma of freshly baked breads, crispy oven puffs, delicate pastries, and rich espresso brews. Whether you are stopping by for tea-time savouries or catching up with friends over ice cream sundaes, our doors are always open with a warm smile.',
    imageUrl: '/uploads/village_seating.jpg',
    buttonText: 'Discover Our Story',
  };

  const reservationCta = content?.reservationCta || {
    title: 'Your Table Is Waiting',
    description: 'Planning a coffee, dessert or a relaxed meal? Reserve your table with us.',
    buttonText: 'Reserve a Table',
    imageUrl: '/uploads/village_seating.jpg',
  };

  return (
    <div className="overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-white pt-20">
        {/* Background Image with Dark Vignette Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.imageUrl || '/uploads/village_exterior.jpg'}
            alt="Village Cafe Curtorim"
            className="w-full h-full object-cover object-[center_20%] transform scale-105 animate-fade-in"
            onError={(e) => {
              e.currentTarget.src = '/uploads/village_exterior.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/60 to-charcoal-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 flex flex-col items-center">
          
          {/* Brand Crest Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-700/80 border border-cafeYellow-500/60 backdrop-blur-sm text-xs sm:text-sm font-semibold tracking-widest text-cafeYellow-400 uppercase mb-6 shadow-warm">
            <Sparkles className="w-3.5 h-3.5 text-cafeYellow-400" />
            <span>{hero.subtitle || 'VILLAGE CAFE • CURTORIM, GOA'}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.15]">
            {hero.title || 'Freshly Baked. Simply Delicious.'}
          </h1>

          <p className="text-base sm:text-xl text-cream-100 max-w-2xl font-normal leading-relaxed mb-10 text-balance">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/menu"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-warm-lg hover:shadow-warm-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 tracking-wide"
            >
              <Utensils className="w-4 h-4" />
              <span>{hero.primaryButtonText || 'EXPLORE MENU'}</span>
            </Link>

            <Link
              to="/reservations"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/40 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 tracking-wide"
            >
              <Calendar className="w-4 h-4" />
              <span>{hero.secondaryButtonText || 'RESERVE A TABLE'}</span>
            </Link>
          </div>

          {/* Quick live status on Hero */}
          <div className="mt-12 flex items-center justify-center">
            <OpenStatusBadge />
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-[11px] tracking-widest uppercase text-cream-200">Scroll</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-cafeYellow-400" />
          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION / WELCOME SECTION */}
      <section className="py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column with layered frame */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-warm-xl border border-coffee-200 bg-white">
                <img
                  src={intro.imageUrl || '/uploads/village_seating.jpg'}
                  alt="Welcome to Village Cafe"
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/village_seating.jpg';
                  }}
                />
              </div>

              {/* Decorative Floating Accent Card */}
              <div className="absolute -bottom-6 -right-6 sm:bottom-6 sm:right-6 bg-burgundy-700 text-white p-5 rounded-2xl shadow-warm-xl border border-cafeYellow-500/50 max-w-[240px] hidden sm:block">
                <p className="font-serif text-lg font-bold text-cafeYellow-400">Authentic Goan Bakery</p>
                <p className="text-xs text-cream-200 mt-1">Baked fresh every morning with pure ingredients and warm hospitality.</p>
              </div>
            </div>

            {/* Content Column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Story</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 leading-tight">
                {intro.title || 'Welcome to Village Cafe'}
              </h2>

              <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed">
                {intro.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-coffee-100 text-coffee-800">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-sm">Artisan Coffee</h4>
                    <p className="text-xs text-charcoal-600 mt-0.5">Espressos, lattes & iced cold brews crafted fresh.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-coffee-100 text-coffee-800">
                    <Croissant className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-sm">Fresh Puffs & Rolls</h4>
                    <p className="text-xs text-charcoal-600 mt-0.5">Warm flaky pastry puffs, savouries & tea rusks.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-coffee-800 hover:bg-coffee-900 text-white shadow-warm transition-all"
                >
                  <span>{intro.buttonText || 'Discover Our Story'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED MENU SECTION */}
      <section className="py-24 bg-white border-y border-coffee-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Handcrafted Specials</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
                {content?.featured?.title || 'Made Fresh, Served With Love'}
              </h2>
              <p className="text-charcoal-600 text-sm sm:text-base mt-2 max-w-xl">
                {content?.featured?.description ||
                  'Explore our most popular café classics, freshly baked daily in Curtorim.'}
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-bold text-burgundy-700 hover:text-burgundy-800 transition-colors"
            >
              <span>View Full Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredItems.map((item) => (
                <MenuItemCard key={item._id || item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-cream-50 rounded-2xl border border-coffee-200">
              <Utensils className="w-10 h-10 text-coffee-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-charcoal-800">Menu items are loading or being updated.</p>
              <Link to="/menu" className="mt-3 inline-block text-xs font-bold text-burgundy-700">
                Browse Full Menu →
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* 4. BAKERY SECTION */}
      <section className="py-24 bg-cream-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 mb-3">
              <Croissant className="w-3.5 h-3.5" />
              <span>Oven Fresh Every Day</span>
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
              {content?.bakery?.title || 'Fresh From The Bakery'}
            </h2>
            <p className="text-charcoal-600 text-sm sm:text-base mt-3">
              {content?.bakery?.description ||
                'From golden flaky puffs to rich cakes, biscuits, and teatime treats.'}
            </p>
          </div>

          {/* Bakery Highlights Grid with Real Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-warm border border-coffee-200 flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                <img
                  src="/uploads/village_shake.jpg"
                  alt="Pastries & Puffs Counter"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    Warm Puffs & Savoury Rolls
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    Golden egg puffs, spiced vegetable patties, warm sausage rolls and traditional Goan bakery delights.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-coffee-100 flex items-center justify-between text-xs font-semibold text-burgundy-700">
                  <span>Available Warm All Day</span>
                  <Link to="/menu" className="hover:underline">Explore →</Link>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-warm border border-coffee-200 flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                <img
                  src="/uploads/village_bakery_shelves.jpg"
                  alt="Bakery Shelves & Cookies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    Cookies, Rusks & Packaged Treats
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    Buttery tea biscuits, crispy breadsticks, traditional sponge cakes, and sweet parcels to enjoy with tea or take home.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-coffee-100 flex items-center justify-between text-xs font-semibold text-burgundy-700">
                  <span>Fresh Shelf Stock</span>
                  <Link to="/menu" className="hover:underline">Explore →</Link>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-warm border border-coffee-200 flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden bg-cream-100">
                <img
                  src="/uploads/village_counter.jpg"
                  alt="Dessert & Cake Counters"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                    Cakes & Amul Ice Cream
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                    Decadent chocolate slices, layered pastries, chilled sundaes, and milkshakes prepared with premium Amul ice cream.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-coffee-100 flex items-center justify-between text-xs font-semibold text-burgundy-700">
                  <span>Sweet Celebrations</span>
                  <Link to="/menu" className="hover:underline">Explore →</Link>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. OUR SPACE / AMBIENCE SECTION */}
      <section className="py-24 bg-charcoal-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cafeYellow-400 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Village Vibe</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                {content?.ourSpace?.title || 'Our Space'}
              </h2>

              <p className="text-sm sm:text-base text-cream-200 leading-relaxed">
                {content?.ourSpace?.description ||
                  'Designed for comfort, conversation, and quiet moments. Enjoy air-conditioned seating with cozy chairs, bright cheerful table accents, and the sights and scents of freshly prepared café treats.'}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm text-cream-200">
                  <CheckCircle className="w-4 h-4 text-cafeYellow-400" />
                  <span>Bright, cheerful, air-conditioned seating area</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cream-200">
                  <CheckCircle className="w-4 h-4 text-cafeYellow-400" />
                  <span>Illuminated display cases with warm pastries and cakes</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-cream-200">
                  <CheckCircle className="w-4 h-4 text-cafeYellow-400" />
                  <span>Convenient parking at Carmel View in Curtorim</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/our-space"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-cafeYellow-500 hover:bg-cafeYellow-600 text-charcoal-950 shadow transition-all"
                >
                  <span>Explore Our Space</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Collage of Actual Photos */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-charcoal-800 shadow-xl aspect-[4/5]">
                  <img
                    src="/uploads/village_seating.jpg"
                    alt="Village Cafe Interior Seating"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-charcoal-800 shadow-xl aspect-video">
                  <img
                    src="/uploads/village_exterior.jpg"
                    alt="Village Cafe Exterior at Carmel View"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="rounded-2xl overflow-hidden border border-charcoal-800 shadow-xl aspect-video">
                  <img
                    src="/uploads/village_counter.jpg"
                    alt="Village Cafe Counter and Clock"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-charcoal-800 shadow-xl aspect-[4/5]">
                  <img
                    src="/uploads/village_shake.jpg"
                    alt="Village Cafe Pastry Display"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SIGNATURE ITEMS HIGHLIGHT */}
      {signatureItems.length > 0 && (
        <section className="py-24 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>House Specialties</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900">
                Chef's Signature Creations
              </h2>
              <p className="text-charcoal-600 text-sm sm:text-base mt-2">
                Handcrafted specialties that define the authentic taste of Village Cafe.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {signatureItems.map((item) => (
                <MenuItemCard key={item._id || item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. GALLERY PREVIEW */}
      <section className="py-24 bg-white border-t border-coffee-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Snapshots</span>
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                Moments at Village Cafe
              </h2>
            </div>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 text-sm font-bold text-burgundy-700 hover:text-burgundy-800"
            >
              <span>View Full Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(galleryPreview.length > 0
              ? galleryPreview
              : [
                  { imageUrl: '/uploads/village_exterior.jpg', caption: 'Exterior at Carmel View' },
                  { imageUrl: '/uploads/village_seating.jpg', caption: 'Cozy Interior Seating' },
                  { imageUrl: '/uploads/village_counter.jpg', caption: 'Illuminated Counter' },
                  { imageUrl: '/uploads/village_bakery_shelves.jpg', caption: 'Fresh Cookies & Rusks' },
                  { imageUrl: '/uploads/village_shake.jpg', caption: 'Pastry & Savoury Cases' },
                ]
            ).map((img, idx) => (
              <Link
                key={idx}
                to="/gallery"
                className="group relative aspect-square rounded-2xl overflow-hidden border border-coffee-200 shadow-sm block"
              >
                <img
                  src={img.url || img.imageUrl}
                  alt={img.caption || 'Village Cafe'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-charcoal-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-serif font-medium">{img.caption}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. RESERVATION CALL TO ACTION */}
      <section className="py-24 bg-cream-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-burgundy-800 rounded-3xl overflow-hidden shadow-warm-xl text-white">
            
            {/* Background Texture / Subtle overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs font-bold tracking-widest text-cafeYellow-400 uppercase">
                  Reserve Ahead
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  {reservationCta.title || 'Your Table Is Waiting'}
                </h2>
                <p className="text-cream-100 text-sm sm:text-base leading-relaxed max-w-xl">
                  {reservationCta.description ||
                    'Planning a coffee, dessert or a relaxed meal? Reserve your table with us.'}
                </p>
                <div className="pt-4 flex flex-wrap gap-4 items-center">
                  <Link
                    to="/reservations"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-white text-burgundy-800 hover:bg-cream-100 shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{reservationCta.buttonText || 'Reserve a Table'}</span>
                  </Link>

                  {contact?.phone && (
                    <a
                      href={`tel:${contact.phone}`}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 transition-all"
                    >
                      <Phone className="w-4 h-4 text-cafeYellow-400" />
                      <span>{contact.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 hidden lg:block">
                <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl aspect-[4/3]">
                  <img
                    src={reservationCta.imageUrl || '/uploads/village_seating.jpg'}
                    alt="Reserve Table at Village Cafe"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. LOCATION & LIVE HOURS SECTION */}
      <section className="py-24 bg-white border-t border-coffee-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location & Timings</span>
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
                  Find Us in Curtorim
                </h2>
                <p className="text-charcoal-600 text-sm sm:text-base mt-2">
                  Conveniently situated in Carmel View, serving the warm heart of Curtorim, Goa.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-cream-50 border border-coffee-200">
                  <MapPin className="w-5 h-5 text-burgundy-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-charcoal-900 text-sm">Address</h4>
                    <p className="text-xs sm:text-sm text-charcoal-700 mt-0.5">
                      {contact?.address || 'Carmel View, Curtorim, Goa 403701, India'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-cream-50 border border-coffee-200">
                  <Clock className="w-5 h-5 text-burgundy-700 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-charcoal-900 text-sm">Opening Timings</h4>
                      <OpenStatusBadge />
                    </div>
                    <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
                      {hours?.summary || 'Open Daily: 8:30 AM – 10:00 PM'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {contact?.googleMapsUrl && (
                  <a
                    href={contact.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold bg-coffee-800 hover:bg-coffee-900 text-white shadow transition-all"
                  >
                    <Compass className="w-4 h-4 text-cafeYellow-400" />
                    <span>Open in Google Maps</span>
                  </a>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold border border-coffee-300 text-coffee-800 hover:bg-coffee-50 transition-colors"
                >
                  <span>Contact Information</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Map Card */}
            <div className="h-80 sm:h-96 rounded-3xl overflow-hidden border border-coffee-200 shadow-warm-lg bg-cream-100 relative">
              <iframe
                title="Village Cafe Curtorim Location"
                src="https://maps.google.com/maps?q=Village+Cafe+Bakery+Curtorim+Goa+India&z=17&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
