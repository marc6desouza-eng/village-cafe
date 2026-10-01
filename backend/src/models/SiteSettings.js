import { createDualModel } from './modelFactory.js';

export const SiteSettings = createDualModel('SiteSettings', {
  siteTitle: { type: String, default: 'Village Cafe | Café & Bakery — Curtorim, Goa' },
  metaDescription: {
    type: String,
    default: 'Visit Village Cafe at Carmel View, Curtorim, Goa. Discover freshly baked pastries, cookies, cakes, artisan coffee, milkshakes, and delicious savouries.',
  },
  logoText: { type: String, default: 'VILLAGE CAFE' },
  logoSubtext: { type: String, default: 'CAFÉ & BAKERY' },
  currencySymbol: { type: String, default: '₹' },
  enableReservations: { type: Boolean, default: true },
  announcement: { type: String, default: 'Welcome to Village Cafe! Freshly baked daily in Curtorim.' },
  isAnnouncementActive: { type: Boolean, default: false },
});
