import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Filter, X, UtensilsCrossed, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { MenuItemCard } from '../components/menu/MenuItemCard';

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL' | 'VEG' | 'NON_VEG'
  const [sortBy, setSortBy] = useState('FEATURED'); // 'FEATURED' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const [itemsRes, catRes] = await Promise.all([
          api.get('/menu'),
          api.get('/categories'),
        ]);

        if (itemsRes.data.success) {
          setItems(itemsRes.data.data || []);
        }

        if (catRes.data.success) {
          setCategories(catRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching menu:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filtered and Sorted Menu Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category filter
        if (selectedCategory !== 'ALL') {
          const catId = item.category?._id || item.category?.id || item.category;
          const catSlug = item.category?.slug;
          if (catId !== selectedCategory && catSlug !== selectedCategory) {
            return false;
          }
        }

        // Dietary filter
        if (dietaryFilter === 'VEG' && !item.isVegetarian) return false;
        if (dietaryFilter === 'NON_VEG' && item.isVegetarian) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'FEATURED') {
          // Signature first, then featured, then order
          if (a.isSignature && !b.isSignature) return -1;
          if (!a.isSignature && b.isSignature) return 1;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        }
        if (sortBy === 'PRICE_ASC') return (a.price || 0) - (b.price || 0);
        if (sortBy === 'PRICE_DESC') return (b.price || 0) - (a.price || 0);
        if (sortBy === 'NAME') return (a.name || '').localeCompare(b.name || '');
        return 0;
      });
  }, [items, selectedCategory, dietaryFilter, searchQuery, sortBy]);

  return (
    <div className="pt-24 pb-20">
      
      {/* Header Banner */}
      <section className="bg-charcoal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cafeYellow-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 mb-4">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Café & Bakery Menu</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Made Fresh Daily
          </h1>
          <p className="text-cream-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Freshly baked breads, flaky puffs, tea-time confectionery, signature espresso brews, and chilled dessert treats.
          </p>
        </div>
      </section>

      {/* Interactive Controls Bar: Category tabs, Search & Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-warm-xl border border-coffee-200 p-4 sm:p-6 space-y-5">
          
          {/* Top Row: Search + Dietary + Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items, flavours, treats..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-coffee-200 text-sm focus:outline-none focus:border-burgundy-600 bg-cream-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dietary & Sorting Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              {/* Dietary Toggle */}
              <div className="inline-flex rounded-xl bg-cream-100 p-1 border border-coffee-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setDietaryFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    dietaryFilter === 'ALL'
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'text-charcoal-700 hover:text-charcoal-900'
                  }`}
                >
                  All Items
                </button>
                <button
                  type="button"
                  onClick={() => setDietaryFilter('VEG')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    dietaryFilter === 'VEG'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'text-charcoal-700 hover:text-emerald-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Veg Only
                </button>
                <button
                  type="button"
                  onClick={() => setDietaryFilter('NON_VEG')}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    dietaryFilter === 'NON_VEG'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'text-charcoal-700 hover:text-amber-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Non-Veg
                </button>
              </div>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-coffee-200 text-xs font-semibold text-charcoal-800 bg-cream-50/50 focus:outline-none focus:border-burgundy-600 cursor-pointer"
              >
                <option value="FEATURED">Sort: Featured First</option>
                <option value="PRICE_ASC">Price: Low to High</option>
                <option value="PRICE_DESC">Price: High to Low</option>
                <option value="NAME">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Dynamic Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar border-t border-coffee-100">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-charcoal-900 text-white shadow-sm'
                  : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
              }`}
            >
              All Categories ({items.length})
            </button>

            {categories.map((cat) => {
              const catId = cat._id || cat.id;
              const count = items.filter(
                (item) => (item.category?._id || item.category?.id || item.category) === catId
              ).length;

              return (
                <button
                  key={catId}
                  type="button"
                  onClick={() => setSelectedCategory(catId)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === catId
                      ? 'bg-burgundy-700 text-white shadow-sm'
                      : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200'
                  }`}
                >
                  {cat.name} {count > 0 && <span className="opacity-70 ml-1">({count})</span>}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Menu Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-4 border border-coffee-200 shadow-sm animate-pulse space-y-4"
              >
                <div className="aspect-[4/3] bg-cream-200 rounded-xl"></div>
                <div className="h-5 bg-cream-200 rounded w-3/4"></div>
                <div className="h-4 bg-cream-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <>
            <div className="flex items-center justify-between text-xs text-charcoal-500 mb-6">
              <span>Showing {filteredItems.length} delicacies</span>
              {(searchQuery || selectedCategory !== 'ALL' || dietaryFilter !== 'ALL') && (
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSearchQuery('');
                    setDietaryFilter('ALL');
                  }}
                  className="text-burgundy-700 font-semibold hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item._id || item.id} item={item} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-coffee-200 shadow-warm max-w-lg mx-auto p-8">
            <UtensilsCrossed className="w-12 h-12 text-coffee-400 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
              No matching items found
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-600 mb-6">
              Try adjusting your search terms, choosing a different category, or resetting your dietary filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setDietaryFilter('ALL');
              }}
              className="px-5 py-2.5 rounded-full bg-burgundy-700 text-white text-xs font-semibold hover:bg-burgundy-800 transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Reservation Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-cream-100 rounded-3xl p-8 sm:p-12 border border-coffee-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mb-2">
              Craving something fresh?
            </h3>
            <p className="text-charcoal-600 text-sm">
              Reserve your table ahead of time to enjoy fresh hot puffs and coffee right out of the oven.
            </p>
          </div>
          <Link
            to="/reservations"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold bg-burgundy-700 hover:bg-burgundy-800 text-white shadow-warm transition-all shrink-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Your Visit</span>
          </Link>
        </div>
      </section>

    </div>
  );
};
