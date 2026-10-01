import { createDualModel } from './modelFactory.js';

export const GalleryImage = createDualModel('GalleryImage', {
  url: { type: String, required: true },
  publicId: { type: String, default: '' },
  caption: { type: String, default: '' },
  category: { type: String, default: 'Café' },
  altText: { type: String, default: '' },
  displayOrder: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
});
