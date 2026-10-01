import { createDualModel } from './modelFactory.js';

export const MenuItem = createDualModel('MenuItem', {
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, default: '' },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  isVegetarian: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isSignature: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  badge: { type: String, default: '' },
});
