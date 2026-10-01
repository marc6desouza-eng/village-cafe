import React from 'react';
import { Link } from 'react-router-dom';
import { Home, UtensilsCrossed } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4 pt-24 text-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-coffee-200 shadow-warm-xl space-y-5">
        <div className="w-16 h-16 rounded-full bg-burgundy-50 border border-burgundy-200 flex items-center justify-center mx-auto text-burgundy-700 font-serif font-bold text-2xl">
          404
        </div>
        <h1 className="font-serif text-3xl font-bold text-charcoal-900">
          Page Not Found
        </h1>
        <p className="text-charcoal-600 text-sm leading-relaxed">
          The page you are looking for might have been moved, or does not exist. Let's get you back to the fresh treats.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-coffee-300 text-coffee-800 hover:bg-coffee-50 text-xs font-semibold transition-colors"
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>View Menu</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
