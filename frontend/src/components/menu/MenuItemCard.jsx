import React from 'react';
import { Sparkles, Award } from 'lucide-react';

export const MenuItemCard = ({ item }) => {
  const isAvailable = item.isAvailable !== false;

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden border border-coffee-200/80 shadow-warm hover:shadow-warm-xl transition-all duration-300 flex flex-col ${
        !isAvailable ? 'opacity-75' : ''
      }`}
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-cream-100">
        <img
          src={item.image || item.imageUrl || '/uploads/village_counter.jpg'}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !isAvailable ? 'grayscale-[40%]' : ''
          }`}
          onError={(e) => {
            e.currentTarget.src = '/uploads/village_counter.jpg';
          }}
          loading="lazy"
        />

        {/* Dietary indicator badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm text-xs font-semibold">
          {item.isVegetarian ? (
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3.5 h-3.5 border-2 border-emerald-600 rounded flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              </span>
              <span className="text-[11px]">Pure Veg</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-900">
              <span className="w-3.5 h-3.5 border-2 border-amber-800 rounded flex items-center justify-center p-0.5">
                <span className="w-1.5 h-1.5 bg-amber-800 rounded-full"></span>
              </span>
              <span className="text-[11px]">Non-Veg</span>
            </span>
          )}
        </div>

        {/* Status badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {item.isSignature && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-burgundy-700 text-white shadow">
              <Award className="w-3 h-3 text-cafeYellow-400" /> Signature
            </span>
          )}
          {item.isFeatured && !item.isSignature && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cafeYellow-500 text-charcoal-950 shadow">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Unavailability Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="px-3.5 py-1.5 bg-charcoal-900 text-cream-100 text-xs font-bold uppercase tracking-widest rounded-full border border-charcoal-700 shadow-lg">
              Currently Unavailable
            </span>
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-bold text-lg text-charcoal-900 group-hover:text-burgundy-700 transition-colors">
              {item.name}
            </h3>
            <span className="font-serif font-bold text-lg text-burgundy-700 shrink-0">
              ₹{item.price}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {item.category?.name && (
          <div className="mt-4 pt-3 border-t border-coffee-100 flex items-center justify-between text-xs text-coffee-700">
            <span className="uppercase tracking-wider text-[11px] font-semibold">
              {item.category.name}
            </span>
            <span className="text-[11px] text-charcoal-400">Fresh daily</span>
          </div>
        )}
      </div>
    </div>
  );
};
