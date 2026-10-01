import { GalleryImage } from '../models/GalleryImage.js';
import { sortBy } from '../utils/helpers.js';

export const getGalleryImages = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (featured === 'true') filter.isFeatured = true;

    let images = await GalleryImage.find(filter);

    if (category && category !== 'all' && category !== 'All') {
      images = images.filter(img => img.category?.toLowerCase() === category.toLowerCase());
    }

    const sorted = sortBy(images, 'displayOrder', true);

    res.json({
      success: true,
      count: sorted.length,
      data: sorted,
    });
  } catch (error) {
    next(error);
  }
};

export const createGalleryImage = async (req, res, next) => {
  try {
    const { url, publicId, caption, category, altText, displayOrder, isFeatured } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required.' });
    }

    const count = await GalleryImage.countDocuments({});

    const newImage = await GalleryImage.create({
      url,
      publicId: publicId || '',
      caption: caption || '',
      category: category || 'Café',
      altText: altText || caption || 'Village Cafe Curtorim',
      displayOrder: typeof displayOrder === 'number' ? displayOrder : count,
      isFeatured: isFeatured !== undefined ? Boolean(isFeatured) : false,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery image added successfully.',
      data: newImage,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const img = await GalleryImage.findById(id);
    if (!img) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    const { caption, category, altText, displayOrder, isFeatured, url } = req.body;

    const updates = {};
    if (caption !== undefined) updates.caption = caption;
    if (category !== undefined) updates.category = category;
    if (altText !== undefined) updates.altText = altText;
    if (displayOrder !== undefined) updates.displayOrder = Number(displayOrder);
    if (isFeatured !== undefined) updates.isFeatured = Boolean(isFeatured);
    if (url !== undefined) updates.url = url;

    const updated = await GalleryImage.findByIdAndUpdate(id, updates, { new: true });

    res.json({
      success: true,
      message: 'Image details updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const img = await GalleryImage.findById(id);
    if (!img) {
      return res.status(404).json({ success: false, message: 'Image not found.' });
    }

    await GalleryImage.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Gallery image removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const reorderGalleryImages = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ success: false, message: 'orderedIds must be an array.' });
    }

    for (let index = 0; index < orderedIds.length; index++) {
      await GalleryImage.findByIdAndUpdate(orderedIds[index], { displayOrder: index });
    }

    res.json({ success: true, message: 'Gallery images reordered successfully.' });
  } catch (error) {
    next(error);
  }
};
