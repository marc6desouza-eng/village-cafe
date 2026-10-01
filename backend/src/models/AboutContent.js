import { createDualModel } from './modelFactory.js';

export const AboutContent = createDualModel('AboutContent', {
  title: { type: String, default: 'Our Story & Philosophy' },
  subtitle: { type: String, default: 'Crafted with warmth in the heart of Curtorim, Goa' },
  storyHeading: { type: String, default: 'A Heartfelt Corner in South Goa' },
  storyParagraph1: {
    type: String,
    default: 'Village Cafe was founded with a straightforward, honest purpose: to create a welcoming haven in Curtorim where locals and visitors can take a pause, enjoy genuine bakery craftsmanship, and share delightful conversations over comforting beverages.',
  },
  storyParagraph2: {
    type: String,
    default: 'From morning espresso and flaky morning pastries to rich milkshakes and evening tea-time treats, we take pride in serving every customer with warm Goan hospitality.',
  },
  storyImage: { type: String, default: '/uploads/village_exterior.jpg' },

  philosophyHeading: { type: String, default: 'Our Philosophy' },
  philosophyText: {
    type: String,
    default: 'We believe good food doesn’t need pretension. It demands care, high-quality ingredients, clean and welcoming spaces, and attentive service. Every bun, shake, and coffee is prepared with pride.',
  },

  freshnessHeading: { type: String, default: 'Uncompromising Freshness' },
  freshnessText: {
    type: String,
    default: 'From our bakery displays stacked with fresh cookies and cakes to our chilled dessert cases and ice cream sundaes, freshness is at the core of everything we do every single day.',
  },
  freshnessImage: { type: String, default: '/uploads/village_counter.jpg' },

  bakeryHeading: { type: String, default: 'The Bakery Craft' },
  bakeryText: {
    type: String,
    default: 'Our shelves showcase time-tested baking traditions: crusty rusks, butter-rich biscuits, melt-in-mouth cookies, soft sliced cakes, and savoury rolls packed fresh for dine-in or takeaway.',
  },
  bakeryImage: { type: String, default: '/uploads/village_bakery_shelves.jpg' },

  experienceHeading: { type: String, default: 'The Café Experience' },
  experienceText: {
    type: String,
    default: 'With cool air-conditioned comfort, comfortable seating, vibrant aesthetics, and a cheerful neighborhood vibe, Village Cafe is your second living room in Curtorim.',
  },
});
