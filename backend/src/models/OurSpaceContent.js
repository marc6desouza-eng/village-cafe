import { createDualModel } from './modelFactory.js';

export const OurSpaceContent = createDualModel('OurSpaceContent', {
  title: { type: String, default: 'Our Space' },
  subtitle: { type: String, default: 'Take a visual tour through Village Cafe Curtorim' },
  intro: {
    type: String,
    default: 'Step inside our welcoming space at Carmel View. Whether you are grabbing a quick takeaway treat from our bakery counter or relaxing over milkshakes with friends, we have created an inviting environment for everyone.',
  },
  sections: {
    type: Array,
    default: [
      {
        id: 'exterior',
        title: 'Building & Exterior',
        tag: 'Welcome to Carmel View',
        description: 'Located at Carmel View along the Curtorim main road with convenient parking, clear modern signage, and a glass-fronted entrance welcoming you into our air-conditioned haven.',
        image: '/uploads/village_exterior.jpg',
      },
      {
        id: 'interior',
        title: 'Comfortable Dining & Seating',
        tag: 'Relax & Unwind',
        description: 'Thoughtfully arranged with plush cushioned dining chairs, warm yellow and green bistro tables, contemporary vertical wood accents, and soothing ambient lighting.',
        image: '/uploads/village_seating.jpg',
      },
      {
        id: 'bakery-counter',
        title: 'Bakery & Dessert Showcase',
        tag: 'Fresh From The Oven',
        description: 'Our refrigerated display counter and display cases feature daily savoury rolls, hot dogs, pastries, chilled desserts, and our partner Amul ice cream parlour parlour scoops.',
        image: '/uploads/village_counter.jpg',
      },
      {
        id: 'bakery-shelves',
        title: 'Artisan Bakery Shelves',
        tag: 'Take Freshness Home',
        description: 'Neatly organized display shelves filled with packaged tea-time treats, crunchy rusks, butter cookies, packaged cakes, and bakery specialties perfect for gifts and home enjoyment.',
        image: '/uploads/village_bakery_shelves.jpg',
      },
      {
        id: 'beverage-corner',
        title: 'Beverages & Shake Counter',
        tag: 'Signature Sips',
        description: 'From frothy hot cappuccinos to thick decadent milkshakes topped with whipped cream and cookies, freshly crafted in front of you.',
        image: '/uploads/village_shake.jpg',
      }
    ],
  },
});
