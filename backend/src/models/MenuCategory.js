import { createDualModel } from './modelFactory.js';

export const MenuCategory = createDualModel('MenuCategory', {
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});
