import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Compass, Shield } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { OpenStatusBadge } from '../common/OpenStatusBadge';

export const Footer = () => {
  const { contact, hours, settings } = useSettings();
  const currentYear = new Date().getFullYear();

  const daysList = hours?.days || [];

  return (
    <footer className="bg-charcoal-950 text-cream-100 pt-16 pb-8 border-t border-coffee-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Story Preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-burgundy-700 border-2 border-cafeYellow-500 flex items-center justify-center text-white font-serif font-bold text-lg shadow">
                VC
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wide text-white">VILLAGE CAFE</h3>
                <p className="text-xs text-coffee-300 uppercase tracking-widest">Café & Bakery • Curtorim</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-300 leading-relaxed">
              A warm neighbourhood café and bakery in Carmel View, Curtorim, Goa. Serving freshly baked treats, artisan coffees, delicious savoury puffs, and chilled scoops.
            </p>
            <div className="pt-2">
              <OpenStatusBadge />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-b border-coffee-800 pb-2">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-charcoal-300">
              <li>
                <Link to="/" className="hover:text-cafeYellow-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cafeYellow-400 transition-colors">Our Story & Bakery</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-cafeYellow-400 transition-colors">Menu & Specials</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-cafeYellow-400 transition-colors">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/our-space" className="hover:text-cafeYellow-400 transition-colors">Our Space & Ambience</Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-cafeYellow-400 transition-colors">Reserve a Table</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cafeYellow-400 transition-colors">Contact & Directions</Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-b border-coffee-800 pb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cafeYellow-400" />
              Opening Hours
            </h4>
            <ul className="space-y-1.5 text-xs text-charcoal-300">
              {daysList.length > 0 ? (
                daysList.map((d, idx) => (
                  <li key={idx} className="flex justify-between items-center py-0.5 border-b border-charcoal-900/60">
                    <span className="font-medium text-cream-200">{d.day}</span>
                    <span>
                      {d.isOpen ? `${d.openTime} – ${d.closeTime}` : <span className="text-amber-400">Closed</span>}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-charcoal-400">Daily: 8:30 AM – 10:00 PM</li>
              )}
            </ul>
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-semibold text-white mb-4 border-b border-coffee-800 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cafeYellow-400" />
              Visit Us
            </h4>
            <div className="space-y-3 text-sm text-charcoal-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cafeYellow-400 shrink-0 mt-1" />
                <span>
                  {contact?.address || 'Carmel View, Curtorim, Goa 403701, India'}
                </span>
              </p>
              {contact?.phone && (
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cafeYellow-400 shrink-0" />
                  <a href={`tel:${contact.phone}`} className="hover:text-white transition-colors">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact?.email && (
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-cafeYellow-400 shrink-0" />
                  <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors truncate">
                    {contact.email}
                  </a>
                </p>
              )}
            </div>

            {/* Social Icons & Google Maps */}
            <div className="pt-2 flex items-center gap-3">
              {contact?.instagramUrl && (
                <a
                  href={contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-charcoal-900 border border-charcoal-800 flex items-center justify-center text-cream-200 hover:text-white hover:bg-burgundy-700 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact?.facebookUrl && (
                <a
                  href={contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-charcoal-900 border border-charcoal-800 flex items-center justify-center text-cream-200 hover:text-white hover:bg-burgundy-700 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact?.googleMapsUrl && (
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-charcoal-900 border border-charcoal-800 text-xs text-cream-200 hover:text-white hover:bg-coffee-800 transition-all"
                >
                  <Compass className="w-3.5 h-3.5 text-cafeYellow-400" />
                  <span>Google Maps</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright and admin link */}
        <div className="pt-8 mt-8 border-t border-charcoal-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>
            © {currentYear} {settings?.siteTitle || 'Village Cafe'}. All rights reserved. Curtorim, Goa.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-1 text-charcoal-400 hover:text-cream-200 transition-colors">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
