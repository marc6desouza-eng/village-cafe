import { createDualModel } from './modelFactory.js';

export const HomepageContent = createDualModel('HomepageContent', {
  heroTitle: { type: String, default: 'Freshly Baked. Simply Delicious.' },
  heroSubtitle: { type: String, default: 'Café & Bakery • Curtorim, Goa' },
  heroDescription: {
    type: String,
    default: 'A neighbourhood café and bakery in Curtorim, Goa, serving freshly baked treats, desserts, beverages and everyday favourites.',
  },
  heroImage: { type: String, default: '/uploads/village_exterior.jpg' },
  heroPrimaryBtnText: { type: String, default: 'EXPLORE MENU' },
  heroSecondaryBtnText: { type: String, default: 'RESERVE A TABLE' },

  introTitle: { type: String, default: 'Welcome to Village Cafe' },
  introSubtitle: { type: String, default: 'Curtorim’s Favourite Gathering Spot' },
  introDescription: {
    type: String,
    default: 'Nestled at Carmel View in picturesque Curtorim, Village Cafe brings together the aroma of freshly roasted coffee, oven-warm bakery specialties, decadent milkshakes, and premium ice-cream delights in a relaxing, air-conditioned sanctuary.',
  },
  introImage: { type: String, default: '/uploads/village_seating.jpg' },
  introBtnText: { type: String, default: 'Discover Our Story' },

  featuredTitle: { type: String, default: 'Made Fresh, Served With Love' },
  featuredSubtitle: { type: String, default: 'Hand-crafted daily favourites prepared with premium ingredients' },

  bakeryTitle: { type: String, default: 'Fresh From The Bakery' },
  bakerySubtitle: { type: String, default: 'Crisp cookies, tea-time rusks, sponge cakes and freshly rolled savouries' },
  bakeryImage: { type: String, default: '/uploads/village_bakery_shelves.jpg' },

  ourSpaceTitle: { type: String, default: 'Experience Our Space' },
  ourSpaceSubtitle: { type: String, default: 'A bright, welcoming ambience designed for slow sips and good company' },

  reservationCtaTitle: { type: String, default: 'Your Table Is Waiting' },
  reservationCtaSubtitle: {
    type: String,
    default: 'Planning a coffee, dessert or a relaxed meal? Reserve your table with us.',
  },
  reservationCtaImage: { type: String, default: '/uploads/village_shake.jpg' },
});
