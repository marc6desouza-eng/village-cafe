import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, Phone, Clock, ChevronRight, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { OpenStatusBadge } from '../common/OpenStatusBadge';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { contact } = useSettings();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Space', path: '/our-space' },
    { name: 'Reservations', path: '/reservations' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-cream-50/95 backdrop-blur-md shadow-warm py-3 border-b border-coffee-100'
            : 'bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/40 to-transparent py-4 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Brand Logo & Tagline */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-burgundy-700 border-2 border-cafeYellow-500 flex items-center justify-center shadow-md transform group-hover:scale-105 transition-transform shrink-0">
                <span className="font-serif font-bold text-cream-50 text-lg tracking-tight">VC</span>
              </div>
              <div className="flex flex-col">
                <span
                  className={`font-serif text-lg sm:text-xl font-bold tracking-wide transition-colors ${
                    isScrolled || !isHome ? 'text-charcoal-900' : 'text-white'
                  }`}
                >
                  VILLAGE CAFE
                </span>
                <span
                  className={`text-[10px] sm:text-xs tracking-wider uppercase font-medium transition-colors ${
                    isScrolled || !isHome ? 'text-coffee-700' : 'text-cream-200'
                  }`}
                >
                  Café & Bakery • Curtorim, Goa
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? isScrolled || !isHome
                          ? 'bg-burgundy-700 text-white shadow-sm'
                          : 'bg-white/20 text-white backdrop-blur-sm shadow-sm'
                        : isScrolled || !isHome
                        ? 'text-charcoal-800 hover:text-burgundy-700 hover:bg-cream-100'
                        : 'text-cream-100 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Right CTAs: Open Status & Reserve Button */}
            <div className="hidden sm:flex items-center gap-3">
              <OpenStatusBadge />

              <Link
                to="/reservations"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-sm hover:shadow-warm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <OpenStatusBadge showHours={false} className="sm:hidden" />
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-xl transition-colors ${
                  isScrolled || !isHome
                    ? 'text-charcoal-900 hover:bg-cream-200'
                    : 'text-white hover:bg-white/20'
                }`}
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-cream-50 shadow-warm-xl flex flex-col z-10 border-l border-coffee-200">
            <div className="p-5 border-b border-coffee-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-burgundy-700 border border-cafeYellow-500 flex items-center justify-center text-white font-serif font-bold text-sm">
                  VC
                </div>
                <div>
                  <span className="font-serif font-bold text-charcoal-900 block leading-tight">VILLAGE CAFE</span>
                  <span className="text-[10px] text-coffee-700">Curtorim, Goa</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-coffee-100">
              <OpenStatusBadge />
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-burgundy-700 text-white shadow-sm'
                        : 'text-charcoal-800 hover:bg-cream-200'
                    }`
                  }
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </NavLink>
              ))}
            </div>

            {/* Drawer Footer CTA */}
            <div className="p-5 border-t border-coffee-100 space-y-3 bg-cream-100/60">
              <Link
                to="/reservations"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-burgundy-700 hover:bg-burgundy-800 text-white shadow transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table</span>
              </Link>

              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-coffee-800 hover:bg-coffee-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" /> Call: {contact.phone}
                </a>
              )}

              <Link
                to="/admin"
                className="w-full flex items-center justify-center gap-1.5 text-xs text-charcoal-500 hover:text-burgundy-700 pt-1"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
