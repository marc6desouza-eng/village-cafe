import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from '../config/db.js';

import { Admin } from '../models/Admin.js';
import { MenuCategory } from '../models/MenuCategory.js';
import { MenuItem } from '../models/MenuItem.js';
import { GalleryImage } from '../models/GalleryImage.js';
import { Reservation } from '../models/Reservation.js';
import { HomepageContent } from '../models/HomepageContent.js';
import { AboutContent } from '../models/AboutContent.js';
import { OurSpaceContent } from '../models/OurSpaceContent.js';
import { OpeningHours } from '../models/OpeningHours.js';
import { ContactSettings } from '../models/ContactSettings.js';
import { SiteSettings } from '../models/SiteSettings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const runSeed = async () => {
  console.log('[Seed] Connecting database...');
  await connectDB();

  console.log('[Seed] Seeding Admin Account...');
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@villagecafe.goa').toLowerCase().trim();
  const rawPassword = process.env.ADMIN_PASSWORD || 'VillageCafeGoa2026!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await Admin.create({
      name: 'Village Cafe Owner',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`[Seed] Created admin: ${adminEmail} (password: ${rawPassword})`);
  } else {
    await Admin.findByIdAndUpdate(existingAdmin._id || existingAdmin.id, {
      password: hashedPassword,
    });
    console.log(`[Seed] Updated admin password for: ${adminEmail}`);
  }

  console.log('[Seed] Seeding Menu Categories...');
  await MenuCategory.deleteMany({});
  const categories = await MenuCategory.insertMany([
    {
      name: 'Cold Beverages & Shakes',
      slug: 'beverages-shakes',
      description: 'Handcrafted thick milkshakes, iced coffee, and refreshing fruit coolers',
      displayOrder: 1,
      isActive: true,
    },
    {
      name: 'Bakery & Packaged Treats',
      slug: 'bakery-treats',
      description: 'Daily fresh-baked cookies, buttery tea rusks, sponge cakes, and Goan favorites',
      displayOrder: 2,
      isActive: true,
    },
    {
      name: 'Savouries & Warm Bites',
      slug: 'savouries-bites',
      description: 'Oven-warm rolls, hot dog buns, puffs, and quick cafe savouries',
      displayOrder: 3,
      isActive: true,
    },
    {
      name: 'Coffee & Hot Brews',
      slug: 'coffee-brews',
      description: 'Aromatic espressos, velvety lattes, cappuccinos, and authentic masala chai',
      displayOrder: 4,
      isActive: true,
    },
    {
      name: 'Desserts & Cakes',
      slug: 'desserts-cakes',
      description: 'Pastries, chocolate truffle slices, creamy mousses, and tea-time cakes',
      displayOrder: 5,
      isActive: true,
    },
    {
      name: 'Amul Ice Cream Specials',
      slug: 'ice-cream-specials',
      description: 'Creamy scoops, sundae creations, and ice-cream floats',
      displayOrder: 6,
      isActive: true,
    },
  ]);

  const catMap = {};
  categories.forEach(c => {
    catMap[c.slug] = c._id || c.id;
  });

  console.log('[Seed] Seeding Menu Items...');
  await MenuItem.deleteMany({});
  await MenuItem.insertMany([
    {
      name: 'Oreo Overload Thick Shake',
      description: 'Rich chocolate milkshake blended with vanilla ice cream, topped with generous whipped cream, chocolate drizzle and a whole Oreo cookie.',
      price: 160,
      category: catMap['beverages-shakes'],
      categoryName: 'Cold Beverages & Shakes',
      image: '/uploads/village_shake.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: true,
      isAvailable: true,
      displayOrder: 1,
      badge: 'Signature Bestseller',
    },
    {
      name: 'Village Cold Coffee',
      description: 'Fresh espresso shot blended with chilled whole milk, a scoop of vanilla ice cream, and dark cocoa dust.',
      price: 130,
      category: catMap['beverages-shakes'],
      categoryName: 'Cold Beverages & Shakes',
      image: '/uploads/village_shake.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: false,
      isAvailable: true,
      displayOrder: 2,
      badge: 'Popular',
    },
    {
      name: 'Carmel View Butter Cookies & Rusks',
      description: 'Traditional crisp bakery cookies and double-baked golden tea rusks, packed fresh daily for tea-time comfort.',
      price: 120,
      category: catMap['bakery-treats'],
      categoryName: 'Bakery & Packaged Treats',
      image: '/uploads/village_bakery_shelves.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: false,
      isAvailable: true,
      displayOrder: 3,
      badge: 'Freshly Baked',
    },
    {
      name: 'Traditional Goan Coconut Macaroons',
      description: 'Crispy exterior, chewy coconut center, baked to perfection using desiccated Goan coconuts.',
      price: 140,
      category: catMap['bakery-treats'],
      categoryName: 'Bakery & Packaged Treats',
      image: '/uploads/village_bakery_shelves.jpg',
      isVegetarian: true,
      isFeatured: false,
      isSignature: true,
      isAvailable: true,
      displayOrder: 4,
      badge: 'Local Favourite',
    },
    {
      name: 'Signature Hot Dog Roll',
      description: 'Soft golden-baked bakery bun with seasoned filling, onions, bell peppers and special house sauce.',
      price: 90,
      category: catMap['savouries-bites'],
      categoryName: 'Savouries & Quick Bites',
      image: '/uploads/village_counter.jpg',
      isVegetarian: false,
      isFeatured: true,
      isSignature: true,
      isAvailable: true,
      displayOrder: 5,
      badge: 'Chef Special',
    },
    {
      name: 'Spiced Savoury Chicken Roll',
      description: 'Flaky baked pastry wrap stuffed with tender minced chicken cooked in warm Goan cafe spices.',
      price: 85,
      category: catMap['savouries-bites'],
      categoryName: 'Savouries & Quick Bites',
      image: '/uploads/village_counter.jpg',
      isVegetarian: false,
      isFeatured: false,
      isSignature: false,
      isAvailable: true,
      displayOrder: 6,
      badge: '',
    },
    {
      name: 'Crispy Veg Puff',
      description: 'Golden puff pastry loaded with spiced potatoes, peas, and fresh coriander.',
      price: 50,
      category: catMap['savouries-bites'],
      categoryName: 'Savouries & Quick Bites',
      image: '/uploads/village_counter.jpg',
      isVegetarian: true,
      isFeatured: false,
      isSignature: false,
      isAvailable: true,
      displayOrder: 7,
      badge: 'Veg Delight',
    },
    {
      name: 'Handcrafted Cappuccino',
      description: 'Equal parts dark espresso, steamed milk, and velvety foam with a hint of cinnamon dusting.',
      price: 90,
      category: catMap['coffee-brews'],
      categoryName: 'Coffee & Hot Brews',
      image: '/uploads/village_seating.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: false,
      isAvailable: true,
      displayOrder: 8,
      badge: 'Barista Choice',
    },
    {
      name: 'Goan Masala Chai',
      description: 'Brewed with whole Assam tea leaves, crushed green cardamom, fresh ginger, and creamy milk.',
      price: 45,
      category: catMap['coffee-brews'],
      categoryName: 'Coffee & Hot Brews',
      image: '/uploads/village_seating.jpg',
      isVegetarian: true,
      isFeatured: false,
      isSignature: false,
      isAvailable: true,
      displayOrder: 9,
      badge: '',
    },
    {
      name: 'Rich Chocolate Truffle Pastry',
      description: 'Decadent moist chocolate sponge layered with premium dark chocolate ganache and chocolate flakes.',
      price: 110,
      category: catMap['desserts-cakes'],
      categoryName: 'Desserts & Cakes',
      image: '/uploads/village_counter.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: false,
      isAvailable: true,
      displayOrder: 10,
      badge: 'Sweet Treat',
    },
    {
      name: 'Amul Triple Scoop Sundae',
      description: 'Three generous scoops of real milk Amul ice cream drizzled with hot chocolate syrup and roasted cashews.',
      price: 150,
      category: catMap['ice-cream-specials'],
      categoryName: 'Amul Ice Cream Specials',
      image: '/uploads/village_counter.jpg',
      isVegetarian: true,
      isFeatured: true,
      isSignature: true,
      isAvailable: true,
      displayOrder: 11,
      badge: 'Amul Partner Special',
    },
  ]);

  console.log('[Seed] Seeding Gallery Images...');
  await GalleryImage.deleteMany({});
  await GalleryImage.insertMany([
    {
      url: '/uploads/village_exterior.jpg',
      caption: 'Carmel View Front Facade & Village Cafe Signboard',
      category: 'Exterior',
      altText: 'Village Cafe storefront and signage at Carmel View, Curtorim',
      displayOrder: 1,
      isFeatured: true,
    },
    {
      url: '/uploads/village_shake.jpg',
      caption: 'Signature Oreo Overload Shake with Chocolate Drizzle',
      category: 'Drinks',
      altText: 'Tall chocolate Oreo milkshake on cozy yellow cafe table',
      displayOrder: 2,
      isFeatured: true,
    },
    {
      url: '/uploads/village_bakery_shelves.jpg',
      caption: 'Freshly Baked Cookies, Rusks, and Tea-Time Specialties',
      category: 'Bakery',
      altText: 'Organized shelves displaying packaged cookies and baked goods',
      displayOrder: 3,
      isFeatured: true,
    },
    {
      url: '/uploads/village_seating.jpg',
      caption: 'Comfortable Air-Conditioned Cafe Seating & Ambiance',
      category: 'Ambience',
      altText: 'Modern dining tables and chairs inside Village Cafe Curtorim',
      displayOrder: 4,
      isFeatured: true,
    },
    {
      url: '/uploads/village_counter.jpg',
      caption: 'Front Service Counter, Bakery Showcase & Ice Cream Station',
      category: 'Café',
      altText: 'Glass display cases with hot dog rolls, pastries and ice cream scoop freezer',
      displayOrder: 5,
      isFeatured: true,
    },
  ]);

  console.log('[Seed] Seeding Sample Reservations...');
  await Reservation.deleteMany({});
  await Reservation.insertMany([
    {
      referenceId: 'VC-2026-A101',
      fullName: 'Rahul Fernandes',
      phone: '+91 98221 45678',
      email: 'rahul.fernandes@example.com',
      date: new Date().toISOString().split('T')[0],
      time: '17:30',
      guests: 4,
      specialRequest: 'Window table preferred for afternoon coffee & desserts',
      status: 'CONFIRMED',
      notes: 'Customer confirmed via WhatsApp call',
    },
    {
      referenceId: 'VC-2026-B202',
      fullName: 'Sunita D’Costa',
      phone: '+91 94220 98765',
      email: 'sunita.dcosta@example.com',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '16:00',
      guests: 2,
      specialRequest: 'Celebrating birthday - would like chocolate truffle pastry ready',
      status: 'PENDING',
      notes: '',
    },
    {
      referenceId: 'VC-2026-C303',
      fullName: 'Antonio Gomes',
      phone: '+91 91580 11223',
      email: 'antonio.g@example.com',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      time: '19:00',
      guests: 6,
      specialRequest: 'Family dinner gathering',
      status: 'COMPLETED',
      notes: 'Completed successfully',
    },
  ]);

  console.log('[Seed] Seeding CMS Content & Settings...');
  await HomepageContent.deleteMany({});
  await HomepageContent.create({});

  await AboutContent.deleteMany({});
  await AboutContent.create({});

  await OurSpaceContent.deleteMany({});
  await OurSpaceContent.create({});

  await OpeningHours.deleteMany({});
  await OpeningHours.create({});

  await ContactSettings.deleteMany({});
  await ContactSettings.create({
    cafeName: 'Village Cafe',
    tagline: 'Café & Bakery',
    address: 'Carmel View, Curtorim, Goa 403786, India',
    landmark: 'Carmel View Building, Main Road',
    city: 'Curtorim',
    state: 'Goa',
    country: 'India',
    phone: '+91 98220 12345',
    email: 'hello@villagecafegoa.com',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Carmel+View+Curtorim+Goa',
    instagram: 'https://instagram.com/villagecafegoa',
    facebook: 'https://facebook.com/villagecafegoa',
    whatsapp: '+91 98220 12345',
    parkingInfo: 'Convenient vehicle parking space available right in front of Carmel View.',
  });

  await SiteSettings.deleteMany({});
  await SiteSettings.create({});

  console.log('[Seed] Database initialization complete!');
};

if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  runSeed()
    .then(() => {
      console.log('Seed completed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
